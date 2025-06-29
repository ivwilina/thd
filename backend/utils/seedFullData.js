const mongoose = require('mongoose');
const { Laptop, Cpu, Brand, Vga, RamSize, StorageSize, ScreenSize, SpecialFeature } = require('../models/Laptop');
const { Printer, PrinterType, PrinterBrand, PrintFeature } = require('../models/Printer');
const Service = require('../models/Service');
const Employee = require('../models/Employee');
require('dotenv').config();

const seedFullDatabase = async () => {
  try {
    console.log('🌱 Starting full database seeding...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/may_tinh_tran_anh', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Laptop.deleteMany({}),
      Cpu.deleteMany({}),
      Brand.deleteMany({}),
      Vga.deleteMany({}),
      RamSize.deleteMany({}),
      StorageSize.deleteMany({}),
      ScreenSize.deleteMany({}),
      SpecialFeature.deleteMany({}),
      Printer.deleteMany({}),
      PrinterType.deleteMany({}),
      PrinterBrand.deleteMany({}),
      PrintFeature.deleteMany({}),
      Service.deleteMany({}),
      Employee.deleteMany({})
    ]);

    // === LAPTOP REFERENCE DATA ===
    console.log('📝 Creating laptop reference data...');
    
    const cpus = await Cpu.insertMany([
      { _id: 'cpu_001', name: 'Intel Core i3-1115G4' },
      { _id: 'cpu_002', name: 'Intel Core i5-1135G7' },
      { _id: 'cpu_003', name: 'Intel Core i5-1235U' },
      { _id: 'cpu_004', name: 'Intel Core i7-1255U' },
      { _id: 'cpu_005', name: 'Intel Core i7-12700H' },
      { _id: 'cpu_006', name: 'AMD Ryzen 5 5500U' },
      { _id: 'cpu_007', name: 'AMD Ryzen 7 5700U' },
      { _id: 'cpu_008', name: 'AMD Ryzen 7 6800H' },
      { _id: 'cpu_009', name: 'Intel Core i9-12900H' },
      { _id: 'cpu_010', name: 'Apple M1' },
      { _id: 'cpu_011', name: 'Apple M2' }
    ]);

    const brands = await Brand.insertMany([
      { _id: 'brand_001', name: 'Dell' },
      { _id: 'brand_002', name: 'HP' },
      { _id: 'brand_003', name: 'Lenovo' },
      { _id: 'brand_004', name: 'Asus' },
      { _id: 'brand_005', name: 'Acer' },
      { _id: 'brand_006', name: 'MSI' },
      { _id: 'brand_007', name: 'Apple' },
      { _id: 'brand_008', name: 'LG' },
      { _id: 'brand_009', name: 'Samsung' }
    ]);

    const vgas = await Vga.insertMany([
      { _id: 'vga_001', name: 'Intel Iris Xe Graphics' },
      { _id: 'vga_002', name: 'Intel UHD Graphics' },
      { _id: 'vga_003', name: 'AMD Radeon Graphics' },
      { _id: 'vga_004', name: 'NVIDIA GeForce MX450' },
      { _id: 'vga_005', name: 'NVIDIA GeForce RTX 3050' },
      { _id: 'vga_006', name: 'NVIDIA GeForce RTX 3060' },
      { _id: 'vga_007', name: 'NVIDIA GeForce RTX 4060' },
      { _id: 'vga_008', name: 'AMD Radeon RX 6600M' },
      { _id: 'vga_009', name: 'Apple M1 Integrated' },
      { _id: 'vga_010', name: 'Apple M2 Integrated' }
    ]);

    const ramSizes = await RamSize.insertMany([
      { _id: 'ram_001', size: 4 },
      { _id: 'ram_002', size: 8 },
      { _id: 'ram_003', size: 16 },
      { _id: 'ram_004', size: 32 },
      { _id: 'ram_005', size: 64 }
    ]);

    const storageSizes = await StorageSize.insertMany([
      { _id: 'storage_001', size: 256 },
      { _id: 'storage_002', size: 512 },
      { _id: 'storage_003', size: 1024 },
      { _id: 'storage_004', size: 2048 },
      { _id: 'storage_005', size: 128 },
      { _id: 'storage_006', size: 500 }
    ]);

    const screenSizes = await ScreenSize.insertMany([
      { _id: 'screen_001', size: 13.3 },
      { _id: 'screen_002', size: 14.0 },
      { _id: 'screen_003', size: 15.6 },
      { _id: 'screen_004', size: 16.0 },
      { _id: 'screen_005', size: 17.3 }
    ]);

    const specialFeatures = await SpecialFeature.insertMany([
      { _id: 'feature_001', name: 'Gaming' },
      { _id: 'feature_002', name: 'Business' },
      { _id: 'feature_003', name: 'Ultrabook' },
      { _id: 'feature_004', name: 'Touchscreen' },
      { _id: 'feature_005', name: '2-in-1 Convertible' },
      { _id: 'feature_006', name: 'Creator' },
      { _id: 'feature_007', name: 'Student' },
      { _id: 'feature_008', name: 'Workstation' }
    ]);

    // === PRINTER REFERENCE DATA ===
    console.log('🖨️ Creating printer reference data...');
    
    const printerTypes = await PrinterType.insertMany([
      { _id: 'printer_type_001', name: 'Laser' },
      { _id: 'printer_type_002', name: 'Inkjet' },
      { _id: 'printer_type_003', name: 'All-in-One' },
      { _id: 'printer_type_004', name: 'Photo Printer' },
      { _id: 'printer_type_005', name: 'Label Printer' }
    ]);

    const printerBrands = await PrinterBrand.insertMany([
      { _id: 'printer_brand_001', name: 'Canon' },
      { _id: 'printer_brand_002', name: 'HP' },
      { _id: 'printer_brand_003', name: 'Epson' },
      { _id: 'printer_brand_004', name: 'Brother' },
      { _id: 'printer_brand_005', name: 'Samsung' },
      { _id: 'printer_brand_006', name: 'Xerox' }
    ]);

    const printFeatures = await PrintFeature.insertMany([
      { _id: 'print_feature_001', name: 'WiFi' },
      { _id: 'print_feature_002', name: 'Duplex' },
      { _id: 'print_feature_003', name: 'Scan' },
      { _id: 'print_feature_004', name: 'Copy' },
      { _id: 'print_feature_005', name: 'Fax' },
      { _id: 'print_feature_006', name: 'ADF' },
      { _id: 'print_feature_007', name: 'Color' },
      { _id: 'print_feature_008', name: 'Mobile Print' }
    ]);

    // === LAPTOPS DATA ===
    console.log('💻 Creating laptop products...');
    
    const laptops = await Laptop.insertMany([
      // NEW LAPTOPS - Dell
      {
        _id: 'laptop_001',
        displayName: 'Laptop Dell Inspiron 15 3520 N5I5122W1',
        model: 'Inspiron 15 3520',
        brand: 'brand_001',
        price: 13990000,
        cpu: 'cpu_002',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_001',
        storageDetails: '256GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) Anti-Glare',
        batteryDetails: '41Wh, 3-cell Lithium-ion',
        connectionPort: '1x USB 3.2 Gen 1, 2x USB 2.0, 1x HDMI 1.4, 1x Audio combo, WiFi 6, Bluetooth 5.1',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_002', 'feature_007'],
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        images: ['/laptop_dell_1_1.jpg', '/laptop_dell_1_2.jpg', '/laptop_dell_1_3.jpg']
      },
      {
        _id: 'laptop_002',
        displayName: 'Laptop Dell Inspiron 16 5630 N6I7110W1',
        model: 'Inspiron 16 5630',
        brand: 'brand_001',
        price: 19990000,
        cpu: 'cpu_004',
        vga: 'vga_001',
        ramSize: 'ram_003',
        ramDetails: '16GB DDR4 3200MHz (2x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_004',
        screenDetails: '16.0" Full HD+ (1920x1200) IPS',
        batteryDetails: '54Wh, 4-cell Lithium-ion',
        connectionPort: '2x USB 3.2 Gen 1, 1x USB-C, 1x HDMI 2.0, WiFi 6E, Bluetooth 5.2',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_002', 'feature_003'],
        isNewProduct: true,
        isFeatured: true,
        discount: 8,
        images: ['/laptop_dell_2_1.jpg', '/laptop_dell_2_2.jpg', '/laptop_dell_2_3.jpg']
      },
      
      // NEW LAPTOPS - HP
      {
        _id: 'laptop_003',
        displayName: 'Laptop HP Pavilion 15-eg3081TU 7C0Q4PA',
        model: 'Pavilion 15-eg3081TU',
        brand: 'brand_002',
        price: 16490000,
        cpu: 'cpu_003',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) IPS Micro-edge',
        batteryDetails: '41Wh, 3-cell Lithium-ion',
        connectionPort: '2x USB 3.0, 1x USB-C, 1x HDMI 2.0, WiFi 6, Bluetooth 5.3',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_002', 'feature_004'],
        isNewProduct: true,
        isFeatured: false,
        discount: 5,
        images: ['/laptop_hp_1_1.jpg', '/laptop_hp_1_2.jpg', '/laptop_hp_1_3.jpg']
      },
      {
        _id: 'laptop_004',
        displayName: 'Laptop HP ENVY x360 13-bf0033dx 6Z6J4UA',
        model: 'ENVY x360 13-bf0033dx',
        brand: 'brand_002',
        price: 24990000,
        cpu: 'cpu_004',
        vga: 'vga_001',
        ramSize: 'ram_003',
        ramDetails: '16GB LPDDR4x 4266MHz',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_001',
        screenDetails: '13.3" 2.5K (2560x1600) OLED Touchscreen',
        batteryDetails: '66Wh, 4-cell Lithium-ion',
        connectionPort: '2x USB-C, 1x USB 3.0, WiFi 6E, Bluetooth 5.3',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_004', 'feature_005', 'feature_003'],
        isNewProduct: true,
        isFeatured: true,
        discount: 12,
        images: ['/laptop_hp_2_1.jpg', '/laptop_hp_2_2.jpg', '/laptop_hp_2_3.jpg']
      },

      // NEW LAPTOPS - Lenovo
      {
        _id: 'laptop_005',
        displayName: 'Laptop Lenovo ThinkPad E14 Gen 4 21E3S00600',
        model: 'ThinkPad E14 Gen 4',
        brand: 'brand_003',
        price: 18990000,
        cpu: 'cpu_003',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_002',
        screenDetails: '14.0" Full HD (1920x1080) IPS Anti-Glare',
        batteryDetails: '45Wh, 3-cell Lithium-ion',
        connectionPort: '2x USB 3.2, 1x USB-C, 1x HDMI 2.0, WiFi 6, Bluetooth 5.1',
        operationSystem: 'Windows 11 Pro',
        specialFeature: ['feature_002', 'feature_008'],
        isNewProduct: true,
        isFeatured: false,
        discount: 7,
        images: ['/laptop_lenovo_1_1.jpg', '/laptop_lenovo_1_2.jpg', '/laptop_lenovo_1_3.jpg']
      },
      {
        _id: 'laptop_006',
        displayName: 'Laptop Lenovo IdeaPad Gaming 3 15ACH6 82K2024LVN',
        model: 'IdeaPad Gaming 3 15ACH6',
        brand: 'brand_003',
        price: 22990000,
        cpu: 'cpu_007',
        vga: 'vga_005',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) IPS 120Hz',
        batteryDetails: '45Wh, 3-cell Lithium-ion',
        connectionPort: '3x USB 3.2, 1x USB-C, 1x HDMI 2.1, WiFi 6, Bluetooth 5.1',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_001'],
        isNewProduct: true,
        isFeatured: true,
        discount: 15,
        images: ['/laptop_lenovo_gaming_1.jpg', '/laptop_lenovo_gaming_2.jpg', '/laptop_lenovo_gaming_3.jpg']
      },

      // NEW LAPTOPS - Asus
      {
        _id: 'laptop_007',
        displayName: 'Laptop Asus VivoBook 15 X1504ZA-NJ582W',
        model: 'VivoBook 15 X1504ZA',
        brand: 'brand_004',
        price: 14990000,
        cpu: 'cpu_003',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) Anti-Glare',
        batteryDetails: '42Wh, 3-cell Lithium-ion',
        connectionPort: '1x USB 3.2, 2x USB 2.0, 1x USB-C, 1x HDMI, WiFi 6, Bluetooth 5.0',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_002', 'feature_007'],
        isNewProduct: true,
        isFeatured: false,
        discount: 8,
        images: ['/laptop_asus_1_1.jpg', '/laptop_asus_1_2.jpg', '/laptop_asus_1_3.jpg']
      },
      {
        _id: 'laptop_008',
        displayName: 'Laptop Asus TUF Gaming F15 FX507ZC4-HN074W',
        model: 'TUF Gaming F15 FX507ZC4',
        brand: 'brand_004',
        price: 26990000,
        cpu: 'cpu_005',
        vga: 'vga_006',
        ramSize: 'ram_003',
        ramDetails: '16GB DDR4 3200MHz (2x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) IPS 144Hz',
        batteryDetails: '90Wh, 4-cell Lithium-ion',
        connectionPort: '3x USB 3.2, 1x USB-C, 1x HDMI 2.1, WiFi 6, Bluetooth 5.2',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_001'],
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        images: ['/laptop_asus_gaming_1.jpg', '/laptop_asus_gaming_2.jpg', '/laptop_asus_gaming_3.jpg']
      },

      // NEW LAPTOPS - MSI
      {
        _id: 'laptop_009',
        displayName: 'Laptop MSI Gaming GF63 Thin 11UC-1228VN',
        model: 'Gaming GF63 Thin 11UC',
        brand: 'brand_006',
        price: 19990000,
        cpu: 'cpu_002',
        vga: 'vga_005',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz (1x8GB)',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_003',
        screenDetails: '15.6" Full HD (1920x1080) IPS 144Hz',
        batteryDetails: '51Wh, 3-cell Lithium-ion',
        connectionPort: '3x USB 3.2, 1x USB-C, 1x HDMI, WiFi 6, Bluetooth 5.2',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_001'],
        isNewProduct: true,
        isFeatured: false,
        discount: 12,
        images: ['/laptop_msi_1_1.jpg', '/laptop_msi_1_2.jpg', '/laptop_msi_1_3.jpg']
      },
      {
        _id: 'laptop_010',
        displayName: 'Laptop MSI Creator Z16P B12UGST-046VN',
        model: 'Creator Z16P B12UGST',
        brand: 'brand_006',
        price: 52990000,
        cpu: 'cpu_009',
        vga: 'vga_007',
        ramSize: 'ram_004',
        ramDetails: '32GB DDR5 4800MHz (2x16GB)',
        storageSize: 'storage_003',
        storageDetails: '1TB SSD NVMe PCIe Gen4',
        screenSize: 'screen_004',
        screenDetails: '16.0" QHD+ (2560x1600) Mini LED 165Hz',
        batteryDetails: '90Wh, 4-cell Lithium-ion',
        connectionPort: '2x USB 3.2, 2x USB-C, 1x HDMI 2.1, WiFi 6E, Bluetooth 5.3',
        operationSystem: 'Windows 11 Pro',
        specialFeature: ['feature_006', 'feature_008'],
        isNewProduct: true,
        isFeatured: true,
        discount: 8,
        images: ['/laptop_msi_creator_1.jpg', '/laptop_msi_creator_2.jpg', '/laptop_msi_creator_3.jpg']
      },

      // NEW LAPTOPS - Apple
      {
        _id: 'laptop_011',
        displayName: 'MacBook Air 13 inch M1 2020 8GB/256GB',
        model: 'MacBook Air M1 2020',
        brand: 'brand_007',
        price: 23990000,
        cpu: 'cpu_010',
        vga: 'vga_009',
        ramSize: 'ram_002',
        ramDetails: '8GB Unified Memory',
        storageSize: 'storage_001',
        storageDetails: '256GB SSD',
        screenSize: 'screen_001',
        screenDetails: '13.3" Retina (2560x1600) IPS True Tone',
        batteryDetails: '49.9Wh, up to 18 hours',
        connectionPort: '2x USB-C Thunderbolt, WiFi 6, Bluetooth 5.0',
        operationSystem: 'macOS',
        specialFeature: ['feature_003', 'feature_002'],
        isNewProduct: true,
        isFeatured: true,
        discount: 15,
        images: ['/macbook_air_m1_1.jpg', '/macbook_air_m1_2.jpg', '/macbook_air_m1_3.jpg']
      },
      {
        _id: 'laptop_012',
        displayName: 'MacBook Pro 14 inch M2 Pro 2023 16GB/512GB',
        model: 'MacBook Pro M2 Pro 2023',
        brand: 'brand_007',
        price: 54990000,
        cpu: 'cpu_011',
        vga: 'vga_010',
        ramSize: 'ram_003',
        ramDetails: '16GB Unified Memory',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD',
        screenSize: 'screen_002',
        screenDetails: '14.2" Liquid Retina XDR (3024x1964) ProMotion',
        batteryDetails: '70Wh, up to 18 hours',
        connectionPort: '3x USB-C Thunderbolt 4, 1x HDMI, 1x SDXC, WiFi 6E, Bluetooth 5.3',
        operationSystem: 'macOS',
        specialFeature: ['feature_006', 'feature_008'],
        isNewProduct: true,
        isFeatured: true,
        discount: 5,
        images: ['/macbook_pro_m2_1.jpg', '/macbook_pro_m2_2.jpg', '/macbook_pro_m2_3.jpg']
      },

      // USED LAPTOPS
      {
        _id: 'laptop_013',
        displayName: 'Laptop Dell Latitude 7420 Cũ (i5-1135G7/8GB/256GB)',
        model: 'Latitude 7420',
        brand: 'brand_001',
        price: 12990000,
        cpu: 'cpu_002',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz',
        storageSize: 'storage_001',
        storageDetails: '256GB SSD NVMe',
        screenSize: 'screen_002',
        screenDetails: '14.0" Full HD (1920x1080) IPS',
        batteryDetails: '63Wh, 4-cell',
        connectionPort: '2x USB 3.2, 1x USB-C, 1x HDMI, WiFi 6, Bluetooth 5.1',
        operationSystem: 'Windows 10 Pro',
        specialFeature: ['feature_002'],
        isNewProduct: false,
        isFeatured: false,
        discount: 20,
        images: ['/laptop_dell_used_1.jpg', '/laptop_dell_used_2.jpg', '/laptop_dell_used_3.jpg']
      },
      {
        _id: 'laptop_014',
        displayName: 'Laptop HP EliteBook 840 G8 Cũ (i7-1165G7/16GB/512GB)',
        model: 'EliteBook 840 G8',
        brand: 'brand_002',
        price: 19990000,
        cpu: 'cpu_004',
        vga: 'vga_001',
        ramSize: 'ram_003',
        ramDetails: '16GB DDR4 3200MHz',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe',
        screenSize: 'screen_002',
        screenDetails: '14.0" Full HD (1920x1080) IPS',
        batteryDetails: '53Wh, 3-cell',
        connectionPort: '2x USB 3.1, 2x USB-C, 1x HDMI, WiFi 6, Bluetooth 5.0',
        operationSystem: 'Windows 10 Pro',
        specialFeature: ['feature_002', 'feature_008'],
        isNewProduct: false,
        isFeatured: true,
        discount: 25,
        images: ['/laptop_hp_used_1.jpg', '/laptop_hp_used_2.jpg', '/laptop_hp_used_3.jpg']
      },
      {
        _id: 'laptop_015',
        displayName: 'Laptop Lenovo ThinkPad T14 Gen 2 Cũ (i5-1135G7/8GB/256GB)',
        model: 'ThinkPad T14 Gen 2',
        brand: 'brand_003',
        price: 14990000,
        cpu: 'cpu_002',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz',
        storageSize: 'storage_001',
        storageDetails: '256GB SSD NVMe',
        screenSize: 'screen_002',
        screenDetails: '14.0" Full HD (1920x1080) IPS',
        batteryDetails: '50Wh, 3-cell',
        connectionPort: '2x USB 3.1, 2x USB-C, 1x HDMI, WiFi 6, Bluetooth 5.1',
        operationSystem: 'Windows 10 Pro',
        specialFeature: ['feature_002'],
        isNewProduct: false,
        isFeatured: false,
        discount: 18,
        images: ['/laptop_thinkpad_used_1.jpg', '/laptop_thinkpad_used_2.jpg', '/laptop_thinkpad_used_3.jpg']
      }
    ]);

    // === PRINTERS DATA ===
    console.log('🖨️ Creating printer products...');
    
    const printers = await Printer.insertMany([
      // NEW PRINTERS - Canon
      {
        _id: 'printer_001',
        type: 'printer_type_002',
        brand: 'printer_brand_001',
        printType: 'Color Inkjet',
        description: 'Máy in phun màu Canon PIXMA G3010 - In, Scan, Copy, WiFi',
        price: 4290000,
        isNewProduct: true,
        isFeatured: true,
        discount: 8,
        printFeatures: ['print_feature_001', 'print_feature_003', 'print_feature_004', 'print_feature_007'],
        images: ['/printer_canon_g3010_1.jpg', '/printer_canon_g3010_2.jpg', '/printer_canon_g3010_3.jpg']
      },
      {
        _id: 'printer_002',
        type: 'printer_type_001',
        brand: 'printer_brand_001',
        printType: 'Monochrome Laser',
        description: 'Máy in laser đơn sắc Canon LBP2900 - Tốc độ in nhanh, tiết kiệm',
        price: 2890000,
        isNewProduct: true,
        isFeatured: false,
        discount: 5,
        printFeatures: ['print_feature_002'],
        images: ['/printer_canon_lbp2900_1.jpg', '/printer_canon_lbp2900_2.jpg', '/printer_canon_lbp2900_3.jpg']
      },
      {
        _id: 'printer_003',
        type: 'printer_type_003',
        brand: 'printer_brand_001',
        printType: 'Color All-in-One',
        description: 'Máy in đa chức năng Canon PIXMA TR4570S - In, Scan, Copy, Fax, WiFi',
        price: 3590000,
        isNewProduct: true,
        isFeatured: true,
        discount: 12,
        printFeatures: ['print_feature_001', 'print_feature_003', 'print_feature_004', 'print_feature_005', 'print_feature_007'],
        images: ['/printer_canon_tr4570s_1.jpg', '/printer_canon_tr4570s_2.jpg', '/printer_canon_tr4570s_3.jpg']
      },

      // NEW PRINTERS - HP
      {
        _id: 'printer_004',
        type: 'printer_type_002',
        brand: 'printer_brand_002',
        printType: 'Color Inkjet',
        description: 'Máy in phun màu HP DeskJet 2320 - Nhỏ gọn, phù hợp gia đình',
        price: 1890000,
        isNewProduct: true,
        isFeatured: false,
        discount: 10,
        printFeatures: ['print_feature_007'],
        images: ['/printer_hp_2320_1.jpg', '/printer_hp_2320_2.jpg', '/printer_hp_2320_3.jpg']
      },
      {
        _id: 'printer_005',
        type: 'printer_type_003',
        brand: 'printer_brand_002',
        printType: 'Color All-in-One',
        description: 'Máy in đa chức năng HP DeskJet Plus 4120 - In, Scan, Copy, WiFi',
        price: 2990000,
        isNewProduct: true,
        isFeatured: true,
        discount: 15,
        printFeatures: ['print_feature_001', 'print_feature_003', 'print_feature_004', 'print_feature_007', 'print_feature_008'],
        images: ['/printer_hp_4120_1.jpg', '/printer_hp_4120_2.jpg', '/printer_hp_4120_3.jpg']
      },
      {
        _id: 'printer_006',
        type: 'printer_type_001',
        brand: 'printer_brand_002',
        printType: 'Monochrome Laser',
        description: 'Máy in laser HP LaserJet Pro M15w - Compact, WiFi, tiết kiệm toner',
        price: 3490000,
        isNewProduct: true,
        isFeatured: false,
        discount: 8,
        printFeatures: ['print_feature_001'],
        images: ['/printer_hp_m15w_1.jpg', '/printer_hp_m15w_2.jpg', '/printer_hp_m15w_3.jpg']
      },

      // NEW PRINTERS - Epson
      {
        _id: 'printer_007',
        type: 'printer_type_002',
        brand: 'printer_brand_003',
        printType: 'Color Inkjet',
        description: 'Máy in phun màu Epson L3210 - EcoTank, tiết kiệm mực in',
        price: 3990000,
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        printFeatures: ['print_feature_003', 'print_feature_004', 'print_feature_007'],
        images: ['/printer_epson_l3210_1.jpg', '/printer_epson_l3210_2.jpg', '/printer_epson_l3210_3.jpg']
      },
      {
        _id: 'printer_008',
        type: 'printer_type_003',
        brand: 'printer_brand_003',
        printType: 'Color All-in-One',
        description: 'Máy in đa chức năng Epson L6290 - EcoTank, A4, WiFi, Duplex',
        price: 8990000,
        isNewProduct: true,
        isFeatured: true,
        discount: 12,
        printFeatures: ['print_feature_001', 'print_feature_002', 'print_feature_003', 'print_feature_004', 'print_feature_006', 'print_feature_007'],
        images: ['/printer_epson_l6290_1.jpg', '/printer_epson_l6290_2.jpg', '/printer_epson_l6290_3.jpg']
      },

      // NEW PRINTERS - Brother
      {
        _id: 'printer_009',
        type: 'printer_type_001',
        brand: 'printer_brand_004',
        printType: 'Monochrome Laser',
        description: 'Máy in laser Brother HL-L2321D - Duplex, tốc độ cao, văn phòng',
        price: 4290000,
        isNewProduct: true,
        isFeatured: false,
        discount: 7,
        printFeatures: ['print_feature_002'],
        images: ['/printer_brother_l2321d_1.jpg', '/printer_brother_l2321d_2.jpg', '/printer_brother_l2321d_3.jpg']
      },
      {
        _id: 'printer_010',
        type: 'printer_type_003',
        brand: 'printer_brand_004',
        printType: 'Monochrome All-in-One',
        description: 'Máy in đa chức năng Brother MFC-L2701DW - In, Scan, Copy, Fax, WiFi, Duplex',
        price: 7490000,
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        printFeatures: ['print_feature_001', 'print_feature_002', 'print_feature_003', 'print_feature_004', 'print_feature_005', 'print_feature_006'],
        images: ['/printer_brother_l2701dw_1.jpg', '/printer_brother_l2701dw_2.jpg', '/printer_brother_l2701dw_3.jpg']
      },

      // USED PRINTERS
      {
        _id: 'printer_011',
        type: 'printer_type_001',
        brand: 'printer_brand_001',
        printType: 'Monochrome Laser',
        description: 'Máy in laser Canon LBP6030 Cũ - Máy đẹp, hoạt động tốt',
        price: 1590000,
        isNewProduct: false,
        isFeatured: false,
        discount: 20,
        printFeatures: [],
        images: ['/printer_canon_used_1.jpg', '/printer_canon_used_2.jpg', '/printer_canon_used_3.jpg']
      },
      {
        _id: 'printer_012',
        type: 'printer_type_002',
        brand: 'printer_brand_002',
        printType: 'Color Inkjet',
        description: 'Máy in HP DeskJet 1112 Cũ - Máy còn mới, in màu đẹp',
        price: 990000,
        isNewProduct: false,
        isFeatured: false,
        discount: 25,
        printFeatures: ['print_feature_007'],
        images: ['/printer_hp_used_1.jpg', '/printer_hp_used_2.jpg', '/printer_hp_used_3.jpg']
      },
      {
        _id: 'printer_013',
        type: 'printer_type_003',
        brand: 'printer_brand_003',
        printType: 'Color All-in-One',
        description: 'Máy in đa chức năng Epson L565 Cũ - EcoTank, còn mới 95%',
        price: 4990000,
        isNewProduct: false,
        isFeatured: true,
        discount: 30,
        printFeatures: ['print_feature_001', 'print_feature_003', 'print_feature_004', 'print_feature_005', 'print_feature_007'],
        images: ['/printer_epson_used_1.jpg', '/printer_epson_used_2.jpg', '/printer_epson_used_3.jpg']
      }
    ]);

    // === SERVICES DATA ===
    console.log('🛠️ Creating services...');
    
    const services = await Service.insertMany([
      // REPAIR SERVICES - Sửa chữa máy tính
      {
        _id: 'service_001',
        name: 'Sửa Máy Tính Bật Không Lên Nguồn',
        description: 'Chẩn đoán và sửa chữa các lỗi nguồn máy tính, thay thế linh kiện hỏng',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_002',
        name: 'Sửa Máy Tính kêu bit bít',
        description: 'Xử lý tiếng kêu bất thường từ quạt tản nhiệt, ổ cứng hoặc các linh kiện khác',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_003',
        name: 'Sửa Máy Tính Bị Đen Màn Hình',
        description: 'Khắc phục lỗi màn hình đen, kiểm tra card đồ họa, cable kết nối',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_004',
        name: 'Sửa Máy Tính Đậm Xanh Màn Hình',
        description: 'Xử lý lỗi Blue Screen of Death (BSOD), cài đặt lại driver, kiểm tra RAM',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_005',
        name: 'Sửa Máy Tính Bị Đơ',
        description: 'Khắc phục tình trạng máy tính bị treo, đơ, không phản hồi',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_006',
        name: 'Sửa Máy Tính Không Vào Được Mạng',
        description: 'Sửa chữa lỗi kết nối mạng, cài đặt driver mạng, kiểm tra card mạng',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_007',
        name: 'Sửa Máy Tính Cần Giật Lắc',
        description: 'Xử lý tình trạng máy tính cần giật, lắc mới chạy được',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_008',
        name: 'Sửa Máy Tính Không Chơi Được Game',
        description: 'Tối ưu hóa máy tính cho gaming, cập nhật driver, kiểm tra nhiệt độ',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_009',
        name: 'Sửa Máy Tính Không In Được',
        description: 'Khắc phục lỗi kết nối máy in, cài đặt driver máy in',
        priceMin: 100000,
        priceMax: 200000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_010',
        name: 'Sửa Máy Tính Qua Ultravew, Teamviewer',
        description: 'Hỗ trợ sửa chữa từ xa qua phần mềm điều khiển máy tính',
        priceMin: 0,
        priceMax: 0,
        type: 'consultation',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_011',
        name: 'Sửa Máy Tính Nhấng Màn',
        description: 'Khắc phục tình trạng màn hình nhấp nháy, không ổn định',
        priceMin: 100000,
        priceMax: 300000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_012',
        name: 'Sửa Máy Tính Nhiều Màn Hình',
        description: 'Cài đặt và sửa chữa hệ thống nhiều màn hình',
        priceMin: 100000,
        priceMax: 300000,
        type: 'installation',
        isFeatured: false,
        isActive: true
      },

      // REPAIR SERVICES - Sửa laptop
      {
        _id: 'service_013',
        name: 'Sửa Màn Hình Bật Không Lên Hình',
        description: 'Sửa chữa màn hình laptop không hiển thị, thay thế màn hình LCD/LED',
        priceMin: 100000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_014',
        name: 'Sửa Laptop Bật Không Lên Nguồn',
        description: 'Chẩn đoán và sửa chữa nguồn laptop, thay thế adapter, pin',
        priceMin: 200000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_015',
        name: 'Thay Chipset Trên Mẹn',
        description: 'Thay thế chipset trên bo mạch chủ laptop',
        priceMin: 200000,
        priceMax: 600000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },

      // MAINTENANCE SERVICES
      {
        _id: 'service_016',
        name: 'Sửa Mền Máy Tính',
        description: 'Cài đặt lại hệ điều hành, phần mềm, diệt virus',
        priceMin: 100000,
        priceMax: 400000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_017',
        name: 'Nâng Cấp Ram Máy Tính',
        description: 'Tư vấn và nâng cấp RAM cho máy tính, laptop',
        priceMin: 200000,
        priceMax: 500000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_018',
        name: 'Nâng Cấp Ổ Cứng SSD',
        description: 'Nâng cấp từ ổ cứng HDD lên SSD, clone dữ liệu',
        priceMin: 400000,
        priceMax: 800000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_019',
        name: 'Nâng Cấp Chip Máy Tính',
        description: 'Tư vấn và nâng cấp CPU cho máy tính desktop',
        priceMin: 0,
        priceMax: 0,
        type: 'consultation',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_020',
        name: 'Sửa Máy Tính Chạy Ngắt',
        description: 'Khắc phục tình trạng máy tính tự động tắt, restart',
        priceMin: 200000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },

      // PRINTER SERVICES
      {
        _id: 'service_021',
        name: 'Đổ Mực Máy In Canon',
        description: 'Đổ mực máy in Canon các loại: đen, màu, chính hãng và tương thích',
        priceMin: 50000,
        priceMax: 200000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_022',
        name: 'Đổ Mực Máy In HP',
        description: 'Đổ mực máy in HP các loại cartridge, toner',
        priceMin: 50000,
        priceMax: 200000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_023',
        name: 'Đổ Mực Máy In Epson',
        description: 'Đổ mực máy in Epson, EcoTank, L series',
        priceMin: 50000,
        priceMax: 200000,
        type: 'maintenance',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_024',
        name: 'Đổ Mực Máy In Brother',
        description: 'Đổ mực máy in Brother laser và inkjet',
        priceMin: 50000,
        priceMax: 200000,
        type: 'maintenance',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_025',
        name: 'Sửa Máy In Bị Kẹt Giấy',
        description: 'Khắc phục tình trạng kẹt giấy, vệ sinh máy in',
        priceMin: 100000,
        priceMax: 300000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_026',
        name: 'Sửa Máy In Không Nhận Cartridge',
        description: 'Sửa chữa lỗi máy in không nhận mực, cartridge',
        priceMin: 150000,
        priceMax: 400000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_027',
        name: 'Sửa Máy In Không Kết Nối WiFi',
        description: 'Cài đặt và sửa chữa kết nối WiFi cho máy in',
        priceMin: 100000,
        priceMax: 250000,
        type: 'repair',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_028',
        name: 'Vệ Sinh Máy In Chuyên Nghiệp',
        description: 'Vệ sinh toàn bộ máy in, đầu phun, con lăn',
        priceMin: 150000,
        priceMax: 300000,
        type: 'maintenance',
        isFeatured: false,
        isActive: true
      },

      // INSTALLATION SERVICES
      {
        _id: 'service_029',
        name: 'Cài Đặt Windows + Office Bản Quyền',
        description: 'Cài đặt Windows 10/11 và Microsoft Office bản quyền',
        priceMin: 200000,
        priceMax: 500000,
        type: 'installation',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_030',
        name: 'Cài Đặt Phần Mềm Chuyên Dụng',
        description: 'Cài đặt phần mềm thiết kế, kế toán, chuyên ngành',
        priceMin: 150000,
        priceMax: 400000,
        type: 'installation',
        isFeatured: false,
        isActive: true
      },
      {
        _id: 'service_031',
        name: 'Cài Đặt Mạng Lan Cho Văn Phòng',
        description: 'Thiết kế và lắp đặt hệ thống mạng LAN cho văn phòng',
        priceMin: 500000,
        priceMax: 2000000,
        type: 'installation',
        isFeatured: true,
        isActive: true
      },

      // CONSULTATION SERVICES
      {
        _id: 'service_032',
        name: 'Tư Vấn Cấu Hình Máy Tính',
        description: 'Tư vấn cấu hình máy tính phù hợp với nhu cầu và ngân sách',
        priceMin: 0,
        priceMax: 100000,
        type: 'consultation',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_033',
        name: 'Tư Vấn Giải Pháp IT Cho Doanh Nghiệp',
        description: 'Tư vấn toàn diện về hệ thống IT cho doanh nghiệp',
        priceMin: 500000,
        priceMax: 2000000,
        type: 'consultation',
        isFeatured: false,
        isActive: true
      },

      // RENTAL SERVICES
      {
        _id: 'service_034',
        name: 'Cho Thuê Laptop Theo Ngày',
        description: 'Cho thuê laptop các loại theo ngày, tuần, tháng',
        priceMin: 200000,
        priceMax: 500000,
        type: 'rental',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_035',
        name: 'Cho Thuê Máy In Sự Kiện',
        description: 'Cho thuê máy in cho các sự kiện, hội nghị',
        priceMin: 300000,
        priceMax: 800000,
        type: 'rental',
        isFeatured: false,
        isActive: true
      }
    ]);

    // === EMPLOYEES DATA ===
    console.log('👥 Creating employees...');
    
    // Create employees one by one to trigger pre-save hooks
    const employeeData = [
      {
        _id: 'EMP001',
        name: 'Nguyễn Văn Quản Trị',
        phoneNumber: '0901234567',
        email: 'admin@maytinh.com',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        isActive: true
      },
      {
        _id: 'EMP002',
        name: 'Trần Thị Quản Lý',
        phoneNumber: '0907654321',
        email: 'manager@maytinh.com',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        username: 'manager',
        password: 'manager123',
        role: 'manager',
        isActive: true
      },
      {
        _id: 'EMP003',
        name: 'Lê Văn Nhân Viên',
        phoneNumber: '0909876543',
        email: 'nhanvien@maytinh.com',
        address: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
        username: 'nhanvien',
        password: 'nhanvien123',
        role: 'staff',
        isActive: true
      },
      {
        _id: 'EMP004',
        name: 'Phạm Thị Chăm Sóc',
        phoneNumber: '0912345678',
        email: 'chamsoc@maytinh.com',
        address: '321 Đường Hai Bà Trưng, Quận 1, TP.HCM',
        username: 'chamsoc',
        password: 'chamsoc123',
        role: 'staff',
        isActive: true
      },
      {
        _id: 'EMP005', 
        name: 'Hoàng Văn Kỹ Thuật',
        phoneNumber: '0923456789',
        email: 'kythuat@maytinh.com',
        address: '654 Đường Điện Biên Phủ, Quận 10, TP.HCM',
        username: 'kythuat',
        password: 'kythuat123',
        role: 'staff',
        isActive: true
      }
    ];

    const employees = [];
    for (const empData of employeeData) {
      const employee = new Employee(empData);
      await employee.save();
      employees.push(employee);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Created:
    - ${cpus.length} CPUs
    - ${brands.length} Brands  
    - ${vgas.length} VGAs
    - ${ramSizes.length} RAM Sizes
    - ${storageSizes.length} Storage Sizes
    - ${screenSizes.length} Screen Sizes
    - ${specialFeatures.length} Special Features
    - ${printerTypes.length} Printer Types
    - ${printerBrands.length} Printer Brands
    - ${printFeatures.length} Print Features
    - ${laptops.length} Laptops (New: ${laptops.filter(l => l.isNewProduct).length}, Used: ${laptops.filter(l => !l.isNewProduct).length})
    - ${printers.length} Printers (New: ${printers.filter(p => p.isNewProduct).length}, Used: ${printers.filter(p => !p.isNewProduct).length})
    - ${services.length} Services
    - ${employees.length} Employees`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Database disconnected');
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedFullDatabase();
}

module.exports = seedFullDatabase;
