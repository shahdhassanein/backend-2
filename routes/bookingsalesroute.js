    const express = require('express');
    const router = express.Router();
    const controller = require('../controllers/bookingsalescontroller');
    // Ensure this path to your auth middleware (containing 'protect' and 'authorize') is correct.
    const { protect, authorize } = require('../middleware/auth'); 

    // Route to create a new purchase (requires user to be logged in and token verified)
    router.post('/purchase', protect, controller.purchaseCar);

    // Route to get purchases for the logged-in user (API endpoint for frontend Fetch)
    // This will be called by your /public/js/myPurchases.js file
    // It requires the user to be logged in (via JWT token checked by 'protect' middleware)
    router.get('/my-purchases', protect, controller.getMyPurchases); 

    // Route to get all purchases (typically for Admin dashboard)
    // This should be protected for admin roles.
    router.get('/', protect, authorize('admin'), controller.getAllPurchases); 

    // Route for rendering the mypurchases EJS page (server-side render version)
    // This route is separate from the API endpoint for fetch.
    // It uses 'protect' to ensure req.user is available for rendering.
    router.get('/view-my-purchases', protect, async (req, res) => {
        try {
            // This calls the controller function that gets data for EJS rendering
            const purchases = await controller.getMyPurchasesData(req.user._id);
            res.render('mypurchases', { purchases: purchases, title: 'My Purchases', user: req.user || null }); 
        } catch (error) {
            console.error('Error fetching purchases for EJS view:', error);
            res.status(500).send('Server error while fetching purchases for view');
        }
    });

    module.exports = router;
    