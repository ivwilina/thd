const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    ref: 'Service'
  },
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  customerAddress: {
    type: String,
    required: false,
    trim: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true,
    enum: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  estimatedPrice: {
    type: Number,
    min: 0
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  staffNotes: {
    type: String,
    trim: true
  },
  assignedStaff: {
    type: String,
    ref: 'Employee'
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save hook to generate _id
serviceBookingSchema.pre('save', function(next) {
  if (!this._id) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this._id = `SB${timestamp}${random}`;
  }
  next();
});

// Static methods
serviceBookingSchema.statics.createBooking = async function(bookingData) {
  const booking = new this(bookingData);
  return await booking.save();
};

serviceBookingSchema.statics.getAllBookings = async function() {
  return await this.find({}).populate('serviceId').sort({ createdAt: -1 });
};

serviceBookingSchema.statics.getBookingById = async function(id) {
  return await this.findById(id).populate('serviceId');
};

serviceBookingSchema.statics.getBookingsByStatus = async function(status) {
  return await this.find({ status }).populate('serviceId').sort({ createdAt: -1 });
};

serviceBookingSchema.statics.getBookingsByCustomer = async function(email) {
  return await this.find({ customerEmail: email }).populate('serviceId').sort({ createdAt: -1 });
};

serviceBookingSchema.statics.updateBookingStatus = async function(id, status, updates = {}) {
  const updateData = { status, ...updates };
  
  if (status === 'confirmed' && !updates.scheduledDate) {
    updateData.scheduledDate = new Date();
  }
  
  if (status === 'completed' && !updates.completedDate) {
    updateData.completedDate = new Date();
  }
  
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return result;
};

serviceBookingSchema.statics.deleteBooking = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return result;
};

// Instance methods
serviceBookingSchema.methods.updateStatus = function(status, updates = {}) {
  return this.constructor.updateBookingStatus(this._id, status, updates);
};

// Virtual for status display
serviceBookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Đã đặt',
    'confirmed': 'Đã xác nhận',
    'in-progress': 'Đang thực hiện',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for formatted date
serviceBookingSchema.virtual('formattedPreferredDate').get(function() {
  return this.preferredDate.toLocaleDateString('vi-VN');
});

// Ensure virtual fields are serialized
serviceBookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);
