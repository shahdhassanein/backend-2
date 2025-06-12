const Cart = require('../models/cartschema');
const Car = require('../models/carsschema');

exports.addToCart = async (req, res) => {
    const { _id } = req.body;
    const userId = 'test-user'; // for now

    try {
        const existing = await Cart.findOne({ car: _id, user: userId });

        if (existing) {
            existing.quantity += 1;
            await existing.save();
        } else {
            await Cart.create({ car: _id, user: userId, quantity: 1 });
        }

        res.status(200).json({ success: true, message: 'Car added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error adding to cart' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('items.carId');

        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ success: true, cart: [], message: 'Cart is empty' });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
