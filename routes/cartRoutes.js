const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Your cart schema
// Optional: check if user is logged in

// POST /api/cart/add
router.post('/add', async (req, res) => {
    try {
        const car = req.body;

        // Optional: you could also check if the car is already in the cart
        const newCartItem = new Cart(car);
        await newCartItem.save();

        res.status(200).json({ success: true, message: 'Car added to cart.' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add to cart.' });
    }
});

module.exports = router;
