const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { Laptop } = require('../models/Laptop');
const { Printer } = require('../models/Printer');
const Service = require('../models/Service');
const Order = require('../models/Order');

// GET /api/inventory/stats/overview - Tổng quan thống kê tồn kho
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProducts = await Inventory.countDocuments({ status: 'ACTIVE' });
    const lowStockProducts = await Inventory.countDocuments({
      status: 'ACTIVE',
      $expr: { $lte: ['$availableStock', '$reorderLevel'] }
    });
    const outOfStockProducts = await Inventory.countDocuments({
      status: 'ACTIVE',
      availableStock: 0
    });

    // Tính tổng giá trị tồn kho
    const totalValueResult = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      { 
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } },
          totalStock: { $sum: '$currentStock' },
          totalAvailable: { $sum: '$availableStock' },
          totalReserved: { $sum: '$reservedStock' }
        }
      }
    ]);

    const totals = totalValueResult[0] || {
      totalValue: 0,
      totalStock: 0,
      totalAvailable: 0,
      totalReserved: 0
    };

    // Thống kê theo loại sản phẩm
    const categoryStats = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $group: {
          _id: '$productType',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ['$availableStock', '$reorderLevel'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      overview: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        ...totals
      },
      categoryStats
    });

  } catch (error) {
    console.error('Error fetching inventory overview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/inventory/stats/movements - Thống kê xuất nhập kho
router.get('/stats/movements', async (req, res) => {
  try {
    const { period = '30', startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const days = parseInt(period);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      dateFilter = { $gte: fromDate };
    }

    // Thống kê xuất nhập kho
    const movements = await Inventory.aggregate([
      { $unwind: '$stockMovements' },
      { $match: { 'stockMovements.date': dateFilter } },
      {
        $group: {
          _id: '$stockMovements.type',
          totalQuantity: { $sum: '$stockMovements.quantity' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Thống kê theo ngày
    const dailyMovements = await Inventory.aggregate([
      { $unwind: '$stockMovements' },
      { $match: { 'stockMovements.date': dateFilter } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$stockMovements.date' } },
            type: '$stockMovements.type'
          },
          totalQuantity: { $sum: '$stockMovements.quantity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Top sản phẩm có nhiều giao dịch nhất
    const topMovedProducts = await Inventory.aggregate([
      { $unwind: '$stockMovements' },
      { $match: { 'stockMovements.date': dateFilter } },
      {
        $group: {
          _id: '$productId',
          productType: { $first: '$productType' },
          totalMovements: { $sum: { $abs: '$stockMovements.quantity' } },
          inCount: {
            $sum: {
              $cond: [{ $in: ['$stockMovements.type', ['IN', 'ADJUSTMENT']] }, '$stockMovements.quantity', 0]
            }
          },
          outCount: {
            $sum: {
              $cond: [{ $in: ['$stockMovements.type', ['OUT']] }, '$stockMovements.quantity', 0]
            }
          }
        }
      },
      { $sort: { totalMovements: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      movements,
      dailyMovements,
      topMovedProducts
    });

  } catch (error) {
    console.error('Error fetching movements stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/inventory/stats/low-stock - Sản phẩm sắp hết hàng
router.get('/stats/low-stock', async (req, res) => {
  try {
    const lowStockProducts = await Inventory.find({
      status: 'ACTIVE',
      $expr: { $lte: ['$availableStock', '$reorderLevel'] }
    }).sort({ availableStock: 1 });

    // Lấy thông tin chi tiết sản phẩm
    const enrichedProducts = await Promise.all(
      lowStockProducts.map(async (item) => {
        let productInfo = { name: 'Unknown Product' };
        
        try {
          switch (item.productType) {
            case 'laptop':
              const laptop = await Laptop.findById(item.productId);
              if (laptop) productInfo = { name: laptop.name, model: laptop.model };
              break;
            case 'printer':
              const printer = await Printer.findById(item.productId);
              if (printer) productInfo = { name: printer.name, model: printer.model };
              break;
            case 'service':
              const service = await Service.findById(item.productId);
              if (service) productInfo = { name: service.name, description: service.description };
              break;
          }
        } catch (err) {
          console.error('Error fetching product info:', err);
        }

        return {
          ...item.toObject(),
          productInfo
        };
      })
    );

    res.json({
      success: true,
      lowStockProducts: enrichedProducts
    });

  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/inventory/stats/turnover - Thống kê tốc độ quay vòng hàng tồn kho
router.get('/stats/turnover', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Tính tốc độ quay vòng dựa trên stock movements
    const turnoverStats = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $unwind: '$stockMovements' },
      { 
        $match: { 
          'stockMovements.date': { $gte: fromDate },
          'stockMovements.type': 'OUT'
        }
      },
      {
        $group: {
          _id: '$productId',
          productType: { $first: '$productType' },
          currentStock: { $first: '$currentStock' },
          totalSold: { $sum: '$stockMovements.quantity' },
          averageStock: { $avg: '$currentStock' }
        }
      },
      {
        $addFields: {
          turnoverRate: {
            $cond: [
              { $gt: ['$averageStock', 0] },
              { $divide: ['$totalSold', '$averageStock'] },
              0
            ]
          }
        }
      },
      { $sort: { turnoverRate: -1 } }
    ]);

    // Phân loại theo tốc độ quay vòng
    const fastMoving = turnoverStats.filter(item => item.turnoverRate > 2);
    const slowMoving = turnoverStats.filter(item => item.turnoverRate < 0.5);
    const normalMoving = turnoverStats.filter(item => item.turnoverRate >= 0.5 && item.turnoverRate <= 2);

    res.json({
      success: true,
      turnoverStats,
      categories: {
        fastMoving: fastMoving.length,
        normalMoving: normalMoving.length,
        slowMoving: slowMoving.length
      },
      fastMoving: fastMoving.slice(0, 10),
      slowMoving: slowMoving.slice(0, 10)
    });

  } catch (error) {
    console.error('Error fetching turnover stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/inventory/stats/value-analysis - Phân tích giá trị tồn kho
router.get('/stats/value-analysis', async (req, res) => {
  try {
    // Phân tích ABC - phân loại sản phẩm theo giá trị
    const valueAnalysis = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $addFields: {
          totalValue: { $multiply: ['$currentStock', '$cost'] }
        }
      },
      { $sort: { totalValue: -1 } },
      {
        $group: {
          _id: null,
          totalInventoryValue: { $sum: '$totalValue' },
          products: { $push: '$$ROOT' }
        }
      }
    ]);

    if (valueAnalysis.length === 0) {
      return res.json({
        success: true,
        abcAnalysis: { A: [], B: [], C: [] },
        summary: { totalValue: 0 }
      });
    }

    const { totalInventoryValue, products } = valueAnalysis[0];
    let cumulativeValue = 0;
    const abcAnalysis = { A: [], B: [], C: [] };

    products.forEach(product => {
      cumulativeValue += product.totalValue;
      const percentage = (cumulativeValue / totalInventoryValue) * 100;
      
      if (percentage <= 80) {
        abcAnalysis.A.push(product);
      } else if (percentage <= 95) {
        abcAnalysis.B.push(product);
      } else {
        abcAnalysis.C.push(product);
      }
    });

    // Thống kê theo warehouse
    const warehouseStats = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $group: {
          _id: '$location.warehouse',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } }
        }
      }
    ]);

    res.json({
      success: true,
      abcAnalysis,
      warehouseStats,
      summary: {
        totalValue: totalInventoryValue,
        totalProducts: products.length,
        averageValue: totalInventoryValue / products.length
      }
    });

  } catch (error) {
    console.error('Error fetching value analysis:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
