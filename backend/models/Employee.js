const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'staff', 'manager'],
    default: 'staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    canManageProducts: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canManageEmployees: { type: Boolean, default: false },
    canManageServices: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false },
    canManageCustomers: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  _id: false
});

// Set default permissions based on role
employeeSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('role')) {
    switch (this.role) {
      case 'admin':
        this.permissions = {
          canManageProducts: true,
          canManageOrders: true,
          canManageEmployees: true,
          canManageServices: true,
          canViewReports: true,
          canManageCustomers: true
        };
        break;
      case 'manager':
        this.permissions = {
          canManageProducts: true,
          canManageOrders: true,
          canManageEmployees: false,
          canManageServices: true,
          canViewReports: true,
          canManageCustomers: true
        };
        break;
      case 'staff':
        this.permissions = {
          canManageProducts: false,
          canManageOrders: true,
          canManageEmployees: false,
          canManageServices: false,
          canViewReports: false,
          canManageCustomers: true
        };
        break;
    }
  }
  next();
});

// Hash password before saving
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods as defined in UML
employeeSchema.methods.getInfo = function() {
  return `${this.name} - ${this.email} - ${this.phoneNumber}`;
};

employeeSchema.methods.deleteAccount = function() {
  return this.deleteOne();
};

// Password comparison method
employeeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if employee has specific permission
employeeSchema.methods.hasPermission = function(permission) {
  if (this.role === 'admin') return true; // Admin has all permissions
  return this.permissions[permission] || false;
};

// Check if employee can access resource
employeeSchema.methods.canAccess = function(resource) {
  if (!this.isActive) return false;
  
  const accessMap = {
    'products': 'canManageProducts',
    'orders': 'canManageOrders', 
    'employees': 'canManageEmployees',
    'services': 'canManageServices',
    'reports': 'canViewReports',
    'customers': 'canManageCustomers'
  };
  
  return this.hasPermission(accessMap[resource]);
};

// Static methods as defined in UML
employeeSchema.statics.createEmployee = async function(employeeData) {
  const employee = new this(employeeData);
  return await employee.save();
};

employeeSchema.statics.getEmployee = async function(id) {
  return await this.findById(id);
};

employeeSchema.statics.updateEmployee = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

employeeSchema.statics.deleteEmployee = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

employeeSchema.statics.getAllEmployees = async function() {
  return await this.find({});
};

module.exports = mongoose.model('Employee', employeeSchema);
