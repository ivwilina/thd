const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { Laptop } = require('../models/Laptop');
const { Printer } = require('../models/Printer');
const Service = require('../models/Service');

// Hàm tạo số ngẫu nhiên trong khoảng
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Hàm tạo dữ liệu tồn kho ngẫu nhiên theo loại sản phẩm
const generateStockData = (productType) => {
  let baseStock, minStock, maxStock, reorderLevel;
  
  switch(productType) {
    case 'laptop':
      baseStock = randomBetween(15, 50); // Laptop thường có stock trung bình
      minStock = 5;
      maxStock = 100;
      reorderLevel = 10;
      break;
    case 'printer':
      baseStock = randomBetween(20, 60); // Máy in thường có stock cao hơn
      minStock = 8;
      maxStock = 150;
      reorderLevel = 15;
      break;
    case 'service':
      baseStock = 999; // Service không giới hạn số lượng
      minStock = 0;
      maxStock = 999;
      reorderLevel = 0;
      break;
    default:
      baseStock = randomBetween(10, 30);
      minStock = 5;
      maxStock = 100;
      reorderLevel = 10;
  }

  const reservedStock = randomBetween(0, Math.min(5, Math.floor(baseStock * 0.2))); // Tối đa 20% stock bị reserved
  const availableStock = baseStock - reservedStock;

  return {
    currentStock: baseStock,
    reservedStock,
    availableStock,
    minimumStock: minStock,
    maximumStock: maxStock,
    reorderLevel,
    cost: productType === 'service' ? 0 : randomBetween(100000, 500000), // Cost cho việc nhập hàng
  };
};

// Hàm tạo thông tin kho và nhà cung cấp
const generateLocationAndSupplier = (productType, index) => {
  const warehouses = ['MAIN', 'STORE_1', 'STORE_2', 'ONLINE'];
  const shelves = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02'];
  
  const suppliers = {
    laptop: [
      { name: 'Dell Vietnam', contact: 'dell@vietnam.com', leadTime: 7 },
      { name: 'HP Vietnam', contact: 'hp@vietnam.com', leadTime: 5 },
      { name: 'Lenovo Vietnam', contact: 'lenovo@vietnam.com', leadTime: 10 },
      { name: 'Asus Vietnam', contact: 'asus@vietnam.com', leadTime: 7 },
      { name: 'Acer Vietnam', contact: 'acer@vietnam.com', leadTime: 8 }
    ],
    printer: [
      { name: 'Canon Vietnam', contact: 'canon@vietnam.com', leadTime: 5 },
      { name: 'HP Vietnam', contact: 'hp@vietnam.com', leadTime: 5 },
      { name: 'Epson Vietnam', contact: 'epson@vietnam.com', leadTime: 7 },
      { name: 'Brother Vietnam', contact: 'brother@vietnam.com', leadTime: 6 }
    ],
    service: [
      { name: 'Internal Service Team', contact: 'service@company.com', leadTime: 0 }
    ]
  };

  const supplierList = suppliers[productType] || suppliers.laptop;
  const supplier = supplierList[index % supplierList.length];

  return {
    location: {
      warehouse: warehouses[index % warehouses.length],
      shelf: shelves[index % shelves.length],
      position: String(index + 1).padStart(3, '0')
    },
    supplier
  };
};

// Hàm tạo stock movements ngẫu nhiên (lịch sử nhập/xuất kho)
const generateStockMovements = (currentStock) => {
  const movements = [];
  const movementTypes = ['IN', 'OUT', 'ADJUSTMENT'];
  const reasons = {
    'IN': ['Initial Stock', 'Purchase Order', 'Return from Customer', 'Stock Adjustment'],
    'OUT': ['Sale', 'Damaged Goods', 'Return to Supplier', 'Internal Use'],
    'ADJUSTMENT': ['Stock Count', 'System Correction', 'Damaged Inventory']
  };

  // Tạo movement ban đầu (nhập kho)
  movements.push({
    type: 'IN',
    quantity: currentStock + randomBetween(5, 15), // Số lượng nhập ban đầu cao hơn stock hiện tại
    reason: 'Initial Stock',
    reference: `PO-${Date.now()}`,
    date: new Date(Date.now() - randomBetween(30, 90) * 24 * 60 * 60 * 1000) // 30-90 ngày trước
  });

  // Tạo vài movement ngẫu nhiên
  for (let i = 0; i < randomBetween(2, 5); i++) {
    const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
    const reasonList = reasons[type];
    const reason = reasonList[Math.floor(Math.random() * reasonList.length)];
    
    movements.push({
      type,
      quantity: type === 'IN' ? randomBetween(5, 20) : randomBetween(1, 10),
      reason,
      reference: type === 'IN' ? `PO-${Date.now() + i}` : `SO-${Date.now() + i}`,
      date: new Date(Date.now() - randomBetween(1, 30) * 24 * 60 * 60 * 1000) // 1-30 ngày trước
    });
  }

  return movements;
};

