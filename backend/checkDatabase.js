const mongoose = require('mongoose');
const Laptop = require('./models/Laptop');
const Printer = require('./models/Printer');
const Employee = require('./models/Employee');
const Service = require('./models/Service');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');

mongoose.connect('mongodb://localhost:27017/may_tinh_tran_anh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    const laptops = await Laptop.find();
    const printers = await Printer.find();
    const employees = await Employee.find();
    const services = await Service.find();
    const orders = await Order.find();
    const inventory = await Inventory.find();
    
    console.log('Database contents:');
    console.log(`- Laptops: ${laptops.length}`);
    console.log(`- Printers: ${printers.length}`);
    console.log(`- Employees: ${employees.length}`);
    console.log(`- Services: ${services.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log(`- Inventory: ${inventory.length}`);
    
    if (laptops.length > 0) {
      console.log('\nFirst laptop sample:');
      const laptop = laptops[0];
      console.log('- _id:', laptop._id);
      console.log('- displayName:', laptop.displayName);
      console.log('- model:', laptop.model);
      console.log('- brand:', laptop.brand);
      console.log('- images:', laptop.images);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  mongoose.connection.close();
});
