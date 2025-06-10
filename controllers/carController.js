const Car = require('../models/carsschema');

const addCar = async (req, res) => {
  try {
    const { name, model, price, engine, color, image } = req.body;
    const newCar = new Car({ name, model, price, engine, color, image });
    await newCar.save();
    res.redirect('/addcar'); // or use '/carlisting'
  } catch (err) {
    res.status(500).send('Error saving car: ' + err.message);
  }
};

module.exports = { addCar };
