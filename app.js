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

// >>> IMPORTANT: Ensure 'cookie-parser' is imported here. This is why it might not be colored if it's missing or misspelled.
const cookieParser = require('cookie-parser'); // For parsing HTTP-only cookies like the JWT token

// Import your route files
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes'); // From Step 2
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/adminRoutes'); // Assuming you have this route defined

// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();


// --- MIDDLEWARE ---
// Order of middleware matters here:

// 1. Body parsers (for JSON and URL-encoded data from forms)
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form data

// 2. Cookie parser (CRUCIAL: This must run before any middleware that accesses req.cookies, like 'protect' middleware)
// This parses incoming cookies from the browser into req.cookies object.
app.use(cookieParser()); // <<< This line correctly applies cookie-parser. It should be colored once this entire file is used and npm install is run.

// 3. Serve static files (HTML, CSS, JS, images from 'public' directory)
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public')); // Keeping this if it was in your original, but it's redundant with the line above.

// 4. EJS View Engine Setup - Tells Express to use EJS for rendering templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// 5. Session middleware (your express-session configuration from middleware/session.js)
// This uses the session configuration from your separate file to avoid duplication.
const sessionMiddleware = require('./middleware/session'); // From Step 5
app.use(sessionMiddleware);

// --- REMOVED / COMMENTED OUT FROM YOUR PREVIOUS app.js ---
// - Duplicate express-session setup (as it's handled by middleware/session.js)
/*
const session = require ('express-session');
const MongoStore = require ('connect-mongo');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
        // secure: true, // Use this in production with HTTPS
    }
}));
*/

// - Old sessionAuth middleware import (as we are using JWT 'protect' for auth)
// const sessionAuth = require('./middleware/sessionAuth');


// --- MOUNT API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.
// The order here also matters for specificity.
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login, /api/auth/logout)
app.use('/addcars', carRoutes); // For adding cars
app.use('/api/bookingsales', bookingsalesroute); // For bookings and sales (includes /api/bookingsales/view-my-purchases)
app.use('/api/cart', cartRoutes); // For cart functionality
// app.use('/admin', require('./routes/adminRoutes')); // If you have admin routes, ensure this is correct


// --- RENDER FRONTEND VIEWS (EJS Pages for direct browser navigation) ---
// These routes handle direct browser navigation to render your EJS templates.
// Crucially, the '/mypurchases' route that caused problems is removed/commented out here.

// Home Page
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });

// Admin/User Management Pages
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });


// --- REMOVED: Problematic `/mypurchases` route from here ---
// This route was causing "purchases is not defined" errors because it rendered 'mypurchases.ejs'
// without passing the 'purchases' data.
// The correct dynamic user purchases page is now ONLY accessed via the protected API route:
// `/api/bookingsales/view-my-purchases` which is defined in routes/bookingsalesroute.js.
// // app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'Purchases', user: req.user }) });


// Dashboard and other public/general EJS pages
// REMOVED: sessionAuth from /Dashboard route, as we are using JWT 'protect'
app.get('/Dashboard', (req, res) => { 
    res.render('Dashboard', { title: 'Dashboard' }); // user data would be passed via req.user if 'protect' used on this route
});

app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) }); // Login page (no user needed initially)
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' }) });
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar '})});
app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})}); 
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});


const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});