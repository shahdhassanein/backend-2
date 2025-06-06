const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
const auth = require('../middleware/auth');
router.post('/purchase', auth, controller.purchaseCar);
router.get('/my-bookings', auth, controller.getMyBookings);
router.get('/my-purchases', auth, controller.getMyPurchases);
router.put('/booking/:id/status', auth, controller.updateBookingStatus);
router.get('/view-my-bookings', auth, async (req, res) => {
  try {
    const bookings = await controller.getMyBookingsData(req.user.id);
    res.render('mybookings', { bookings });  // ashan a pass el bookings to EJS
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.get('/view-my-purchases', auth, async (req, res) => {
  try {
    const purchases = await controller.getMyPurchasesData(req.user.id);
    res.render('mypurchases', { purchases });  
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;