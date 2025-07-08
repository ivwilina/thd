const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test API endpoints
const testAPIs = async () => {
  console.log('🧪 BẮT ĐẦU KIỂM TRA API...\n');

  try {
    // Test 1: Get Inventory
    console.log('1️⃣ Testing GET /api/inventory...');
    const inventoryRes = await axios.get(`${BASE_URL}/inventory`);
    console.log(`✅ Inventory API: ${inventoryRes.data.inventory.length} items found`);
    
    if (inventoryRes.data.inventory.length > 0) {
      const sample = inventoryRes.data.inventory[0];
      console.log(`   📦 Sample: ${sample.productId} - Stock: ${sample.currentStock}`);
    }

    // Test 2: Get Laptops  
    console.log('\n2️⃣ Testing GET /api/laptops...');
    const laptopsRes = await axios.get(`${BASE_URL}/laptops`);
    console.log(`✅ Laptops API: ${laptopsRes.data.laptops?.length || 0} items found`);
    
    if (laptopsRes.data.laptops && laptopsRes.data.laptops.length > 0) {
      const sample = laptopsRes.data.laptops[0];
      console.log(`   💻 Sample: ${sample.displayName} - Price: ${sample.price?.toLocaleString('vi-VN')}đ`);
    }

    // Test 3: Get Printers
    console.log('\n3️⃣ Testing GET /api/printers...');
    const printersRes = await axios.get(`${BASE_URL}/printers`);
    console.log(`✅ Printers API: ${printersRes.data.printers?.length || 0} items found`);
    
    if (printersRes.data.printers && printersRes.data.printers.length > 0) {
      const sample = printersRes.data.printers[0];
      console.log(`   🖨️ Sample: ${sample.type} ${sample.brand} - Price: ${sample.price?.toLocaleString('vi-VN')}đ`);
    }

    // Test 4: Inventory Statistics
    console.log('\n4️⃣ Calculating Inventory Statistics...');
    const inventory = inventoryRes.data.inventory;
    
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inStockCount = 0;

    inventory.forEach(item => {
      totalStock += item.currentStock;
      if (item.currentStock === 0) {
        outOfStockCount++;
      } else if (item.currentStock <= item.minimumStock) {
        lowStockCount++;
      } else {
        inStockCount++;
      }
    });

    console.log(`✅ Statistics:`);
    console.log(`   📊 Total Items: ${inventory.length}`);
    console.log(`   📦 Total Stock: ${totalStock} products`);
    console.log(`   ✅ In Stock: ${inStockCount} products`);
    console.log(`   ⚠️ Low Stock: ${lowStockCount} products`);
    console.log(`   ❌ Out of Stock: ${outOfStockCount} products`);

    // Test 5: Sample Product Details
    console.log('\n5️⃣ Sample Product Details:');
    if (inventory.length > 0) {
      const sampleInventory = inventory[0];
      console.log(`📋 Product: ${sampleInventory.productId}`);
      console.log(`   📦 Current Stock: ${sampleInventory.currentStock}`);
      console.log(`   🔒 Reserved: ${sampleInventory.reservedStock}`);
      console.log(`   ✅ Available: ${sampleInventory.availableStock}`);
      console.log(`   📍 Location: ${sampleInventory.location.warehouse}-${sampleInventory.location.shelf}`);
      console.log(`   🏭 Supplier: ${sampleInventory.supplier.name}`);
      console.log(`   ⏱️ Lead Time: ${sampleInventory.supplier.leadTime} days`);
    }

    console.log('\n🎉 TẤT CẢ API ĐỀU HOẠT ĐỘNG BÌNH THƯỜNG!');
    console.log('\n💡 Bạn có thể truy cập:');
    console.log('   🖥️ Admin Inventory: http://localhost:3000/admin/inventory');
    console.log('   🖥️ Admin Products: http://localhost:3000/admin/products');
    console.log('   🖥️ Admin Reports: http://localhost:3000/admin/reports');

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Khắc phục sự cố:');
      console.log('1. Đảm bảo backend server đang chạy: npm run dev');
      console.log('2. Kiểm tra port 5000 có available không');
      console.log('3. Kiểm tra MongoDB đang chạy');
    }
  }
};

// Chạy test
testAPIs();
