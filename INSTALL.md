# Hệ Thống Quản Lý Máy Tính Trần Anh - Hướng Dẫn Cài Đặt

## 📋 Mục Lục
- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Khởi chạy hệ thống](#khởi-chạy-hệ-thống)
- [Tài khoản mặc định](#tài-khoản-mặc-định)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🎯 Giới thiệu

Hệ thống quản lý cửa hàng máy tính với các tính năng:
- **Quản lý sản phẩm**: Laptop, máy in, linh kiện
- **Quản lý tồn kho**: Theo dõi số lượng, cảnh báo hết hàng
- **Quản lý đơn hàng**: Xử lý đơn hàng, theo dõi trạng thái
- **Quản lý nhân viên**: Phân quyền admin/staff/manager
- **Dịch vụ**: Sửa chữa, bảo trì, bảo hành

## 💻 Yêu cầu hệ thống

### Backend Requirements
- **Node.js**: v16.0+ 
- **MongoDB**: v5.0+
- **NPM**: v8.0+

### Frontend Requirements  
- **React**: v18.0+
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+

### Hệ điều hành hỗ trợ
- Windows 10/11
- macOS 10.15+
- Ubuntu 20.04+

## 🚀 Cài đặt

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd code
```

### Bước 2: Cài đặt Backend

```bash
# Chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Hoặc sử dụng script tự động (Windows)
install.bat

# Hoặc sử dụng script tự động (Linux/macOS)  
chmod +x install.sh
./install.sh
```

### Bước 3: Cài đặt Frontend

```bash
# Chuyển vào thư mục frontend
cd ../frontend/may_tinh_tran_anh

# Cài đặt dependencies
npm install

# Build production (tùy chọn)
npm run build
```

### Bước 4: Cấu hình MongoDB

1. **Khởi động MongoDB service**:
   ```bash
   # Windows (Command Prompt as Administrator)
   net start MongoDB
   
   # Linux/macOS
   sudo systemctl start mongod
   # hoặc
   brew services start mongodb-community
   ```

2. **Kiểm tra kết nối**:
   ```bash
   # Mở MongoDB shell
   mongosh
   
   # Tạo database (tự động tạo khi insert data)
   use may_tinh_tran_anh
   ```

### Bước 5: Setup dữ liệu mẫu

```bash
# Trong thư mục backend
cd backend

# Chạy script setup dữ liệu mẫu
node setupComplete.js
```

Script sẽ tạo:
- ✅ 3 tài khoản: Admin, Staff, Manager
- ✅ 20+ sản phẩm laptop (Dell, HP, Asus, Lenovo, MSI, MacBook)
- ✅ 10+ máy in (Brother, Canon, HP, Epson)
- ✅ Dữ liệu tồn kho
- ✅ 15+ đơn hàng mẫu
- ✅ 10+ dịch vụ (sửa chữa, bảo trì)

## 🎮 Khởi chạy hệ thống

### Cách 1: Khởi chạy thủ công

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server chạy tại: http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend/may_tinh_tran_anh  
npm start
# App chạy tại: http://localhost:3000
```

### Cách 2: Sử dụng VS Code Tasks

1. Mở VS Code trong thư mục gốc
2. `Ctrl+Shift+P` → "Tasks: Run Task"
3. Chọn "Start Backend Server"
4. Mở terminal mới, chạy frontend:
   ```bash
   cd frontend/may_tinh_tran_anh
   npm start
   ```

### Cách 3: Script tự động (Windows)

```bash
# Khởi động backend
cd backend
start-server.bat

# Khởi động frontend (terminal mới)
cd ../frontend/may_tinh_tran_anh
npm start
```

## 👥 Tài khoản mặc định

Sau khi chạy `setupComplete.js`, bạn có thể đăng nhập với:

### Admin Account
- **Email**: `admin@maytinhrananh.com`
- **Password**: `admin123`
- **Quyền**: Toàn quyền quản lý

### Staff Account  
- **Email**: `staff1@maytinhrananh.com`
- **Password**: `staff123`
- **Quyền**: Quản lý tồn kho, xem đơn hàng

### Manager Account
- **Email**: `manager1@maytinhrananh.com` 
- **Password**: `manager123`
- **Quyền**: Quản lý nhân viên, báo cáo

## 📁 Cấu trúc dự án

```
code/
├── backend/                    # Node.js Backend
│   ├── models/                # MongoDB Models
│   ├── routes/                # API Routes  
│   ├── middleware/            # Auth & Validation
│   ├── uploads/               # Product Images
│   ├── utils/                 # Utilities
│   ├── server.js              # Main Server
│   ├── setupComplete.js       # Data Setup Script
│   └── package.json
│
├── frontend/may_tinh_tran_anh/ # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable Components
│   │   ├── pages/             # Page Components
│   │   ├── services/          # API Services
│   │   ├── assets/            # CSS & Images
│   │   └── App.jsx            # Main App
│   └── package.json
│
├── cleanup.bat                # Cleanup Script
├── CSS_UNIFIED_DESIGN_REPORT.md
└── INSTALL.md                 # This file
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
```javascript
// Login
POST /api/auth/login
{
  "email": "admin@maytinhrananh.com",
  "password": "admin123"
}

// Response
{
  "token": "jwt_token_here",
  "employee": { ...employee_data }
}
```

### Main Endpoints

#### Products
- `GET /api/laptops` - Lấy danh sách laptop
- `POST /api/laptops` - Tạo laptop mới
- `PUT /api/laptops/:id` - Cập nhật laptop
- `DELETE /api/laptops/:id` - Xóa laptop

#### Inventory
- `GET /api/inventory` - Lấy tồn kho
- `PUT /api/inventory/:id` - Cập nhật tồn kho

#### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật đơn hàng

#### Employees (Admin only)
- `GET /api/employees` - Lấy danh sách nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên

## 🧹 Dọn dẹp file phát triển

Sau khi cài đặt xong, xóa các file test và báo cáo tạm:

```bash
# Windows
cleanup.bat

# Linux/macOS
chmod +x cleanup.sh
./cleanup.sh
```

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. MongoDB connection failed
```bash
# Kiểm tra MongoDB đang chạy
# Windows
net start MongoDB

# Linux/macOS  
sudo systemctl status mongod
```

#### 2. Port đã được sử dụng
```bash
# Kiểm tra port 3001 (backend)
netstat -ano | findstr :3001

# Kill process nếu cần
taskkill /PID <process_id> /F
```

#### 3. CORS Error
- Đảm bảo backend chạy trước frontend
- Kiểm tra `API_BASE_URL` trong `apiService.js`

#### 4. NPM install failed
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài đặt lại
npm install
```

#### 5. Image không hiển thị
- Kiểm tra thư mục `backend/uploads/` có ảnh mẫu
- Đảm bảo backend serve static files đúng

### Performance Tips

1. **Database Indexing**: MongoDB tự động tạo index cho `_id`
2. **Image Optimization**: Ảnh trong `uploads/` đã được optimize
3. **Bundle Size**: Chạy `npm run build` để minify frontend

### Debug Mode

```bash
# Backend debug
cd backend  
DEBUG=* npm run dev

# Frontend debug
cd frontend/may_tinh_tran_anh
REACT_APP_DEBUG=true npm start
```

## 📞 Hỗ trợ

- **Email**: support@maytinhrananh.com
- **Documentation**: [CSS_UNIFIED_DESIGN_REPORT.md](./CSS_UNIFIED_DESIGN_REPORT.md)
- **Issues**: Tạo issue trên repository

---

## 🎉 Kết thúc

Hệ thống đã sẵn sàng sử dụng! 

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001  
- **Database**: MongoDB (may_tinh_tran_anh)

Chúc bạn sử dụng hệ thống hiệu quả! 🚀
