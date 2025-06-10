const Car = require('../models/carsschema');

exports.getAllCars = async (req, res) => {
    const filters = req.query;
    try {
        const cars = await Car.find(filters);
        res.json(cars);
    } catch (error) {
        console.error('Error fetching all cars:', error);
        res.status(500).json({ message: 'Server error fetching cars.' });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }
        res.json(car);
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        res.status(500).json({ message: 'Server error fetching car.' });
    }
};

exports.createCar = async (req, res) => {
    try {
        const { name, brand, model, category, price, stock, engine, color, image } = req.body;
        const newCar = await Car.create({ 
            name, brand, model, category, price, stock, engine, color, image 
        });
        res.status(201).json({ message: 'Car added successfully!', car: newCar });
    } catch (error) {
        console.error('Error creating car:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error adding car.' });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            name, brand, model, category, 
            price, stock, engine, color, image 
        } = req.body;

        const car = await Car.findByIdAndUpdate(
            id,
            { name, brand, model, category, price, stock, engine, color, image },
            { new: true, runValidators: true }
        );

        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }

        res.status(200).json({ message: 'Car updated successfully!', car });
    } catch (error) {
        console.error('Error updating car:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while updating car.' });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found.' });
        }
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Server error deleting car.' });
    }
};

const renderUpdateCarForm = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).render('error', { message: 'Car not found.' });
        }

        res.render('updatecar', { car });
    } catch (error) {
        console.error('Error rendering update car form:', error);
        res.status(500).render('error', { message: 'Server error while loading update form.' });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    renderUpdateCarForm,
};