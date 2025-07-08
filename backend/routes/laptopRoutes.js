const express = require('express');
const router = express.Router();
const Laptop = require('../models/Laptop');

// Test route to debug
router.get('/test-debug', async (req, res) => {
  try {
    console.log('🔍 Debug route called');
    
    const laptops = await Laptop.find({});
    console.log('📊 Total laptops in DB:', laptops.length);
    
    if (laptops.length > 0) {
      console.log('🔍 First laptop:', laptops[0]);
    }
    
    const newLaptops = await Laptop.filterLaptops({ isNewProduct: true });
    console.log('📊 New laptops:', newLaptops.length);
    
    res.json({
      totalLaptops: laptops.length,
      newLaptops: newLaptops.length,
      sampleLaptop: laptops[0] || null,
      newLaptopsSample: newLaptops.slice(0, 2)
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops - Get all laptops with optional filters
router.get('/', async (req, res) => {
  try {
    const { brand, cpu, minPrice, maxPrice, isNewProduct, isFeatured, search, page = 1, limit = 10 } = req.query;
    
    let laptops;
    
    if (search) {
      laptops = await Laptop.searchLaptops(search);
    } else if (brand || cpu || minPrice || maxPrice || isNewProduct !== undefined || isFeatured !== undefined) {
      const criteria = {
        brand,
        cpu,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        isNewProduct: isNewProduct !== undefined ? isNewProduct === 'true' : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
      };
      laptops = await Laptop.filterLaptops(criteria);
    } else {
      laptops = await Laptop.getAllLaptops();
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLaptops = laptops.slice(startIndex, endIndex);
    
    res.json({
      laptops: paginatedLaptops,
      total: laptops.length,
      page: parseInt(page),
      totalPages: Math.ceil(laptops.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/new - Get new laptops
router.get('/new', async (req, res) => {
  try {
    const laptops = await Laptop.filterLaptops({ isNewProduct: true });
    res.json({
      data: laptops,
      total: laptops.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/used - Get used laptops
router.get('/used', async (req, res) => {
  try {
    const laptops = await Laptop.filterLaptops({ isNewProduct: false });
    res.json({
      data: laptops,
      total: laptops.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/featured - Get featured laptops
router.get('/featured', async (req, res) => {
  try {
    const laptops = await Laptop.getFeaturedLaptops();
    res.json({
      data: laptops,
      total: laptops.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/latest - Get latest laptops
router.get('/latest', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const laptops = await Laptop.getLatestLaptops(parseInt(limit));
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/brand/:brandId - Get laptops by brand
router.get('/brand/:brandId', async (req, res) => {
  try {
    const laptops = await Laptop.getLaptopsByBrand(req.params.brandId);
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/cpu/:cpuId - Get laptops by CPU
router.get('/cpu/:cpuId', async (req, res) => {
  try {
    const laptops = await Laptop.getLaptopsByCpu(req.params.cpuId);
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/laptops - Create new laptop
router.post('/', async (req, res) => {
  try {
    const laptop = await Laptop.createLaptop(req.body);
    res.status(201).json(laptop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/laptops/:id - Update laptop
router.put('/:id', async (req, res) => {
  try {
    const success = await Laptop.updateLaptop(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    res.json({ message: 'Laptop updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/laptops/:id - Get laptop by ID (must be at the end to avoid conflicts)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const laptop = await Laptop.getLaptopById(id);
    
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    
    res.json({
      data: laptop,
      success: true
    });
  } catch (error) {
    console.error('Error fetching laptop:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/laptops/:id - Delete laptop
router.delete('/:id', async (req, res) => {
  try {
    const success = await Laptop.deleteLaptop(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    res.json({ message: 'Laptop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
