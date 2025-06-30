const mongoose = require('mongoose');

// Simple database check script
async function checkDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh');
    console.log('✅ Connected to MongoDB');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 Collections in database:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check each collection count
    console.log('\n📊 Document counts:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
    
    // Check orders collection specifically
    console.log('\n🛒 Orders analysis:');
    const ordersCollection = mongoose.connection.db.collection('orders');
    const orderStats = await ordersCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: { $toDouble: '$totalAmount' } }
        }
      }
    ]).toArray();
    
    orderStats.forEach(stat => {
      console.log(`- ${stat._id || 'No status'}: ${stat.count} orders, Total: ${stat.totalAmount?.toLocaleString('vi-VN')} VND`);
    });
    
    // Check laptops/printers for inventory
    console.log('\n💻 Products analysis:');
    const laptopsCollection = mongoose.connection.db.collection('laptops');
    const laptopCount = await laptopsCollection.countDocuments();
    const sampleLaptop = await laptopsCollection.findOne({}, { projection: { name: 1, price: 1, stock: 1 } });
    console.log(`- Laptops: ${laptopCount} items`);
    if (sampleLaptop) {
      console.log(`  Sample: ${sampleLaptop.name}, Price: ${sampleLaptop.price}, Stock: ${sampleLaptop.stock}`);
    }
    
    const printersCollection = mongoose.connection.db.collection('printers');
    const printerCount = await printersCollection.countDocuments();
    const samplePrinter = await printersCollection.findOne({}, { projection: { name: 1, price: 1, stock: 1 } });
    console.log(`- Printers: ${printerCount} items`);
    if (samplePrinter) {
      console.log(`  Sample: ${samplePrinter.name}, Price: ${samplePrinter.price}, Stock: ${samplePrinter.stock}`);
    }
    
    // Check inventory collection
    console.log('\n📦 Inventory analysis:');
    const inventoryCollection = mongoose.connection.db.collection('inventories');
    const inventoryCount = await inventoryCollection.countDocuments();
    console.log(`- Inventory records: ${inventoryCount} items`);
    
    if (inventoryCount > 0) {
      const sampleInventory = await inventoryCollection.findOne({}, { 
        projection: { 
          itemCode: 1, 
          itemName: 1, 
          currentStock: 1, 
          category: 1,
          location: 1,
          lastUpdated: 1
        } 
      });
      console.log(`  Sample: ${sampleInventory.itemName} (${sampleInventory.itemCode})`);
      console.log(`    Stock: ${sampleInventory.currentStock}, Location: ${sampleInventory.location}`);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 Database connection closed');
  }
}

checkDatabase();
