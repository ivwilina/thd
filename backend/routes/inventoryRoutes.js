const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { Laptop } = require('../models/Laptop');
const { Printer } = require('../models/Printer');
const Service = require('../models/Service');

// GET /api/inventory - Lấy danh sách tồn kho
router.get('/', async (req, res) => {
  try {
    const { 
      productType, 
      warehouse, 
      status = 'ACTIVE',
      lowStock = false,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build filter
    const filter = { status };
    if (productType) filter.productType = productType;
    if (warehouse) filter['location.warehouse'] = warehouse;
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$availableStock', '$reorderLevel'] };
    }

    // Get inventory with pagination
    const inventory = await Inventory.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Inventory.countDocuments(filter);

    res.json({
      inventory,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/inventory/:productId - Lấy tồn kho của một sản phẩm
router.get('/:productId', async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ 
      productId: req.params.productId,
      status: 'ACTIVE'
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/inventory/stats/overview - Thống kê tổng quan tồn kho
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      { $match: { status: 'ACTIVE' } },
      {
        $group: {
          _id: '$productType',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalReserved: { $sum: '$reservedStock' },
          totalAvailable: { $sum: '$availableStock' },
          avgStock: { $avg: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } }
        }
      }
    ]);

    // Low stock items
    const lowStockCount = await Inventory.countDocuments({
      status: 'ACTIVE',
      $expr: { $lte: ['$availableStock', '$reorderLevel'] }
    });

    // Out of stock items
    const outOfStockCount = await Inventory.countDocuments({
      status: 'ACTIVE',
      availableStock: { $lte: 0 }
    });

    res.json({
      byProductType: stats,
      alerts: {
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/inventory/stats/warehouse - Thống kê theo kho
router.get('/stats/warehouse', async (req, res) => {
  try {
    const stats = await Inventory.aggregate([
      { $match: { status: 'ACTIVE', productType: { $ne: 'service' } } },
      {
        $group: {
          _id: '$location.warehouse',
          totalProducts: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } },
          productTypes: { $addToSet: '$productType' }
        }
      },
      { $sort: { totalStock: -1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/inventory/alerts/low-stock - Cảnh báo hàng sắp hết
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      status: 'ACTIVE',
      $expr: { $lte: ['$availableStock', '$reorderLevel'] }
    }).sort({ availableStock: 1 });

    // Populate product details
    const enrichedItems = await Promise.all(lowStockItems.map(async (item) => {
      let productDetails = null;
      
      try {
        switch (item.productType) {
          case 'laptop':
            productDetails = await Laptop.findById(item.productId).select('displayName model brand');
            break;
          case 'printer':
            productDetails = await Printer.findById(item.productId).select('printType brand');
            break;
          case 'service':
            productDetails = await Service.findById(item.productId).select('name type');
            break;
        }
      } catch (err) {
        console.log('Error fetching product details:', err.message);
      }

      return {
        ...item.toObject(),
        productDetails
      };
    }));

    res.json(enrichedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/inventory/:productId/update-stock - Cập nhật tồn kho
router.post('/:productId/update-stock', async (req, res) => {
  try {
    const { quantityChange, reason, reference } = req.body;

    if (!quantityChange || !reason) {
      return res.status(400).json({ 
        error: 'quantityChange and reason are required' 
      });
    }

    const inventory = await Inventory.findOne({ 
      productId: req.params.productId,
      status: 'ACTIVE'
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    await inventory.updateStock(quantityChange, reason, reference);

    res.json({
      message: 'Stock updated successfully',
      inventory
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/inventory/:productId/reserve - Đặt trước hàng
router.post('/:productId/reserve', async (req, res) => {
  try {
    const { quantity, reason, reference } = req.body;

    if (!quantity || !reason) {
      return res.status(400).json({ 
        error: 'quantity and reason are required' 
      });
    }

    const inventory = await Inventory.findOne({ 
      productId: req.params.productId,
      status: 'ACTIVE'
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    await inventory.reserveStock(quantity, reason, reference);

    res.json({
      message: 'Stock reserved successfully',
      inventory
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/inventory/:productId/release - Hủy đặt trước
router.post('/:productId/release', async (req, res) => {
  try {
    const { quantity, reason, reference } = req.body;

    if (!quantity || !reason) {
      return res.status(400).json({ 
        error: 'quantity and reason are required' 
      });
    }

    const inventory = await Inventory.findOne({ 
      productId: req.params.productId,
      status: 'ACTIVE'
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory not found' });
    }

    await inventory.releaseReservedStock(quantity, reason, reference);

    res.json({
      message: 'Reserved stock released successfully',
      inventory
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
