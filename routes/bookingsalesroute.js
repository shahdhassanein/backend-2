const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
const auth = require('../middleware/auth');

router.post('/purchase', auth, controller.purchaseCar);

router.get('/my-purchases', auth, controller.getMyPurchases);

router.get('/view-my-purchases', auth, async (req, res) => {
  try {
    const purchases = await controller.getMyPurchasesData(req.user._id);
    res.render('mypurchases', { purchases });  
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).send('Server error while fetching purchases');
  }
});

module.exports = router;
