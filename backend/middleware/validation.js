const { validateEmail, validatePhoneNumber } = require('../utils/helpers');

// Validation for Employee
const validateEmployee = (req, res, next) => {
  const { name, phoneNumber, email, address, username, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  if (!email || !validateEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!address || address.trim().length < 5) {
    errors.push('Address must be at least 5 characters long');
  }

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Validation for Laptop
const validateLaptop = (req, res, next) => {
  const { displayName, model, brand, price } = req.body;
  const errors = [];

  if (!displayName || displayName.trim().length < 3) {
    errors.push('Display name must be at least 3 characters long');
  }

  if (!model || model.trim().length < 2) {
    errors.push('Model must be at least 2 characters long');
  }

  if (!brand || brand.trim().length < 2) {
    errors.push('Brand must be specified');
  }

  if (!price || price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Validation for Order
const validateOrder = (req, res, next) => {
  const { customerName, customerPhoneNumber, customerEmail, customerAddress, orderItem, finalPrice } = req.body;
  const errors = [];

  if (!customerName || customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters long');
  }

  if (!customerPhoneNumber || !validatePhoneNumber(customerPhoneNumber)) {
    errors.push('Invalid customer phone number format');
  }

  if (!customerEmail || !validateEmail(customerEmail)) {
    errors.push('Invalid customer email format');
  }

  if (!customerAddress || customerAddress.trim().length < 5) {
    errors.push('Customer address must be at least 5 characters long');
  }

  if (!orderItem || orderItem.trim().length < 3) {
    errors.push('Order item description is required');
  }

  if (!finalPrice || finalPrice <= 0) {
    errors.push('Final price must be a positive number');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Validation for Service
const validateService = (req, res, next) => {
  const { name, priceMin, priceMax, type } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3) {
    errors.push('Service name must be at least 3 characters long');
  }

  if (priceMin !== undefined && priceMin < 0) {
    errors.push('Minimum price cannot be negative');
  }

  if (priceMax !== undefined && priceMax < 0) {
    errors.push('Maximum price cannot be negative');
  }

  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  if (!type || type.trim().length < 2) {
    errors.push('Service type is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = {
  validateEmployee,
  validateLaptop,
  validateOrder,
  validateService
};
