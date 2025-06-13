const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth'); // Adjust path if your middleware is named differently, e.g., '../middleware/protect' or requires default export

// POST /api/cart/add-item: Adds a car to the user's cart
router.post('/add-item', protect, cartController.addToCart);

// GET /api/cart: Gets the user's cart
router.get('/', protect, cartController.getCartItems);

// DELETE /api/cart/remove/:carId: Removes an item from the user's cart
router.delete('/remove/:carId', protect, cartController.removeFromCart);

// PUT /api/cart/update-quantity/:carId: Updates an item's quantity in the user's cart
router.put('/update-quantity/:carId', protect, cartController.updateCartItemQuantity);

// POST /api/cart/checkout: Processes the checkout for the user's cart
router.post('/checkout', protect, cartController.checkoutCart);

module.exports = router;