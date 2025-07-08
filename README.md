# 🏪 Hệ Thống Bán Hàng Máy Tính Trần Anh

Website bán hàng máy tính laptop và máy in với đầy đủ tính năng quản lý.

## 🚀 Tính Năng Chính

- **🔐 Quản lý người dùng**: Admin, Staff, Manager với phân quyền chi tiết
- **💻 Quản lý sản phẩm**: Laptop, Máy in với hình ảnh và thông tin chi tiết
- **📦 Quản lý kho**: Theo dõi tồn kho, cảnh báo hết hàng
- **📋 Quản lý đơn hàng**: Từ pending đến delivered
- **🔧 Quản lý dịch vụ**: Các dịch vụ sửa chữa, bảo trì
- **📊 Thống kê**: Báo cáo doanh thu, tồn kho

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **bcryptjs** Password hashing
- **multer** File upload

### Frontend
- **HTML5**, **CSS3**, **JavaScript**
- **Bootstrap** responsive design
- **Chart.js** cho thống kê

## 📁 Cấu Trúc Dự Án

```
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Product images
│   ├── server.js        # Main server file
│   └── setupComplete.js # Database setup script
├── frontend/
│   └── may_tinh_tran_anh/  # Website files
└── README.md
```

## ⚡ Khởi Chạy Nhanh

### 1. Cài đặt Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database
```bash
node setupComplete.js
```

### 3. Khởi động Server
```bash
npm run dev
# hoặc
node server.js
```

### 4. Truy cập Website
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Tài Khoản Mặc Định

| Role | Email | Password |
|------|--------|----------|
| Admin | admin@maytinhrananh.com | admin123 |
| Staff | staff1@maytinhrananh.com | staff123 |
| Manager | manager@maytinhrananh.com | manager123 |

## 📊 Dữ Liệu Mẫu

Sau khi setup, hệ thống sẽ có:
- ✅ **4 Employees** (1 admin, 2 staff, 1 manager)
- ✅ **8 Laptops** (6 máy mới, 2 máy cũ) 
- ✅ **4 Printers** (các loại khác nhau)
- ✅ **6 Services** (dịch vụ sửa chữa, bảo trì)
- ✅ **12 Inventory items** (quản lý tồn kho)
- ✅ **3 Sample orders** (đơn hàng mẫu)

## 🖼️ Hình Ảnh Sản Phẩm

Mỗi sản phẩm đều có 3 hình ảnh minh họa được lưu trong thư mục `backend/uploads/`:
- **Laptops**: `laptop_[brand]_[model]_[number].jpg`
- **Printers**: `printer_[brand]_[model]_[number].jpg`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Products
- `GET /api/laptops` - Danh sách laptop
- `GET /api/printers` - Danh sách máy in
- `GET /api/services` - Danh sách dịch vụ

### Orders
- `GET /api/orders` - Danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới

### Inventory
- `GET /api/inventory` - Tồn kho
- `GET /api/inventory/stats` - Thống kê tồn kho

## 🚀 Triển Khai

1. **Development**: `npm run dev`
2. **Production**: `npm start`
3. **Database**: Đảm bảo MongoDB đang chạy
4. **Environment**: Kiểm tra file `.env`

## 📝 Ghi Chú

- Dự án đã được dọn dẹp, loại bỏ tất cả file test và tài liệu không cần thiết
- Chỉ giữ lại các file core cần thiết cho hoạt động
- Tất cả sản phẩm đều có hình ảnh minh họa
- Database schema đã được tối ưu hóa

---

**Phát triển bởi**: Nhóm Phát Triển Website Bán Hàng  
**Phiên bản**: 1.0.0  
**Cập nhật cuối**: July 2025
