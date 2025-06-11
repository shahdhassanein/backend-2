
const express = require('express');
const path = require('path');
const router = express.Router();
const { addCar } = require('../controllers/carController');

// Route to handle adding a car via POST (JSON body)
router.post('/addcar', addCar);
router.get('/addcar', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/addcar.html'));
});

module.exports = router;

