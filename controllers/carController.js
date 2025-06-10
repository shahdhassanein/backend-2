// Function to render the add car form
exports.addCarForm = (req, res) => {
    // Make sure the view name here matches your EJS file name (e.g., 'addcar.ejs')
    res.render('addcar', {
        title: 'Add New Car',
        error: req.flash('error'),
        success: req.flash('success')
    });
};

// Function to handle the submission of the add car form (renamed to createCar)
exports.createCar = (req, res) => {
    const { name, model, price, engine, color, image } = req.body;

    if (!name || !model || !price || !engine || !color || !image) {
        req.flash('error', 'All fields are required!');
        // Redirect to the correct path, which should be the GET route for displaying the form
        return res.redirect('/addcar');
    }

    // In a real application, you'd save this data to a database.
    console.log('Car added:', { name, model, price, engine, color, image });
    req.flash('success', 'Car added successfully!');
    // Redirect to the correct path after successful submission
    res.redirect('/addcar');
};