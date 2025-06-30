# Hệ Thống Quản Lý Máy Tính Trần Anh

## 🎯 Tổng quan
Hệ thống quản lý cửa hàng máy tính hoàn chỉnh với:
- **Frontend**: React.js với giao diện hiện đại, responsive
- **Backend**: Node.js + Express + MongoDB
- **Tính năng**: Quản lý sản phẩm, tồn kho, đơn hàng, nhân viên, dịch vụ

## 🚀 Cài đặt nhanh

### Cách 1: Sử dụng Quick Start Script (Khuyến nghị)

**Windows:**
```cmd
quickStart.bat
```

**Linux/macOS:**
```bash
chmod +x quickStart.sh
./quickStart.sh
```

### Cách 2: Cài đặt thủ công

**Xem hướng dẫn chi tiết tại: [INSTALL.md](./INSTALL.md)**

```bash
# 1. Cài đặt backend
cd backend && npm install

# 2. Cài đặt frontend  
cd ../frontend/may_tinh_tran_anh && npm install

# 3. Setup dữ liệu mẫu
cd ../../backend && node setupComplete.js

# 4. Khởi chạy
npm run dev  # Backend (port 3001)
# Terminal mới:
cd ../frontend/may_tinh_tran_anh && npm start  # Frontend (port 3000)
```

## 👥 Tài khoản mặc định
- **Admin**: admin@maytinhrananh.com / admin123
- **Staff**: staff1@maytinhrananh.com / staff123  
- **Manager**: manager1@maytinhrananh.com / manager123

## 🔧 Scripts hỗ trợ

| Script | Mô tả |
|--------|-------|
| `quickStart.bat/sh` | Script khởi chạy nhanh với menu tương tác |
| `backend/setupComplete.js` | Tạo dữ liệu mẫu (sản phẩm, tài khoản, đơn hàng) |
| `backend/healthCheck.js` | Kiểm tra tình trạng hệ thống |
| `cleanup.bat/sh` | Xóa file test và báo cáo không cần thiết |

## Project Structure
```
ToHuuDung/code/
├── frontend/may_tinh_tran_anh/     # React frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   ├── assets/                 # CSS and images
│   │   └── App.jsx                 # Main app component
│   ├── public/                     # Static assets
│   └── package.json
└── backend/                        # Node.js backend
    ├── models/                     # Mongoose schemas
    ├── routes/                     # API endpoints
    ├── middleware/                 # Auth & validation
    ├── utils/                      # Helper functions
    ├── uploads/                    # Uploaded files
    └── server.js                   # Main server
```

## Features Implemented

### Frontend (React)
✅ **Navigation & Layout**
- Modern responsive navbar with logo and menu
- Breadcrumb navigation
- Mobile-friendly design

✅ **Pages**
- **Home Page**: Hero section, featured products, categories
- **Product Listing**: Filter, search, pagination, product grid
- **Product Detail**: Detailed product info, specifications, gallery
- **Checkout**: Customer info form, payment method, order summary

✅ **Components**
- Reusable product cards
- Filter sidebar with brand, price, features
- Search and sort functionality
- Responsive image galleries

### Backend (Node.js + Express + MongoDB)
✅ **Models theo UML Class Diagram**
- `Employee` - Nhân viên với authentication
- `Laptop` + reference models (CPU, Brand, VGA, RAM, Storage, Screen, Features)
- `Printer` + reference models (Type, Brand, Features)
- `Service` - Dịch vụ sửa chữa, cho thuê
- `Order` - Đơn hàng với tracking
- `Log` - Nhật ký hoạt động

✅ **API Endpoints**
- **Authentication**: Login, register, profile management
- **CRUD Operations**: Create, Read, Update, Delete cho tất cả entities
- **Advanced Features**: Search, filter, pagination
- **File Upload**: Single/multiple image upload
- **Categories**: Dynamic category management

