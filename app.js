// --- Load environment variables ---
require('dotenv').config();

// --- Imports ---
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// --- Import your MongoDB connection ---
const connectDB = require('./config/db'); // make sure this is a function

// --- App Setup ---
const app = express();

// --- Connect to MongoDB ---
connectDB(); // This must be a function that connects using mongoose

// --- Middleware ---
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON
app.use(express.static(path.join(__dirname, 'public'))); // Static files

// --- View Engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Import Routes ---
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');

// --- Use Routes ---
app.use('/cars', carRoutes);
app.use('/bookingsales', bookingsalesroute);

// --- Render Pages ---
app.get('/', (req, res) => res.render('homepage', { title: 'Home Page' }));
app.get('/addcar', (req, res) => res.render('addcar', { title: 'Add Car' }));
app.get('/admin', (req, res) => res.render('admin', { title: 'Admin Page' }));
app.get('/usersmangment', (req, res) => res.render('usersmangment', { title: 'Users Management' }));
app.get('/mypurchases', (req, res) => res.render('purchases', { title: 'My Purchases' }));
app.get('/Dashboard', (req, res) => res.render('Dashboard', { title: 'Dashboard' }));
app.get('/Contact', (req, res) => res.render('Contact', { title: 'Contact' }));
app.get('/checkout', (req, res) => res.render('checkout', { title: 'Checkout' }));
app.get('/cart', (req, res) => res.render('cart', { title: 'Cart' }));
app.get('/admin-orders', (req, res) => res.render('admin-orders', { title: 'Admin Orders' }));
app.get('/inventory', (req, res) => res.render('inventory', { title: 'Inventory' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
app.get('/Privacy', (req, res) => res.render('Privacy', { title: 'Privacy' }));
app.get('/Term', (req, res) => res.render('Term', { title: 'Term' }));
app.get('/register', (req, res) => res.render('register', { title: 'Register' }));
app.get('/carllisting', (req, res) => res.render('carllisting', { title: 'Car Listing' }));

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
