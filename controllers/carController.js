const Car = require('../models/carsschema');

const addCar = async (req, res) => {
    try {
        const { name, model, price, engine, color, image } = req.body;

        // Basic validation
        if (!name || !model || !price || !engine || !color || !image) {
            // ALWAYS return after sending a response
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newCar = new Car({ name, model, price, engine, color, image });
        await newCar.save();

        // ALWAYS return after sending a response
        return res.status(201).json({ success: true, message: 'Car added successfully!', car: newCar });

    } catch (err) {
        console.error("Error saving car:", err.message);

        // Handle specific MongoDB errors like validation failures
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            // ALWAYS return after sending a response
            return res.status(400).json({ success: false, message: 'Validation failed', errors: errors });
        }

        // Generic error response
        // ALWAYS return after sending a response
        return res.status(500).json({ success: false, message: 'Failed to add car.', error: err.message });
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