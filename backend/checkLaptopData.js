const express = require('express');
const mongoose = require('mongoose');
const Laptop = require('./models/Laptop');

mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    const laptops = await Laptop.find().limit(2);
    console.log('Sample laptop data:');
    laptops.forEach((laptop, index) => {
      console.log(`\nLaptop ${index + 1}:`);
      console.log('_id:', laptop._id);
      console.log('displayName:', laptop.displayName);
      console.log('model:', laptop.model);
      console.log('brand:', laptop.brand);
      console.log('cpu:', laptop.cpu);
      console.log('ramDetails:', laptop.ramDetails);
      console.log('storageDetails:', laptop.storageDetails);
      console.log('screenDetails:', laptop.screenDetails);
      console.log('images:', laptop.images);
    });
  } catch (error) {
    console.error('Error:', error);
  }
  
  mongoose.connection.close();
});
