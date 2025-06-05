const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Car = require('../models/Car');
const User = require('../models/User');


router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.items.car');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            data: user.cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

router.post('/add', auth, async (req, res) => {
    try {
        const { carId } = req.body;
        const user = await User.findById(req.user.id);
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        
        const existingItem = user.cart.items.find(item => item.car.toString() === carId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.items.push({ car: carId, quantity: 1 });
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


router.put('/update', auth, async (req, res) => {
    try {
        const { carId, quantity } = req.body;
        const user = await User.findById(req.user.id);

        const cartItem = user.cart.items.find(item => item.car.toString() === carId);
        if (!cartItem) {
            return res.status(404).json({ success: false, error: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            user.cart.items = user.cart.items.filter(item => item.car.toString() !== carId);
        } else {
            cartItem.quantity = quantity;
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

router.delete('/remove', auth, async (req, res) => {
    try {
        const { carId } = req.body;
        const user = await User.findById(req.user.id);

        user.cart.items = user.cart.items.filter(item => item.car.toString() !== carId);
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router; 