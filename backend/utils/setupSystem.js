const mongoose = require('mongoose');
const createPlaceholderImages = require('./createPlaceholderImages');
const seedFullDatabase = require('./seedFullData');
require('dotenv').config();

const setupCompleteSystem = async () => {
  console.log('🚀 Starting complete system setup...\n');
  
  try {
    // Step 1: Create placeholder images
    console.log('📸 Step 1: Creating placeholder images...');
    createPlaceholderImages();
    console.log('✅ Placeholder images created successfully\n');
    
    // Step 2: Seed database
    console.log('🌱 Step 2: Setting up database...');
    await seedFullDatabase();
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupCompleteSystem();
}

module.exports = setupCompleteSystem;
