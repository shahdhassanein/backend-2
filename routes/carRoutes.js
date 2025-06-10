// routes/carRoutes.js
const express = require('express');
const router = express.Router(); // Create a new Express router instance
const carController = require('../controllers/carController'); // Import the car controller functions

// Define the GET route for displaying the 'Add Car' form.
// When a GET request is made to `/cars/add` (due to `app.use('/cars', carRoutes)` in `app.js`),
// the `getAddCarForm` function from `carController` will be executed.
router.get('/add', carController.getAddCarForm);

// Define the POST route for submitting the 'Add Car' form.
// When a POST request is made to `/cars/add`, the `addCar` function from `carController`
// will be executed to process the form data and save it to the database.
router.post('/add', carController.addCar);

// Export the router so it can be imported and used in `app.js`.
module.exports = router;