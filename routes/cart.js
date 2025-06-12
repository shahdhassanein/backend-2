const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth'); // make sure the user is authenticated




router.post('/add', cartController.addToCart); // ✅ ده لازم يكون دالة مش undefined


module.exports = router;
