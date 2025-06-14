
// controllers/cartController.js

const Cart = require('../models/cartschema'); // Adjust path if your cart schema is named differently
const Car = require('../models/carsschema');   // Make sure you have a Car model
const Purchase = require('../models/purchaseschema'); // Make sure you have a Purchase model
const User = require('../models/usersschema');   // Make sure you have a User model


exports.addToCart = async (req, res) => {
    try {
        // Assuming userId comes from authenticated request (e.g., from a 'protect' middleware)
        const userId = req.user._id; // Ensure req.user._id is available
        const { carId, quantity = 1 } = req.body; // Default quantity to 1 if not provided

        // Input Validation
        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required.' });
        }
        // Harmonized quantity limit to 4 (matching frontend and updateCartItemQuantity)
        if (typeof quantity !== 'number' || quantity < 1 || quantity > 4) {
            return res.status(400).json({ success: false, message: 'Quantity must be a number between 1 and 4.' });
        }

        // Find the car to ensure it exists and get its details for the cart item
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the car is already in the cart
        const itemIndex = cart.items.findIndex(item => item.carId.toString() === carId);

        if (itemIndex > -1) {
            // Car exists in cart, update quantity
            const newQuantity = cart.items[itemIndex].quantity + quantity;
            // Harmonized quantity limit to 4
            if (newQuantity > 4) {
                return res.status(400).json({ success: false, message: 'Adding this quantity would exceed the maximum (4) for this item in your cart.' });
            } else {
                // IMPORTANT FIX: Actually update the quantity before saving and sending response
                cart.items[itemIndex].quantity = newQuantity;
            }
        } else {
            // Car not in cart, add new item
            cart.items.push({
                carId: car._id,
                quantity: quantity,
                name: car.name,      // Denormalized fields
                model: car.model,    // Denormalized fields
                price: car.price,    // Denormalized fields
                image: car.image     // Denormalized fields
            });
        }

        await cart.save(); // Save the updated or new cart

        res.status(200).json({ success: true, message: 'Item added to cart successfully!', cart });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error while adding to cart.', error: error.message });
    }
};


exports.getCartItems = async (req, res) => {
    try {
        // Assuming userId comes from authenticated request
        const userId = req.user._id;

        // Find the user's cart and populate the 'carId' for full car details
        const cart = await Cart.findOne({ userId }).populate('items.carId');

        if (!cart) {
            return res.status(200).json({ success: true, cart: { userId, items: [] }, message: 'Cart is empty for this user.' });
        }

        // Filter out any items where carId population failed (e.g., car was deleted)
        // And ensure quantities are within limits (e.g., if a car was added with quantity 0 somehow)
        cart.items = cart.items.filter(item => item.carId !== null && item.quantity >= 1 && item.quantity <= 4);

        // Re-save if items were filtered to ensure consistent state
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
        // Assuming userId from authenticated request
        const userId = req.user._id;
        const { carId } = req.params; // carId from URL parameter (e.g., /api/cart/remove/60c72b2f9f1b2c001f8e4d3a)

        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required for removal.' });
        }

        let cart = await Cart.findOne({ userId });

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
        const { carId } = req.params; // carId from URL
        const { quantity } = req.body; // New quantity from request body

        if (!carId || typeof quantity !== 'number' || quantity < 1 || quantity > 4) {
            return res.status(400).json({ success: false, message: 'Invalid Car ID or quantity (must be between 1 and 4).' });
        }

        let cart = await Cart.findOne({ userId });

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


exports.checkoutCart = async (req, res) => {
    try {
        const userId = req.user._id;
        // Assuming paymentInfo (e.g., token, card details) is passed from frontend
        // For a real app, this would integrate with a payment gateway (Stripe, PayPal)
        const { paymentInfo } = req.body;

        // Added console logs for debugging
        console.log('--- Checkout Request Start ---');
        console.log('User ID from auth:', userId);
        console.log('Received paymentInfo:', paymentInfo); // Will likely be {} from current frontend

        // IMPORTANT DEBUGGING STEP: Temporarily adjust this validation.
        // If your Purchase schema expects specific fields within paymentInfo,
        // and you're sending an empty object, this could cause validation errors down the line.
        // For now, let's assume an empty object is acceptable if you're not doing real payment integration.
        // If paymentInfo MUST NOT be empty or must have certain keys, you'll need to modify frontend or add mock data.
        if (!paymentInfo || Object.keys(paymentInfo).length === 0) { // Check if it's an empty object
             console.warn('Payment information is empty. Proceeding without specific payment details.');
             // You can choose to return an error here if payment info is strictly required
             // return res.status(400).json({ success: false, message: 'Payment information is required and cannot be empty.' });
        }


        const cart = await Cart.findOne({ userId }).populate('items.carId');

        console.log('Cart found:', !!cart);
        console.log('Number of items in cart:', cart ? cart.items.length : 0);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cannot checkout an empty cart.' });
        }

        const purchasedItems = [];
        let totalOrderValue = 0;

        for (const item of cart.items) {
            const car = item.carId; // Populated car object

            if (!car) {
                console.warn(`Car with ID ${item.carId} not found during checkout. Skipping this item.`);
                continue; // Skip if car was deleted from inventory
            }

            const itemTotalPrice = car.price * item.quantity;
            totalOrderValue += itemTotalPrice;

            const newPurchase = new Purchase({
                userId: userId,
                carId: car._id,
                quantity: item.quantity,
                unitPrice: car.price,
                totalPrice: itemTotalPrice,
                // Store payment info relevant to this specific purchase,
                // or just reference the overall transaction if payment is handled once.
                paymentInfo: paymentInfo, // Use the received paymentInfo (which is currently {})
                purchaseDate: new Date(),
                status: 'Completed'
            });

            console.log('Attempting to save new purchase:', newPurchase);
            await newPurchase.save();
            purchasedItems.push(newPurchase);
            console.log('Purchase saved for carId:', car._id);
        }

        // After successful checkout, clear the user's cart
        console.log('Attempting to delete cart for userId:', userId);
        await Cart.deleteOne({ userId });
        console.log('Cart deleted successfully.');

        res.status(201).json({
            success: true,
            message: 'Checkout completed successfully! Your purchases have been recorded.',
            purchases: purchasedItems,
            totalOrderValue: totalOrderValue
        });
        console.log('--- Checkout Request End (Success) ---');

    } catch (error) {
        console.error('--- Checkout Request Error ---');
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Failed to complete checkout.', error: error.message });
        console.error('--- Checkout Request End (Error) ---');
    }
};