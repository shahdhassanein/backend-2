require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/backend');
    console.log(`MongoDB Connected: ${conn.connection.db.databaseName}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit app if db fails
  }
};

module.exports = connectDB;
