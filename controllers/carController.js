
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

const deleteCar = async (req, res) => {
  try {
    const { id } = req.body; // destructure from JSON
    await Car.findByIdAndDelete(id);
    res.status(200).send("Car removed successfully");
  } catch (err) {
    console.error("❌ Error deleting car:", err.message);
    res.status(500).send("Failed to remove car");
  }
};
const updateCar = async (req, res) => {
  try {
    const { id, name, model, price, engine, color, image } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { name, model, price, engine, color, image },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).send("Car not found");
    }

    res.status(200).send("Car updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating car");
  }
};
module.exports = { addCar,getAllCars ,deleteCar,updateCar };