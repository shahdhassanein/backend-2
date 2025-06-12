<<<<<<< Updated upstream
=======
// File: config/db.js
>>>>>>> Stashed changes
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
    // Use the variable from your .env file
    await mongoose.connect(process.env.MONGO_URI);
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
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
=======
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/backend', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

module.exports = connectDB; // ✅ Make sure this line exists
>>>>>>> bbbb297ec6687d1a4a20160afb9fe5ce2d2f13b0
