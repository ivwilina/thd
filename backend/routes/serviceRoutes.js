const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET /api/services - Get all services with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, search, featured } = req.query;
    
    let services;
    
    if (search) {
      services = await Service.searchServices(search);
    } else if (featured === 'true') {
      services = await Service.getFeaturedServices();
    } else if (type) {
      services = await Service.getServicesByType(type);
    } else {
      services = await Service.getAllServices();
    }
    
    res.json({
      data: services,
      total: services.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services/featured - Get featured services
router.get('/featured', async (req, res) => {
  try {
    const services = await Service.getFeaturedServices();
    res.json({
      data: services,
      total: services.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services/type/:type - Get services by type
router.get('/type/:type', async (req, res) => {
  try {
    const services = await Service.getServicesByType(req.params.type);
    res.json({
      data: services,
      total: services.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/services/:id - Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.getService(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({
      data: service
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/services - Create new service
router.post('/', async (req, res) => {
  try {
    const service = await Service.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/services/:id - Update service
router.put('/:id', async (req, res) => {
  try {
    const success = await Service.updateService(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const success = await Service.deleteService(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
