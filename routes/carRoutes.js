const express = require('express');
const router = express.Router();
const { addCar } = require('../controllers/carController'); // Import the addCar controller
router.post('/addcar', addCar);
module.exports = router;
