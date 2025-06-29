# 🖼️ Khắc Phục Lỗi Không Thể Tải Ảnh

## 🔍 Vấn Đề
Frontend không thể hiển thị ảnh từ backend do cấu hình URL không đúng.

## ✅ Các Thay Đổi Đã Thực Hiện

### 1. **Cập nhật apiService.js**
- Sửa đường dẫn ảnh từ tương đối thành tuyệt đối
- Format: `http://localhost:3000/uploads/filename.jpg`

### 2. **Cập nhật Components**
- **ProductListing.jsx**: Sử dụng `product.image` trực tiếp
- **Home.jsx**: Sử dụng `product.image` trực tiếp  
- **ProductDetail.jsx**: Xử lý mảng ảnh với URL đầy đủ

### 3. **Tạo Placeholder Images**
- `/public/placeholder-laptop.jpg` - SVG placeholder cho laptop
- `/public/placeholder-printer.jpg` - SVG placeholder cho máy in

### 4. **Thêm Test Routes**
- `/test-image` - Trang test hiển thị ảnh
- `testImages.js` - Script test kết nối ảnh

## 🚀 Cách Kiểm Tra

### 1. **Khởi động Backend:**
```powershell
cd backend
npm start
```

### 2. **Test ảnh trực tiếp:**
- Truy cập: http://localhost:3000/test-image
- Kiểm tra ảnh mẫu hiển thị

### 3. **Test API:**
```powershell
cd backend
node testImages.js
```

### 4. **Khởi động Frontend:**
```powershell
cd frontend/may_tinh_tran_anh
npm run dev
```

### 5. **Kiểm tra trong Browser:**
- Truy cập: http://localhost:5173
- Xem sản phẩm có hiển thị ảnh không
- Check Console nếu có lỗi

## 🔧 Troubleshooting

### ❌ **Ảnh vẫn không hiển thị:**

1. **Kiểm tra Backend:**
   - Server có chạy ở port 3000?
   - Truy cập http://localhost:3000/uploads/laptop_dell_1_1.jpg

2. **Kiểm tra CORS:**
   - Backend đã cấu hình CORS cho localhost:5173
   - Frontend có đang chạy đúng port?

3. **Kiểm tra dữ liệu:**
   ```powershell
   cd backend
   npm run verify
   ```

4. **Regenerate images nếu cần:**
   ```powershell
   cd backend
   npm run create-images
   ```

### ❌ **Lỗi 404 cho ảnh:**

1. **Kiểm tra thư mục uploads:**
   ```powershell
   dir backend/uploads
   ```

2. **Kiểm tra static file config trong server.js:**
   ```javascript
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

### ❌ **Ảnh placeholder không hiển thị:**

1. **Kiểm tra file trong public:**
   ```
   frontend/may_tinh_tran_anh/public/placeholder-laptop.jpg
   frontend/may_tinh_tran_anh/public/placeholder-printer.jpg
   ```

2. **Đảm bảo onError handler hoạt động:**
   ```javascript
   onError={(e) => {
     e.target.src = '/placeholder-laptop.jpg';
   }}
   ```

## 📊 **Cấu Trúc Ảnh**

### **Backend (uploads/):**
```
laptop_dell_1_1.jpg       # Laptop Dell - ảnh 1
laptop_dell_1_2.jpg       # Laptop Dell - ảnh 2  
laptop_hp_1_1.jpg         # Laptop HP - ảnh 1
printer_canon_g3010_1.jpg # Máy in Canon - ảnh 1
...
```

### **URL Pattern:**
- **Backend**: `http://localhost:3000/uploads/filename.jpg`
- **Frontend Placeholder**: `/placeholder-laptop.jpg`

## ✅ **Expected Results**

Sau khi hoàn thành:
- ✅ Trang chủ hiển thị sản phẩm có ảnh
- ✅ Trang danh mục hiển thị ảnh sản phẩm  
- ✅ Trang chi tiết có gallery ảnh
- ✅ Fallback placeholder khi ảnh lỗi
- ✅ Loading states và error handling

**🎉 Lỗi ảnh đã được khắc phục!**
