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
    employeeId: 'ADMIN001',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@maytinhrananh.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    phone: '0123456789',
    address: '123 Đường ABC, TP.HCM'
  },
  {
    employeeId: 'STAFF001',
    fullName: 'Trần Thị Staff',
    email: 'staff1@maytinhrananh.com', 
    password: 'staff123',
    role: 'staff',
    status: 'active',
    phone: '0987654321',
    address: '456 Đường XYZ, TP.HCM'
  },
  {
    employeeId: 'STAFF002',
    fullName: 'Lê Văn Hỗ Trợ',
    email: 'staff2@maytinhrananh.com',
    password: 'staff123',
    role: 'staff', 
    status: 'active',
    phone: '0369258147',
    address: '789 Đường DEF, TP.HCM'
  },
  {
    employeeId: 'MGR001',
    fullName: 'Phạm Thị Manager',
    email: 'manager@maytinhrananh.com',
    password: 'manager123',
    role: 'manager',
    status: 'active',
    phone: '0147258369',
    address: '321 Đường GHI, TP.HCM'
  }
];

const sampleLaptops = [
  {
    brand: 'Dell',
    model: 'Inspiron 3511',
    displayName: 'Dell Inspiron 3511 - Intel Core i5',
    cpu: 'Intel Core i5-1135G7',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    screen: '15.6 inch Full HD',
    graphics: 'Intel Iris Xe Graphics',
    price: 15990000,
    description: 'Laptop Dell Inspiron 3511 với cấu hình mạnh mẽ, phù hợp cho công việc văn phòng và học tập.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 5,
    images: ['laptop_dell_1_1.jpg', 'laptop_dell_1_2.jpg', 'laptop_dell_1_3.jpg']
  },
  {
    brand: 'HP',
    model: 'Pavilion 15-eg0xxx',
    displayName: 'HP Pavilion 15 - Intel Core i7',
    cpu: 'Intel Core i7-1165G7',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    screen: '15.6 inch Full HD IPS',
    graphics: 'Intel Iris Xe Graphics',
    price: 19990000,
    description: 'Laptop HP Pavilion 15 với hiệu năng cao, thiết kế đẹp mắt.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 8,
    images: ['laptop_hp_1_1.jpg', 'laptop_hp_1_2.jpg', 'laptop_hp_1_3.jpg']
  },
  {
    brand: 'Asus',
    model: 'VivoBook 15 X515',
    displayName: 'Asus VivoBook 15 - AMD Ryzen 5',
    cpu: 'AMD Ryzen 5 5500U',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    screen: '15.6 inch Full HD',
    graphics: 'AMD Radeon Graphics',
    price: 13990000,
    description: 'Laptop Asus VivoBook 15 với vi xử lý AMD Ryzen mạnh mẽ.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: false,
    discount: 0,
    images: ['laptop_asus_1_1.jpg', 'laptop_asus_1_2.jpg', 'laptop_asus_1_3.jpg']
  },
  {
    brand: 'Lenovo',
    model: 'IdeaPad 3 15ITL6',
    displayName: 'Lenovo IdeaPad 3 - Intel Core i5',
    cpu: 'Intel Core i5-1135G7',
    ram: '8GB DDR4',
    storage: '512GB SSD',
    screen: '15.6 inch Full HD',
    graphics: 'Intel Iris Xe Graphics',
    price: 16490000,
    description: 'Laptop Lenovo IdeaPad 3 với thiết kế hiện đại, cấu hình ổn định.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 3,
    images: ['laptop_lenovo_1_1.jpg', 'laptop_lenovo_1_2.jpg', 'laptop_lenovo_1_3.jpg']
  },
  {
    brand: 'Apple',
    model: 'MacBook Air M1',
    displayName: 'MacBook Air M1 - 256GB',
    cpu: 'Apple M1',
    ram: '8GB Unified Memory',
    storage: '256GB SSD',
    screen: '13.3 inch Retina Display',
    graphics: 'Apple M1 GPU',
    price: 26990000,
    description: 'MacBook Air với chip M1 siêu tiết kiệm pin, hiệu năng vượt trội.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 0,
    images: ['macbook_air_m1_1.jpg', 'macbook_air_m1_2.jpg', 'macbook_air_m1_3.jpg']
  },
  {
    brand: 'MSI',
    model: 'Gaming GF63 Thin',
    displayName: 'MSI Gaming GF63 - GTX 1650',
    cpu: 'Intel Core i5-10500H',
    ram: '8GB DDR4',
    storage: '512GB SSD',
    screen: '15.6 inch Full HD 144Hz',
    graphics: 'NVIDIA GeForce GTX 1650',
    price: 18990000,
    description: 'Laptop gaming MSI GF63 với card đồ họa rời, màn hình 144Hz.',
    category: 'laptop',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 10,
    images: ['laptop_msi_1_1.jpg', 'laptop_msi_1_2.jpg', 'laptop_msi_1_3.jpg']
  },
  // Used laptops
  {
    brand: 'Dell',
    model: 'Latitude 7420',
    displayName: 'Dell Latitude 7420 - Cũ 99%',
    cpu: 'Intel Core i7-1185G7',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    screen: '14 inch Full HD',
    graphics: 'Intel Iris Xe Graphics',
    price: 22990000,
    description: 'Laptop Dell Latitude cũ 99%, chất lượng như mới, bảo hành 6 tháng.',
    category: 'laptop',
    status: 'available',
    isNewProduct: false,
    isFeatured: false,
    discount: 15,
    images: ['laptop_dell_used_1.jpg', 'laptop_dell_used_2.jpg', 'laptop_dell_used_3.jpg']
  },
  {
    brand: 'HP',
    model: 'EliteBook 840 G8',
    displayName: 'HP EliteBook 840 - Cũ 95%',
    cpu: 'Intel Core i5-1135G7',
    ram: '16GB DDR4',
    storage: '256GB SSD',
    screen: '14 inch Full HD',
    graphics: 'Intel Iris Xe Graphics',
    price: 19990000,
    description: 'Laptop HP EliteBook cũ 95%, doanh nhân chuyên nghiệp.',
    category: 'laptop',
    status: 'available',
    isNewProduct: false,
    isFeatured: false,
    discount: 20,
    images: ['laptop_hp_used_1.jpg', 'laptop_hp_used_2.jpg', 'laptop_hp_used_3.jpg']
  }
];

