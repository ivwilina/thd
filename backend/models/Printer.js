const mongoose = require('mongoose');

// Reference models for printer
const printerTypeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const printerBrandSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const printFeatureSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const printerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    ref: 'PrinterType',
    required: true
  },
  brand: {
    type: String,
    ref: 'PrinterBrand',
    required: true
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
  printFeatures: [{
    type: String,
    ref: 'PrintFeature'
  }],
  images: [{
    type: String
  }]
}, {
  timestamps: true,
  _id: false
});

// Static methods as defined in UML
printerSchema.statics.createPrinter = async function(printerData) {
  const printer = new this(printerData);
  return await printer.save();
};

printerSchema.statics.getPrinter = async function(id) {
  return await this.findById(id)
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
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
  return await this.find({})
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

printerSchema.statics.getPrintersByBrand = async function(brandId) {
  return await this.find({ brand: brandId })
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

printerSchema.statics.getPrintersByType = async function(typeId) {
  return await this.find({ type: typeId })
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

printerSchema.statics.getLatestPrinters = async function(limit = 10) {
  return await this.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

printerSchema.statics.getFeaturedPrinters = async function() {
  return await this.find({ isFeatured: true })
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

printerSchema.statics.searchPrinters = async function(keyword) {
  const regex = new RegExp(keyword, 'i');
  return await this.find({
    $or: [
      { printType: regex },
      { description: regex }
    ]
  })
  .populate('type')
  .populate('brand')
  .populate('printFeatures');
};

printerSchema.statics.filterPrinters = async function(criteria) {
  const query = {};
  
  if (criteria.brand) query.brand = criteria.brand;
  if (criteria.type) query.type = criteria.type;
  if (criteria.minPrice) query.price = { $gte: criteria.minPrice };
  if (criteria.maxPrice) {
    if (query.price) {
      query.price.$lte = criteria.maxPrice;
    } else {
      query.price = { $lte: criteria.maxPrice };
    }
  }
  if (criteria.isNewProduct !== undefined) query.isNewProduct = criteria.isNewProduct;
  if (criteria.isFeatured !== undefined) query.isFeatured = criteria.isFeatured;
  
  return await this.find(query)
    .populate('type')
    .populate('brand')
    .populate('printFeatures');
};

// Create reference models
const PrinterType = mongoose.model('PrinterType', printerTypeSchema);
const PrinterBrand = mongoose.model('PrinterBrand', printerBrandSchema);
const PrintFeature = mongoose.model('PrintFeature', printFeatureSchema);

const Printer = mongoose.model('Printer', printerSchema);

module.exports = Printer;
module.exports.Printer = Printer;
module.exports.PrinterType = PrinterType;
module.exports.PrinterBrand = PrinterBrand;
module.exports.PrintFeature = PrintFeature;
