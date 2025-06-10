const express = require('express');
const router = express.Router();
const Car = require('../models/carsschema'); // Path to your Car schema
const carController = require('../controllers/carController'); // Path to your Car Controller

// Route to add a new car (POST /api/cars/add)
router.post('/add', async (req, res) => {
  try {
    // Destructure all fields that can be sent when adding a car
    // Make sure 'brand' and 'availability' are included if you want to set them on creation
    const { name, model, engine, image, price, brand, availability } = req.body;

    const newCar = new Car({
      name,
      model,
      engine,
      image,
      price,
      brand,       // Include brand
      availability // Include availability
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully!' });
  } catch (error) {
    console.error('Error saving car:', error);
    // Send a more specific error message if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error: Could not add car.' });
  }
});

// Route to get all cars (GET /api/cars/)
// This uses the getAllCars function from carController
router.get('/', carController.getAllCars);

module.exports = router;