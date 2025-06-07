const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart);

router.route('/:carId')
    .delete(protect, removeFromCart);

module.exports = router;
