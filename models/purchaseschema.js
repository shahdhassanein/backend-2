const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  paymentInfo: { type: Object },
  purchaseDate: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Purchase', purchaseSchema);