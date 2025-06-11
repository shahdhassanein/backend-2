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
app.use('/cars', carRoutes);
// --- VIEW ENGINE SETUP ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'Users Management' }) });
app.get('/addcar', (req, res) => { res.render('addcar', { title: 'ADD car' }) });
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
//.

app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
//console.log('carRoutes.js loaded!'); //debugging lltesting 

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the 'Add Car' form at: http://localhost:${PORT}/cars/add`);
});