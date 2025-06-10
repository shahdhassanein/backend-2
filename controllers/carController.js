
const Car = require('../models/carsschema'); // Ensure this path and filename are correct

// @desc    Get all cars (for API calls or rendering a list)
// @route   GET /api/cars
// @access  Public
exports.getAllCars = async (req, res) => {
    try {
        const filters = req.query; // Allows for filtering (e.g., /api/cars?brand=Porsche)
        const cars = await Car.find(filters);
        // If this route is intended to render your inventory.ejs page,
        // you would use res.render('inventory', { cars }); instead of res.json
        // For now, keeping it as JSON as per previous setup, but be aware for inventory page.
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error while fetching cars' });
    }
};

// @desc    Get single car by ID (for API calls, e.g., for JS on updatecar.ejs)
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
// @route   POST /api/cars/add
// @access  Private/Admin
exports.createCar = async (req, res) => {
    try {
        const { name, model, engine, image, price, brand, category, stock, availability } = req.body; // Added category, stock, availability
        const newCar = new Car({
            name, model, engine, image, price, brand, category, stock, availability
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
        const { id } = req.params;
        // Destructure all fields that can be updated, matching your updatecar.ejs
        const { name, brand, model, category, price, stock, engine, color, image } = req.body;

        const car = await Car.findByIdAndUpdate(
            id,
            { name, brand, model, category, price, stock, engine, color, image },
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car updated successfully!', car });
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

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id); // Simpler than find and deleteOne

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car removed successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid car ID format' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Render the update car form (for rendering EJS view)
// @route   GET /api/cars/update-car-view/:id
// @access  Private/Admin
exports.renderUpdateCarForm = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id); // Fetch the full car object here

        if (!car) {
            return res.status(404).render('error', { message: 'Car not found.' }); // Render error page
        }
        res.render('updatecar', { car }); // Pass the full car object to the EJS template
    } catch (error) {
        console.error('Error rendering update car form:', error);
        res.status(500).render('error', { message: 'Server error while loading update form.' });
    }
};

// Export all the functions that your routes or other parts of your app will use
module.exports = {
    getAllCars: exports.getAllCars,
    getCarById: exports.getCarById,
    createCar: exports.createCar,
    updateCar: exports.updateCar,
    deleteCar: exports.deleteCar,
    renderUpdateCarForm: exports.renderUpdateCarForm,
};