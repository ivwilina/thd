const mongoose = require('mongoose');
const seedInventory = require('./utils/seedInventory');

const runInventorySetup = async () => {
  try {
    console.log('🚀 Starting Inventory Setup...\n');

    // Kết nối database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/may_tinh_tran_anh');
      console.log('✅ Connected to MongoDB');
    }

    // Chạy seed inventory
    console.log('\n📦 Creating inventory data...');
    await seedInventory();

    console.log('\n✅ Inventory setup completed successfully!');

  } catch (error) {
    console.error('❌ Error during inventory setup:', error);
    throw error;
  }
};

module.exports = runInventorySetup;

// Nếu file được chạy trực tiếp
if (require.main === module) {
  runInventorySetup()
    .then(() => {
      console.log('\n🎉 Inventory setup finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Inventory setup failed:', error);
      process.exit(1);
    });
}
