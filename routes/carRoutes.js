const express = require('express');
const router = express.Router();
const Car = require('../models/carsschema');
const { protect, authorize } = require('../middleware/auth');
const carController = require('../controllers/carController');
router.get('/cars', carController.getAllCars);
router.post("/admin/add-car", async (req, res) => {
  try {
    const { brand, model, year, color, price, imageUrl } = req.body;

    const newCar = new Car({
      brand,
      model,
      year,
      color,
      price,
      imageUrl,
    });

    await newCar.save();
    res.status(200).json({ message: "Car added successfully" });
  } catch (err) {
    console.error("Error saving car:", err);
    res.status(500).json({ error: "Failed to add car" });
  }
});
router.get('/cars/:id', carController.getCarById);
// router.post('/cars', upload.array('images'), carController.createCar);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);
module.exports = router;  // <<-- important export