const samplePrinters = [
  {
    brand: 'Canon',
    model: 'PIXMA G2010',
    name: 'Canon PIXMA G2010',
    description: 'Máy in phun màu đa năng Canon PIXMA G2010',
    type: 'inkjet',
    features: ['Print', 'Copy', 'Scan'],
    price: 3290000,
    category: 'printer',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 5,
    images: ['printer_canon_g2010_1.jpg', 'printer_canon_g2010_2.jpg']
  },
  {
    brand: 'HP',
    model: 'LaserJet Pro M404dn',
    name: 'HP LaserJet Pro M404dn',
    description: 'Máy in laser đen trắng HP LaserJet Pro M404dn',
    type: 'laser',
    features: ['Print', 'Duplex'],
    price: 5990000,
    category: 'printer',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 0,
    images: ['printer_hp_m404_1.jpg', 'printer_hp_m404_2.jpg']
  },
  {
    brand: 'Brother',
    model: 'HL-L2321D',
    name: 'Brother HL-L2321D',
    description: 'Máy in laser đen trắng Brother HL-L2321D',
    type: 'laser',
    features: ['Print', 'Duplex'],
    price: 2990000,
    category: 'printer',
    status: 'available',
    isNewProduct: true,
    isFeatured: false,
    discount: 8,
    images: ['printer_brother_l2321d_1.jpg']
  },
  {
    brand: 'Epson',
    model: 'EcoTank L3210',
    name: 'Epson EcoTank L3210',
    description: 'Máy in phun màu đa năng Epson EcoTank L3210',
    type: 'inkjet',
    features: ['Print', 'Copy', 'Scan'],
    price: 4190000,
    category: 'printer',
    status: 'available',
    isNewProduct: true,
    isFeatured: true,
    discount: 12,
    images: ['printer_epson_l3210_1.jpg', 'printer_epson_l3210_2.jpg']
  }
];

