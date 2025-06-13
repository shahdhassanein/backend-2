// controllers/cartController.js
/*
// Import necessary Mongoose models
const Cart = require('../models/ordersschema'); // Import the Cart model (defined in ordersschema.js)
const Car = require('../models/carsschema');     // Import the Car model
const Purchase = require('../models/purchaseschema'); // Import the Purchase model
const User = require('../models/usersschema');   // Import the User model


exports.addToCart = async (req, res) => {
    try {
        // Get userId from the authenticated request (set by the 'protect' middleware)
        const userId = req.user._id;
        // Get carId from the request body
        const { carId } = req.body;

        // Basic validation for carId
        if (!carId) {
            return res.status(400).json({ success: false, message: 'Car ID is required.' });
        }

        // Find the car to ensure it exists. This is important for validation and getting car details.
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: 'Car not found.' });
        }

        // Find the user's cart. A user should only have one cart document.
        let cart = await Cart.findOne({ userId });

        // If no cart exists for the user, create a new one with an empty items array
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if the specific car is already in the cart's items array
        const itemIndex = cart.items.findIndex(item => item.carId.toString() === carId);

        if (itemIndex > -1) {
            // If the car exists in the cart, increment its quantity
            cart.items[itemIndex].quantity += 1;
        } else {
            // If the car is not in the cart, add it as a new item with quantity 1
            cart.items.push({ carId, quantity: 1 });
        }

        // Save the updated cart document to the database
        await cart.save();
        res.status(200).json({ success: true, message: 'Item added to cart successfully!', cart });

    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error while adding to cart.', error: error.message });
    }
};


exports.getCartItems = async (req, res) => {
    try {
        // Get userId from the authenticated request
        const userId = req.user._id; 

        // Find the user's cart and populate the 'carId' for each item
        // This brings in full car details (name, model, price, etc.) into the cart object
        const cart = await Cart.findOne({ userId }).populate('items.carId');

        // If no cart is found or the cart is empty, return an empty cart object
        if (!cart || cart.items.length === 0) {
            // Return an object that mirrors the cart structure, but empty
            return res.status(200).json({ success: true, cart: { userId, items: [] }, message: 'Cart is empty.' });
        }

        // Return the populated cart object
        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching cart items.', error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        // Get userId from the authenticated request
        const userId = req.user._id;
        // Get carId from the URL parameters
        const { carId } = req.params; 

        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        // If no cart exists for the user, the item cannot be removed
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found for this user.' });
        }

        // Filter out the item to be removed.
        // This creates a new array excluding the specified car.
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item.carId.toString() !== carId);

        // If the item count didn't change, it means the carId wasn't found in the cart
        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ success: false, message: 'Car not found in cart or already removed.' });
        }

        // Save the updated cart document
        await cart.save();
        res.status(200).json({ success: true, message: 'Item removed from cart successfully!', cart });

    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Server error while removing item from cart.', error: error.message });
    }
};

exports.checkoutCart = async (req, res) => {
    try {
        // Get userId from the authenticated request
        const userId = req.user._id;
        // Get paymentInfo from the request body (assuming this is collected from the frontend form)
        const { paymentInfo } = req.body; 

        // Input validation for paymentInfo (basic check, more detailed validation can be added)
        if (!paymentInfo || !paymentInfo.cardType || !paymentInfo.last4Digits || !paymentInfo.expiryDate || !paymentInfo.cardholderName) {
            return res.status(400).json({ success: false, message: 'Payment information is incomplete. Please provide card type, cardholder name, last 4 digits, and expiry date.' });
        }

        // Find the user's cart and populate car details for each item
        const cart = await Cart.findOne({ userId }).populate('items.carId');

        // If the cart is empty, prevent checkout
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cannot checkout an empty cart.' });
        }

        const purchasedItems = []; // Array to store the newly created purchase records

        // Iterate over each item in the cart
        for (const item of cart.items) {
            const car = item.carId; // The populated car object

            // Important: Handle cases where populated car might be null if car was deleted from inventory
            if (!car) {
                console.warn(`Car with ID ${item.carId} not found for purchase. Skipping this item.`);
                continue; // Skip this item if the car doesn't exist anymore
            }

            // Create a new Purchase document for each item
            const newPurchase = new Purchase({
                userId: userId,
                carId: car._id,
                quantity: item.quantity,
                unitPrice: car.price, // Snapshot the car's price at the time of purchase
                totalPrice: car.price * item.quantity, // Calculate total for this item
                paymentInfo: paymentInfo, // Attach the collected payment information
                purchaseDate: new Date(), // Set the current purchase date
                status: 'Completed' // Set the purchase status to 'Completed' upon successful creation
            });

            // Save the new purchase record to the database
            await newPurchase.save();
            purchasedItems.push(newPurchase); // Add to the list of purchased items

            // Optional: Update car availability or stock (if you have stock management)
            // Example: If each car is unique and becomes unavailable after one purchase:
            // car.availability = false; 
            // await car.save();
            // Or if you have a 'stock' field on your Car model:
            // car.stock -= item.quantity;
            // if (car.stock < 0) {
            //     // Handle out-of-stock scenario (e.g., revert purchase, notify user)
            //     // A more robust solution would involve transactions and stock checks BEFORE purchase creation
            //     throw new Error(`Not enough stock for ${car.name}.`); 
            // }
            // await car.save();
        }

        // After successfully processing all items, clear the user's cart
        await Cart.deleteOne({ userId }); // Deletes the entire cart document for the user

        res.status(201).json({
            success: true,
            message: 'Checkout completed successfully! Your purchases have been recorded.',
            purchases: purchasedItems // Return the created purchase records
        });

    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Failed to complete checkout.', error: error.message });
    }
};
*/
const Cart = require('../models/cartschema');

const addToCart = async (req, res) => {
  try {
    const { name, model, price, engine, color, image } = req.body;

    if (!name || !model || !price) {
      return res.status(400).json({ message: 'Missing car data' });
    }

    const newCartItem = new Cart({
      userId:'684bdf12343c8cf9b022efa8' ,
      name,
      model,
      price,
      engine,
      color,
      image: image || '/images/default-car.jpg',
    });

    await newCartItem.save();

    res.status(201).json({ message: 'Car added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addToCart, getCartItems };
