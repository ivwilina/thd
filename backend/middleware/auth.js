const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id);
    
    if (!employee) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.employee = employee;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = auth;
