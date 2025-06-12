const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
const { protect } = require('../middleware/auth');  // Import protect middleware

router.post('/purchase', controller.purchaseCar);

router.get('/my-purchases', controller.getMyPurchases);

router.get('/',  async (req, res) => {
    try {
        const purchases = await controller.getAllPurchases(); // Call a controller function to get ALL purchases
        res.json(purchases); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching all purchases:', error);
        res.status(500).json({ message: 'Server error while fetching all purchases' });
    }
});

router.get('/view-my-purchases', protect, async (req, res) => {
  try {
    const purchases = await controller.getMyPurchasesData(req.user._id);
    res.render('mypurchases', { purchases });  
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).send('Server error while fetching purchases');
  }
});


module.exports = router;


/*const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsalescontroller');
//const auth = require('../middleware/auth');
const { protect } = require('../middleware/auth');

console.log('auth:', typeof auth);
console.log('purchaseCar:', typeof controller.purchaseCar);


router.post('/purchase', protect, controller.purchaseCar);

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

module.exports = router; */
