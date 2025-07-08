const mongoose = require('mongoose');
const Laptop = require('./models/Laptop');
const Printer = require('./models/Printer');
const Inventory = require('./models/Inventory');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/computer_store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Dữ liệu mẫu Laptop
const laptopSampleData = [
  {
    _id: "laptop_dell_inspiron_15_3000",
    displayName: "Dell Inspiron 15 3000",
    model: "Inspiron 15 3000",
    brand: "Dell",
    price: 12990000,
    cpu: "Intel Core i3-1115G4",
    vga: "Intel UHD Graphics",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 3200MHz (1x8GB)",
    storageSize: "256GB",
    storageDetails: "256GB PCIe NVMe SSD",
    screenSize: "15.6 inch",
    screenDetails: "15.6 inch HD (1366x768) Anti-Glare LED-Backlit",
    description: "Laptop Dell Inspiron 15 3000 với thiết kế đơn giản, hiệu năng ổn định cho công việc văn phòng và học tập.",
    isNewProduct: true,
    isFeatured: true,
    discount: 5,
    images: [
      "laptop_dell_1_1.jpg",
      "laptop_dell_1_2.jpg",
      "laptop_dell_1_3.jpg"
    ],
    specialFeature: ["Thiết kế mỏng nhẹ", "Pin tối ưu"],
    condition: "new",
    warranty: "12 tháng",
    availability: "in-stock"
  },
  {
    _id: "laptop_asus_vivobook_15",
    displayName: "ASUS VivoBook 15 X515EA",
    model: "VivoBook 15 X515EA",
    brand: "ASUS",
    price: 14990000,
    cpu: "Intel Core i5-1135G7",
    vga: "Intel Iris Xe Graphics",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 2400MHz (1x8GB)",
    storageSize: "512GB",
    storageDetails: "512GB PCIe NVMe SSD",
    screenSize: "15.6 inch",
    screenDetails: "15.6 inch FHD (1920x1080) Anti-Glare",
    description: "ASUS VivoBook 15 với màn hình FHD sắc nét, hiệu năng mạnh mẽ cho đa nhiệm.",
    isNewProduct: true,
    isFeatured: false,
    discount: 8,
    images: [
      "laptop_asus_1_1.jpg",
      "laptop_asus_1_2.jpg",
      "laptop_asus_1_3.jpg"
    ],
    specialFeature: ["Màn hình FHD", "Bàn phím NumberPad"],
    condition: "new",
    warranty: "24 tháng",
    availability: "in-stock"
  },
  {
    _id: "laptop_hp_pavilion_15",
    displayName: "HP Pavilion 15-eg0502TX",
    model: "Pavilion 15-eg0502TX",
    brand: "HP",
    price: 18990000,
    cpu: "Intel Core i5-1135G7",
    vga: "NVIDIA GeForce MX450 2GB",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 3200MHz (1x8GB)",
    storageSize: "512GB",
    storageDetails: "512GB PCIe NVMe SSD",
    screenSize: "15.6 inch",
    screenDetails: "15.6 inch FHD (1920x1080) IPS",
    description: "HP Pavilion 15 với card đồ họa rời NVIDIA MX450, lý tưởng cho thiết kế và giải trí.",
    isNewProduct: true,
    isFeatured: true,
    discount: 10,
    images: [
      "laptop_hp_1_1.jpg",
      "laptop_hp_1_2.jpg",
      "laptop_hp_1_3.jpg"
    ],
    specialFeature: ["Card đồ họa rời", "Màn hình IPS"],
    condition: "new",
    warranty: "12 tháng",
    availability: "in-stock"
  },
  {
    _id: "laptop_asus_gaming_tuf",
    displayName: "ASUS TUF Gaming F15 FX506LH",
    model: "TUF Gaming F15 FX506LH",
    brand: "ASUS",
    price: 22990000,
    cpu: "Intel Core i5-10300H",
    vga: "NVIDIA GeForce GTX 1650 4GB",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 2933MHz (1x8GB)",
    storageSize: "512GB",
    storageDetails: "512GB PCIe NVMe SSD",
    screenSize: "15.6 inch",
    screenDetails: "15.6 inch FHD (1920x1080) 144Hz",
    description: "ASUS TUF Gaming F15 với GTX 1650, màn hình 144Hz cho trải nghiệm gaming mượt mà.",
    isNewProduct: true,
    isFeatured: true,
    discount: 12,
    images: [
      "laptop_asus_gaming_1.jpg",
      "laptop_asus_gaming_2.jpg",
      "laptop_asus_gaming_3.jpg"
    ],
    specialFeature: ["Gaming", "Màn hình 144Hz", "Làm mát hiệu quả"],
    condition: "new",
    warranty: "24 tháng",
    availability: "in-stock"
  },
  {
    _id: "laptop_lenovo_thinkpad_e14",
    displayName: "Lenovo ThinkPad E14 Gen 3",
    model: "ThinkPad E14 Gen 3",
    brand: "Lenovo",
    price: 16990000,
    cpu: "AMD Ryzen 5 5500U",
    vga: "AMD Radeon Graphics",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 3200MHz (1x8GB)",
    storageSize: "256GB",
    storageDetails: "256GB PCIe NVMe SSD",
    screenSize: "14 inch",
    screenDetails: "14 inch FHD (1920x1080) IPS Anti-Glare",
    description: "Lenovo ThinkPad E14 dòng laptop doanh nghiệp với độ bền cao và bảo mật tốt.",
    isNewProduct: false,
    isFeatured: false,
    discount: 0,
    images: [
      "laptop_lenovo_1_1.jpg",
      "laptop_lenovo_1_2.jpg"
    ],
    specialFeature: ["Doanh nghiệp", "Bảo mật cao"],
    condition: "new",
    warranty: "36 tháng",
    availability: "in-stock"
  },
  {
    _id: "laptop_macbook_air_m2",
    displayName: "MacBook Air 13 inch M2 2022",
    model: "MacBook Air M2",
    brand: "Apple",
    price: 28990000,
    cpu: "Apple M2 8-core CPU",
    vga: "Apple M2 8-core GPU",
    ramSize: "8GB",
    ramDetails: "8GB Unified Memory",
    storageSize: "256GB",
    storageDetails: "256GB SSD",
    screenSize: "13.6 inch",
    screenDetails: "13.6 inch Liquid Retina (2560x1664)",
    description: "MacBook Air M2 với thiết kế siêu mỏng, hiệu năng mạnh mẽ và thời lượng pin ấn tượng.",
    isNewProduct: true,
    isFeatured: true,
    discount: 0,
    images: [
      "macbook_air_m2_1.jpg",
      "macbook_air_m2_2.jpg",
      "macbook_air_m2_3.jpg"
    ],
    specialFeature: ["Chip M2", "Thiết kế siêu mỏng", "Pin 18 giờ"],
    condition: "new",
    warranty: "12 tháng",
    availability: "out-of-stock"
  },
  {
    _id: "laptop_msi_gf63_thin",
    displayName: "MSI GF63 Thin 11SC",
    model: "GF63 Thin 11SC",
    brand: "MSI",
    price: 19990000,
    cpu: "Intel Core i5-11400H",
    vga: "NVIDIA GeForce GTX 1650 Max-Q 4GB",
    ramSize: "8GB",
    ramDetails: "8GB DDR4 3200MHz (1x8GB)",
    storageSize: "512GB",
    storageDetails: "512GB NVMe PCIe SSD",
    screenSize: "15.6 inch",
    screenDetails: "15.6 inch FHD (1920x1080) 60Hz",
    description: "MSI GF63 Thin laptop gaming mỏng nhẹ với GTX 1650 Max-Q, phù hợp cho game và đồ họa.",
    isNewProduct: false,
    isFeatured: false,
    discount: 15,
    images: [
      "laptop_msi_1_1.jpg",
      "laptop_msi_1_2.jpg"
    ],
    specialFeature: ["Gaming", "Thiết kế mỏng"],
    condition: "new",
    warranty: "24 tháng",
    availability: "in-stock"
  }
];

