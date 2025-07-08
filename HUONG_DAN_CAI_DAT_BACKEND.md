# HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG BACKEND VỚI DỮ LIỆU MẪU

## 🚀 CÀI ĐẶT BACKEND

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Khởi động MongoDB
Đảm bảo MongoDB đang chạy trên máy của bạn:
```bash
# Windows (nếu cài đặt MongoDB Community)
net start MongoDB

# hoặc chạy mongod trực tiếp
mongod
```

### 3. Setup dữ liệu mẫu
```bash
# Trong thư mục backend
node setup-sample-data.js
```

Script này sẽ:
- ✅ Tạo 7 laptop mẫu với thông tin chi tiết
- ✅ Tạo 5 máy in mẫu với thông tin chi tiết  
- ✅ Tạo 12 bản ghi inventory với số lượng tồn kho thực tế
- ✅ Liên kết dữ liệu inventory với sản phẩm
- ✅ Hiển thị báo cáo tình trạng tồn kho

### 4. Khởi động server
```bash
npm run dev
# hoặc
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📦 DỮ LIỆU MẪU ĐÃ TẠO

### LAPTOP (7 sản phẩm):
1. **Dell Inspiron 15 3000** - 15 chiếc (Còn hàng)
2. **ASUS VivoBook 15 X515EA** - 22 chiếc (Còn hàng) 
3. **HP Pavilion 15-eg0502TX** - 8 chiếc (Còn hàng)
4. **ASUS TUF Gaming F15** - 12 chiếc (Còn hàng)
5. **Lenovo ThinkPad E14** - 6 chiếc (Còn hàng)
6. **MacBook Air M2** - 0 chiếc (❌ HẾT HÀNG)
7. **MSI GF63 Thin** - 18 chiếc (Còn hàng)

### PRINTER (5 sản phẩm):
1. **HP LaserJet Pro M15w** - 25 chiếc (Còn hàng)
2. **Canon PIXMA G3010** - 32 chiếc (Còn hàng)
3. **Epson L3150** - 14 chiếc (Còn hàng)
4. **Brother DCP-T720DW** - 9 chiếc (Còn hàng)
5. **HP LaserJet Pro MFP M428fdw** - 0 chiếc (❌ HẾT HÀNG)

### THỐNG KÊ TỒN KHO:
- 📦 **Tổng số lượng**: 161 sản phẩm
- ✅ **Còn hàng**: 10 sản phẩm  
- ❌ **Hết hàng**: 2 sản phẩm
- ⚠️ **Sắp hết**: 0 sản phẩm

## 🖥️ FRONTEND - ADMIN INVENTORY

### Tính năng đã cập nhật:
1. **Hiển thị thông tin chi tiết**:
   - Tồn kho hiện tại
   - Số lượng đặt trước  
   - Số lượng có sẵn
   - Min/Max stock
   - Reorder level
   - Vị trí kho
   - Nhà cung cấp
   - Lead time

2. **Table nâng cao**:
   - 12 cột thông tin chi tiết
   - Status badges với màu sắc
   - Cost display (giá vốn)
   - Product category badges
   - Action buttons (View, Edit, Reorder)

3. **Responsive design**:
   - Tối ưu cho desktop và mobile
   - Scroll horizontal trên màn hình nhỏ
   - Ẩn thông tin phụ trên mobile

## 🔌 API ENDPOINTS

### GET /api/inventory
Lấy danh sách tồn kho với thông tin chi tiết

### GET /api/laptops  
Lấy danh sách laptop

### GET /api/printers
Lấy danh sách máy in

## 📱 SỬ DỤNG ADMIN INVENTORY

1. **Truy cập**: `http://localhost:3000/admin/inventory`

2. **Chức năng chính**:
   - 🔍 Tìm kiếm sản phẩm
   - 🎯 Lọc theo trạng thái (Tất cả/Còn hàng/Sắp hết/Hết hàng)
   - 👁️ Xem chi tiết sản phẩm
   - ✏️ Cập nhật tồn kho
   - ➕ Đặt hàng ngay (cho sản phẩm sắp hết)
   - 🔄 Làm mới dữ liệu
   - 📊 Export dữ liệu

3. **Thông tin hiển thị**:
   - Mã sản phẩm
   - Tên và giá vốn
   - Danh mục (Laptop/Máy in)
   - Tồn kho với cảnh báo
   - Số lượng đặt trước
   - Số lượng có sẵn
   - Min/Max/Reorder level
   - Vị trí trong kho
   - Nhà cung cấp và lead time
   - Trạng thái và ngày cập nhật

## 🎨 THIẾT KẾ

- **Consistent UI**: Thiết kế đồng nhất với admin products
- **Color coding**: Màu sắc phân biệt trạng thái
- **Modern layout**: Layout hiện đại với cards và shadows
- **Mobile friendly**: Responsive cho mọi thiết bị

## 🔧 TROUBLESHOOTING

### Lỗi thường gặp:

1. **MongoDB connection error**:
   ```bash
   # Kiểm tra MongoDB đang chạy
   mongod --version
   # Khởi động MongoDB service
   net start MongoDB
   ```

2. **Port đã được sử dụng**:
   ```bash
   # Thay đổi port trong backend/server.js
   const PORT = process.env.PORT || 5001;
   ```

3. **Dữ liệu không hiển thị**:
   ```bash
   # Chạy lại script setup
   node setup-sample-data.js
   ```

4. **Frontend không load**:
   ```bash
   # Kiểm tra CORS và API URL trong frontend
   # Đảm bảo backend đang chạy trên port 5000
   ```

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. MongoDB đang chạy
2. Backend server đang chạy (port 5000)
3. Frontend đang chạy (port 3000)
4. Dữ liệu đã được setup thành công

---

**✅ Setup hoàn tất!** Bạn có thể bắt đầu sử dụng hệ thống quản lý inventory với dữ liệu mẫu đầy đủ.