✅ **Security & Validation**
- JWT authentication
- Input validation middleware
- Error handling
- CORS support

## Quick Start

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/may_tinh_tran_anh
JWT_SECRET=your_secret_key_here

# Start MongoDB (ensure MongoDB is running)
# Start server
npm start

# Or development mode with auto-reload
npm run dev

# Seed database with sample data
npm run seed
```

### 2. Frontend Setup
```bash
# Navigate to frontend
cd frontend/may_tinh_tran_anh

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Verify Installation
- Backend: http://localhost:3000/health
- Frontend: http://localhost:5173
- API Documentation: http://localhost:3000/api/laptops

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/register` - Register employee
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/laptops` - Get laptops (with filters)
- `GET /api/laptops/:id` - Get laptop details
- `POST /api/laptops` - Create laptop
- `PUT /api/laptops/:id` - Update laptop
- `DELETE /api/laptops/:id` - Delete laptop

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/status/:status` - Get orders by status

### File Upload
- `POST /api/upload/single` - Upload single image
- `POST /api/upload/multiple` - Upload multiple images

### Categories
- `GET /api/categories/laptops` - Get laptop categories
- `GET /api/categories/printers` - Get printer categories

## Database Schema

### Core Entities (theo UML)
1. **Employee** - Quản lý nhân viên
2. **Laptop** - Sản phẩm laptop với các thuộc tính chi tiết
3. **Printer** - Sản phẩm máy in
4. **Service** - Dịch vụ (sửa chữa, cho thuê)
5. **Order** - Đơn hàng với thông tin khách hàng
6. **Log** - Nhật ký hoạt động

### Reference Collections
- CPU, Brand, VGA, RamSize, StorageSize, ScreenSize, SpecialFeature
- PrinterType, PrinterBrand, PrintFeature

## Development Notes

### Fixed Issues
✅ **Module Dependencies**: Installed missing `express-validator`, `multer`
✅ **Schema Conflicts**: Changed `isNew` to `isNewProduct` (Mongoose reserved keyword)
✅ **Port Conflicts**: Resolved EADDRINUSE errors
✅ **CORS Configuration**: Enabled cross-origin requests
✅ **File Upload**: Configured multer for image uploads

### Code Quality
- Consistent error handling with try-catch
- Input validation on all endpoints
- Modular route organization
- Clean separation of concerns
- Environment-based configuration

## Testing

### Backend Testing
```bash
# Run basic tests
npm test

# Test individual endpoints
node quickTest.js

# Manual testing via browser
http://localhost:5000/health
http://localhost:5000/api/laptops
```

### Frontend Testing
- Navigate through all pages
- Test responsive design on mobile/desktop
- Verify form submissions
- Check product filtering and search

## Production Deployment

### Backend
1. Set production environment variables
2. Configure MongoDB Atlas or production database
3. Set up SSL/HTTPS
4. Configure reverse proxy (nginx)
5. Set up process manager (PM2)

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify)
3. Configure environment variables for API URLs

## Future Enhancements

### Potential Features
- [ ] Admin dashboard for managing products
- [ ] Real-time order tracking
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Customer reviews and ratings
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

### Technical Improvements
- [ ] Redis caching for better performance
- [ ] Image optimization and CDN
- [ ] API rate limiting
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline
- [ ] Docker containerization

## Support

### Common Issues
- **Port 5000 in use**: Kill existing process or change PORT in .env
- **MongoDB connection**: Ensure MongoDB service is running
- **CORS errors**: Check frontend URL in CORS configuration
- **File upload errors**: Verify uploads directory permissions

### Documentation
- [Backend API Documentation](./backend/API_DOCUMENTATION.md)
- [Frontend Component Guide](./frontend/may_tinh_tran_anh/README.md)
- [Database Schema](./backend/README.md)

---

**Created by**: THD  
**Last Updated**: June 29, 2025  
**Version**: 1.0.0
