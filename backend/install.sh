#!/bin/bash

# ==================================================
# MAY TINH TRAN ANH - NEW SYSTEM INSTALLATION SCRIPT
# ==================================================

echo "🚀 Starting May Tinh Tran Anh Backend Installation..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << EOL
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Cloudinary Configuration (Optional - for real image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
EOL
    echo "✅ .env file created with default values"
    echo "⚠️  Please update the values in .env file as needed"
else
    echo "✅ .env file already exists"
fi

echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/may_tinh_tran_anh')
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
    console.log('   Please ensure MongoDB is running');
    process.exit(1);
  });
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to MongoDB. Please ensure MongoDB is running."
    echo "   For local MongoDB: https://docs.mongodb.com/manual/installation/"
    echo "   For MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    exit 1
fi

echo ""

# Run complete setup
echo "🛠️  Setting up database and images..."
npm run setup

if [ $? -ne 0 ]; then
    echo "❌ Setup failed"
    exit 1
fi

echo ""

# Verify installation
echo "🔍 Verifying installation..."
npm run verify

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 What was created:"
echo "   ✅ 28 products (15 laptops + 13 printers)"
echo "   ✅ 84 placeholder images (2-3 per product)"
echo "   ✅ Complete reference data (brands, specs, etc.)"
echo "   ✅ 8 services and 3 employee accounts"
echo ""
echo "🚀 To start the server:"
echo "   npm start        # Production mode"
echo "   npm run dev      # Development mode"
echo ""
echo "📚 Available commands:"
echo "   npm run verify   # Check database contents"
echo "   npm run setup    # Re-run complete setup"
echo "   npm test         # Run backend tests"
echo ""
echo "🌐 API will be available at: http://localhost:3000"
echo ""
