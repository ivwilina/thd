# May Tinh Tran Anh - Backend API

Backend API server cho hệ thống cửa hàng máy tính Trần Anh được xây dựng với Node.js, Express.js và MongoDB.

## Cấu trúc dự án

```
backend/
├── models/           # Mongoose models
│   ├── Employee.js   # Nhân viên
│   ├── Laptop.js     # Laptop và các model liên quan
│   ├── Printer.js    # Máy in và các model liên quan
│   ├── Service.js    # Dịch vụ
│   ├── Order.js      # Đơn hàng
│   └── Log.js        # Nhật ký hoạt động
├── routes/           # API routes
│   ├── employeeRoutes.js
│   ├── laptopRoutes.js
│   ├── printerRoutes.js
│   ├── serviceRoutes.js
│   ├── orderRoutes.js
│   ├── logRoutes.js
│   └── categoryRoutes.js
├── middleware/       # Custom middleware
│   └── auth.js       # Authentication middleware
├── utils/            # Utility functions
│   ├── helpers.js    # Helper functions
│   └── seedDatabase.js # Database seeding
├── server.js         # Main server file
├── package.json
└── .env             # Environment variables
```

## Models theo UML Class Diagram

### Employee (Nhân viên)
- Quản lý thông tin nhân viên
- Authentication và authorization
- Các phương thức: createEmployee, getEmployee, updateEmployee, deleteEmployee, getAllEmployees

### Laptop
- Quản lý thông tin laptop
- Liên kết với CPU, Brand, VGA, RAM, Storage, Screen, SpecialFeature
- Các phương thức: createLaptop, getLaptop, updateLaptop, deleteLaptop, getAllLaptops, getLaptopsByBrand, getLaptopsByCpu, getLatestLaptops, getFeaturedLaptops, searchLaptops, filterLaptops

### Printer
- Quản lý thông tin máy in
- Liên kết với PrinterType, PrinterBrand, PrintFeature
- Các phương thức tương tự như Laptop

### Service
- Quản lý dịch vụ (sửa chữa, cho thuê, v.v.)
- Các phương thức: createService, getService, updateService, deleteService, getAllServices, getServicesByType, getFeaturedServices, searchServices

### Order
- Quản lý đơn hàng
- Hỗ trợ đơn hàng sản phẩm và dịch vụ
- Các phương thức: createOrder, getOrder, updateOrder, deleteOrder, getAllOrders, getOrdersByStatus, getOrdersByDate, getOrdersByCustomer, updateOrderStatus, completeOrder

### Log
- Ghi nhật ký hoạt động của nhân viên
- Liên kết với Employee
- Các phương thức: createLog, getLog, updateLog, deleteLog, getAllLogs, getLogsByEmployee

## API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/register` - Register new employee (admin only)
- `GET /api/auth/me` - Get current employee info
- `PUT /api/auth/change-password` - Change password

### File Upload
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images
- `DELETE /api/upload/:filename` - Delete uploaded file

### Employees
- `GET /api/employees` - Lấy danh sách nhân viên
- `GET /api/employees/:id` - Lấy thông tin nhân viên
- `POST /api/employees` - Tạo nhân viên mới
- `PUT /api/employees/:id` - Cập nhật nhân viên
- `DELETE /api/employees/:id` - Xóa nhân viên

### Laptops
- `GET /api/laptops` - Lấy danh sách laptop (có filter, search, pagination)
- `GET /api/laptops/:id` - Lấy thông tin laptop
- `GET /api/laptops/featured` - Lấy laptop nổi bật
- `GET /api/laptops/latest` - Lấy laptop mới nhất
- `GET /api/laptops/brand/:brandId` - Lấy laptop theo thương hiệu
- `POST /api/laptops` - Tạo laptop mới
- `PUT /api/laptops/:id` - Cập nhật laptop
- `DELETE /api/laptops/:id` - Xóa laptop

### Printers
- Tương tự như Laptops với endpoint `/api/printers`

### Services
- `GET /api/services` - Lấy danh sách dịch vụ
- `GET /api/services/featured` - Lấy dịch vụ nổi bật
- `GET /api/services/type/:type` - Lấy dịch vụ theo loại
- CRUD operations tương tự

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/status/:status` - Lấy đơn hàng theo trạng thái
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `PUT /api/orders/:id/complete` - Hoàn thành đơn hàng

### Categories
- `GET /api/categories/cpus` - Danh sách CPU
- `GET /api/categories/brands` - Danh sách thương hiệu
- `GET /api/categories/vgas` - Danh sách VGA
- Và các category khác...

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` và cấu hình:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh
JWT_SECRET=your_jwt_secret
```

3. Khởi động MongoDB

4. Chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. Seed database (tùy chọn):
```javascript
// Trong MongoDB shell hoặc script riêng
const seedDatabase = require('./utils/seedDatabase');
seedDatabase();
```

## Tính năng

- ✅ RESTful API design
- ✅ MongoDB với Mongoose ODM
- ✅ Validation với Joi
- ✅ Error handling middleware
- ✅ CORS support
- ✅ Environment configuration
- ✅ Pagination
- ✅ Search và filtering
- ✅ Database seeding
- ✅ Structured theo UML class diagram

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **joi**: Data validation
- **multer**: File uploads
- **nodemailer**: Email notifications

## Development

```bash
# Chạy trong development mode với nodemon
npm run dev

# Chạy tests
npm test
```

## Deployment

Server có thể deploy trên:
- Heroku
- DigitalOcean
- AWS EC2
- Vercel (cho serverless)

Database có thể sử dụng:
- MongoDB Atlas (cloud)
- Local MongoDB instance
