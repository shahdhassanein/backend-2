const express = require('express');
const router = express.Router();
const { addCar } = require('../controllers/carController');
router.post('/addcar', addCar);

// Handle POST request to add a car
router.post('/addcar', carController.addCar);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/add', protect, admin, carController.createCar);
router.put('/:id', protect, admin, carController.updateCar); 
router.delete('/:id', protect, admin, carController.deleteCar);
module.exports = router;
