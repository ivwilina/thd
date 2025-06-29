const fs = require('fs');
const path = require('path');

const createPlaceholderImages = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // List of image files needed
  const imageFiles = [
    // Dell Laptops
    'laptop_dell_1_1.jpg', 'laptop_dell_1_2.jpg', 'laptop_dell_1_3.jpg',
    'laptop_dell_2_1.jpg', 'laptop_dell_2_2.jpg', 'laptop_dell_2_3.jpg',
    'laptop_dell_used_1.jpg', 'laptop_dell_used_2.jpg', 'laptop_dell_used_3.jpg',
    
    // HP Laptops
    'laptop_hp_1_1.jpg', 'laptop_hp_1_2.jpg', 'laptop_hp_1_3.jpg',
    'laptop_hp_2_1.jpg', 'laptop_hp_2_2.jpg', 'laptop_hp_2_3.jpg',
    'laptop_hp_used_1.jpg', 'laptop_hp_used_2.jpg', 'laptop_hp_used_3.jpg',
    
    // Lenovo Laptops
    'laptop_lenovo_1_1.jpg', 'laptop_lenovo_1_2.jpg', 'laptop_lenovo_1_3.jpg',
    'laptop_lenovo_gaming_1.jpg', 'laptop_lenovo_gaming_2.jpg', 'laptop_lenovo_gaming_3.jpg',
    'laptop_thinkpad_used_1.jpg', 'laptop_thinkpad_used_2.jpg', 'laptop_thinkpad_used_3.jpg',
    
    // Asus Laptops
    'laptop_asus_1_1.jpg', 'laptop_asus_1_2.jpg', 'laptop_asus_1_3.jpg',
    'laptop_asus_gaming_1.jpg', 'laptop_asus_gaming_2.jpg', 'laptop_asus_gaming_3.jpg',
    
    // MSI Laptops
    'laptop_msi_1_1.jpg', 'laptop_msi_1_2.jpg', 'laptop_msi_1_3.jpg',
    'laptop_msi_creator_1.jpg', 'laptop_msi_creator_2.jpg', 'laptop_msi_creator_3.jpg',
    
    // Apple MacBooks
    'macbook_air_m1_1.jpg', 'macbook_air_m1_2.jpg', 'macbook_air_m1_3.jpg',
    'macbook_pro_m2_1.jpg', 'macbook_pro_m2_2.jpg', 'macbook_pro_m2_3.jpg',
    
    // Canon Printers
    'printer_canon_g3010_1.jpg', 'printer_canon_g3010_2.jpg', 'printer_canon_g3010_3.jpg',
    'printer_canon_lbp2900_1.jpg', 'printer_canon_lbp2900_2.jpg', 'printer_canon_lbp2900_3.jpg',
    'printer_canon_tr4570s_1.jpg', 'printer_canon_tr4570s_2.jpg', 'printer_canon_tr4570s_3.jpg',
    'printer_canon_used_1.jpg', 'printer_canon_used_2.jpg', 'printer_canon_used_3.jpg',
    
    // HP Printers
    'printer_hp_2320_1.jpg', 'printer_hp_2320_2.jpg', 'printer_hp_2320_3.jpg',
    'printer_hp_4120_1.jpg', 'printer_hp_4120_2.jpg', 'printer_hp_4120_3.jpg',
    'printer_hp_m15w_1.jpg', 'printer_hp_m15w_2.jpg', 'printer_hp_m15w_3.jpg',
    'printer_hp_used_1.jpg', 'printer_hp_used_2.jpg', 'printer_hp_used_3.jpg',
    
    // Epson Printers
    'printer_epson_l3210_1.jpg', 'printer_epson_l3210_2.jpg', 'printer_epson_l3210_3.jpg',
    'printer_epson_l6290_1.jpg', 'printer_epson_l6290_2.jpg', 'printer_epson_l6290_3.jpg',
    'printer_epson_used_1.jpg', 'printer_epson_used_2.jpg', 'printer_epson_used_3.jpg',
    
    // Brother Printers
    'printer_brother_l2321d_1.jpg', 'printer_brother_l2321d_2.jpg', 'printer_brother_l2321d_3.jpg',
    'printer_brother_l2701dw_1.jpg', 'printer_brother_l2701dw_2.jpg', 'printer_brother_l2701dw_3.jpg'
  ];

  // Create placeholder SVG content for each image
  imageFiles.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    
    // Don't overwrite existing files
    if (!fs.existsSync(filePath)) {
      // Extract product info from filename
      const isLaptop = filename.includes('laptop');
      const isPrinter = filename.includes('printer');
      const brand = filename.split('_')[1] || 'product';
      const isUsed = filename.includes('used');
      
      // Create simple SVG placeholder
      const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ddd" stroke-width="2"/>
        <text x="50%" y="40%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">
          ${isLaptop ? '💻' : isPrinter ? '🖨️' : '📱'} ${brand.toUpperCase()}
        </text>
        <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#888">
          ${isLaptop ? 'Laptop' : isPrinter ? 'Printer' : 'Product'} ${isUsed ? '(Used)' : '(New)'}
        </text>
        <text x="50%" y="70%" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#aaa">
          ${filename}
        </text>
      </svg>`;
      
      fs.writeFileSync(filePath, svgContent, 'utf8');
    }
  });

  console.log(`✅ Created ${imageFiles.length} placeholder images in uploads directory`);
  console.log('📁 Images location:', uploadsDir);
  
  return imageFiles;
};

// Run if called directly
if (require.main === module) {
  createPlaceholderImages();
}

module.exports = createPlaceholderImages;
