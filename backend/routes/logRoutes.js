const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// GET /api/logs - Get all logs
router.get('/', async (req, res) => {
  try {
    const { employeeId, page = 1, limit = 50 } = req.query;
    
    let logs;
    
    if (employeeId) {
      logs = await Log.getLogsByEmployee(employeeId);
    } else {
      logs = await Log.getAllLogs();
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLogs = logs.slice(startIndex, endIndex);
    
    res.json({
      logs: paginatedLogs,
      total: logs.length,
      page: parseInt(page),
      totalPages: Math.ceil(logs.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/logs/employee/:employeeId - Get logs by employee
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const logs = await Log.getLogsByEmployee(req.params.employeeId);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/logs/:id - Get log by ID
router.get('/:id', async (req, res) => {
  try {
    const log = await Log.getLog(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/logs - Create new log
router.post('/', async (req, res) => {
  try {
    const log = await Log.createLog(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/logs/:id - Update log
router.put('/:id', async (req, res) => {
  try {
    const success = await Log.updateLog(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ message: 'Log updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/logs/:id - Delete log
router.delete('/:id', async (req, res) => {
  try {
    const success = await Log.deleteLog(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/logs/:id/details - Get log details
router.get('/:id/details', async (req, res) => {
  try {
    const log = await Log.getLog(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.json({ details: log.getLogDetails() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
