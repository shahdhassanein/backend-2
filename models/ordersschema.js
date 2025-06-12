// models/ordersschema.js (This file now defines your Cart model)

const mongoose = require('mongoose');

// Schema for individual items within the cart's 'items' array
const cartItemSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', // References the 'Car' model (from carsschema.js)
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, // Minimum quantity of 1
        default: 1 // Default quantity if not specified
    }
}, { _id: false }); // Prevents Mongoose from adding an unnecessary '_id' to subdocuments

// Main Cart schema: One cart document per user
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // References the 'User' model (from usersschema.js)
    },
    items: [cartItemSchema] // An array to store all car items currently in the user's cart
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

// Export the model. The internal Mongoose model name will be 'Cart'.
module.exports = mongoose.model('Cart', cartSchema);