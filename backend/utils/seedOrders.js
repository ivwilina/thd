const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

const sampleOrders = [
  {
    _id: 'ORD1720123456789',
    customerName: 'Nguyễn Văn Nam',
    customerPhoneNumber: '0901234567',
    customerEmail: 'nam.nguyen@example.com',
    customerAddress: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    billingMethod: 'cash-on-delivery',
    note: 'Giao hàng giờ hành chính',
    type: 'product',
    orderItems: [
      {
        itemType: 'laptop',
        itemId: 'laptop_001',
        itemName: 'Laptop Dell Inspiron 15 3520 N5I5122W1',
        quantity: 1,
        unitPrice: 12591000,
        totalPrice: 12591000
      }
    ],
    finalPrice: 12591000,
    status: 'pending'
  },
  {
    _id: 'ORD1720123456790',
    customerName: 'Trần Thị Lan',
    customerPhoneNumber: '0912345678',
    customerEmail: 'lan.tran@example.com',
    customerAddress: '456 Đường Nguyễn Huệ, Quận 3, TP.HCM',
    billingMethod: 'bank-transfer',
    note: 'Chuyển khoản trước khi giao',
    type: 'product',
    orderItems: [
      {
        itemType: 'printer',
        itemId: 'printer_001',
        itemName: 'Máy in phun màu Canon PIXMA G3010',
        quantity: 1,
        unitPrice: 3946800,
        totalPrice: 3946800
      }
    ],
    finalPrice: 3946800,
    status: 'confirmed',
    processedBy: 'EMP001',
    processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    _id: 'ORD1720123456791',
    customerName: 'Lê Minh Đức',
    customerPhoneNumber: '0923456789',
    customerEmail: 'duc.le@example.com',
    customerAddress: '789 Đường Võ Văn Tần, Quận 10, TP.HCM',
    billingMethod: 'cash-on-delivery',
    note: 'Gọi trước khi giao 30 phút',
    type: 'product',
    orderItems: [
      {
        itemType: 'laptop',
        itemId: 'laptop_002',
        itemName: 'Laptop Dell Inspiron 16 5630 N6I7110W1',
        quantity: 1,
        unitPrice: 22491000,
        totalPrice: 22491000
      },
      {
        itemType: 'printer',
        itemId: 'printer_002',
        itemName: 'Máy in laser Canon LBP2900',
        quantity: 1,
        unitPrice: 2745500,
        totalPrice: 2745500
      }
    ],
    finalPrice: 25236500,
    status: 'processing',
    processedBy: 'EMP002',
    processedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    _id: 'ORD1720123456792',
    customerName: 'Phạm Thị Hương',
    customerPhoneNumber: '0934567890',
    customerEmail: 'huong.pham@example.com',
    customerAddress: '321 Đường Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM',
    billingMethod: 'cash',
    note: '',
    type: 'product',
    orderItems: [
      {
        itemType: 'laptop',
        itemId: 'laptop_011',
        itemName: 'MacBook Air 13 inch M1 2020 8GB/256GB',
        quantity: 1,
        unitPrice: 23392000,
        totalPrice: 23392000
      }
    ],
    finalPrice: 23392000,
    status: 'delivered',
    processedBy: 'EMP001',
    processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    _id: 'ORD1720123456793',
    customerName: 'Hoàng Văn Hùng',
    customerPhoneNumber: '0945678901',
    customerEmail: 'hung.hoang@example.com',
    customerAddress: '654 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    billingMethod: 'bank-transfer',
    note: 'Khách đòi hủy do thay đổi ý định',
    type: 'product',
    orderItems: [
      {
        itemType: 'printer',
        itemId: 'printer_007',
        itemName: 'Máy in phun màu Epson L3210',
        quantity: 2,
        unitPrice: 3591000,
        totalPrice: 7182000
      }
    ],
    finalPrice: 7182000,
    status: 'cancelled',
    processedBy: 'EMP003',
    processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    cancelReason: 'Khách hàng đổi ý, không muốn mua nữa'
  }
];

const seedOrders = async () => {
  try {
    console.log('🚀 Starting order seeding...');

    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/may_tinh_tran_anh');
    console.log('✅ Connected to MongoDB');

    // Xóa dữ liệu order cũ
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing orders');

    // Tạo đơn hàng mẫu
    const orders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${orders.length} sample orders`);

    // Hiển thị thống kê
    const statusCount = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$finalPrice' }
        }
      }
    ]);

    console.log('\n📊 Order Statistics:');
    statusCount.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} orders, ${stat.totalValue.toLocaleString('vi-VN')} VND`);
    });

    console.log('\n🎉 Order seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    process.exit(1);
  }
};

// Chạy seed nếu file được thực thi trực tiếp
if (require.main === module) {
  seedOrders();
}

module.exports = seedOrders;
