// app.js
// Load environment variables from .env file
require('dotenv').config();

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose'); // Mongoose is already imported, good.
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function

// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB(); // Call the database connection function

// --- ROUTE IMPORTS ---
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
// --- MIDDLEWARE ---
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// --- VIEW ENGINE SETUP ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


// --- API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.


// Mount carRoutes for '/cars' base path.
// This is where the logic for GET /cars/add and POST /cars/add will be handled
// by your carRoutes.js file and carController.js.
//app.use('/addcar', carRoutes);

// If you have admin-specific routes, uncomment and use like this:
// app.use('/admin', adminRoutes);


// --- FRONTEND ROUTES (rendering EJS templates) ---
// These routes directly render EJS files, often used for serving web pages.
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'Users Management' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'Admin Page' }) });
app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'My Purchases' }) });
app.get('/Dashboard', (req, res) => { res.render('Dashboard', { title: 'Dashboard' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' });});

// The '/addcar' route is now handled by the carRoutes.js
// so you can remove this specific GET route handler if you want
// to solely rely on the carRoutes.js for '/cars/add'.
// If you keep it, `app.get('/addcar')` will take precedence over
// `app.use('/cars', carRoutes)` for the exact path `/addcar` if it's placed earlier.
// However, the cleanest approach is to have `/cars/add` be the only way to access it.
// I've kept it for now, but note the potential redundancy.
app.get('/addcar', (req, res) => {
    // If you intend for this to be `/addcar` directly, and not `/cars/add`,
    // then this line is fine. But for consistency with MVC, it's often preferred
    // to keep all car-related routes under the `/cars` prefix.
    // If you want this to use the controller, you'd call `carController.getAddCarForm` here.
    res.render('addcar', { title: 'Add Car Form', error: undefined, success: undefined });
});


app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
//console.log('carRoutes.js loaded!'); //debugging lltesting 

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the 'Add Car' form at: http://localhost:${PORT}/cars/add`);
});