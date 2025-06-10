const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET route for displaying the add car form
// Changed to /addcar to match your HTML form's action
router.get('/addcar', carController.addCarForm);

// POST route for handling the submission of the add car form
// Changed to /addcar to match your HTML form's action
router.post('/addcar', carController.createCar);

module.exports = router;