const sampleServices = [
  {
    name: 'Cài đặt hệ điều hành Windows',
    type: 'software',
    description: 'Dịch vụ cài đặt hệ điều hành Windows, driver, phần mềm cơ bản',
    price: 200000,
    duration: 120,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Vệ sinh laptop chuyên nghiệp',
    type: 'hardware',
    description: 'Vệ sinh laptop, thay keo tản nhiệt, làm sạch quạt tản nhiệt',
    price: 300000,
    duration: 90,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Nâng cấp RAM laptop',
    type: 'hardware',
    description: 'Dịch vụ nâng cấp RAM cho laptop, bao gồm RAM và công lắp đặt',
    price: 150000,
    duration: 30,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Thay thế ổ cứng SSD',
    type: 'hardware',
    description: 'Thay thế ổ cứng HDD bằng SSD, clone dữ liệu, tối ưu hệ thống',
    price: 250000,
    duration: 60,
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sửa chữa màn hình laptop',
    type: 'repair',
    description: 'Sửa chữa màn hình laptop: thay LCD, sửa bản lề, cáp màn hình',
    price: 500000,
    duration: 180,
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Cài đặt phần mềm văn phòng',
    type: 'software',
    description: 'Cài đặt bộ Microsoft Office, Adobe Reader, phần mềm cần thiết',
    price: 100000,
    duration: 45,
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
      productName: laptop.displayName,
      brand: laptop.brand,
      model: laptop.model,
      price: laptop.price,
      quantity: Math.floor(Math.random() * 50) + 10, // Random stock 10-59
      minStock: 5,
      location: 'Kho A',
      status: 'active'
    });
  }
  
  // Create inventory for printers
  for (let printer of printers) {
    inventoryItems.push({
      productId: printer._id,
      productType: 'printer',
      productName: printer.name,
      brand: printer.brand,
      model: printer.model,
      price: printer.price,
      quantity: Math.floor(Math.random() * 30) + 5, // Random stock 5-34
      minStock: 3,
      location: 'Kho B',
      status: 'active'
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
      customerInfo: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      items: [
        {
          productId: laptops[0]._id,
          productType: 'laptop',
          productName: laptops[0].displayName,
          price: laptops[0].price,
          quantity: 1,
          total: laptops[0].price
        }
      ],
      totalAmount: laptops[0].price,
      status: 'confirmed',
      paymentMethod: 'transfer',
      paymentStatus: 'paid',
      assignedTo: staff[0]._id,
      notes: 'Khách hàng yêu cầu giao hàng trong tuần'
    },
    {
      customerInfo: {
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 3, TP.HCM'
      },
      items: [
        {
          productId: printers[0]._id,
          productType: 'printer',
          productName: printers[0].name,
          price: printers[0].price,
          quantity: 2,
          total: printers[0].price * 2
        }
      ],
      totalAmount: printers[0].price * 2,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      notes: 'Đơn hàng mới, chờ xử lý'
    },
    {
      customerInfo: {
        name: 'Lê Văn C',
        email: 'levanc@gmail.com',
        phone: '0369258147',
        address: '789 Đường DEF, Quận 5, TP.HCM'
      },
      items: [
        {
          productId: laptops[1]._id,
          productType: 'laptop',
          productName: laptops[1].displayName,
          price: laptops[1].price,
          quantity: 1,
          total: laptops[1].price
        },
        {
          productId: printers[1]._id,
          productType: 'printer', 
          productName: printers[1].name,
          price: printers[1].price,
          quantity: 1,
          total: printers[1].price
        }
      ],
      totalAmount: laptops[1].price + printers[1].price,
      status: 'completed',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      assignedTo: staff[1]._id,
      notes: 'Đơn hàng đã hoàn thành, khách hàng hài lòng'
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
