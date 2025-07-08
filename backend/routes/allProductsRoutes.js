const express = require('express');
const router = express.Router();
const Laptop = require('../models/Laptop');
const Printer = require('../models/Printer');

// GET /api/all-products - Get all products (laptops + printers)
router.get('/', async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice, isNewProduct, isFeatured, search, page = 1, limit = 50 } = req.query;
    
    let laptops = [];
    let printers = [];
    
    // Get laptops
    if (!category || category === 'laptop' || category === 'Laptop') {
      try {
        if (search) {
          laptops = await Laptop.searchLaptops(search);
        } else if (brand || minPrice || maxPrice || isNewProduct !== undefined || isFeatured !== undefined) {
          const criteria = {
            brand,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            isNewProduct: isNewProduct !== undefined ? isNewProduct === 'true' : undefined,
            isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
          };
          laptops = await Laptop.filterLaptops(criteria);
        } else {
          laptops = await Laptop.getAllLaptops();
        }
      } catch (error) {
        console.error('Error fetching laptops:', error);
        laptops = [];
      }
    }
    
    // Get printers
    if (!category || category === 'printer' || category === 'Máy In') {
      try {
        if (search) {
          printers = await Printer.searchPrinters(search);
        } else if (brand || minPrice || maxPrice || isNewProduct !== undefined || isFeatured !== undefined) {
          const criteria = {
            brand,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            isNewProduct: isNewProduct !== undefined ? isNewProduct === 'true' : undefined,
            isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
          };
          printers = await Printer.filterPrinters(criteria);
        } else {
          printers = await Printer.getAllPrinters();
        }
      } catch (error) {
        console.error('Error fetching printers:', error);
        printers = [];
      }
    }
    
    // Format laptops with category info
    const formattedLaptops = laptops.map(laptop => {
      const obj = laptop.toObject ? laptop.toObject() : laptop;
      return {
        ...obj,
        name: obj.displayName || obj.name,
        category: 'laptop',
        categoryName: 'Laptop'
      };
    });
    
    // Format printers with category info
    const formattedPrinters = printers.map(printer => {
      const obj = printer.toObject ? printer.toObject() : printer;
      return {
        ...obj,
        name: obj.displayName || obj.description || obj.name,
        category: 'printer',
        categoryName: 'Máy In'
      };
    });
    
    // Combine all products
    const allProducts = [...formattedLaptops, ...formattedPrinters];
    
    // Apply additional filters if needed
    let filteredProducts = allProducts;
    
    if (brand) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand && product.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }
    
    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price?.toString().replace(/[^\d.]/g, '')) || 0;
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }
    
    // Apply search filter across all fields
    if (search && !category) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => {
        const searchableText = [
          product.name,
          product.displayName,
          product.description,
          product.brand,
          product.model,
          product.cpu,
          product.ramDetails,
          product.storageDetails,
          product.screenDetails,
          product.printType,
          ...(product.printFeatures || []).map(f => f.name || f)
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredProducts.length / limit),
      categories: {
        laptops: formattedLaptops.length,
        printers: formattedPrinters.length
      }
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
