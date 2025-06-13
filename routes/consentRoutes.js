const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Ensure this path is correct
const { acceptCookieConsent } = require('../controllers/consentController'); // Will create this controller next

// This route will be called when a logged-in user accepts cookie consent
// It's protected, so only authenticated users can use it.
router.post('/accept', protect, acceptCookieConsent);

module.exports = router;