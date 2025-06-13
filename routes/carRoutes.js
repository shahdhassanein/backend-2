const express = require('express');
const router = express.Router();
const { addCar,deleteCar, updateCar } = require('../controllers/carController');
const {   getAllCars, getCarById } = require('../controllers/adminController');
// List cars (JSON)
router.get('/all', getAllCars);

// Add a car
// Route in carRoutes.js
router.post('/addcars', addCar);

// Delete a car
router.post('/deletecar', deleteCar);

// Update a car
router.post('/updatecar', updateCar);

// search 
router.get('/search/:id', getCarById);
module.exports = router;
