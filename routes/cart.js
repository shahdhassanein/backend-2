const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes
router.get('/', cartController.getCartItems);
router.post('/add', cartController.addToCart);
router.delete('/remove/:itemId', cartController.removeFromCart);

module.exports = router;
