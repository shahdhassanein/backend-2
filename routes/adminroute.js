const express = require('express');
const router = express.Router();

const { protect,authorize } = require('../middleware/auth');
const { getCarById, getAllCars } = require('../controllers/adminController');
const { addCar, deleteCar, updateCar } = require('../controllers/carController');
router.use(protect);
router.use(authorize('admin'));
router.post('/addcar',  addCar);
// List all cars (JSON)
router.get('/all', getAllCars);
// Delete a car
router.post('/deletecar', deleteCar);
// Update a car
router.post('/updatecar', updateCar);
// Search for a car by ID
router.get('/search/:id', getCarById);

module.exports = router;
