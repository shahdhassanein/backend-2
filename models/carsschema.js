

const mongoose = require('mongoose');

const carsschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true,
        enum: ['Electric', 'Gas', 'Hybrid']
    },
    price: {
        type: Number,
        required: true
    },
    engine: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    }
}, {
    //timestamps: true
});

module.exports = mongoose.model('Car', carsschema);
