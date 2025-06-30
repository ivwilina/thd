// Quick Order Management API Test
// Run this after starting the backend server to test all functionality

const testOrderManagement = async () => {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('🧪 Testing Order Management API...\n');
  
  try {
    // Test 1: Get all orders
    console.log('1️⃣ Fetching all orders...');
    const ordersResponse = await fetch(`${baseURL}/orders`);
    const ordersData = await ordersResponse.json();
    console.log(`✅ Found ${ordersData.orders?.length || 0} orders`);
    
    if (ordersData.orders && ordersData.orders.length > 0) {
      const testOrder = ordersData.orders[0];
      console.log(`📋 Test Order ID: ${testOrder._id}`);
      console.log(`📊 Status: ${testOrder.status}`);
      console.log(`💰 Total: ${testOrder.finalPrice} VND`);
      
      // Test 2: Get specific order details
      console.log('\n2️⃣ Getting order details...');
      const orderResponse = await fetch(`${baseURL}/orders/${testOrder._id}`);
      const orderData = await orderResponse.json();
      console.log(`✅ Order details retrieved: ${orderData.order.customerName}`);
      
      // Test 3: Try order operations based on status
      if (testOrder.status === 'pending') {
        console.log('\n3️⃣ Testing order confirmation...');
        const confirmResponse = await fetch(`${baseURL}/orders/${testOrder._id}/confirm`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: 'test-employee-123' })
        });
        const confirmData = await confirmResponse.json();
        console.log(`✅ Order confirmation: ${confirmData.success ? 'Success' : 'Failed'}`);
        
      } else if (['confirmed', 'processing'].includes(testOrder.status)) {
        console.log('\n3️⃣ Testing order completion...');
        const completeResponse = await fetch(`${baseURL}/orders/${testOrder._id}/complete`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeId: 'test-employee-123' })
        });
        const completeData = await completeResponse.json();
        console.log(`✅ Order completion: ${completeData.success ? 'Success' : 'Failed'}`);
      }
    }
    
    // Test 4: Create new test order
    console.log('\n4️⃣ Creating test order...');
    const newOrder = {
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhoneNumber: '0123456789',
      customerAddress: '123 Test Street, Test City',
      orderItems: [
        {
          itemId: 'test-item-1',
          itemName: 'Test Laptop',
          quantity: 1,
          unitPrice: 15000000,
          totalPrice: 15000000
        }
      ],
      finalPrice: 15000000,
      billingMethod: 'cash',
      note: 'Test order created by automation'
    };
    
    const createResponse = await fetch(`${baseURL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    const createData = await createResponse.json();
    console.log(`✅ Order creation: ${createData.success ? 'Success' : 'Failed'}`);
    if (createData.success) {
      console.log(`📝 New Order ID: ${createData.order._id}`);
    }
    
    console.log('\n🎉 API Testing Complete!');
    console.log('\n📱 Frontend Testing:');
    console.log('1. Open http://localhost:5174/login');
    console.log('2. Login with staff/123456');
    console.log('3. Test order management features');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('- Backend server is running on port 3000');
    console.log('- MongoDB is connected');
    console.log('- Sample data has been seeded');
  }
};

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testOrderManagement();
}

module.exports = { testOrderManagement };
