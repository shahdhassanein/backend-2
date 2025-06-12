// Load environment variables from .env file
require('dotenv').config();

console.log('--- Dotenv Load Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SESSION_SECRET from .env:', process.env.SESSION_SECRET);
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
console.log('-------------------------');

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function
const cookieParser = require('cookie-parser'); // For parsing HTTP-only cookies like the JWT token
const cors = require('cors'); // For enabling Cross-Origin Resource Sharing

// Import your route files
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes'); // From Step 2
const cartRoutes = require('./routes/cart');
// If you have 'adminRoutes.js' uncomment the line below. Otherwise, keep it commented to avoid errors.
// const adminRoutes = require('./routes/adminRoutes');


// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();

// --- MIDDLEWARE ---
// Order of middleware matters here:

// 1. CORS Middleware (if needed for cross-origin requests)
app.use(cors());

// 2. Body parsers (for JSON and URL-encoded data from forms)
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data

// 3. Cookie parser (CRUCIAL: This must run before any middleware that accesses req.cookies, like 'protect' middleware)
app.use(cookieParser());

// 4. Serve static files (HTML, CSS, JS, images from 'public' directory)
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public'));

// 5. EJS View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// 6. Session middleware
const sessionMiddleware = require('./middleware/session'); // From Step 5
app.use(sessionMiddleware);


// --- MOUNT API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/addcars', carRoutes);
app.use('/api/bookingsales', bookingsalesroute);
app.use('/api/cart', cartRoutes);
// Mount admin routes IF they exist. Keep commented if you don't have 'adminRoutes.js'.
// app.use('/admin', adminRoutes);


// --- RENDER FRONTEND VIEWS (EJS Pages for direct browser navigation) ---
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });


app.get('/Dashboard', (req, res) => { res.render('Dashboard', { title: 'Dashboard' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' }) });
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar '})});
//app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})}); 
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});


const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});