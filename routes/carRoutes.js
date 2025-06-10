// backend-2/routes/carRoutes.js

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController'); // <--- Correctly imports the controller
const { protect, admin } = require('../middleware/auth'); // <--- Correctly imports the middleware

// --- ROUTES FOR CAR LISTINGS (what your /carllisting page uses) ---

// @route   GET /api/cars
// @desc    Get all cars
// @access  Public
router.get('/', carController.getAllCars); // This is your line 7

// @route   GET /api/cars/:id
// @desc    Get a single car by ID
// @access  Public
router.get('/:id', carController.getCarById);

// @route   POST /api/cars/add
// @desc    Add a new car (requires admin)
// @access  Private/Admin
router.post('/add', protect, admin, carController.createCar);

// @route   PUT /api/cars/:id
// @desc    Update a car by ID (requires admin)
// @access  Private/Admin
router.put('/:id', protect, admin, carController.updateCar);

// @route   DELETE /api/cars/:id
// @desc    Delete a car by ID (requires admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, carController.deleteCar);


module.exports = router;