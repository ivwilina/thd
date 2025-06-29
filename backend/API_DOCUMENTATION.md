# API Documentation - May Tinh Tran Anh

## Overview
RESTful API cho hệ thống cửa hàng máy tính Trần Anh. Backend được xây dựng với Node.js, Express.js và MongoDB.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Sử dụng JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

## Quick Start

### 1. Cài đặt dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình environment
Tạo file `.env` với nội dung:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### 3. Khởi chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 4. Seed database với dữ liệu mẫu
```bash
npm run seed
```

### 5. Test backend
```bash
npm test
```

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "EMP001",
    "name": "Admin User",
    "username": "admin",
    "email": "admin@maytinh.com"
  }
}
```

#### Register Employee (Admin only)
```http
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "EMP002",
  "name": "New Employee",
  "phoneNumber": "0123456789",
  "email": "employee@maytinh.com",
  "address": "123 Main St",
  "username": "newuser",
  "password": "password123"
}
```

### Laptops

#### Get All Laptops
```http
GET /api/laptops?page=1&limit=10&brand=Dell&search=i5
```

#### Get Single Laptop
```http
GET /api/laptops/LAPTOP001
```

#### Create Laptop
```http
POST /api/laptops
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "Dell Inspiron 15",
  "model": "3520",
  "brand": "BRAND001",
  "price": 15000000,
  "cpu": "CPU001",
  "vga": "VGA001",
  "ramSize": "RAM001",
  "ramDetails": "8GB DDR4",
  "storageSize": "STORAGE001",
  "storageDetails": "512GB SSD",
  "screenSize": "SCREEN001",
  "screenDetails": "15.6 Full HD",
  "isNew": true,
  "isFeatured": false,
  "discount": 10
}
```

#### Get Featured Laptops
```http
GET /api/laptops/featured
```

#### Search Laptops
```http
GET /api/laptops?search=gaming laptop
```

#### Filter Laptops
```http
GET /api/laptops?brand=Dell&minPrice=10000000&maxPrice=20000000&isNew=true
```

### Orders

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customerName": "Nguyen Van A",
  "customerPhoneNumber": "0987654321",
  "customerEmail": "customer@example.com",
  "customerAddress": "123 Customer Street",
  "billingMethod": "cash",
  "note": "Giao hàng buổi sáng",
  "type": "product",
  "orderItem": "[{\"productId\":\"LAPTOP001\",\"quantity\":1,\"price\":15000000}]",
  "finalPrice": 13500000
}
```

#### Get Orders by Status
```http
GET /api/orders/status/pending
```

#### Update Order Status
```http
PUT /api/orders/ORDER001/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Services

#### Get All Services
```http
GET /api/services
```

#### Get Services by Type
```http
GET /api/services/type/repair
```

#### Create Service
```http
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop Cleaning Service",
  "priceMin": 100000,
  "priceMax": 500000,
  "type": "maintenance"
}
```

### File Upload

#### Upload Single Image
```http
POST /api/upload/single
Content-Type: multipart/form-data

image=<binary_file>
```

Response:
```json
{
  "message": "File uploaded successfully",
  "filename": "image-1640123456789-123456789.jpg",
  "url": "/uploads/image-1640123456789-123456789.jpg",
  "size": 245760
}
```

#### Upload Multiple Images
```http
POST /api/upload/multiple
Content-Type: multipart/form-data

images=<binary_file_1>
images=<binary_file_2>
```

### Categories

#### Get Categories with Products
```http
GET /api/categories/laptops
GET /api/categories/printers
GET /api/categories/services
```

## Error Handling

API trả về lỗi theo format:
```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### Collections
- `employees` - Nhân viên
- `laptops` - Laptop
- `cpus`, `brands`, `vgas`, `ramsizes`, `storagesizes`, `screensizes`, `specialfeatures` - Reference data cho laptop
- `printers` - Máy in
- `printertypes`, `printerbrands`, `printfeatures` - Reference data cho printer
- `services` - Dịch vụ
- `orders` - Đơn hàng
- `logs` - Nhật ký hoạt động

## Testing

Backend được trang bị:
- Unit tests cho models
- Integration tests cho API endpoints
- Sample data seeding
- Health check endpoint: `GET /health`

Chạy tests:
```bash
npm test
```

## Development

### Project Structure
```
backend/
├── models/           # Mongoose schemas
├── routes/           # API route handlers
├── middleware/       # Authentication, validation
├── utils/            # Helper functions, seeding
├── uploads/          # Uploaded files
├── server.js         # Main server file
└── package.json      # Dependencies
```

### Adding New Features
1. Tạo model trong `models/`
2. Tạo routes trong `routes/`
3. Thêm validation nếu cần
4. Cập nhật server.js để include routes
5. Thêm tests

### Best Practices
- Sử dụng async/await cho database operations
- Validate input data trước khi lưu database
- Log các hoạt động quan trọng
- Sử dụng middleware cho authentication
- Handle errors properly với try-catch