// Dữ liệu mẫu Printer
const printerSampleData = [
  {
    _id: "printer_hp_laserjet_pro_m15w",
    type: "Laser Printer",
    brand: "HP",
    printType: "Đen trắng",
    description: "HP LaserJet Pro M15w - Máy in laser đen trắng không dây nhỏ gọn cho văn phòng nhỏ.",
    price: 2590000,
    isNewProduct: true,
    isFeatured: true,
    discount: 5,
    images: [
      "printer_hp_m15w_1.jpg",
      "printer_hp_m15w_2.jpg"
    ],
    printFeatures: ["In không dây", "Kết nối WiFi", "Tiết kiệm năng lượng"],
    condition: "new",
    warranty: "12 tháng",
    availability: "in-stock"
  },
  {
    _id: "printer_canon_pixma_g3010",
    type: "Inkjet Printer",
    brand: "Canon",
    printType: "Màu",
    description: "Canon PIXMA G3010 - Máy in phun màu đa chức năng với hệ thống mực liên tục.",
    price: 4290000,
    isNewProduct: true,
    isFeatured: true,
    discount: 8,
    images: [
      "printer_canon_g3010_1.jpg",
      "printer_canon_g3010_2.jpg",
      "printer_canon_g3010_3.jpg"
    ],
    printFeatures: ["In màu", "Scan", "Copy", "Mực liên tục", "WiFi"],
    condition: "new",
    warranty: "12 tháng",
    availability: "in-stock"
  },
  {
    _id: "printer_epson_l3150",
    type: "Inkjet Printer",
    brand: "Epson",
    printType: "Màu",
    description: "Epson L3150 - Máy in phun màu đa chức năng với mực EcoTank tiết kiệm.",
    price: 3990000,
    isNewProduct: true,
    isFeatured: false,
    discount: 10,
    images: [
      "printer_epson_l3150_1.jpg",
      "printer_epson_l3150_2.jpg"
    ],
    printFeatures: ["In màu", "Scan", "Copy", "EcoTank", "WiFi Direct"],
    condition: "new",
    warranty: "24 tháng",
    availability: "in-stock"
  },
  {
    _id: "printer_brother_dcp_t720dw",
    type: "Inkjet Printer",
    brand: "Brother",
    printType: "Màu",
    description: "Brother DCP-T720DW - Máy in phun màu đa chức năng với mực InkBenefit.",
    price: 4690000,
    isNewProduct: false,
    isFeatured: false,
    discount: 0,
    images: [
      "printer_brother_t720dw_1.jpg",
      "printer_brother_t720dw_2.jpg"
    ],
    printFeatures: ["In màu", "Scan", "Copy", "In 2 mặt", "WiFi"],
    condition: "new",
    warranty: "36 tháng",
    availability: "in-stock"
  },
  {
    _id: "printer_hp_laserjet_pro_mfp_m428fdw",
    type: "Laser Printer",
    brand: "HP",
    printType: "Đen trắng",
    description: "HP LaserJet Pro MFP M428fdw - Máy in laser đa chức năng cho doanh nghiệp.",
    price: 8990000,
    isNewProduct: true,
    isFeatured: true,
    discount: 12,
    images: [
      "printer_hp_m428fdw_1.jpg",
      "printer_hp_m428fdw_2.jpg",
      "printer_hp_m428fdw_3.jpg"
    ],
    printFeatures: ["In laser", "Scan", "Copy", "Fax", "In 2 mặt", "WiFi", "Ethernet"],
    condition: "new",
    warranty: "12 tháng",
    availability: "out-of-stock"
  }
];

