const Car = require('../models/carsschema');

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.render('carllisting', { title: 'Car Listing', cars });
  } catch (err) {
    res.status(500).send('Error getting cars: ' + err.message);
  }
};

const addCar = async (req, res) => {
  try {
    const { name, model, price, engine, color, image } = req.body;
    const newCar = new Car({ name, model, price, engine, color, image });
    await newCar.save();
    res.redirect('/carllisting');
  } catch (err) {
    res.status(500).send('Error saving car: ' + err.message);
  }
};

module.exports = {
  getAllCars,
  addCar
};
