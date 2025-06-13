// models/cartschema.js

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
        unique: true // A user should typically only have one active cart document
    },
    items: [ // Array to hold multiple car items in the cart
        {
            carId: { // Reference to the actual car product
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Car', // Reference to your Car model (e.g., defined in carsschema.js)
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1 // Quantity should be at least 1
            },
            // Denormalized fields for quick access without populating 'Car' every time
            name: { type: String, required: true },
            model: { type: String },
            price: { type: Number, required: true },
            image: { type: String }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Mongoose will automatically manage createdAt and updatedAt fields

module.exports = mongoose.model('Cart', cartSchema);