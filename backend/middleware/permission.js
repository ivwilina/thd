const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Middleware để xác thực token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id);

    if (!employee || !employee.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or inactive account' 
      });
    }

    req.user = employee;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Middleware để kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  next();
};

// Middleware để kiểm tra quyền manager hoặc admin
const requireManagerOrAdmin = (req, res, next) => {
  if (!['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Manager or Admin access required' 
    });
  }
  next();
};

// Middleware để kiểm tra quyền cụ thể
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({ 
        success: false, 
        message: `Permission '${permission}' required` 
      });
    }
    next();
  };
};

// Middleware để kiểm tra quyền truy cập resource
const requireResourceAccess = (resource) => {
  return (req, res, next) => {
    if (!req.user.canAccess(resource)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access to '${resource}' denied` 
      });
    }
    next();
  };
};

// Middleware để log hoạt động của user
const logActivity = (action) => {
  return (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.user.username} (${req.user.role}) - ${action}`);
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManagerOrAdmin,
  requirePermission,
  requireResourceAccess,
  logActivity
};
