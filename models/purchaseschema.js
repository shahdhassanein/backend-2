const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  cardType: {
    type: String,
    enum: ['Visa', 'Mastercard'],
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
    match: /^(0[1-9]|1[0-2])\/\d{2}$/ 
  }
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  paymentInfo: {
    type: paymentSchema,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Completed'
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
