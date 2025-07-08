/**
 * Complete System Setup Script
 * Creates all necessary data for a new deployment
 * Includes: Products, Employees, Orders, Services, Inventory
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Laptop = require('./models/Laptop');
const Printer = require('./models/Printer');
const Employee = require('./models/Employee');
const Service = require('./models/Service');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const sampleEmployees = [
  {
    _id: 'ADMIN001',
    name: 'Nguyễn Văn Admin',
    username: 'admin',
    email: 'admin@maytinhrananh.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    phoneNumber: '0123456789',
    address: '123 Đường ABC, TP.HCM'
  },
  {
    _id: 'STAFF001',
    name: 'Trần Thị Staff',
    username: 'staff1',
    email: 'staff1@maytinhrananh.com', 
    password: 'staff123',
    role: 'staff',
    isActive: true,
    phoneNumber: '0987654321',
    address: '456 Đường XYZ, TP.HCM'
  },
  {
    _id: 'STAFF002',
    name: 'Lê Văn Hỗ Trợ',
    username: 'staff2',
    email: 'staff2@maytinhrananh.com',
    password: 'staff123',
    role: 'staff', 
    isActive: true,
    phoneNumber: '0369258147',
    address: '789 Đường DEF, TP.HCM'
  },
  {
    _id: 'MGR001',
    name: 'Phạm Thị Manager',
    username: 'manager',
    email: 'manager@maytinhrananh.com',
    password: 'manager123',
    role: 'manager',
    isActive: true,
    phoneNumber: '0147258369',
    address: '321 Đường GHI, TP.HCM'
  }
];

const sampleLaptops = [
  {
    _id: 'LAPTOP001',
    brand: 'DELL',
    model: 'Inspiron 3511',
    displayName: 'Dell Inspiron 3511 - Intel Core i5',
    cpu: 'INTEL_I5_1135G7',
    ramSize: 'RAM_8GB',
    ramDetails: '8GB DDR4',
    storageSize: 'STORAGE_256GB',
    storageDetails: '256GB SSD',
    screenSize: 'SCREEN_15_6',
    screenDetails: '15.6 inch Full HD',
    vga: 'INTEL_IRIS_XE',
    price: 15990000,
    description: 'Laptop Dell Inspiron 3511 với cấu hình mạnh mẽ, phù hợp cho công việc văn phòng và học tập.',
    isNewProduct: true,
    specialFeature: [],
    images: ['laptop_dell_1_1.jpg', 'laptop_dell_1_2.jpg', 'laptop_dell_1_3.jpg']
  },
  {
    _id: 'LAPTOP002',
    brand: 'HP',
    model: 'Pavilion 15-eg0xxx',
    displayName: 'HP Pavilion 15 - Intel Core i7',
    cpu: 'INTEL_I7_1165G7',
    ramSize: 'RAM_16GB',
    ramDetails: '16GB DDR4',
    storageSize: 'STORAGE_512GB',
    storageDetails: '512GB SSD',
    screenSize: 'SCREEN_15_6',
    screenDetails: '15.6 inch Full HD IPS',
    vga: 'INTEL_IRIS_XE',
    price: 19990000,
    description: 'Laptop HP Pavilion 15 với hiệu năng cao, thiết kế đẹp mắt.',
    isNewProduct: true,
    specialFeature: [],
    images: ['laptop_hp_1_1.jpg', 'laptop_hp_1_2.jpg', 'laptop_hp_1_3.jpg']
  },
  {
    _id: 'LAPTOP003',
    brand: 'ASUS',
    model: 'VivoBook 15 X515',
    displayName: 'Asus VivoBook 15 - AMD Ryzen 5',
    cpu: 'AMD_RYZEN5_5500U',
    ramSize: 'RAM_8GB',
    ramDetails: '8GB DDR4',
    storageSize: 'STORAGE_256GB',
    storageDetails: '256GB SSD',
    screenSize: 'SCREEN_15_6',
    screenDetails: '15.6 inch Full HD',
    vga: 'AMD_RADEON',
    price: 13990000,
    description: 'Laptop Asus VivoBook 15 với vi xử lý AMD Ryzen mạnh mẽ.',
    isNewProduct: true,
    specialFeature: [],
    images: ['laptop_asus_1_1.jpg', 'laptop_asus_1_2.jpg', 'laptop_asus_1_3.jpg']
  },
  {
    _id: 'LAPTOP004',
    brand: 'LENOVO',
    model: 'IdeaPad 3 15ITL6',
    displayName: 'Lenovo IdeaPad 3 - Intel Core i5',
    cpu: 'INTEL_I5_1135G7',
    ramSize: 'RAM_8GB',
    ramDetails: '8GB DDR4',
    storageSize: 'STORAGE_512GB',
    storageDetails: '512GB SSD',
    screenSize: 'SCREEN_15_6',
    screenDetails: '15.6 inch Full HD',
    vga: 'INTEL_IRIS_XE',
    price: 16490000,
    description: 'Laptop Lenovo IdeaPad 3 với thiết kế hiện đại, cấu hình ổn định.',
    isNewProduct: true,
    specialFeature: [],
    images: ['laptop_lenovo_1_1.jpg', 'laptop_lenovo_1_2.jpg', 'laptop_lenovo_1_3.jpg']
  },
  {
    _id: 'LAPTOP005',
    brand: 'APPLE',
    model: 'MacBook Air M1',
    displayName: 'MacBook Air M1 - 256GB',
    cpu: 'APPLE_M1',
    ramSize: 'RAM_8GB',
    ramDetails: '8GB Unified Memory',
    storageSize: 'STORAGE_256GB',
    storageDetails: '256GB SSD',
    screenSize: 'SCREEN_13_3',
    screenDetails: '13.3 inch Retina Display',
    vga: 'APPLE_M1_GPU',
    price: 26990000,
    description: 'MacBook Air với chip M1 siêu tiết kiệm pin, hiệu năng vượt trội.',
    isNewProduct: true,
    specialFeature: [],
    images: ['macbook_air_m1_1.jpg', 'macbook_air_m1_2.jpg', 'macbook_air_m1_3.jpg']
  },
  {
    _id: 'LAPTOP006',
    brand: 'MSI',
    model: 'Gaming GF63 Thin',
    displayName: 'MSI Gaming GF63 - GTX 1650',
    cpu: 'INTEL_I5_10500H',
    ramSize: 'RAM_8GB',
    ramDetails: '8GB DDR4',
    storageSize: 'STORAGE_512GB',
    storageDetails: '512GB SSD',
    screenSize: 'SCREEN_15_6',
    screenDetails: '15.6 inch Full HD 144Hz',
    vga: 'NVIDIA_GTX_1650',
    price: 18990000,
    description: 'Laptop gaming MSI GF63 với card đồ họa rời, màn hình 144Hz.',
    isNewProduct: true,
    specialFeature: [],
    images: ['laptop_msi_1_1.jpg', 'laptop_msi_1_2.jpg', 'laptop_msi_1_3.jpg']
  },
  // Used laptops
  {
    _id: 'LAPTOP007',
    brand: 'DELL',
    model: 'Latitude 7420',
    displayName: 'Dell Latitude 7420 - Cũ 99%',
    cpu: 'INTEL_I7_1185G7',
    ramSize: 'RAM_16GB',
    ramDetails: '16GB DDR4',
    storageSize: 'STORAGE_512GB',
    storageDetails: '512GB SSD',
    screenSize: 'SCREEN_14',
    screenDetails: '14 inch Full HD',
    vga: 'INTEL_IRIS_XE',
    price: 22990000,
    description: 'Laptop Dell Latitude cũ 99%, chất lượng như mới, bảo hành 6 tháng.',
    isNewProduct: false,
    specialFeature: [],
    images: ['laptop_dell_used_1.jpg', 'laptop_dell_used_2.jpg', 'laptop_dell_used_3.jpg']
  },
  {
    _id: 'LAPTOP008',
    brand: 'HP',
    model: 'EliteBook 840 G8',
    displayName: 'HP EliteBook 840 - Cũ 95%',
    cpu: 'INTEL_I5_1135G7',
    ramSize: 'RAM_16GB',
    ramDetails: '16GB DDR4',
    storageSize: 'STORAGE_256GB',
    storageDetails: '256GB SSD',
    screenSize: 'SCREEN_14',
    screenDetails: '14 inch Full HD',
    vga: 'INTEL_IRIS_XE',
    price: 19990000,
    description: 'Laptop HP EliteBook cũ 95%, doanh nhân chuyên nghiệp.',
    isNewProduct: false,
    specialFeature: [],
    images: ['laptop_hp_used_1.jpg', 'laptop_hp_used_2.jpg', 'laptop_hp_used_3.jpg']
  }
];

const samplePrinters = [
  {
    _id: 'PRINTER001',
    brand: 'CANON',
    type: 'INKJET',
    printType: 'Phun màu',
    description: 'Máy in phun màu đa năng Canon PIXMA G3010',
    price: 3290000,
    isNewProduct: true,
    isFeatured: true,
    discount: 5,
    images: ['printer_canon_g3010_1.jpg', 'printer_canon_g3010_2.jpg', 'printer_canon_g3010_3.jpg']
  },
  {
    _id: 'PRINTER002',
    brand: 'HP',
    type: 'LASER',
    printType: 'Laser đen trắng',
    description: 'Máy in laser đen trắng HP LaserJet Pro M15W',
    price: 5990000,
    isNewProduct: true,
    isFeatured: true,
    discount: 0,
    images: ['printer_hp_m15w_1.jpg', 'printer_hp_m15w_2.jpg', 'printer_hp_m15w_3.jpg']
  },
  {
    _id: 'PRINTER003',
    brand: 'BROTHER',
    type: 'LASER',
    printType: 'Laser đen trắng',
    description: 'Máy in laser đen trắng Brother HL-L2321D',
    price: 2990000,
    isNewProduct: true,
    isFeatured: false,
    discount: 8,
    images: ['printer_brother_l2321d_1.jpg', 'printer_brother_l2321d_2.jpg', 'printer_brother_l2321d_3.jpg']
  },
  {
    _id: 'PRINTER004',
    brand: 'EPSON',
    type: 'INKJET',
    printType: 'Phun màu',
    description: 'Máy in phun màu đa năng Epson EcoTank L3210',
    price: 4190000,
    isNewProduct: true,
    isFeatured: true,
    discount: 12,
    images: ['printer_epson_l3210_1.jpg', 'printer_epson_l3210_2.jpg', 'printer_epson_l3210_3.jpg']
  }
];

const sampleServices = [
  {
    _id: 'SERVICE001',
    name: 'Cài đặt hệ điều hành Windows',
    type: 'installation',
    description: 'Dịch vụ cài đặt hệ điều hành Windows, driver, phần mềm cơ bản',
    priceMin: 150000,
    priceMax: 250000,
    isActive: true,
    isFeatured: true
  },
  {
    _id: 'SERVICE002',
    name: 'Vệ sinh laptop chuyên nghiệp',
    type: 'maintenance',
    description: 'Vệ sinh laptop, thay keo tản nhiệt, làm sạch quạt tản nhiệt',
    priceMin: 250000,
    priceMax: 350000,
    isActive: true,
    isFeatured: true
  },
  {
    _id: 'SERVICE003',
    name: 'Nâng cấp RAM laptop',
    type: 'installation',
    description: 'Dịch vụ nâng cấp RAM cho laptop, bao gồm RAM và công lắp đặt',
    priceMin: 100000,
    priceMax: 200000,
    isActive: true,
    isFeatured: false
  },
  {
    _id: 'SERVICE004',
    name: 'Thay thế ổ cứng SSD',
    type: 'installation',
    description: 'Thay thế ổ cứng HDD bằng SSD, clone dữ liệu, tối ưu hệ thống',
    priceMin: 200000,
    priceMax: 300000,
    isActive: true,
    isFeatured: true
  },
  {
    _id: 'SERVICE005',
    name: 'Sửa chữa màn hình laptop',
    type: 'repair',
    description: 'Sửa chữa màn hình laptop: thay LCD, sửa bản lề, cáp màn hình',
    priceMin: 400000,
    priceMax: 600000,
    isActive: true,
    isFeatured: false
  },
  {
    _id: 'SERVICE006',
    name: 'Cài đặt phần mềm văn phòng',
    type: 'installation',
    description: 'Cài đặt bộ Microsoft Office, Adobe Reader, phần mềm cần thiết',
    priceMin: 50000,
    priceMax: 150000,
    isActive: true,
    isFeatured: false
  }
];

// Hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Setup functions
const setupEmployees = async () => {
  console.log('📝 Setting up employees...');
  
  // Clear existing employees
  await Employee.deleteMany({});
  
  // Hash passwords and create employees
  for (let emp of sampleEmployees) {
    emp.password = await hashPassword(emp.password);
    await Employee.create(emp);
  }
  
  console.log(`✅ Created ${sampleEmployees.length} employees`);
};

const setupLaptops = async () => {
  console.log('💻 Setting up laptops...');
  
  // Clear existing laptops
  await Laptop.deleteMany({});
  
  // Create laptops
  await Laptop.insertMany(sampleLaptops);
  
  console.log(`✅ Created ${sampleLaptops.length} laptops`);
};

const setupPrinters = async () => {
  console.log('🖨️ Setting up printers...');
  
  // Clear existing printers
  await Printer.deleteMany({});
  
  // Create printers
  await Printer.insertMany(samplePrinters);
  
  console.log(`✅ Created ${samplePrinters.length} printers`);
};

const setupServices = async () => {
  console.log('🔧 Setting up services...');
  
  // Clear existing services
  await Service.deleteMany({});
  
  // Create services
  await Service.insertMany(sampleServices);
  
  console.log(`✅ Created ${sampleServices.length} services`);
};

const setupInventory = async () => {
  console.log('📦 Setting up inventory...');
  
  // Clear existing inventory
  await Inventory.deleteMany({});
  
  // Get all products
  const laptops = await Laptop.find({});
  const printers = await Printer.find({});
  
  const inventoryItems = [];
  
  // Create inventory for laptops
  for (let laptop of laptops) {
    inventoryItems.push({
      productId: laptop._id,
      productType: 'laptop',
      productModel: 'Laptop',
      currentStock: Math.floor(Math.random() * 50) + 10, // Random stock 10-59
      availableStock: Math.floor(Math.random() * 50) + 10,
      minimumStock: 5,
      maximumStock: 100,
      reorderLevel: 10,
      cost: laptop.price * 0.8, // Cost is 80% of selling price
      location: {
        warehouse: 'MAIN',
        shelf: 'A01',
        position: '001'
      },
      status: 'ACTIVE'
    });
  }
  
  // Create inventory for printers
  for (let printer of printers) {
    inventoryItems.push({
      productId: printer._id,
      productType: 'printer',
      productModel: 'Printer',
      currentStock: Math.floor(Math.random() * 30) + 5, // Random stock 5-34
      availableStock: Math.floor(Math.random() * 30) + 5,
      minimumStock: 3,
      maximumStock: 50,
      reorderLevel: 5,
      cost: printer.price * 0.75, // Cost is 75% of selling price
      location: {
        warehouse: 'MAIN',
        shelf: 'B01',
        position: '001'
      },
      status: 'ACTIVE'
    });
  }
  
  await Inventory.insertMany(inventoryItems);
  
  console.log(`✅ Created ${inventoryItems.length} inventory items`);
};

const setupSampleOrders = async () => {
  console.log('📋 Setting up sample orders...');
  
  // Clear existing orders
  await Order.deleteMany({});
  
  // Get some products and employees
  const laptops = await Laptop.find({}).limit(3);
  const printers = await Printer.find({}).limit(2);
  const staff = await Employee.find({ role: 'staff' }).limit(2);
  
  const sampleOrders = [
    {
      _id: 'ORDER001',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@gmail.com',
      customerPhoneNumber: '0123456789',
      customerAddress: '123 Đường ABC, Quận 1, TP.HCM',
      billingMethod: 'bank-transfer',
      type: 'product',
      orderItems: [
        {
          itemType: 'laptop',
          itemId: laptops[0]._id,
          itemName: laptops[0].displayName,
          quantity: 1,
          unitPrice: laptops[0].price,
          totalPrice: laptops[0].price
        }
      ],
      finalPrice: laptops[0].price,
      status: 'confirmed',
      processedBy: staff[0]._id,
      processedAt: new Date(),
      note: 'Khách hàng yêu cầu giao hàng trong tuần'
    },
    {
      _id: 'ORDER002',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@gmail.com',
      customerPhoneNumber: '0987654321',
      customerAddress: '456 Đường XYZ, Quận 3, TP.HCM',
      billingMethod: 'cash-on-delivery',
      type: 'product',
      orderItems: [
        {
          itemType: 'printer',
          itemId: printers[0]._id,
          itemName: printers[0].description,
          quantity: 2,
          unitPrice: printers[0].price,
          totalPrice: printers[0].price * 2
        }
      ],
      finalPrice: printers[0].price * 2,
      status: 'pending',
      note: 'Đơn hàng mới, chờ xử lý'
    },
    {
      _id: 'ORDER003',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@gmail.com',
      customerPhoneNumber: '0369258147',
      customerAddress: '789 Đường DEF, Quận 5, TP.HCM',
      billingMethod: 'cash',
      type: 'mixed',
      orderItems: [
        {
          itemType: 'laptop',
          itemId: laptops[1]._id,
          itemName: laptops[1].displayName,
          quantity: 1,
          unitPrice: laptops[1].price,
          totalPrice: laptops[1].price
        },
        {
          itemType: 'printer',
          itemId: printers[1]._id,
          itemName: printers[1].description,
          quantity: 1,
          unitPrice: printers[1].price,
          totalPrice: printers[1].price
        }
      ],
      finalPrice: laptops[1].price + printers[1].price,
      status: 'delivered',
      processedBy: staff[1]._id,
      processedAt: new Date(),
      note: 'Đơn hàng đã hoàn thành, khách hàng hài lòng'
    }
  ];
  
  await Order.insertMany(sampleOrders);
  
  console.log(`✅ Created ${sampleOrders.length} sample orders`);
};

// Main setup function
const runCompleteSetup = async () => {
  try {
    console.log('🚀 Starting complete system setup...\n');
    
    await connectDB();
    
    await setupEmployees();
    await setupLaptops();
    await setupPrinters();
    await setupServices();
    await setupInventory();
    await setupSampleOrders();
    
    console.log('\n🎉 Complete system setup finished successfully!');
    console.log('\n📊 Setup Summary:');
    console.log(`- Employees: ${sampleEmployees.length} (1 admin, 2 staff, 1 manager)`);
    console.log(`- Laptops: ${sampleLaptops.length} (including new and used)`);
    console.log(`- Printers: ${samplePrinters.length}`);
    console.log(`- Services: ${sampleServices.length}`);
    console.log(`- Inventory items: ${sampleLaptops.length + samplePrinters.length}`);
    console.log(`- Sample orders: 3`);
    
    console.log('\n🔑 Default login credentials:');
    console.log('Admin: admin@maytinhrananh.com / admin123');
    console.log('Staff: staff1@maytinhrananh.com / staff123');
    console.log('Manager: manager@maytinhrananh.com / manager123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run setup if called directly
if (require.main === module) {
  runCompleteSetup();
}

module.exports = {
  runCompleteSetup,
  setupEmployees,
  setupLaptops,
  setupPrinters,
  setupServices,
  setupInventory,
  setupSampleOrders
};
