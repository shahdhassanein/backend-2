const express = require('express');
const router = express.Router();
const Car = require('../models/carsschema');
const { protect, authorize } = require('../middleware/auth');
const carController = require('../controllers/carController');
router.get('/cars', carController.getAllCars);
router.get('/cars/:id', carController.getCarById);
// router.post('/cars', upload.array('images'), carController.createCar);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);

module.exports = router;  // <<-- important export


