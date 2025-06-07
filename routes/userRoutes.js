const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUserProfile } = require('../controllers/usercontroller');
const { protect } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
