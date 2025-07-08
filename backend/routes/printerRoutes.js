const express = require('express');
const router = express.Router();
const Printer = require('../models/Printer');

// GET /api/printers - Get all printers with optional filters
router.get('/', async (req, res) => {
  try {
    const { brand, type, minPrice, maxPrice, isNewProduct, isFeatured, search, page = 1, limit = 10 } = req.query;
    
    let printers;
    
    if (search) {
      printers = await Printer.searchPrinters(search);
    } else if (brand || type || minPrice || maxPrice || isNewProduct !== undefined || isFeatured !== undefined) {
      const criteria = {
        brand,
        type,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        isNewProduct: isNewProduct !== undefined ? isNewProduct === 'true' : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
      };
      printers = await Printer.filterPrinters(criteria);
    } else {
      printers = await Printer.getAllPrinters();
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPrinters = printers.slice(startIndex, endIndex);
    
    res.json({
      printers: paginatedPrinters,
      total: printers.length,
      page: parseInt(page),
      totalPages: Math.ceil(printers.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/new - Get new printers
router.get('/new', async (req, res) => {
  try {
    const printers = await Printer.filterPrinters({ isNewProduct: true });
    res.json({
      data: printers,
      total: printers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/used - Get used printers
router.get('/used', async (req, res) => {
  try {
    const printers = await Printer.filterPrinters({ isNewProduct: false });
    res.json({
      data: printers,
      total: printers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/featured - Get featured printers
router.get('/featured', async (req, res) => {
  try {
    const printers = await Printer.getFeaturedPrinters();
    res.json({
      data: printers,
      total: printers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/latest - Get latest printers
router.get('/latest', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const printers = await Printer.getLatestPrinters(parseInt(limit));
    res.json(printers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/brand/:brandId - Get printers by brand
router.get('/brand/:brandId', async (req, res) => {
  try {
    const printers = await Printer.getPrintersByBrand(req.params.brandId);
    res.json(printers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/type/:typeId - Get printers by type
router.get('/type/:typeId', async (req, res) => {
  try {
    const printers = await Printer.getPrintersByType(req.params.typeId);
    res.json(printers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/printers - Create new printer
router.post('/', async (req, res) => {
  try {
    const printer = await Printer.createPrinter(req.body);
    res.status(201).json(printer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/printers/:id - Update printer
router.put('/:id', async (req, res) => {
  try {
    const success = await Printer.updatePrinter(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Printer not found' });
    }
    res.json({ message: 'Printer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/printers/:id - Delete printer
router.delete('/:id', async (req, res) => {
  try {
    const success = await Printer.deletePrinter(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Printer not found' });
    }
    res.json({ message: 'Printer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printers/:id - Get printer by ID (must be at the end to avoid conflicts)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await Printer.getPrinterById(id);
    
    if (!printer) {
      return res.status(404).json({ message: 'Printer not found' });
    }
    
    res.json({
      data: printer,
      success: true
    });
  } catch (error) {
    console.error('Error fetching printer:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
