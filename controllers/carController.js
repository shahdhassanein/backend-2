
const Car = require('../models/carsschema'); // path must be correct
const addCar = async (req, res) => {
  try {
    const { name, model, price, engine, color, image } = req.body;

    const newCar = new Car({ name, model, price, engine, color, image });
    await newCar.save();

    res.status(201).json({ message: 'Car added successfully', car: newCar }); // ✅
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to add car' }); // ✅
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
module.exports = { addCar,deleteCar,updateCar };

