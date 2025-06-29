const mongoose = require('mongoose');

// Reference models for laptop
const cpuSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const brandSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const vgaSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const ramSizeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const storageSizeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const screenSizeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  size: { type: Number, required: true }
}, { _id: false });

const specialFeatureSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, trim: true }
}, { _id: false });

const laptopSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    ref: 'Brand',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cpu: {
    type: String,
    ref: 'Cpu',
    required: true
  },
  vga: {
    type: String,
    ref: 'Vga',
    required: true
  },
  ramSize: {
    type: String,
    ref: 'RamSize',
    required: true
  },
  ramDetails: {
    type: String,
    trim: true
  },
  storageSize: {
    type: String,
    ref: 'StorageSize',
    required: true
  },
  storageDetails: {
    type: String,
    trim: true
  },
  screenSize: {
    type: String,
    ref: 'ScreenSize',
    required: true
  },
  screenDetails: {
    type: String,
    trim: true
  },
  batteryDetails: {
    type: String,
    trim: true
  },
  connectionPort: {
    type: String,
    trim: true
  },
  operationSystem: {
    type: String,
    trim: true
  },
  specialFeature: [{
    type: String,
    ref: 'SpecialFeature'
  }],
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
    type: String
  }]
}, {
  timestamps: true,
  _id: false
});

// Static methods as defined in UML
laptopSchema.statics.createLaptop = async function(laptopData) {
  const laptop = new this(laptopData);
  return await laptop.save();
};

laptopSchema.statics.getLaptop = async function(id) {
  return await this.findById(id)
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.updateLaptop = async function(id, updateData) {
  const result = await this.findByIdAndUpdate(id, updateData, { new: true });
  return !!result;
};

laptopSchema.statics.deleteLaptop = async function(id) {
  const result = await this.findByIdAndDelete(id);
  return !!result;
};

laptopSchema.statics.getAllLaptops = async function() {
  return await this.find({})
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.getLaptopsByBrand = async function(brandId) {
  return await this.find({ brand: brandId })
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.getLaptopsByCpu = async function(cpuId) {
  return await this.find({ cpu: cpuId })
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.getLatestLaptops = async function(limit = 10) {
  return await this.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.getFeaturedLaptops = async function() {
  return await this.find({ isFeatured: true })
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

laptopSchema.statics.searchLaptops = async function(keyword) {
  const regex = new RegExp(keyword, 'i');
  return await this.find({
    $or: [
      { displayName: regex },
      { model: regex },
      { operationSystem: regex }
    ]
  })
  .populate('brand')
  .populate('cpu')
  .populate('vga')
  .populate('ramSize')
  .populate('storageSize')
  .populate('screenSize')
  .populate('specialFeature');
};

laptopSchema.statics.filterLaptops = async function(criteria) {
  const query = {};
  
  if (criteria.brand) query.brand = criteria.brand;
  if (criteria.cpu) query.cpu = criteria.cpu;
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
    .populate('brand')
    .populate('cpu')
    .populate('vga')
    .populate('ramSize')
    .populate('storageSize')
    .populate('screenSize')
    .populate('specialFeature');
};

// Create reference models
const Cpu = mongoose.model('Cpu', cpuSchema);
const Brand = mongoose.model('Brand', brandSchema);
const Vga = mongoose.model('Vga', vgaSchema);
const RamSize = mongoose.model('RamSize', ramSizeSchema);
const StorageSize = mongoose.model('StorageSize', storageSizeSchema);
const ScreenSize = mongoose.model('ScreenSize', screenSizeSchema);
const SpecialFeature = mongoose.model('SpecialFeature', specialFeatureSchema);

const Laptop = mongoose.model('Laptop', laptopSchema);

module.exports = {
  Laptop,
  Cpu,
  Brand,
  Vga,
  RamSize,
  StorageSize,
  ScreenSize,
  SpecialFeature
};
