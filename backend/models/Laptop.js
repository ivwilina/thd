const mongoose = require('mongoose');

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
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cpu: {
    type: String,
    required: true,
    trim: true
  },
  vga: {
    type: String,
    required: true,
    trim: true
  },
  ramSize: {
    type: String,
    required: true,
    trim: true
  },
  ramDetails: {
    type: String,
    trim: true
  },
  storageSize: {
    type: String,
    required: true,
    trim: true
  },
  storageDetails: {
    type: String,
    trim: true
  },
  screenSize: {
    type: String,
    required: true,
    trim: true
  },
  screenDetails: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
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
  specialFeature: [{
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
laptopSchema.statics.createLaptop = async function(laptopData) {
  const laptop = new this(laptopData);
  return await laptop.save();
};

laptopSchema.statics.getLaptopById = async function(id) {
  return await this.findById(id);
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
  return await this.find({});
};

laptopSchema.statics.getLaptopsByBrand = async function(brand) {
  return await this.find({ brand: brand });
};

laptopSchema.statics.searchLaptops = async function(query) {
  return await this.find({
    $or: [
      { displayName: { $regex: query, $options: 'i' } },
      { model: { $regex: query, $options: 'i' } },
      { brand: { $regex: query, $options: 'i' } },
      { cpu: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
};

laptopSchema.statics.filterLaptops = async function(criteria) {
  const filter = {};
  
  if (criteria.brand) {
    filter.brand = criteria.brand;
  }
  
  if (criteria.cpu) {
    filter.cpu = criteria.cpu;
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

laptopSchema.statics.getFeaturedLaptops = async function() {
  return await this.find({ isFeatured: true });
};

laptopSchema.statics.getNewLaptops = async function() {
  return await this.find({ isNewProduct: true });
};

laptopSchema.statics.getUsedLaptops = async function() {
  return await this.find({ isNewProduct: false });
};

const Laptop = mongoose.model('Laptop', laptopSchema);

module.exports = Laptop;