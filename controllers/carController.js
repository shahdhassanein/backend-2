
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

const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        return res.status(200).json({ success: true, cars });
    } catch (err) {
        console.error("Error fetching cars:", err.message);
        return res.status(500).json({ success: false, message: 'Failed to retrieve cars.', error: err.message });
    }
};


module.exports = { addCar,getAllCars  };