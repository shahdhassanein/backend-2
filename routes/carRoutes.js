// routes/carRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();

const { addCar, getAllCars ,deleteCar,updateCar } = require('../controllers/carController'); // Make sure getAllCars is imported!

// API route to handle adding a car
router.post('/addcar', addCar); // This will be accessible at /cars/addcar (POST)
router.post('/deletecar', deleteCar);
router.post('/deletecar', updateCar );
router.get('/addcar', (req, res) => { // This will be accessible at /cars/addcar (GET)
  res.render('addcar', { title: 'Add Car' });
});
router.get('/all', getAllCars);
module.exports = router;