const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth'); // make sure the user is authenticated

router.post('/add', auth, cartController.addToCart);
router.get('/', auth, cartController.getCart);

module.exports = router;
