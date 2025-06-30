const mongoose = require('mongoose');

// Schema cho quản lý tồn kho
const inventorySchema = new mongoose.Schema({
  productId: {
    type: String, // Sử dụng String để match với _id của Laptop, Printer, Service
    required: true,
    index: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['laptop', 'printer', 'accessory', 'service'],
    index: true
  },
  productModel: {
    type: String,
    required: true // Tên model để reference đến collection tương ứng
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: 0
  },
  availableStock: {
    type: Number,
    default: 0,
    min: 0
  },
  minimumStock: {
    type: Number,
    default: 5,
    min: 0
  },
  maximumStock: {
    type: Number,
    default: 1000
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  cost: {
    type: Number,
    default: 0
  },
  location: {
    warehouse: {
      type: String,
      default: 'MAIN'
    },
    shelf: {
      type: String,
      default: 'A01'
    },
    position: {
      type: String,
      default: '001'
    }
  },
  supplier: {
    name: {
      type: String,
      default: 'Nhà cung cấp chính'
    },
    contact: {
      type: String
    },
    leadTime: {
      type: Number,
      default: 7 // Thời gian giao hàng (ngày)
    }
  },
  stockMovements: [{
    type: {
      type: String,
      enum: ['IN', 'OUT', 'ADJUSTMENT', 'RESERVED', 'RELEASED'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    reference: {
      type: String // Order ID, Invoice number, etc.
    },
    date: {
      type: Date,
      default: Date.now
    },
    employeeId: {
      type: String,
      ref: 'Employee'
    },
    notes: String
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'],
    default: 'ACTIVE'
  },
  lastRestocked: {
    type: Date
  },
  lastSold: {
    type: Date
  },
  turnoverRate: {
    type: Number,
    default: 0 // Số lần bán trong tháng
  },
  seasonality: {
    peak: [String], // Tháng cao điểm: ['12', '1', '2']
    low: [String]   // Tháng thấp điểm: ['6', '7', '8']
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      ref: 'Employee'
    },
    updatedBy: {
      type: String,
      ref: 'Employee'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
inventorySchema.virtual('stockValue').get(function() {
  return this.currentStock * this.cost;
});

inventorySchema.virtual('needsReorder').get(function() {
  return this.availableStock <= this.reorderLevel;
});

inventorySchema.virtual('stockStatus').get(function() {
  if (this.availableStock <= 0) return 'OUT_OF_STOCK';
  if (this.availableStock <= this.minimumStock) return 'LOW_STOCK';
  if (this.availableStock <= this.reorderLevel) return 'REORDER_NEEDED';
  return 'IN_STOCK';
});

inventorySchema.virtual('stockPercentage').get(function() {
  if (this.maximumStock <= 0) return 0;
  return Math.round((this.currentStock / this.maximumStock) * 100);
});

inventorySchema.virtual('fullLocation').get(function() {
  return `${this.location.warehouse}-${this.location.shelf}-${this.location.position}`;
});

inventorySchema.virtual('daysSinceLastUpdate').get(function() {
  if (!this.metadata || !this.metadata.updatedAt) return 0;
  const now = new Date();
  const updatedAt = new Date(this.metadata.updatedAt);
  return Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
});

// Indexes
inventorySchema.index({ productId: 1, productType: 1 }, { unique: true });
inventorySchema.index({ productType: 1, status: 1 });
inventorySchema.index({ availableStock: 1 });
inventorySchema.index({ 'location.warehouse': 1 });
inventorySchema.index({ needsReorder: 1 });

// Pre-save middleware
inventorySchema.pre('save', function(next) {
  // Tính available stock = current stock - reserved stock
  this.availableStock = Math.max(0, this.currentStock - this.reservedStock);
  
  // Update metadata
  this.metadata.updatedAt = new Date();
  
  next();
});

// Methods
inventorySchema.methods.addStock = function(quantity, reason, reference, employeeId) {
  this.currentStock += quantity;
  this.stockMovements.push({
    type: 'IN',
    quantity: quantity,
    reason: reason,
    reference: reference,
    employeeId: employeeId,
    date: new Date()
  });
  this.lastRestocked = new Date();
  return this.save();
};

inventorySchema.methods.removeStock = function(quantity, reason, reference, employeeId) {
  if (this.availableStock < quantity) {
    throw new Error('Insufficient stock available');
  }
  
  this.currentStock -= quantity;
  this.stockMovements.push({
    type: 'OUT',
    quantity: quantity,
    reason: reason,
    reference: reference,
    employeeId: employeeId,
    date: new Date()
  });
  this.lastSold = new Date();
  return this.save();
};

inventorySchema.methods.reserveStock = function(quantity, reason, reference, employeeId) {
  if (this.availableStock < quantity) {
    throw new Error('Insufficient stock to reserve');
  }
  
  this.reservedStock += quantity;
  this.stockMovements.push({
    type: 'RESERVED',
    quantity: quantity,
    reason: reason,
    reference: reference,
    employeeId: employeeId,
    date: new Date()
  });
  return this.save();
};

inventorySchema.methods.releaseReservedStock = function(quantity, reason, reference, employeeId) {
  if (this.reservedStock < quantity) {
    throw new Error('Cannot release more than reserved');
  }
  
  this.reservedStock -= quantity;
  this.stockMovements.push({
    type: 'RELEASED',
    quantity: quantity,
    reason: reason,
    reference: reference,
    employeeId: employeeId,
    date: new Date()
  });
  return this.save();
};

inventorySchema.methods.updateStock = function(quantityChange, reason, reference, employeeId) {
  if (quantityChange > 0) {
    return this.addStock(quantityChange, reason, reference, employeeId);
  } else if (quantityChange < 0) {
    return this.removeStock(Math.abs(quantityChange), reason, reference, employeeId);
  } else {
    // No change needed
    return Promise.resolve(this);
  }
};

inventorySchema.methods.adjustStock = function(newQuantity, reason, reference, employeeId) {
  const difference = newQuantity - this.currentStock;
  this.currentStock = newQuantity;
  
  this.stockMovements.push({
    type: 'ADJUSTMENT',
    quantity: difference,
    reason: reason,
    reference: reference,
    employeeId: employeeId,
    date: new Date()
  });
  return this.save();
};

// Static methods
inventorySchema.statics.getLowStockItems = function() {
  return this.find({
    status: 'ACTIVE',
    $expr: { $lte: ['$availableStock', '$reorderLevel'] }
  });
};

inventorySchema.statics.getOutOfStockItems = function() {
  return this.find({
    status: 'ACTIVE',
    availableStock: { $lte: 0 }
  });
};

inventorySchema.statics.getStockByWarehouse = function(warehouse) {
  return this.find({
    'location.warehouse': warehouse,
    status: 'ACTIVE'
  });
};

inventorySchema.statics.getInventoryValue = function() {
  return this.aggregate([
    { $match: { status: 'ACTIVE' } },
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$currentStock', '$cost'] } },
        totalItems: { $sum: '$currentStock' },
        totalProducts: { $sum: 1 }
      }
    }
  ]);
};

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
