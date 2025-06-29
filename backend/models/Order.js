const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerPhoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  customerAddress: {
    type: String,
    required: true,
    trim: true
  },
  billingMethod: {
    type: String,
    required: true,
    enum: ['bank-transfer', 'cash-on-delivery', 'cash'],
    default: 'cash-on-delivery'
  },
  note: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['product', 'service', 'mixed'],
    default: 'product'
  },
  orderItems: [{
    itemType: {
      type: String,
      enum: ['laptop', 'printer', 'service'],
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
  _id: false
});

// Instance methods as defined in UML
orderSchema.methods.updateOrderStatus = async function(newStatus) {
  this.status = newStatus;
  const result = await this.save();
  return !!result;
};

orderSchema.methods.completeOrder = async function() {
  this.status = 'delivered';
  const result = await this.save();
  return !!result;
};

orderSchema.methods.calculateTotalPrice = function() {
  let total = 0;
  this.orderItems.forEach(item => {
    total += item.totalPrice;
  });
  this.finalPrice = total;
  return total;
};

// Static methods as defined in UML
orderSchema.statics.createOrder = async function(orderData) {
  const order = new this(orderData);
  order.calculateTotalPrice();
  return await order.save();
};

orderSchema.statics.getOrder = async function(id) {
  return await this.findById(id);
};

orderSchema.statics.updateOrder = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

orderSchema.statics.deleteOrder = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

orderSchema.statics.getAllOrders = async function() {
  return await this.find({}).sort({ orderDate: -1 });
};

orderSchema.statics.getOrdersByStatus = async function(status) {
  return await this.find({ status }).sort({ orderDate: -1 });
};

orderSchema.statics.getOrdersByDate = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await this.find({
    orderDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ orderDate: -1 });
};

orderSchema.statics.getOrdersByCustomer = async function(customerInfo) {
  const regex = new RegExp(customerInfo, 'i');
  return await this.find({
    $or: [
      { customerName: regex },
      { customerPhoneNumber: regex },
      { customerEmail: regex }
    ]
  }).sort({ orderDate: -1 });
};

orderSchema.statics.getOrdersByType = async function(type) {
  return await this.find({ type }).sort({ orderDate: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
