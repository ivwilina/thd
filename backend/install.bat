@echo off
REM ==================================================
REM MAY TINH TRAN ANH - NEW SYSTEM INSTALLATION SCRIPT (Windows)
REM ==================================================

echo 🚀 Starting May Tinh Tran Anh Backend Installation...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Creating .env file...
    (
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh
        echo.
        echo # Server Configuration
        echo PORT=3000
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo.
        echo # Cloudinary Configuration ^(Optional - for real image uploads^)
        echo CLOUDINARY_CLOUD_NAME=your_cloudinary_name
        echo CLOUDINARY_API_KEY=your_cloudinary_key
        echo CLOUDINARY_API_SECRET=your_cloudinary_secret
        echo.
        echo # Email Configuration ^(Optional^)
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your_email@gmail.com
        echo SMTP_PASS=your_email_password
    ) > .env
    echo ✅ .env file created with default values
    echo ⚠️  Please update the values in .env file as needed
) else (
    echo ✅ .env file already exists
)

echo.

REM Run complete setup
echo 🛠️  Setting up database and images...
npm run setup

if errorlevel 1 (
    echo ❌ Setup failed
    pause
    exit /b 1
)

echo.

REM Verify installation
echo 🔍 Verifying installation...
npm run verify

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 What was created:
echo    ✅ 28 products ^(15 laptops + 13 printers^)
echo    ✅ 84 placeholder images ^(2-3 per product^)
echo    ✅ Complete reference data ^(brands, specs, etc.^)
echo    ✅ 8 services and 3 employee accounts
echo.
echo 🚀 To start the server:
echo    npm start        # Production mode
echo    npm run dev      # Development mode
echo.
echo 📚 Available commands:
echo    npm run verify   # Check database contents
echo    npm run setup    # Re-run complete setup
echo    npm test         # Run backend tests
echo.
echo 🌐 API will be available at: http://localhost:3000
echo.
pause
