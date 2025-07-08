// Quick test and setup script
const mongoose = require('mongoose');
const Laptop = require('./models/Laptop');

async function quickTest() {
  try {
    // Connect to database
    await mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Count laptops
    const totalLaptops = await Laptop.countDocuments();
    console.log('📊 Total laptops:', totalLaptops);
    
    // Get first laptop
    const firstLaptop = await Laptop.findOne();
    console.log('🔍 First laptop:', firstLaptop);
    
    if (totalLaptops === 0) {
      console.log('⚠️ No laptops found, running setup...');
      
      // Import and run setup
      const { setupLaptops } = require('./setupComplete');
      await setupLaptops();
      
      console.log('✅ Setup completed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

quickTest();
