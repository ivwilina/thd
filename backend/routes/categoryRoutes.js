const express = require('express');
const router = express.Router();
const { Cpu, Brand, Vga, RamSize, StorageSize, ScreenSize, SpecialFeature } = require('../models/Laptop');
const { PrinterType, PrinterBrand, PrintFeature } = require('../models/Printer');

// Laptop Categories Routes

// CPU Routes
router.get('/cpus', async (req, res) => {
  try {
    const cpus = await Cpu.find({});
    res.json(cpus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cpus', async (req, res) => {
  try {
    const cpu = new Cpu(req.body);
    await cpu.save();
    res.status(201).json(cpu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Brand Routes
router.get('/brands', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/brands', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VGA Routes
router.get('/vgas', async (req, res) => {
  try {
    const vgas = await Vga.find({});
    res.json(vgas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/vgas', async (req, res) => {
  try {
    const vga = new Vga(req.body);
    await vga.save();
    res.status(201).json(vga);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RAM Size Routes
router.get('/ram-sizes', async (req, res) => {
  try {
    const ramSizes = await RamSize.find({});
    res.json(ramSizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/ram-sizes', async (req, res) => {
  try {
    const ramSize = new RamSize(req.body);
    await ramSize.save();
    res.status(201).json(ramSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Storage Size Routes
router.get('/storage-sizes', async (req, res) => {
  try {
    const storageSizes = await StorageSize.find({});
    res.json(storageSizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/storage-sizes', async (req, res) => {
  try {
    const storageSize = new StorageSize(req.body);
    await storageSize.save();
    res.status(201).json(storageSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Screen Size Routes
router.get('/screen-sizes', async (req, res) => {
  try {
    const screenSizes = await ScreenSize.find({});
    res.json(screenSizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/screen-sizes', async (req, res) => {
  try {
    const screenSize = new ScreenSize(req.body);
    await screenSize.save();
    res.status(201).json(screenSize);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Special Feature Routes
router.get('/special-features', async (req, res) => {
  try {
    const specialFeatures = await SpecialFeature.find({});
    res.json(specialFeatures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/special-features', async (req, res) => {
  try {
    const specialFeature = new SpecialFeature(req.body);
    await specialFeature.save();
    res.status(201).json(specialFeature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Printer Categories Routes

// Printer Type Routes
router.get('/printer-types', async (req, res) => {
  try {
    const printerTypes = await PrinterType.find({});
    res.json(printerTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/printer-types', async (req, res) => {
  try {
    const printerType = new PrinterType(req.body);
    await printerType.save();
    res.status(201).json(printerType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Printer Brand Routes
router.get('/printer-brands', async (req, res) => {
  try {
    const printerBrands = await PrinterBrand.find({});
    res.json(printerBrands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/printer-brands', async (req, res) => {
  try {
    const printerBrand = new PrinterBrand(req.body);
    await printerBrand.save();
    res.status(201).json(printerBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Print Feature Routes
router.get('/print-features', async (req, res) => {
  try {
    const printFeatures = await PrintFeature.find({});
    res.json(printFeatures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/print-features', async (req, res) => {
  try {
    const printFeature = new PrintFeature(req.body);
    await printFeature.save();
    res.status(201).json(printFeature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
