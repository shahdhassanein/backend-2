const express = require('express');
const router = express.Router();
const Car = require('../models/carsschema'); // Adjust path if needed

// Route to get all cars for public display on the car listing page
// This will be accessible at /api/cars/all because of app.use('/api/cars', carRoutes)
router.get('/all', async (req, res) => {
    try {
        const cars = await Car.find({}); // Fetch all cars
        res.json(cars); // Send them as JSON
    } catch (error) {
        console.error('Error fetching public cars:', error);
        res.status(500).json({ message: 'Server error. Could not retrieve cars.' });
    }
});

// You can add other public car-related routes here if needed, e.g., router.get('/:id')
// No `protect` or `authorize` middleware here unless the route absolutely requires it for a general user.

module.exports = router;