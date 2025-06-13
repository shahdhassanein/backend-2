const Car = require('../models/carsschema'); // adjust path if needed
const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};
const getCarById = async (req, res) => {
  const { id } = req.params;
  try {
    const car = await Car.findById(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.status(200).json(car);
  } catch (err) {
    console.error('Error finding car by ID:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};




// Export the function
module.exports = { getCarById, getAllCars };