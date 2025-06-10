// controllers/carController.js
const Car = require('../models/carsschema'); // Import the Car Mongoose model

// Controller function to render the 'Add Car' form.
// This function is responsible for preparing data for the view
// and instructing Express to render the `addcar.ejs` template.
exports.getAddCarForm = (req, res) => {
    // Render the 'addcar' EJS template.
    // We pass initial values for 'title', 'error', and 'success'
    // to ensure the template has these variables available when first loaded.
    res.render('addcar', {
        title: 'Add New Car',
        error: undefined,   // No error initially
        success: undefined  // No success message initially
    });
};

// Controller function to handle the submission of the 'Add Car' form.
// This function extracts data from the request body, creates a new car document,
// saves it to the database, and then re-renders the form with a success or error message.
exports.addCar = async (req, res) => {
    // Destructure the form fields from `req.body`.
    // These names ('name', 'model', etc.) must match the 'name' attributes of your HTML form inputs.
    const { name, model, price, engine, color, image } = req.body;

    try {
        // Create a new instance of the Car model with the data from the form.
        const newCar = new Car({
            name,
            model,
            price,
            engine,
            color,
            image
        });

        // Save the new car document to the MongoDB database.
        // `await` ensures that this operation completes before proceeding.
        await newCar.save();

        console.log('Car saved successfully!'); // Log success to the server console

        // Re-render the 'addcar' form, this time with a success message.
        // We also reset the error message to 'undefined'.
        res.render('addcar', {
            title: 'Add New Car',
            success: 'Car added successfully!',
            error: undefined
        });
    } catch (err) {
        // If an error occurs during saving (e.g., validation error, database connection issue),
        // log the error and re-render the form with an error message.
        console.error('Error saving car:', err.message);

        let errorMessage = 'Failed to add car. Please try again.';

        // If it's a Mongoose validation error, extract specific error messages.
        if (err.name === 'ValidationError') {
            errorMessage = Object.values(err.errors).map(val => val.message).join(', ');
        }

        // Re-render the 'addcar' form, passing the error message.
        // We also reset the success message to 'undefined'.
        res.render('addcar', {
            title: 'Add New Car',
            error: errorMessage,
            success: undefined
        });
    }
};