# 👥 Tài Khoản Nhân Viên Mẫu

## 📋 Danh Sách Tài Khoản

### 1. 👑 Quản Trị Viên (Admin)
- **Tên:** Nguyễn Văn Quản Trị
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@maytinh.com
- **Vai trò:** Administrator
- **Quyền hạn:** Toàn quyền quản lý hệ thống

### 2. 👨‍💼 Quản Lý (Manager)
- **Tên:** Trần Thị Quản Lý
- **Username:** `manager`
- **Password:** `manager123`
- **Email:** manager@maytinh.com
- **Vai trò:** Manager
- **Quyền hạn:** Quản lý sản phẩm, đơn hàng, dịch vụ, khách hàng, xem báo cáo

### 3. 👨‍💻 Nhân Viên Bán Hàng
- **Tên:** Lê Văn Nhân Viên
- **Username:** `nhanvien`
- **Password:** `nhanvien123`
- **Email:** nhanvien@maytinh.com
- **Vai trò:** Staff
- **Quyền hạn:** Quản lý đơn hàng và chăm sóc khách hàng

### 4. 💬 Nhân Viên Chăm Sóc Khách Hàng
- **Tên:** Phạm Thị Chăm Sóc
- **Username:** `chamsoc`
- **Password:** `chamsoc123`
- **Email:** chamsoc@maytinh.com
- **Vai trò:** Staff
- **Quyền hạn:** Chăm sóc khách hàng và xử lý đơn hàng

### 5. 🔧 Nhân Viên Kỹ Thuật
- **Tên:** Hoàng Văn Kỹ Thuật
- **Username:** `kythuat`
- **Password:** `kythuat123`
- **Email:** kythuat@maytinh.com
- **Vai trò:** Staff
- **Quyền hạn:** Chăm sóc khách hàng và hỗ trợ kỹ thuật

## 🔐 Ma Trận Phân Quyền

| Chức năng | Admin | Manager | Staff |
|-----------|-------|---------|-------|
| Quản lý sản phẩm | ✅ | ✅ | ❌ |
| Quản lý đơn hàng | ✅ | ✅ | ✅ |
| Quản lý nhân viên | ✅ | ❌ | ❌ |
| Quản lý dịch vụ | ✅ | ✅ | ❌ |
| Xem báo cáo | ✅ | ✅ | ❌ |
| Chăm sóc khách hàng | ✅ | ✅ | ✅ |

## 🚀 Cách Sử Dụng

### 1. Đăng Nhập
```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### 2. Phản Hồi Thành Công
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "EMP001",
    "name": "Nguyễn Văn Quản Trị",
    "username": "admin",
    "email": "admin@maytinh.com",
    "role": "admin",
    "permissions": {
      "canManageProducts": true,
      "canManageOrders": true,
      "canManageEmployees": true,
      "canManageServices": true,
      "canViewReports": true,
      "canManageCustomers": true
    }
  }
}
```

### 3. Sử Dụng Token
Thêm token vào header của các request:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 Quản Lý Phân Quyền

### Middleware Có Sẵn
- `authenticateToken` - Xác thực token
- `requireAdmin` - Chỉ admin
- `requireManagerOrAdmin` - Admin hoặc Manager
- `requirePermission(permission)` - Quyền cụ thể
- `requireResourceAccess(resource)` - Truy cập tài nguyên
- `logActivity(action)` - Ghi log hoạt động

### Ví Dụ Sử Dụng
```javascript
// Chỉ admin mới xóa được nhân viên
router.delete('/employees/:id', 
  authenticateToken, 
  requireAdmin, 
  logActivity('Delete employee'),
  deleteEmployeeController
);

// Manager và admin có thể xem sản phẩm
router.get('/products', 
  authenticateToken, 
  requireResourceAccess('products'),
  getProductsController
);
```

## 📝 Test Tài Khoản

Chạy lệnh test để kiểm tra hệ thống phân quyền:
```bash
npm run test-roles
```

## 🔄 Thay Đổi Mật Khẩu

Để thay đổi mật khẩu trong môi trường production:
1. Đăng nhập bằng tài khoản admin
2. Sử dụng API `/api/auth/change-password`
3. Hoặc cập nhật trực tiếp trong database với password đã hash

## ⚠️ Lưu Ý Bảo Mật

- **Thay đổi mật khẩu mặc định** trong môi trường production
- **JWT_SECRET** phải được set mạnh trong file `.env`
- **Logout** bằng cách xóa token ở client
- **Token expiry** mặc định là 7 ngày

## 📞 Hỗ Trợ

Nếu có vấn đề với tài khoản:
1. Kiểm tra database connection
2. Chạy `npm run verify` để xác minh dữ liệu
3. Chạy `npm run setup` để reset toàn bộ dữ liệu
