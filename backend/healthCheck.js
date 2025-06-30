/**
 * System Health Check Script
 * Kiểm tra tình trạng hệ thống sau khi cài đặt
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
const Employee = require('./models/Employee');
const Laptop = require('./models/Laptop');
const Printer = require('./models/Printer');
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
    console.log('✅ MongoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Check functions
const checkDatabase = async () => {
  console.log('\n🔍 Checking database collections...');
  
  try {
    const employeeCount = await Employee.countDocuments();
    const laptopCount = await Laptop.countDocuments();
    const printerCount = await Printer.countDocuments();
    const serviceCount = await Service.countDocuments();
    const orderCount = await Order.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    
    console.log(`📊 Data counts:`);
    console.log(`   - Employees: ${employeeCount}`);
    console.log(`   - Laptops: ${laptopCount}`);
    console.log(`   - Printers: ${printerCount}`);
    console.log(`   - Services: ${serviceCount}`);
    console.log(`   - Orders: ${orderCount}`);
    console.log(`   - Inventory items: ${inventoryCount}`);
    
    // Check if we have essential data
    if (employeeCount === 0) {
      console.log('⚠️  WARNING: No employees found! Run setupComplete.js');
      return false;
    }
    
    if (laptopCount === 0 && printerCount === 0) {
      console.log('⚠️  WARNING: No products found! Run setupComplete.js');
      return false;
    }
    
    console.log('✅ Database check passed');
    return true;
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    return false;
  }
};

const checkAuthSystem = async () => {
  console.log('\n🔑 Checking authentication system...');
  
  try {
    // Check for admin account
    const admin = await Employee.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ No admin account found!');
      return false;
    }
    
    // Check for staff account
    const staff = await Employee.findOne({ role: 'staff' });
    if (!staff) {
      console.log('❌ No staff account found!');
      return false;
    }
    
    console.log('✅ Authentication system check passed');
    console.log(`   - Admin: ${admin.email}`);
    console.log(`   - Staff: ${staff.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Auth system check failed:', error.message);
    return false;
  }
};

const checkFileSystem = async () => {
  console.log('\n📁 Checking file system...');
  
  const requiredPaths = [
    './uploads',
    './models',
    './routes',
    './middleware',
    '../frontend/may_tinh_tran_anh/src',
    '../frontend/may_tinh_tran_anh/public'
  ];
  
  let allGood = true;
  
  for (const pathToCheck of requiredPaths) {
    if (fs.existsSync(pathToCheck)) {
      console.log(`✅ ${pathToCheck} exists`);
    } else {
      console.log(`❌ ${pathToCheck} NOT FOUND!`);
      allGood = false;
    }
  }
  
  // Check if images exist
  const uploadsPath = './uploads';
  if (fs.existsSync(uploadsPath)) {
    const files = fs.readdirSync(uploadsPath);
    const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|gif)$/i));
    console.log(`📸 Found ${imageFiles.length} image files in uploads/`);
    
    if (imageFiles.length === 0) {
      console.log('⚠️  WARNING: No product images found in uploads/');
    }
  }
  
  return allGood;
};

const checkPackageJson = async () => {
  console.log('\n📦 Checking package.json files...');
  
  const packages = [
    { path: './package.json', name: 'Backend' },
    { path: '../frontend/may_tinh_tran_anh/package.json', name: 'Frontend' }
  ];
  
  let allGood = true;
  
  for (const pkg of packages) {
    try {
      if (fs.existsSync(pkg.path)) {
        const packageData = JSON.parse(fs.readFileSync(pkg.path, 'utf8'));
        console.log(`✅ ${pkg.name} package.json: ${packageData.name} v${packageData.version}`);
        
        // Check node_modules
        const nodeModulesPath = path.join(path.dirname(pkg.path), 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
          console.log(`   - node_modules exists`);
        } else {
          console.log(`   ⚠️  node_modules NOT found - run 'npm install'`);
          allGood = false;
        }
      } else {
        console.log(`❌ ${pkg.name} package.json NOT FOUND: ${pkg.path}`);
        allGood = false;
      }
    } catch (error) {
      console.log(`❌ Error reading ${pkg.name} package.json: ${error.message}`);
      allGood = false;
    }
  }
  
  return allGood;
};

const checkPorts = async () => {
  console.log('\n🌐 Checking port configuration...');
  
  const net = require('net');
  
  const checkPort = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => {
          resolve(true); // Port is available
        });
      });
      server.on('error', () => {
        resolve(false); // Port is in use
      });
    });
  };
  
  const backendPort = 3001;
  const frontendPort = 3000;
  
  const backendAvailable = await checkPort(backendPort);
  const frontendAvailable = await checkPort(frontendPort);
  
  console.log(`   - Backend port ${backendPort}: ${backendAvailable ? '✅ Available' : '⚠️  In use'}`);
  console.log(`   - Frontend port ${frontendPort}: ${frontendAvailable ? '✅ Available' : '⚠️  In use'}`);
  
  return true; // Ports being in use is not necessarily bad
};

// Main health check function
const runHealthCheck = async () => {
  console.log('🏥 SYSTEM HEALTH CHECK');
  console.log('=====================\n');
  
  const results = [];
  
  // 1. Database connection
  const dbConnection = await connectDB();
  results.push({ test: 'Database Connection', passed: dbConnection });
  
  if (dbConnection) {
    // 2. Database data
    const dbData = await checkDatabase();
    results.push({ test: 'Database Data', passed: dbData });
    
    // 3. Authentication
    const authSystem = await checkAuthSystem();
    results.push({ test: 'Authentication System', passed: authSystem });
  }
  
  // 4. File system
  const fileSystem = await checkFileSystem();
  results.push({ test: 'File System', passed: fileSystem });
  
  // 5. Package.json files
  const packages = await checkPackageJson();
  results.push({ test: 'Package Dependencies', passed: packages });
  
  // 6. Ports
  await checkPorts();
  results.push({ test: 'Port Configuration', passed: true });
  
  // Summary
  console.log('\n📋 HEALTH CHECK SUMMARY');
  console.log('========================');
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.test}`);
  });
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 SYSTEM IS READY!');
    console.log('\nNext steps:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start frontend: cd frontend/may_tinh_tran_anh && npm start');
    console.log('3. Open browser: http://localhost:3000');
  } else {
    console.log('\n⚠️  SYSTEM NEEDS ATTENTION!');
    console.log('\nPlease fix the failed tests above before proceeding.');
  }
  
  // Close database connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
};

// Run the health check
if (require.main === module) {
  runHealthCheck().catch(console.error);
}

module.exports = { runHealthCheck };
