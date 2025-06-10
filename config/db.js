const mongoose = require('mongoose');
const Car = require('../models/carsschema'); // adjust path if needed

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/backend', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // OPTIONAL: create a dummy car to test DB
    const testCar = new Car({
      name: 'Test Car',
      model: '2025',
      price: 10000,
      engine: 'V6',
      color: 'Red',
      image: 'test.jpg'
    });

    await testCar.save();
    console.log('✅ Test car saved to MongoDB');

  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

module.exports = connectDB;
