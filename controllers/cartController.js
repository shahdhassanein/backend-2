const Cart = require('../models/Cart');
const Car = require('../models/Car');

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id; // assuming you're using authentication middleware
        const { _id: carId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.carId.toString() === carId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ carId, quantity: 1 });
        }

        await cart.save();
        res.status(200).json({ success: true, cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
