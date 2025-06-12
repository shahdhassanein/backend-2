const express = require('express');
const router = express.Router();
const { addCar, getAllCars, deleteCar, updateCar } = require('../controllers/carController');

// List cars (JSON)
router.get('/all', getAllCars);

// Add a car
router.post('/addcar', addCar);

// Delete a car
router.post('/deletecar', deleteCar);

// Update a car
router.post('/updatecar', updateCar);

module.exports = router;
