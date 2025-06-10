const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, admin } = require('../middleware/auth');
// Handle POST request to add a car
router.post('/addcar', carController.addCar);
module.exports = router;
