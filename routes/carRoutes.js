const express = require('express');
const router = express.Router();
const { addCar } = require('../controllers/carController');
router.post('/addcar', addCar);

// Handle POST request to add a car
router.post('/addcar', carController.addCar);
module.exports = router;
