const Booking = require('../models/bookingschema'); 
const Purchase = require('../models/purchaseschema');
exports.purchaseCar = async (req, res) =>
  {
  try {
    const { userId, carId, paymentInfo } = req.body;
    const newPurchase = new Purchase({ userId, carId, paymentInfo });
    await newPurchase.save();
    res.status(201).json({ message: 'Car reserved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reserve car' });
  }
};