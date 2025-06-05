const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
const auth = require('../middleware/auth');
router.post('/purchase', auth, controller.purchaseCar);
router.get('/my-bookings', auth, controller.getMyBookings);
router.get('/my-purchases', auth, controller.getMyPurchases);
router.put('/booking/:id/status', auth, controller.updateBookingStatus);

module.exports = router;