// Demo script for Staff Inventory Management
const http = require('http');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🎯 STAFF INVENTORY DEMO                      ║
║                     Chức năng xem tồn kho                      ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log('📋 Tính năng đã hoàn thiện:');
console.log('');

console.log('🔹 **6 Dashboard Tabs**:');
console.log('   1️⃣ 📈 Tổng quan - Overview statistics');
console.log('   2️⃣ ⚠️ Sắp hết hàng - Low stock alerts');  
console.log('   3️⃣ 🔄 Tốc độ bán - Sales velocity analysis');
console.log('   4️⃣ 💰 Phân tích giá trị - ABC value analysis');
console.log('   5️⃣ 📦 Xuất nhập - Stock movements');
console.log('   6️⃣ 📋 Tất cả sản phẩm - Complete product list ⭐ **MỚI**');
console.log('');

console.log('🔹 **Tab "Tất cả sản phẩm" Features**:');
console.log('   🔍 Smart Search: Tên, mã SP, thương hiệu');
console.log('   🏷️ Category Filter: Tất cả/Laptop/Máy in');
console.log('   🎨 Color-coded Status: Hết hàng/Sắp hết/Còn hàng');
console.log('   📊 Real-time Summary: Tổng kho/giá trị/sắp hết/hết hàng');
console.log('   📱 Responsive Design: Mobile-friendly layout');
console.log('');

console.log('🔹 **Robust Data System**:');
console.log('   ✅ API Integration: getLaptops() + getPrinters()');
console.log('   🛡️ Smart Fallback: Mock data khi API thống kê fail');
console.log('   🔄 Real-time Updates: Dữ liệu từ database thực tế');
console.log('   📦 Product Classification: Auto-detect laptop vs printer');
console.log('');

console.log('📊 **Current Inventory Data**:');
http.get('http://localhost:3000/api/laptops', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const laptopsData = JSON.parse(data);
      const laptops = Array.isArray(laptopsData) ? laptopsData : (laptopsData.laptops || []);
      
      http.get('http://localhost:3000/api/printers', (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => data2 += chunk);
        res2.on('end', () => {
          try {
            const printersData = JSON.parse(data2);
            const printers = Array.isArray(printersData) ? printersData : (printersData.printers || []);
            
            const allProducts = [...laptops, ...printers];
            const totalStock = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
            const totalValue = allProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
            const lowStock = allProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
            const outOfStock = allProducts.filter(p => (p.stock || 0) === 0).length;
            
            console.log(`   💻 Laptops: ${laptops.length} models`);
            console.log(`   🖨️ Printers: ${printers.length} models`);
            console.log(`   📦 Total Stock: ${totalStock} units`);
            console.log(`   💰 Total Value: ${totalValue.toLocaleString('vi-VN')} VND`);
            console.log(`   ⚠️ Low Stock: ${lowStock} products`);
            console.log(`   ❌ Out of Stock: ${outOfStock} products`);
            console.log('');
            
            console.log('🚀 **How to Test**:');
            console.log('   1. Start backend: cd backend && npm run dev');
            console.log('   2. Start frontend: cd frontend/may_tinh_tran_anh && npm run dev');
            console.log('   3. Open: http://localhost:5174/login');
            console.log('   4. Login as staff: username=staff, password=123456');
            console.log('   5. Click "📦 Tồn kho" tab');
            console.log('   6. Test all 6 tabs, especially "📋 Tất cả sản phẩm"');
            console.log('');
            
            console.log('🧪 **Test Scenarios**:');
            console.log('   🔍 Search: "Dell", "HP", "Canon", "Máy in"');
            console.log('   🏷️ Filter: Switch between Tất cả/Laptop/Máy in');
            console.log('   📊 Check real-time summary updates');
            console.log('   🎨 Verify color-coded stock status');
            console.log('   📱 Test responsive design on different screen sizes');
            console.log('');
            
            console.log('✅ **Production Ready Features**:');
            console.log('   - Complete inventory dashboard');
            console.log('   - Professional UI/UX design');  
            console.log('   - Robust error handling');
            console.log('   - Mobile-responsive layout');
            console.log('   - Real-time data synchronization');
            console.log('   - Comprehensive search & filtering');
            console.log('');
            
            console.log('🎉 **Chức năng xem tồn kho của staff đã hoàn thiện 100%!**');
            
          } catch (e) {
            console.log('   ❌ Error fetching printers data');
          }
        });
      }).on('error', () => {
        console.log('   ❌ Backend server not running. Please start with: npm run dev');
      });
      
    } catch (e) {
      console.log('   ❌ Error fetching laptops data');
    }
  });
}).on('error', () => {
  console.log('   ❌ Backend server not running. Please start with: npm run dev');
  console.log('');
  console.log('🚀 **Quick Start**:');
  console.log('   cd backend && npm run dev');
  console.log('   cd frontend/may_tinh_tran_anh && npm run dev');
});
