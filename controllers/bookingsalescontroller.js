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
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};
exports.getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;
    const purchases = await Purchase.find({ userId });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    await Booking.findByIdAndUpdate(bookingId, { status });
    res.json({ message: 'Booking status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};