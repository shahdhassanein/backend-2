const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'usersschema' // Make sure this matches your User model name
    },
    name: String,
    model: String,
    price: Number,
    engine: String,
    color: String,
    image: String
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
