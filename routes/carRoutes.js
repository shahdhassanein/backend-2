const express = require('express');
const router = express.Router();
console.log('carRoutes.js loaded!');

const carController = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');

// --- PUBLIC / GENERAL ROUTES ---
router.get('/', carController.getAllCars);

// --- ADMIN VIEWS ---
router.get('/addcar-view', protect, authorize('admin'), (req, res) => {
    res.render('addcar', { title: 'Add New Car' });
});

router.get('/update-car-view/:id', protect, authorize('admin'), carController.renderUpdateCarForm);

// --- API ROUTES (ADMIN RESTRICTED) ---
router.post('/add', protect, authorize('admin'), carController.createCar);
router.put('/:id', protect, authorize('admin'), carController.updateCar);
router.delete('/:id', protect, authorize('admin'), carController.deleteCar);

// --- THIS SHOULD BE LAST ---
router.get('/:id', carController.getCarById); // Always place dynamic :id routes last

module.exports = router;
