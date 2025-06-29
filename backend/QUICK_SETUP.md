# 🚀 Quick Setup Guide for New System

## Overview
This backend system comes with a complete set of sample data including 28 products (15 laptops + 13 printers, both new and used) with realistic specifications and placeholder images.

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git (for cloning)

## 🛠️ Quick Installation

### Option 1: Automated Installation (Recommended)

**Windows:**
```batch
install.bat
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Option 2: Manual Installation

### 1. Clone/Download the Project
```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh
PORT=3000
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Complete System Setup
```bash
npm run setup
```

This single command will:
- ✅ Create 84 placeholder images (2-3 per product)
- ✅ Seed database with 28 products
- ✅ Create reference data (brands, categories, etc.)
- ✅ Add sample services and employees

## 📊 What Gets Created

### Products (28 total)
**Laptops (15):**
- 12 New laptops (Dell, HP, Lenovo, Asus, MSI, Apple)
- 3 Used laptops (Dell, HP, Lenovo)

**Printers (13):**
- 10 New printers (Canon, HP, Epson, Brother)
- 3 Used printers (Canon, HP, Epson)

### Reference Data
- CPU models (11)
- Brands (9 laptop brands, 6 printer brands)
- VGA cards (10)
- RAM sizes (5 options)
- Storage sizes (6 options)
- Screen sizes (5 options)
- Special features (8)
- Print features (8)

### Services (35)
- 17 Repair services (computer & laptop troubleshooting)
- 8 Maintenance services (RAM upgrade, SSD, ink refill)
- 4 Installation services (Windows, Office, network setup)
- 4 Consultation services (free remote support, IT consulting)
- 2 Rental services (laptop & printer rental)

**📋 See SERVICES_CATALOG.md for complete service list**

### Employees (5)
- 1 Admin account (full access)
- 1 Manager account (product & service management)
- 3 Staff accounts (customer care & orders)

**👥 Sample Accounts:**
- Admin: `admin` / `admin123`
- Manager: `manager` / `manager123` 
- Staff: `nhanvien` / `nhanvien123`
- Customer Care: `chamsoc` / `chamsoc123`
- Technical: `kythuat` / `kythuat123`

**📋 See SAMPLE_ACCOUNTS.md for detailed role permissions**

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run setup` | **Complete setup** (images + database) |
| `npm run seed-full` | Seed database only |
| `npm run create-images` | Create placeholder images only |
| `npm run verify` | **Verify database contents** |
| `npm run test-roles` | Test role-based permissions |
| `npm run test-services` | **Test services data** |
| `npm run test` | Run backend tests |

## 🔧 Individual Setup Options

If you want to run setup steps individually:

### Create Images Only
```bash
npm run create-images
```

### Seed Database Only
```bash
npm run seed-full
```

### Start Server
```bash
npm start
# or for development
npm run dev
```

## 📁 Folder Structure After Setup

```
backend/
├── uploads/              # 84 placeholder images
│   ├── laptop_dell_1_1.jpg
│   ├── laptop_hp_1_1.jpg
│   └── ... (82 more images)
├── models/               # Database models
├── routes/               # API routes
├── utils/                # Utility scripts
│   ├── setupSystem.js    # Main setup script
│   ├── seedFullData.js   # Database seeding
│   └── createPlaceholderImages.js
└── package.json         # Dependencies & scripts
```

## 🌐 API Endpoints Available

After setup, your API will have endpoints for:
- `/api/laptops` - Laptop CRUD operations
- `/api/printers` - Printer CRUD operations
- `/api/services` - Service management
- `/api/employees` - Employee management
- `/api/orders` - Order processing
- `/api/logs` - System logs
- `/api/upload` - File uploads
- `/api/auth` - Authentication

## 🔄 Re-running Setup

To reset and re-run the complete setup:
```bash
npm run setup
```

This will:
- Clear existing data
- Recreate all sample data
- Reset placeholder images

## 📞 Support

If you encounter any issues:
1. Check MongoDB connection in `.env`
2. Ensure all dependencies are installed
3. Verify Node.js version (v14+)
4. Check the console output for specific error messages

---

**🎉 Your computer store backend is now ready with 28 sample products and 84 images!**