// Dữ liệu mẫu Inventory
const inventorySampleData = [
  // Laptop Inventory
  {
    productId: "laptop_dell_inspiron_15_3000",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 15,
    reservedStock: 2,
    availableStock: 13,
    minimumStock: 5,
    maximumStock: 50,
    reorderLevel: 8,
    cost: 11500000,
    location: {
      warehouse: "MAIN",
      shelf: "A01",
      position: "001"
    },
    supplier: {
      name: "Dell Vietnam",
      contact: "dell@vietnam.com",
      leadTime: 7
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 20,
        reason: "Nhập hàng mới",
        reference: "PO-2024-001",
        date: new Date('2024-01-15')
      },
      {
        type: "OUT",
        quantity: 5,
        reason: "Bán hàng",
        reference: "INV-2024-001",
        date: new Date('2024-01-20')
      }
    ]
  },
  {
    productId: "laptop_asus_vivobook_15",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 22,
    reservedStock: 1,
    availableStock: 21,
    minimumStock: 5,
    maximumStock: 40,
    reorderLevel: 10,
    cost: 13200000,
    location: {
      warehouse: "MAIN",
      shelf: "A01",
      position: "002"
    },
    supplier: {
      name: "ASUS Vietnam",
      contact: "asus@vietnam.com",
      leadTime: 5
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 25,
        reason: "Nhập hàng mới",
        reference: "PO-2024-002",
        date: new Date('2024-01-10')
      },
      {
        type: "OUT",
        quantity: 3,
        reason: "Bán hàng",
        reference: "INV-2024-002",
        date: new Date('2024-01-25')
      }
    ]
  },
  {
    productId: "laptop_hp_pavilion_15",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 8,
    reservedStock: 3,
    availableStock: 5,
    minimumStock: 5,
    maximumStock: 30,
    reorderLevel: 8,
    cost: 16800000,
    location: {
      warehouse: "MAIN",
      shelf: "A01",
      position: "003"
    },
    supplier: {
      name: "HP Vietnam",
      contact: "hp@vietnam.com",
      leadTime: 10
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 15,
        reason: "Nhập hàng mới",
        reference: "PO-2024-003",
        date: new Date('2024-01-05')
      },
      {
        type: "OUT",
        quantity: 7,
        reason: "Bán hàng",
        reference: "INV-2024-003",
        date: new Date('2024-01-28')
      }
    ]
  },
  {
    productId: "laptop_asus_gaming_tuf",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 12,
    reservedStock: 0,
    availableStock: 12,
    minimumStock: 3,
    maximumStock: 25,
    reorderLevel: 5,
    cost: 20500000,
    location: {
      warehouse: "MAIN",
      shelf: "A02",
      position: "001"
    },
    supplier: {
      name: "ASUS Vietnam",
      contact: "asus@vietnam.com",
      leadTime: 5
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 15,
        reason: "Nhập hàng mới",
        reference: "PO-2024-004",
        date: new Date('2024-01-12')
      },
      {
        type: "OUT",
        quantity: 3,
        reason: "Bán hàng",
        reference: "INV-2024-004",
        date: new Date('2024-01-30')
      }
    ]
  },
  {
    productId: "laptop_lenovo_thinkpad_e14",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 6,
    reservedStock: 1,
    availableStock: 5,
    minimumStock: 5,
    maximumStock: 20,
    reorderLevel: 7,
    cost: 15200000,
    location: {
      warehouse: "MAIN",
      shelf: "A02",
      position: "002"
    },
    supplier: {
      name: "Lenovo Vietnam",
      contact: "lenovo@vietnam.com",
      leadTime: 14
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 10,
        reason: "Nhập hàng mới",
        reference: "PO-2024-005",
        date: new Date('2024-01-08')
      },
      {
        type: "OUT",
        quantity: 4,
        reason: "Bán hàng",
        reference: "INV-2024-005",
        date: new Date('2024-01-22')
      }
    ]
  },
  {
    productId: "laptop_macbook_air_m2",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minimumStock: 2,
    maximumStock: 15,
    reorderLevel: 3,
    cost: 26500000,
    location: {
      warehouse: "MAIN",
      shelf: "A02",
      position: "003"
    },
    supplier: {
      name: "Apple Vietnam",
      contact: "apple@vietnam.com",
      leadTime: 21
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 5,
        reason: "Nhập hàng mới",
        reference: "PO-2024-006",
        date: new Date('2024-01-01')
      },
      {
        type: "OUT",
        quantity: 5,
        reason: "Bán hàng",
        reference: "INV-2024-006",
        date: new Date('2024-01-31')
      }
    ]
  },
  {
    productId: "laptop_msi_gf63_thin",
    productType: "laptop",
    productModel: "Laptop",
    currentStock: 18,
    reservedStock: 2,
    availableStock: 16,
    minimumStock: 4,
    maximumStock: 30,
    reorderLevel: 6,
    cost: 17500000,
    location: {
      warehouse: "MAIN",
      shelf: "A03",
      position: "001"
    },
    supplier: {
      name: "MSI Vietnam",
      contact: "msi@vietnam.com",
      leadTime: 7
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 20,
        reason: "Nhập hàng mới",
        reference: "PO-2024-007",
        date: new Date('2024-01-18')
      },
      {
        type: "OUT",
        quantity: 2,
        reason: "Bán hàng",
        reference: "INV-2024-007",
        date: new Date('2024-01-29')
      }
    ]
  },
  // Printer Inventory
  {
    productId: "printer_hp_laserjet_pro_m15w",
    productType: "printer",
    productModel: "Printer",
    currentStock: 25,
    reservedStock: 3,
    availableStock: 22,
    minimumStock: 10,
    maximumStock: 50,
    reorderLevel: 15,
    cost: 2200000,
    location: {
      warehouse: "MAIN",
      shelf: "B01",
      position: "001"
    },
    supplier: {
      name: "HP Vietnam",
      contact: "hp@vietnam.com",
      leadTime: 7
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 30,
        reason: "Nhập hàng mới",
        reference: "PO-2024-008",
        date: new Date('2024-01-14')
      },
      {
        type: "OUT",
        quantity: 5,
        reason: "Bán hàng",
        reference: "INV-2024-008",
        date: new Date('2024-01-26')
      }
    ]
  },
  {
    productId: "printer_canon_pixma_g3010",
    productType: "printer",
    productModel: "Printer",
    currentStock: 32,
    reservedStock: 4,
    availableStock: 28,
    minimumStock: 8,
    maximumStock: 60,
    reorderLevel: 12,
    cost: 3800000,
    location: {
      warehouse: "MAIN",
      shelf: "B01",
      position: "002"
    },
    supplier: {
      name: "Canon Vietnam",
      contact: "canon@vietnam.com",
      leadTime: 5
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 40,
        reason: "Nhập hàng mới",
        reference: "PO-2024-009",
        date: new Date('2024-01-11')
      },
      {
        type: "OUT",
        quantity: 8,
        reason: "Bán hàng",
        reference: "INV-2024-009",
        date: new Date('2024-01-27')
      }
    ]
  },
  {
    productId: "printer_epson_l3150",
    productType: "printer",
    productModel: "Printer",
    currentStock: 14,
    reservedStock: 1,
    availableStock: 13,
    minimumStock: 6,
    maximumStock: 40,
    reorderLevel: 10,
    cost: 3500000,
    location: {
      warehouse: "MAIN",
      shelf: "B01",
      position: "003"
    },
    supplier: {
      name: "Epson Vietnam",
      contact: "epson@vietnam.com",
      leadTime: 7
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 20,
        reason: "Nhập hàng mới",
        reference: "PO-2024-010",
        date: new Date('2024-01-16')
      },
      {
        type: "OUT",
        quantity: 6,
        reason: "Bán hàng",
        reference: "INV-2024-010",
        date: new Date('2024-01-23')
      }
    ]
  },
  {
    productId: "printer_brother_dcp_t720dw",
    productType: "printer",
    productModel: "Printer",
    currentStock: 9,
    reservedStock: 0,
    availableStock: 9,
    minimumStock: 5,
    maximumStock: 25,
    reorderLevel: 8,
    cost: 4200000,
    location: {
      warehouse: "MAIN",
      shelf: "B02",
      position: "001"
    },
    supplier: {
      name: "Brother Vietnam",
      contact: "brother@vietnam.com",
      leadTime: 10
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 12,
        reason: "Nhập hàng mới",
        reference: "PO-2024-011",
        date: new Date('2024-01-09')
      },
      {
        type: "OUT",
        quantity: 3,
        reason: "Bán hàng",
        reference: "INV-2024-011",
        date: new Date('2024-01-24')
      }
    ]
  },
  {
    productId: "printer_hp_laserjet_pro_mfp_m428fdw",
    productType: "printer",
    productModel: "Printer",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    minimumStock: 3,
    maximumStock: 15,
    reorderLevel: 5,
    cost: 8200000,
    location: {
      warehouse: "MAIN",
      shelf: "B02",
      position: "002"
    },
    supplier: {
      name: "HP Vietnam",
      contact: "hp@vietnam.com",
      leadTime: 14
    },
    stockMovements: [
      {
        type: "IN",
        quantity: 5,
        reason: "Nhập hàng mới",
        reference: "PO-2024-012",
        date: new Date('2024-01-03')
      },
      {
        type: "OUT",
        quantity: 5,
        reason: "Bán hàng",
        reference: "INV-2024-012",
        date: new Date('2024-01-30')
      }
    ]
  }
];

