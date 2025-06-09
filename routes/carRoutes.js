const express = require('express');
const router = express.Router();
const Car = require('../models/carsschema');

router.post('/add', async (req, res) => {
  try {
    const { name, model, engine, image, price } = req.body;

    const newCar = new Car({
      name,
      model,
      engine,
      image,
      price
    });

    await newCar.save();
    res.status(201).json({ message: 'Car added successfully!' });
  } catch (error) {
    console.error('Error saving car:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
