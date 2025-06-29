# 🚀 Khởi Động Hệ Thống May Tinh Tran Anh

## 📋 Tổng Quan
Hệ thống bao gồm:
- **Backend**: Node.js + Express + MongoDB (Port 3000)
- **Frontend**: React + Vite (Port 5173)

## 🔧 Yêu Cầu Hệ Thống
- Node.js (v14 hoặc cao hơn)
- MongoDB (đang chạy hoặc MongoDB Atlas)
- NPM hoặc Yarn

## ⚡ Khởi Động Nhanh

### 🅰️ Cách 1: Sử dụng Scripts Tự Động

#### Backend:
```powershell
cd backend
.\start-server.ps1
```

#### Frontend:
```powershell
cd frontend\may_tinh_tran_anh
.\start-frontend.ps1
```

### 🅱️ Cách 2: Khởi Động Thủ Công

#### 1. Khởi động Backend:
```powershell
cd backend
npm install
npm start
```

#### 2. Khởi động Frontend (terminal mới):
```powershell
cd frontend\may_tinh_tran_anh
npm install
npm run dev
```

## 🔗 URLs Truy Cập

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

## 📊 API Endpoints Đã Sửa

### ✅ Laptops:
- `GET /api/laptops/new` - Laptop mới
- `GET /api/laptops/used` - Laptop cũ  
- `GET /api/laptops/featured` - Laptop nổi bật
- `GET /api/laptops/:id` - Chi tiết laptop

### ✅ Printers:
- `GET /api/printers/new` - Máy in mới
- `GET /api/printers/used` - Máy in cũ
- `GET /api/printers/featured` - Máy in nổi bật
- `GET /api/printers/:id` - Chi tiết máy in

### ✅ Services:
- `GET /api/services` - Tất cả dịch vụ
- `GET /api/services/featured` - Dịch vụ nổi bật
- `GET /api/services/type/:type` - Dịch vụ theo loại
- `GET /api/services/:id` - Chi tiết dịch vụ

## 🛠️ Response Format (Đã Chuẩn Hóa)

Tất cả endpoints hiện trả về format:
```json
{
  "data": [...],
  "total": number
}
```

## 🔧 Troubleshooting

### ❌ Lỗi 404 Not Found:
- Kiểm tra backend đã khởi động chưa
- Kiểm tra đúng port (3000 cho backend)
- Kiểm tra MongoDB đã kết nối

### ❌ CORS Errors:
- Backend đã cấu hình CORS cho localhost:5173
- Kiểm tra frontend đang chạy đúng port

### ❌ Database Empty:
```powershell
cd backend
npm run setup    # Tạo dữ liệu mẫu + hình ảnh
npm run verify   # Kiểm tra dữ liệu
```

## 📁 Cấu Trúc Project

```
code/
├── backend/
│   ├── models/          # Laptop, Printer, Service models
│   ├── routes/          # API routes với endpoints mới
│   ├── utils/           # Scripts seed data
│   ├── start-server.ps1 # Script khởi động
│   └── testAPI.js       # Test API
└── frontend/
    └── may_tinh_tran_anh/
        ├── src/
        │   ├── pages/       # ProductListing, Home, ServiceListing
        │   ├── services/    # apiService.js
        │   └── components/  # NavBar
        └── start-frontend.ps1
```

## 🎯 Tính Năng Hoạt Động

✅ **Navigation**: Menu danh mục hoạt động  
✅ **Product Listing**: Hiển thị sản phẩm theo category  
✅ **Product Detail**: Chi tiết từ database  
✅ **Service Listing**: Trang dịch vụ với filter  
✅ **Featured Products**: Sản phẩm nổi bật trang chủ  
✅ **Error Handling**: Thông báo lỗi khi API down  
✅ **Loading States**: UX tốt khi load dữ liệu  

## 📱 Responsive Design

Website hoạt động tốt trên:
- 💻 Desktop
- 📱 Mobile  
- 📱 Tablet

---

**🎉 Hệ thống đã sẵn sàng sử dụng!**
