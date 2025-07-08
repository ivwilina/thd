const mongoose = require('mongoose');
const ServiceBooking = require('./models/ServiceBooking');

async function cleanupTestData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Clean up test data
    await ServiceBooking.deleteMany({});
    console.log('✅ Cleaned up test service booking data');
    
    await mongoose.disconnect();
    console.log('🔚 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error.message);
  }
}

cleanupTestData();
