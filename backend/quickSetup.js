// Quick setup script
const mongoose = require('mongoose');
const { runCompleteSetup } = require('./setupComplete');

async function quickSetup() {
  try {
    console.log('🚀 Running quick setup...');
    await runCompleteSetup();
    console.log('✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

quickSetup();
