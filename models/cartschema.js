const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
        quantity: { type: Number, default: 1 }
    }]
});

module.exports = mongoose.model('Cart', cartSchema);
