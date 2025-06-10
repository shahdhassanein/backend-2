
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, admin } = require('../middleware/auth');

router.get('/', carController.getAllCars);

router.get('/:id', carController.getCarById);

router.post('/add', protect, admin, carController.createCar);

router.put('/:id', protect, admin, carController.updateCar);

router.delete('/:id', protect, admin, carController.deleteCar);

router.get('/addcar-view', (req, res) => {
    res.render('addcar', { title: 'Add New Car' });
});

module.exports = router;