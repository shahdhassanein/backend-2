const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    cardType: {
    type: String,
    enum: ['Visa', 'Mastercard', 'Credit Card'],
    required: true
},
    cardholderName: {
        type: String,
        required: true,
        trim: true
    },
    last4Digits: {
        type: String,
        required: true,
        match: /^\d{4}$/ // exactly 4 digits
    },
    expiryDate: {
        type: String,
        required: true,
        match: /^(0[1-9]|1[0-2])\/\d{2}$/ // MM/YY format (e.g., 12/26)
    }
}, { _id: false }); // _id: false means Mongoose won't add an _id to sub-documents of this type


// Define a schema for individual items within a purchase
const itemSchema = new mongoose.Schema({
    car: { // Reference to the Car model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true
    },
    totalPrice: { // total price for this specific item (quantity * unitPrice)
        type: Number,
        required: true
    },
    // Denormalized car details for the purchase record (good practice)
    name: { type: String, required: true },
    model: { type: String, required: true },
    engine: { type: String },
    color: { type: String },
    image: { type: String }
}, { _id: false }); // _id: false for items in the array, as they are part of the main purchase document


const purchaseSchema = new mongoose.Schema({
    user: { // Reference to the User model (matches 'user' field in Cart and req.user._id)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: { // This will be an array of itemSchema documents (multiple cars in one order)
        type: [itemSchema],
        required: true,
        validate: { // Custom validator to ensure at least one item is present
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'A purchase must contain at least one item.'
        }
    },
    totalAmount: { // Overall total for the entire purchase
        type: Number,
        required: true,
        min: 0
    },
    paymentInfo: { // The entire payment information sub-document
        type: paymentSchema,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled', 'Refunded'],
        default: 'Completed'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Purchase', purchaseSchema);