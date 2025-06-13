const Cart = require('../models/cartschema');
const Car = require('../models/carsschema');
const Purchase = require('../models/purchaseschema');
const User = require('../models/usersschema');


exports.addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { carId, quantity = 1 } = req.body;

        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required.' });
        }
        if (typeof quantity !== 'number' || quantity < 1 || quantity > 4) {
            return res.status(400).json({ success: false, message: 'Quantity must be a number between 1 and 4.' });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        let cart = await Cart.findOne({ user: userId }); // Assuming 'user' field in Cart schema

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.carId.toString() === carId);

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            if (newQuantity > 4) { // Max quantity 4 matches frontend
                return res.status(400).json({ success: false, message: 'Adding this quantity would exceed the maximum (4) for this item in your cart.' });
            }
            cart.items[itemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                carId: car._id,
                quantity: quantity,
                name: car.name,
                model: car.model,
                price: car.price,
                image: car.image
            });
        }

        await cart.save();

        res.status(200).json({ success: true, message: 'Item added to cart successfully!', cart });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error while adding to cart.', error: error.message });
    }
};


exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate('items.carId');

        if (!cart) {
            return res.status(200).json({ success: true, cart: { user: userId, items: [] }, message: 'Cart is empty for this user.' });
        }

        cart.items = cart.items.filter(item => item.carId !== null && item.quantity >= 1 && item.quantity <= 4);

        if (cart.isModified('items')) {
            await cart.save();
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching cart items.', error: error.message });
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required for removal.' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user.' });
        }

        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.carId.toString() !== carId);

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ success: false, message: 'Car not found in cart or already removed.' });
        }

        await cart.save();
        res.status(200).json({ success: true, message: 'Item removed from cart successfully!', cart });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Server error while removing item from cart.', error: error.message });
    }
};


exports.updateCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { carId } = req.params;
        const { quantity } = req.body;

        if (!carId || typeof quantity !== 'number' || quantity < 1 || quantity > 4) {
            return res.status(400).json({ success: false, message: 'Invalid Car ID or quantity (must be between 1 and 4).' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user.' });
        }

        const itemIndex = cart.items.findIndex(item => item.carId.toString() === carId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Car not found in cart.' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ success: true, message: 'Item quantity updated successfully!', cart });

    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({ success: false, message: 'Server error while updating item quantity.', error: error.message });
    }
};


exports.checkoutCart = async (req, res, next) => {
    console.log('--- BACKEND CHECKOUT START ---');
    try {
        const userId = req.user._id;
        console.log('Backend: Authenticated User ID:', userId);

        const { paymentInfo } = req.body;
        console.log('Backend: Received paymentInfo:', paymentInfo);

        if (!paymentInfo || Object.keys(paymentInfo).length === 0) {
            console.warn('Backend: Payment information is required but not provided or is empty.');
            return res.status(400).json({ success: false, message: 'Payment information is required.' });
        }

        const cart = await Cart.findOne({ user: userId }).populate('items.carId');
        console.log('Backend: Cart retrieved from DB:', cart);

        if (!cart || cart.items.length === 0) {
            console.warn('Backend: Attempted checkout with an empty or non-existent cart for user:', userId);
            return res.status(400).json({ success: false, message: 'Cannot checkout an empty cart.' });
        }

        const purchaseItems = cart.items.map(item => {
            const car = item.carId;
            if (!car) {
                console.warn(`Car with ID ${item.carId} not found during checkout for item. Skipping.`);
                return null;
            }
            return {
                car: car._id,
                quantity: item.quantity,
                unitPrice: car.price,
                totalPrice: car.price * item.quantity,
                name: car.name,
                model: car.model,
                engine: car.engine,
                color: car.color,
                image: car.image
            };
        }).filter(item => item !== null); // Filter out any nulls if cars were not found

        if (purchaseItems.length === 0) {
            console.warn('Backend: No valid items found in cart after filtering for purchase.');
            return res.status(400).json({ success: false, message: 'No valid items to purchase in cart.' });
        }

        const totalOrderAmount = purchaseItems.reduce((sum, item) => sum + item.totalPrice, 0);

        const newPurchase = new Purchase({
            user: userId, // Ensure this matches your Purchase schema's field name
            items: purchaseItems,
            totalAmount: totalOrderAmount,
            paymentInfo: paymentInfo, // This now directly maps to your updated paymentSchema
            purchaseDate: new Date(),
            status: 'Completed'
        });

        const savedPurchase = await newPurchase.save();
        console.log('Backend: Purchase saved successfully:', savedPurchase);

        await Cart.deleteOne({ user: userId });
        console.log('Backend: User cart cleared after successful checkout.');

        res.status(201).json({
            success: true,
            message: 'Checkout completed successfully! Your purchase has been recorded.',
            purchase: savedPurchase,
            totalOrderValue: totalOrderAmount
        });
        console.log('--- BACKEND CHECKOUT END (SUCCESS) ---');

    } catch (error) {
        console.error('--- BACKEND CHECKOUT ERROR ---');
        console.error('Error in checkoutCart:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.errors) {
            console.error('Validation errors:', error.errors);
            for (let field in error.errors) {
                console.error(`Field '${field}': ${error.errors[field].message}`);
            }
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to complete checkout.',
            error: error
        });
        console.log('--- BACKEND CHECKOUT END (ERROR) ---');
    }
};