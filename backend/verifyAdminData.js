const mongoose = require('mongoose');

// Test script to verify admin data display matches database
async function verifyAdminData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh');
    console.log('🔗 Connected to database');
    
    console.log('\n=== ADMIN PRODUCTS VERIFICATION ===');
    
    // Check Laptops
    const laptopsCollection = mongoose.connection.db.collection('laptops');
    const laptops = await laptopsCollection.find({}).limit(5).toArray();
    console.log('\n💻 LAPTOPS (First 5):');
    laptops.forEach((laptop, index) => {
      console.log(`${index + 1}. ${laptop.name || 'Unnamed'}`);
      console.log(`   ID: ${laptop._id}`);
      console.log(`   Price: ${laptop.price?.toLocaleString('vi-VN')} VND`);
      console.log(`   Stock: ${laptop.stock || 'No stock data'}`);
      console.log(`   Brand: ${laptop.brand?.name || 'No brand'}`);
      console.log('   ---');
    });
    
    // Check Printers
    const printersCollection = mongoose.connection.db.collection('printers');
    const printers = await printersCollection.find({}).limit(5).toArray();
    console.log('\n🖨️ PRINTERS (First 5):');
    printers.forEach((printer, index) => {
      console.log(`${index + 1}. ${printer.name || 'Unnamed'}`);
      console.log(`   ID: ${printer._id}`);
      console.log(`   Price: ${printer.price?.toLocaleString('vi-VN')} VND`);
      console.log(`   Stock: ${printer.stock || 'No stock data'}`);
      console.log(`   Brand: ${printer.brand?.name || 'No brand'}`);
      console.log('   ---');
    });
    
    console.log('\n=== ADMIN INVENTORY VERIFICATION ===');
    
    // Inventory simulation based on products
    const totalLaptops = await laptopsCollection.countDocuments();
    const totalPrinters = await printersCollection.countDocuments();
    const laptopsWithStock = await laptopsCollection.countDocuments({ stock: { $gt: 0 } });
    const printersWithStock = await printersCollection.countDocuments({ stock: { $gt: 0 } });
    
    console.log(`📊 Inventory Summary:`);
    console.log(`- Total Laptops: ${totalLaptops}`);
    console.log(`- Laptops with Stock: ${laptopsWithStock}`);
    console.log(`- Total Printers: ${totalPrinters}`);
    console.log(`- Printers with Stock: ${printersWithStock}`);
    console.log(`- Total Products: ${totalLaptops + totalPrinters}`);
    
    console.log('\n=== ADMIN ACCOUNTS VERIFICATION ===');
    
    // Check Employees
    const employeesCollection = mongoose.connection.db.collection('employees');
    const employees = await employeesCollection.find({}).toArray();
    console.log(`👥 Employees in database: ${employees.length}`);
    
    if (employees.length > 0) {
      console.log('\nEmployee Details:');
      employees.forEach((emp, index) => {
        console.log(`${index + 1}. ${emp.name || 'Unnamed'}`);
        console.log(`   ID: ${emp._id}`);
        console.log(`   Email: ${emp.email || 'No email'}`);
        console.log(`   Phone: ${emp.phone || emp.phoneNumber || 'No phone'}`);
        console.log(`   Role: ${emp.role || 'No role'}`);
        console.log(`   Status: ${emp.status || 'No status'}`);
        console.log('   ---');
      });
    } else {
      console.log('⚠️ No employees found - Admin will show demo accounts');
    }
    
    console.log('\n=== ADMIN REPORTS VERIFICATION ===');
    
    // Check Orders for reports
    const ordersCollection = mongoose.connection.db.collection('orders');
    const orders = await ordersCollection.find({}).toArray();
    console.log(`🛒 Orders in database: ${orders.length}`);
    
    if (orders.length > 0) {
      const orderStats = await ordersCollection.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { 
              $sum: { 
                $cond: {
                  if: { $type: '$totalAmount' },
                  then: { $toDouble: '$totalAmount' },
                  else: 0
                }
              }
            }
          }
        }
      ]).toArray();
      
      console.log('\nOrder Statistics by Status:');
      orderStats.forEach(stat => {
        console.log(`- ${stat._id || 'No Status'}: ${stat.count} orders`);
        if (stat.totalAmount > 0) {
          console.log(`  Total Value: ${stat.totalAmount.toLocaleString('vi-VN')} VND`);
        }
      });
      
      const totalRevenue = orders.reduce((sum, order) => {
        const amount = parseFloat(order.totalAmount) || 0;
        return sum + amount;
      }, 0);
      
      console.log(`\n💰 Total Revenue: ${totalRevenue.toLocaleString('vi-VN')} VND`);
      console.log(`📈 Average Order Value: ${totalRevenue > 0 ? (totalRevenue / orders.length).toLocaleString('vi-VN') : 0} VND`);
    } else {
      console.log('⚠️ No orders found - Reports will show demo data');
    }
    
    // Check Services
    const servicesCollection = mongoose.connection.db.collection('services');
    const servicesCount = await servicesCollection.countDocuments();
    console.log(`\n🔧 Services: ${servicesCount} items`);
    
    console.log('\n=== FRONTEND DISPLAY RECOMMENDATIONS ===');
    console.log('Based on database analysis:');
    
    if (totalLaptops + totalPrinters > 0) {
      console.log('✅ AdminProducts should show real laptop/printer data');
    } else {
      console.log('⚠️ AdminProducts will show empty or demo data');
    }
    
    if (totalLaptops + totalPrinters > 0) {
      console.log('✅ AdminInventory should calculate stock status from products');
    } else {
      console.log('⚠️ AdminInventory will show demo data');
    }
    
    if (employees.length > 0) {
      console.log('✅ AdminAccounts should show real employee data');
    } else {
      console.log('⚠️ AdminAccounts will show demo accounts (staff/admin)');
    }
    
    if (orders.length > 0) {
      console.log('✅ AdminReports should use real order statistics');
    } else {
      console.log('⚠️ AdminReports will show demo statistics');
    }
    
    console.log('\n🎯 CONCLUSION:');
    if (totalLaptops + totalPrinters > 0 && orders.length > 0) {
      console.log('✅ Database has sufficient data for real admin display');
    } else {
      console.log('⚠️ Database needs more data, admin will use fallback/demo data');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Verification complete');
  }
}

verifyAdminData();
