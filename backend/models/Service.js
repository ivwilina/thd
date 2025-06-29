const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  priceMin: {
    type: Number,
    required: true,
    min: 0
  },
  priceMax: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['repair', 'maintenance', 'installation', 'consultation', 'rental']
  },
  description: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  _id: false
});

// Static methods as defined in UML
serviceSchema.statics.createService = async function(serviceData) {
  const service = new this(serviceData);
  return await service.save();
};

serviceSchema.statics.getService = async function(id) {
  return await this.findById(id);
};

serviceSchema.statics.updateService = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

serviceSchema.statics.deleteService = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

serviceSchema.statics.getAllServices = async function() {
  return await this.find({ isActive: true });
};

serviceSchema.statics.getServicesByType = async function(type) {
  return await this.find({ type, isActive: true });
};

serviceSchema.statics.getFeaturedServices = async function() {
  return await this.find({ isFeatured: true, isActive: true });
};

serviceSchema.statics.searchServices = async function(keyword) {
  const regex = new RegExp(keyword, 'i');
  return await this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: regex },
          { description: regex },
          { type: regex }
        ]
      }
    ]
  });
};

module.exports = mongoose.model('Service', serviceSchema);
