const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Welcome to the API Home Page'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
