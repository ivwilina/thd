const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const { authenticateToken, requireAdmin } = require('../middleware/permission');

// POST /api/auth/login - Employee login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if employee exists
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
      });
    }

    // Check if account is active
    if (!employee.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa' 
      });
    }

    // Check password
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: employee._id,
        name: employee.name,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        permissions: employee.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
        phoneNumber: req.user.phoneNumber,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST /api/auth/register - Register new employee (admin only)
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id, name, phoneNumber, email, address, username, password, role } = req.body;

    // Validate required fields
    if (!id || !name || !phoneNumber || !email || !username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ 
      $or: [{ username }, { email }, { _id: id }] 
    });
    
    if (existingEmployee) {
      return res.status(400).json({ 
        success: false,
        message: 'Nhân viên đã tồn tại (ID, username hoặc email trùng)' 
      });
    }

    // Create new employee
    const employee = new Employee({
      _id: id,
      name,
      phoneNumber,
      email,
      address,
      username,
      password,
      role: role || 'staff'
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản nhân viên thành công',
      employee: {
        id: employee._id,
        name: employee.name,
        username: employee.username,
        email: employee.email,
        role: employee.role,
        permissions: employee.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET /api/auth/me - Get current employee info
router.get('/me', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/auth/change-password - Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const employee = await Employee.findById(req.employee._id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    employee.password = newPassword;
    await employee.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
