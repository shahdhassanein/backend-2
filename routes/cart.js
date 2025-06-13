// routes/cart.js
/*
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth'); 
router.post('/add', protect, cartController.addToCart);
router.get('/', protect, cartController.getCartItems);
router.delete('/remove/:carId', protect, cartController.removeFromCart);
router.post('/checkout', protect, cartController.checkoutCart);
*/
const express = require('express');
const router = express.Router();
const { addToCart, getCartItems } = require('../controllers/cartController');
const protect = require('../middleware/protect'); // Auth middleware

// POST /api/cart → Adds a car to the user's cart
router.post('/', addToCart);

// Optional: GET /api/cart → Gets the user's cart
router.get('/',  getCartItems);

module.exports = router;