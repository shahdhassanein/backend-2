const Car = require('../models/carsschema'); // path must be correct

const addCar = async (req, res) => {
  try {
    const { name, model, price, engine, color, image } = req.body;

    const newCar = new Car({ name, model, price, engine, color, image });
    await newCar.save();

    // Flash message-style logic using query parameter
    res.redirect('/admin?message=Car+added+successfully');
  } catch (err) {
    console.error(err.message);
    res.redirect('/admin?message=Failed+to+add+car');
  }
};

module.exports = { addCar }; // <<-- This is important!
