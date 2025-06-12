const Car = require('../models/carsschema'); // adjust path if needed
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// Export the function
module.exports = {  getAllCars };