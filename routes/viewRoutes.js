//for both terms and privacy 

const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController'); // Import the new controller

// Route for Terms of Service page
router.get('/Term', viewController.renderStaticPage('Term', 'Terms of Service'));

// Route for Privacy Policy page
router.get('/Privacy', viewController.renderStaticPage('Privacy', 'Privacy Policy'));

module.exports = router;