const express = require('express');
const router = express.Router();
const Cart = require('../models/ordersschema');

// POST /api/cart/add
router.post('/add', async (req, res) => {
    try {
        const userId = req.session.userId; // Or req.user._id if you're using passport
        const car = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        const newCartItem = new Cart({ ...car, userId });
        await newCartItem.save();

        res.status(200).json({ success: true, message: 'Car added to cart' });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/cart/:userId
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const cartItems = await Cart.find({ userId });
        res.status(200).json({ success: true, cartItems });
    } catch (err) {
        console.error('Error getting cart:', err);
        res.status(500).json({ success: false, message: 'Could not get cart' });
    }
});

module.exports = router;
