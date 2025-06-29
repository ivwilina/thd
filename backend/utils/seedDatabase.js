const mongoose = require('mongoose');
const { Laptop, Cpu, Brand, Vga, RamSize, StorageSize, ScreenSize, SpecialFeature } = require('../models/Laptop');
const { Printer, PrinterType, PrinterBrand, PrintFeature } = require('../models/Printer');
const Service = require('../models/Service');

const seedDatabase = async () => {
  try {
    // Clear existing data
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
      Service.deleteMany({})
    ]);

    // Seed laptop reference data
    const cpus = await Cpu.insertMany([
      { _id: 'cpu_001', name: 'Intel Core i3-1115G4' },
      { _id: 'cpu_002', name: 'Intel Core i5-1155G7' },
      { _id: 'cpu_003', name: 'Intel Core i5-1235U' },
      { _id: 'cpu_004', name: 'Intel Core i7-1255U' },
      { _id: 'cpu_005', name: 'AMD Ryzen 5 5500U' },
      { _id: 'cpu_006', name: 'AMD Ryzen 7 5700U' }
    ]);

    const brands = await Brand.insertMany([
      { _id: 'brand_001', name: 'Dell' },
      { _id: 'brand_002', name: 'HP' },
      { _id: 'brand_003', name: 'Lenovo' },
      { _id: 'brand_004', name: 'Asus' },
      { _id: 'brand_005', name: 'Acer' }
    ]);

    const vgas = await Vga.insertMany([
      { _id: 'vga_001', name: 'Intel Iris Xe Graphics' },
      { _id: 'vga_002', name: 'Intel UHD Graphics' },
      { _id: 'vga_003', name: 'AMD Radeon Graphics' },
      { _id: 'vga_004', name: 'NVIDIA GeForce MX450' }
    ]);

    const ramSizes = await RamSize.insertMany([
      { _id: 'ram_001', size: 4 },
      { _id: 'ram_002', size: 8 },
      { _id: 'ram_003', size: 16 },
      { _id: 'ram_004', size: 32 }
    ]);

    const storageSizes = await StorageSize.insertMany([
      { _id: 'storage_001', size: 256 },
      { _id: 'storage_002', size: 512 },
      { _id: 'storage_003', size: 1024 },
      { _id: 'storage_004', size: 2048 }
    ]);

    const screenSizes = await ScreenSize.insertMany([
      { _id: 'screen_001', size: 14 },
      { _id: 'screen_002', size: 15 },
      { _id: 'screen_003', size: 17 }
    ]);

    const specialFeatures = await SpecialFeature.insertMany([
      { _id: 'feature_001', name: 'Backlit Keyboard' },
      { _id: 'feature_002', name: 'Fingerprint Reader' },
      { _id: 'feature_003', name: 'Touchscreen' },
      { _id: 'feature_004', name: '2-in-1 Convertible' }
    ]);

    // Seed laptops
    const laptops = await Laptop.insertMany([
      {
        _id: 'laptop_001',
        displayName: 'Laptop Dell Inspiron 15 3520 5310BLK 102F0',
        model: 'Inspiron 15 3520',
        brand: 'brand_001',
        price: 11990000,
        cpu: 'cpu_002',
        vga: 'vga_001',
        ramSize: 'ram_002',
        ramDetails: '8GB DDR4 3200MHz',
        storageSize: 'storage_001',
        storageDetails: '256GB SSD NVMe PCIe',
        screenSize: 'screen_002',
        screenDetails: '15.6" Full HD (1920x1080) Anti-Glare',
        batteryDetails: '3 Cell 41WHr',
        connectionPort: '1x USB 3.2, 2x USB 2.0, 1x HDMI, 1x RJ45',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_001'],
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        images: ['/laptop1.jpg']
      },
      {
        _id: 'laptop_002',
        displayName: 'Laptop Dell Inspiron 15 3520 6H3D73',
        model: 'Inspiron 15 3520',
        brand: 'brand_001',
        price: 17990000,
        cpu: 'cpu_004',
        vga: 'vga_001',
        ramSize: 'ram_003',
        ramDetails: '16GB DDR4 3200MHz',
        storageSize: 'storage_002',
        storageDetails: '512GB SSD NVMe PCIe',
        screenSize: 'screen_002',
        screenDetails: '15.6" Full HD (1920x1080) Anti-Glare',
        batteryDetails: '3 Cell 41WHr',
        connectionPort: '1x USB 3.2, 2x USB 2.0, 1x HDMI, 1x RJ45',
        operationSystem: 'Windows 11 Home',
        specialFeature: ['feature_001', 'feature_002'],
        isNewProduct: true,
        isFeatured: true,
        discount: 10,
        images: ['/laptop2.jpg']
      }
    ]);

    // Seed printer reference data
    const printerTypes = await PrinterType.insertMany([
      { _id: 'printer_type_001', name: 'Laser Printer' },
      { _id: 'printer_type_002', name: 'Inkjet Printer' },
      { _id: 'printer_type_003', name: 'All-in-One' }
    ]);

    const printerBrands = await PrinterBrand.insertMany([
      { _id: 'printer_brand_001', name: 'Canon' },
      { _id: 'printer_brand_002', name: 'HP' },
      { _id: 'printer_brand_003', name: 'Epson' },
      { _id: 'printer_brand_004', name: 'Brother' }
    ]);

    const printFeatures = await PrintFeature.insertMany([
      { _id: 'print_feature_001', name: 'Duplex Printing' },
      { _id: 'print_feature_002', name: 'Wireless Connectivity' },
      { _id: 'print_feature_003', name: 'Mobile Printing' },
      { _id: 'print_feature_004', name: 'Scanning' }
    ]);

    // Seed printers
    const printers = await Printer.insertMany([
      {
        _id: 'printer_001',
        type: 'printer_type_001',
        brand: 'printer_brand_001',
        printType: 'MÁY IN CANON 2900',
        description: 'Máy in laser đơn sắc Canon LBP2900, tốc độ in nhanh',
        price: 2000000,
        isNewProduct: false,
        isFeatured: true,
        discount: 0,
        printFeatures: ['print_feature_002'],
        images: ['/printer1.jpg']
      }
    ]);

    // Seed services
    const services = await Service.insertMany([
      {
        _id: 'service_001',
        name: 'Sửa laptop tại nhà',
        priceMin: 100000,
        priceMax: 500000,
        type: 'repair',
        description: 'Dịch vụ sửa chữa laptop tại nhà với đội ngũ kỹ thuật viên chuyên nghiệp',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_002',
        name: 'Cho thuê laptop',
        priceMin: 500000,
        priceMax: 2000000,
        type: 'rental',
        description: 'Dịch vụ cho thuê laptop theo ngày, tuần, tháng',
        isFeatured: true,
        isActive: true
      },
      {
        _id: 'service_003',
        name: 'Sửa máy in',
        priceMin: 50000,
        priceMax: 300000,
        type: 'repair',
        description: 'Dịch vụ sửa chữa máy in các loại',
        isFeatured: false,
        isActive: true
      }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Seeded ${cpus.length} CPUs`);
    console.log(`Seeded ${brands.length} brands`);
    console.log(`Seeded ${laptops.length} laptops`);
    console.log(`Seeded ${printers.length} printers`);
    console.log(`Seeded ${services.length} services`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
