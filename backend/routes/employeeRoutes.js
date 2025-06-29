const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin, requireManagerOrAdmin, logActivity } = require('../middleware/permission');

// Validation middleware
const validateEmployee = [
  body('name').notEmpty().withMessage('Tên là bắt buộc'),
  body('phoneNumber').notEmpty().withMessage('Số điện thoại là bắt buộc'),
  body('email').isEmail().withMessage('Email hợp lệ là bắt buộc'),
  body('address').notEmpty().withMessage('Địa chỉ là bắt buộc'),
  body('username').notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Vai trò không hợp lệ')
];

// GET /api/employees - Get all employees (Admin/Manager only)
router.get('/', authenticateToken, requireManagerOrAdmin, logActivity('View all employees'), async (req, res) => {
  try {
    const employees = await Employee.find({}, '-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET /api/employees/:id - Get employee by ID (Admin/Manager only)
router.get('/:id', authenticateToken, requireManagerOrAdmin, logActivity('View employee details'), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, '-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', validateEmployee, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await Employee.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const success = await Employee.updateEmployee(req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const success = await Employee.deleteEmployee(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/employees/:id/info - Get employee info
router.get('/:id/info', async (req, res) => {
  try {
    const employee = await Employee.getEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ info: employee.getInfo() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
