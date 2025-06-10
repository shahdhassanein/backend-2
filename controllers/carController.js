// backend-2/controllers/carController.js

const Car = require('../models/carsschema'); // Make sure this path is correct for your Car schema

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getAllCars = async (req, res) => {
    try {
        const filters = req.query; // Allows for filtering (e.g., /api/cars?brand=Porsche)
        const cars = await Car.find(filters);
        res.status(200).json(cars); // Send success status with data
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error while fetching cars' });
    }
};

// @desc    Get single car by ID
// @route   GET /api/cars/:id
// @access  Public
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid car ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new car
// @route   POST /api/cars/add (or /api/cars depending on your route setup)
// @access  Private/Admin
exports.createCar = async (req, res) => {
    try {
        // Ensure you destructure all fields required by your schema
        const { name, model, engine, image, price, brand, availability } = req.body;

        const newCar = new Car({
            name,
            model,
            engine,
            image,
            price,
            brand,
            availability // Make sure to include availability if you're sending it
        });

        const createdCar = await newCar.save();
        res.status(201).json({ message: 'Car added successfully!', car: createdCar });
    } catch (error) {
        console.error('Error creating car:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: 'Failed to create car' });
    }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res) => {
    try {
        const updateCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!updateCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(updateCar);
    } catch (error) {
        console.error('Error updating car:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid car ID format' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: 'Failed to update car' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        await car.deleteOne(); // Use deleteOne() for Mongoose 5+
        res.status(200).json({ message: 'Car removed successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid car ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.renderUpdateCarForm = async (req, res) => {
    try {
        const carId = req.params.id;
        
        res.render('updatecar', {
            title: 'Update Car', 
            carId: carId         
        });
    } catch (error) {
        console.error('Error rendering update car form:', error);
        res.status(500).send('Error loading update form.');
    }
};


module.exports = {
    renderUpdateCarForm,
};