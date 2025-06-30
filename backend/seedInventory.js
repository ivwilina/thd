const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');
const { Laptop } = require('./models/Laptop');
const { Printer } = require('./models/Printer');
const Service = require('./models/Service');

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateInventoryData = async () => {
  try {
    console.log('🧹 Clearing existing inventory data...');
    await Inventory.deleteMany({});

    console.log('📊 Generating inventory data...');

    // Lấy danh sách laptops, printers, services
    const laptops = await Laptop.find({}).limit(10);
    const printers = await Printer.find({}).limit(5);
    const services = await Service.find({}).limit(3);

    const inventoryData = [];

    // Tạo inventory cho laptops
    for (let i = 0; i < laptops.length; i++) {
      const laptop = laptops[i];
      const currentStock = Math.floor(Math.random() * 50) + 5;
      const reservedStock = Math.floor(Math.random() * 5);
      
      inventoryData.push({
        productId: laptop._id.toString(),
        productType: 'laptop',
        productModel: 'Laptop',
        currentStock,
        reservedStock,
        availableStock: currentStock - reservedStock,
        minimumStock: 5,
        maximumStock: 100,
        reorderLevel: 10,
        cost: laptop.price * 0.7, // 70% of selling price
        location: {
          warehouse: ['MAIN', 'BRANCH_1', 'BRANCH_2'][Math.floor(Math.random() * 3)],
          shelf: `A${String(i + 1).padStart(2, '0')}`,
          position: `${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`
        },
        supplier: {
          name: ['Dell Vietnam', 'HP Vietnam', 'Asus Vietnam', 'Lenovo Vietnam'][Math.floor(Math.random() * 4)],
          contact: '0123456789',
          leadTime: Math.floor(Math.random() * 14) + 7
        },
        stockMovements: [
          {
            type: 'IN',
            quantity: currentStock + 20,
            reason: 'Nhập hàng đầu kỳ',
            reference: `PO-${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            employeeId: 'admin-001',
            notes: 'Nhập hàng từ nhà cung cấp'
          },
          {
            type: 'OUT',
            quantity: Math.floor(Math.random() * 15) + 5,
            reason: 'Bán hàng',
            reference: `SO-${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
            employeeId: 'staff-001',
            notes: 'Xuất hàng bán cho khách'
          }
        ],
        status: 'ACTIVE',
        lastRestocked: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
        lastSold: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
        turnoverRate: Math.random() * 3,
        seasonality: {
          peak: ['11', '12', '1'],
          low: ['6', '7', '8']
        },
        metadata: {
          createdBy: 'admin-001',
          updatedBy: 'admin-001'
        }
      });
    }

    // Tạo inventory cho printers
    for (let i = 0; i < printers.length; i++) {
      const printer = printers[i];
      const currentStock = Math.floor(Math.random() * 30) + 3;
      const reservedStock = Math.floor(Math.random() * 3);
      
      inventoryData.push({
        productId: printer._id.toString(),
        productType: 'printer',
        productModel: 'Printer',
        currentStock,
        reservedStock,
        availableStock: currentStock - reservedStock,
        minimumStock: 3,
        maximumStock: 50,
        reorderLevel: 5,
        cost: printer.price * 0.75,
        location: {
          warehouse: 'MAIN',
          shelf: `B${String(i + 1).padStart(2, '0')}`,
          position: `${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`
        },
        supplier: {
          name: ['Canon Vietnam', 'HP Vietnam', 'Brother Vietnam'][Math.floor(Math.random() * 3)],
          contact: '0123456789',
          leadTime: Math.floor(Math.random() * 10) + 5
        },
        stockMovements: [
          {
            type: 'IN',
            quantity: currentStock + 10,
            reason: 'Nhập hàng đầu kỳ',
            reference: `PO-PR-${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000),
            employeeId: 'admin-001',
            notes: 'Nhập hàng printer'
          },
          {
            type: 'OUT',
            quantity: Math.floor(Math.random() * 8) + 2,
            reason: 'Bán hàng',
            reference: `SO-PR-${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
            employeeId: 'staff-001',
            notes: 'Xuất bán printer'
          }
        ],
        status: 'ACTIVE',
        lastRestocked: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        lastSold: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        turnoverRate: Math.random() * 2,
        seasonality: {
          peak: ['9', '10', '11'],
          low: ['1', '2', '3']
        },
        metadata: {
          createdBy: 'admin-001',
          updatedBy: 'admin-001'
        }
      });
    }

    // Tạo inventory cho services
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      
      inventoryData.push({
        productId: service._id.toString(),
        productType: 'service',
        productModel: 'Service',
        currentStock: 999, // Services không có giới hạn stock
        reservedStock: 0,
        availableStock: 999,
        minimumStock: 0,
        maximumStock: 999,
        reorderLevel: 0,
        cost: service.price * 0.5,
        location: {
          warehouse: 'SERVICE',
          shelf: 'SV01',
          position: String(i + 1).padStart(3, '0')
        },
        supplier: {
          name: 'Internal Service Team',
          contact: '0123456789',
          leadTime: 0
        },
        stockMovements: [
          {
            type: 'OUT',
            quantity: Math.floor(Math.random() * 20) + 5,
            reason: 'Dịch vụ đã thực hiện',
            reference: `SV-${Date.now()}-${i}`,
            date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),
            employeeId: 'tech-001',
            notes: 'Thực hiện dịch vụ cho khách hàng'
          }
        ],
        status: 'ACTIVE',
        lastSold: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        turnoverRate: Math.random() * 5,
        metadata: {
          createdBy: 'admin-001',
          updatedBy: 'admin-001'
        }
      });
    }

    // Tạo một số sản phẩm low stock để test
    for (let i = 0; i < 3; i++) {
      const lowStockLaptop = laptops[i];
      if (lowStockLaptop) {
        inventoryData.push({
          productId: lowStockLaptop._id.toString() + '-low',
          productType: 'laptop',
          productModel: 'Laptop',
          currentStock: 2, // Dưới reorderLevel
          reservedStock: 1,
          availableStock: 1,
          minimumStock: 5,
          maximumStock: 100,
          reorderLevel: 10,
          cost: lowStockLaptop.price * 0.7,
          location: {
            warehouse: 'MAIN',
            shelf: `LOW${String(i + 1).padStart(2, '0')}`,
            position: '001'
          },
          supplier: {
            name: 'Dell Vietnam',
            contact: '0123456789',
            leadTime: 14
          },
          stockMovements: [
            {
              type: 'IN',
              quantity: 20,
              reason: 'Nhập hàng đầu kỳ',
              reference: `PO-LOW-${Date.now()}-${i}`,
              date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
              employeeId: 'admin-001'
            },
            {
              type: 'OUT',
              quantity: 17,
              reason: 'Bán hàng',
              reference: `SO-LOW-${Date.now()}-${i}`,
              date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              employeeId: 'staff-001'
            }
          ],
          status: 'ACTIVE',
          lastRestocked: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          lastSold: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          turnoverRate: 5,
          metadata: {
            createdBy: 'admin-001',
            updatedBy: 'admin-001'
          }
        });
      }
    }

    // Insert dữ liệu vào database
    console.log(`📦 Inserting ${inventoryData.length} inventory records...`);
    await Inventory.insertMany(inventoryData);

    console.log('✅ Inventory data generated successfully!');
    console.log(`📊 Created ${inventoryData.length} inventory records`);
    
    // In thống kê
    const stats = await Inventory.aggregate([
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 },
          totalStock: { $sum: '$currentStock' },
          totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } }
        }
      }
    ]);
    
    console.log('\n📈 Inventory Statistics:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} items, ${stat.totalStock} units, ${Math.round(stat.totalValue).toLocaleString()} VND`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Error generating inventory data:', error);
    process.exit(1);
  }
};

generateInventoryData();
