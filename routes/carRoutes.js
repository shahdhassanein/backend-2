// routes/carRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const { addCar, getAllCars ,deleteCar} = require('../controllers/carController'); // Make sure getAllCars is imported!

// API route to handle adding a car
router.post('/addcar', addCar); // This will be accessible at /cars/addcar (POST)
router.post('/deletecar', deleteCar);
// Route to display the addcar form (if you want it under /cars/addcar)
// If you access /addcar directly, this route is needed.
// If your app.js handles /addcar, you might not need this here.
router.get('/addcar', (req, res) => { // This will be accessible at /cars/addcar (GET)
  res.render('addcar', { title: 'Add Car' });
});
// DELETE route to remove a car by ID (using POST for simplicity)



// API route to fetch ALL cars (this is your JSON endpoint!)
// This will be accessible at /cars/all
router.get('/all', getAllCars);

// IMPORTANT: DO NOT have a route like this here if app.js handles /carllisting directly
// If you have `router.get('/carllisting', ...)` in THIS file, REMOVE IT.
// The `app.get('/carllisting', ...)` in `app.js` will handle rendering the EJS page.

module.exports = router;