// Hàm setup dữ liệu mẫu
const setupSampleData = async () => {
  try {
    console.log('🚀 Bắt đầu setup dữ liệu mẫu...');

    // Xóa dữ liệu cũ
    console.log('🗑️  Xóa dữ liệu cũ...');
    await Laptop.deleteMany({});
    await Printer.deleteMany({});
    await Inventory.deleteMany({});

    // Thêm dữ liệu Laptop
    console.log('💻 Thêm dữ liệu Laptop...');
    for (const laptop of laptopSampleData) {
      await Laptop.create(laptop);
      console.log(`✅ Đã thêm laptop: ${laptop.displayName}`);
    }

    // Thêm dữ liệu Printer
    console.log('🖨️  Thêm dữ liệu Printer...');
    for (const printer of printerSampleData) {
      await Printer.create(printer);
      console.log(`✅ Đã thêm printer: ${printer.type} - ${printer.brand}`);
    }

    // Thêm dữ liệu Inventory
    console.log('📦 Thêm dữ liệu Inventory...');
    for (const inventory of inventorySampleData) {
      await Inventory.create(inventory);
      console.log(`✅ Đã thêm inventory cho: ${inventory.productId} (Stock: ${inventory.currentStock})`);
    }

    console.log('🎉 Setup dữ liệu mẫu hoàn thành!');
    
    // Hiển thị thống kê
    const laptopCount = await Laptop.countDocuments();
    const printerCount = await Printer.countDocuments();
    const inventoryCount = await Inventory.countDocuments();
    
    console.log('\n📊 THỐNG KÊ DỮ LIỆU:');
    console.log(`📱 Laptops: ${laptopCount} sản phẩm`);
    console.log(`🖨️  Printers: ${printerCount} sản phẩm`);
    console.log(`📦 Inventory records: ${inventoryCount} bản ghi`);
    
    // Hiển thị tình trạng tồn kho
    console.log('\n📦 TÌNH TRẠNG TỒN KHO:');
    const inventories = await Inventory.find({}).populate('productId');
    let totalStock = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    
    for (const inv of inventories) {
      totalStock += inv.currentStock;
      if (inv.currentStock === 0) {
        outOfStockCount++;
        console.log(`❌ HẾT HÀNG: ${inv.productId} (${inv.productType})`);
      } else if (inv.currentStock <= inv.minimumStock) {
        lowStockCount++;
        console.log(`⚠️  SẮP HẾT: ${inv.productId} (${inv.currentStock}/${inv.minimumStock})`);
      } else {
        console.log(`✅ ĐỦ HÀNG: ${inv.productId} (${inv.currentStock} sản phẩm)`);
      }
    }
    
    console.log(`\n📊 TỔNG KẾT:`);
    console.log(`📦 Tổng số lượng tồn kho: ${totalStock} sản phẩm`);
    console.log(`⚠️  Sản phẩm sắp hết hàng: ${lowStockCount}`);
    console.log(`❌ Sản phẩm hết hàng: ${outOfStockCount}`);

  } catch (error) {
    console.error('❌ Lỗi khi setup dữ liệu mẫu:', error);
  }
};

// Chạy setup
const main = async () => {
  await connectDB();
  await setupSampleData();
  process.exit(0);
};

// Chạy script
if (require.main === module) {
  main();
}

module.exports = {
  setupSampleData,
  laptopSampleData,
  printerSampleData,
  inventorySampleData
};
