const mongoose = require('mongoose');

const printerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  printType: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isNewProduct: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  images: [{
    type: String,
    trim: true
  }],
  printFeatures: [{
    type: String,
    trim: true
  }],
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new'
  },
  warranty: {
    type: String,
    trim: true
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock'
  }
}, {
  timestamps: true,
  _id: false
});

// Static methods
printerSchema.statics.createPrinter = async function(printerData) {
  const printer = new this(printerData);
  return await printer.save();
};

printerSchema.statics.getPrinterById = async function(id) {
  return await this.findById(id);
};

printerSchema.statics.updatePrinter = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

printerSchema.statics.deletePrinter = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

printerSchema.statics.getAllPrinters = async function() {
  return await this.find({});
};

printerSchema.statics.getPrintersByType = async function(type) {
  return await this.find({ type: type });
};

printerSchema.statics.getPrintersByBrand = async function(brand) {
  return await this.find({ brand: brand });
};

printerSchema.statics.getLatestPrinters = async function(limit = 10) {
  return await this.find({})
    .sort({ createdAt: -1 })
    .limit(limit);
};

printerSchema.statics.getFeaturedPrinters = async function() {
  return await this.find({ isFeatured: true });
};

printerSchema.statics.getNewPrinters = async function() {
  return await this.find({ isNewProduct: true });
};

printerSchema.statics.getUsedPrinters = async function() {
  return await this.find({ isNewProduct: false });
};

printerSchema.statics.searchPrinters = async function(keyword) {
  const regex = new RegExp(keyword, 'i');
  return await this.find({
    $or: [
      { printType: regex },
      { description: regex },
      { brand: regex },
      { type: regex }
    ]
  });
};

printerSchema.statics.filterPrinters = async function(criteria) {
  const filter = {};
  
  if (criteria.brand) {
    filter.brand = criteria.brand;
  }
  
  if (criteria.type) {
    filter.type = criteria.type;
  }
  
  if (criteria.minPrice || criteria.maxPrice) {
    filter.price = {};
    if (criteria.minPrice) {
      filter.price.$gte = criteria.minPrice;
    }
    if (criteria.maxPrice) {
      filter.price.$lte = criteria.maxPrice;
    }
  }
  
  if (criteria.isNewProduct !== undefined) {
    filter.isNewProduct = criteria.isNewProduct;
  }
  
  if (criteria.isFeatured !== undefined) {
    filter.isFeatured = criteria.isFeatured;
  }
  
  return await this.find(filter);
};

const Printer = mongoose.model('Printer', printerSchema);

module.exports = Printer;
