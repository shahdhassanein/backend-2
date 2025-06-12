// models/bookingsaleschema.js (or similar)

const mongoose = require('mongoose');

const bookingSaleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This should match the name of your User model
        required: true
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', // This must match the name of your Car model (which is 'Car' from carsschema.js)
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1 // Assuming 1 car per booking, adjust if multiple quantity is possible
    },
    totalPrice: {
        type: Number,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    }
    // Add any other fields relevant to your booking/sale (e.g., payment details, delivery address)
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const BookingSale = mongoose.model('BookingSale', bookingSaleSchema);

module.exports = BookingSale;