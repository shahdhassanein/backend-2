const express = require('express');
const router = express.Router();
const { addCar } = require('../controllers/carController');
router.post('/addcar', addCar);
router.get('/addcar', (req, res) => {
  res.render('addcar'); // assuming you have views/addcar.ejs
});
router.post('/addcar', protect, admin, carController.createCar);
router.put('/:id', protect, admin, carController.updateCar); 
router.delete('/:id', protect, admin, carController.deleteCar);
module.exports = router;
module.exports = router;
