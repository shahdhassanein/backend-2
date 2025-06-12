// routes/cart.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// Import the 'protect' middleware to ensure user authentication for these routes
const { protect } = require('../middleware/auth'); 

/**
 * @route   POST /api/cart/add
 * @desc    Add a car to the user's cart or increment its quantity if already present.
 * @access  Private (requires authentication)
 */
router.post('/add', protect, cartController.addToCart);

/**
 * @route   GET /api/cart
 * @desc    Get all items currently in the authenticated user's cart.
 * @access  Private (requires authentication)
 */
router.get('/', protect, cartController.getCartItems);

/**
 * @route   DELETE /api/cart/remove/:carId
 * @desc    Remove a specific car from the user's cart.
 * @access  Private (requires authentication)
 */
// The ':carId' in the URL allows us to specify which car to remove
router.delete('/remove/:carId', protect, cartController.removeFromCart);

/**
 * @route   POST /api/cart/checkout
 * @desc    Process the entire cart into purchase records and clear the cart.
 * @access  Private (requires authentication)
 */
router.post('/checkout', protect, cartController.checkoutCart);

module.exports = router;