const seedInventory = async () => {
  try {
    console.log('Starting inventory seeding...');

    // Xóa dữ liệu inventory cũ
    await Inventory.deleteMany({});
    console.log('Cleared existing inventory data');

    const inventoryData = [];

    // Lấy tất cả laptop
    const laptops = await Laptop.find({}).select('_id displayName');
    console.log(`Found ${laptops.length} laptops`);

    // Tạo inventory cho từng laptop
    laptops.forEach((laptop, index) => {
      const stockData = generateStockData('laptop');
      const locationSupplier = generateLocationAndSupplier('laptop', index);
      
      inventoryData.push({
        productId: laptop._id,
        productType: 'laptop',
        productModel: 'Laptop', // Reference đến Laptop model
        ...stockData,
        ...locationSupplier,
        stockMovements: generateStockMovements(stockData.currentStock),
        notes: `Inventory for ${laptop.displayName}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Lấy tất cả printer
    const printers = await Printer.find({}).select('_id printType');
    console.log(`Found ${printers.length} printers`);

    // Tạo inventory cho từng printer
    printers.forEach((printer, index) => {
      const stockData = generateStockData('printer');
      const locationSupplier = generateLocationAndSupplier('printer', index);
      
      inventoryData.push({
        productId: printer._id,
        productType: 'printer',
        productModel: 'Printer', // Reference đến Printer model
        ...stockData,
        ...locationSupplier,
        stockMovements: generateStockMovements(stockData.currentStock),
        notes: `Inventory for ${printer.printType}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Lấy tất cả service
    const services = await Service.find({}).select('_id name');
    console.log(`Found ${services.length} services`);

    // Tạo inventory cho từng service
    services.forEach((service, index) => {
      const stockData = generateStockData('service');
      const locationSupplier = generateLocationAndSupplier('service', index);
      
      inventoryData.push({
        productId: service._id,
        productType: 'service',
        productModel: 'Service', // Reference đến Service model
        ...stockData,
        ...locationSupplier,
        stockMovements: [], // Service không có stock movements
        notes: `Inventory for ${service.name}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Insert tất cả inventory data
    const result = await Inventory.insertMany(inventoryData);
    
    console.log('✅ Inventory seeding completed!');
    console.log(`📦 Created ${result.length} inventory records:`);
    console.log(`   - Laptops: ${laptops.length} records`);
    console.log(`   - Printers: ${printers.length} records`);
    console.log(`   - Services: ${services.length} records`);

    // Hiển thị thống kê stock
    const totalStock = await Inventory.aggregate([
      { $match: { productType: { $ne: 'service' } } },
      { $group: { _id: '$productType', totalStock: { $sum: '$currentStock' }, avgStock: { $avg: '$currentStock' } } }
    ]);

    console.log('\n📊 Stock Statistics:');
    totalStock.forEach(stat => {
      console.log(`   - ${stat._id}: Total = ${stat.totalStock}, Average = ${Math.round(stat.avgStock)}`);
    });

    // Hiển thị sản phẩm có stock thấp
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$availableStock', '$reorderLevel'] },
      productType: { $ne: 'service' }
    }).populate('productId');

    if (lowStockItems.length > 0) {
      console.log('\n⚠️  Low Stock Alerts:');
      lowStockItems.forEach(item => {
        console.log(`   - Product ID: ${item.productId}, Available: ${item.availableStock}, Reorder Level: ${item.reorderLevel}`);
      });
    }

    return result;

  } catch (error) {
    console.error('❌ Error seeding inventory:', error);
    throw error;
  }
};

module.exports = seedInventory;

// Nếu file được chạy trực tiếp
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/may_tinh_tran_anh')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedInventory();
    })
    .then(() => {
      console.log('Inventory seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
