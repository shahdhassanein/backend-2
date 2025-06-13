const express = require('express');
const { acceptCookieConsent, checkCookieConsentStatus } = require('../controllers/consentController'); // Import new function
const { protect } = require('../middleware/auth'); // Ensure this path is correct

const router = express.Router();

// Route to record that a logged-in user has accepted cookie consent
router.post('/accept', protect, acceptCookieConsent);

// NEW ROUTE: Route to check the cookie consent status for the logged-in user
router.get('/status', protect, checkCookieConsentStatus); 
// Note: This route is protected. If a user is not logged in, 'protect' will redirect them
// or send a 401. The homepage.js will need to handle this gracefully (assuming no consent).

module.exports = router;