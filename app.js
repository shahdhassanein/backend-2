// Load environment variables from .env file
require('dotenv').config();

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
//const session = require ('express-session'); // Commented out in your original, keeping as is
const MongoStore = require ('connect-mongo'); // Kept as is, though session is commented out
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function


// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();

const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/adminRoutes'); // Assuming you have this route defined


// --- MIDDLEWARE ---
// Ensure these are before your routes that handle JSON/URL-encoded bodies
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded form submissions

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public')); // Redundant with the line above but kept as per your original

// EJS View Engine Setup
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));

// Session middleware (kept commented out as in your original)
/*
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
    }
}));
*/
// Assuming you have this session middleware in a separate file
const sessionMiddleware = require('./middleware/session');
app.use(sessionMiddleware);


// --- USE API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.
app.use('/api/auth', authRoutes); 
app.use('/addcars', carRoutes);
app.use('/api/bookingsales', bookingsalesroute); // This mounts your bookingsales routes, including /api/bookingsales/view-my-purchases
app.use('/api/cart', cartRoutes);


// --- RENDER FRONTEND VIEWS (EJS Pages) ---

// Home Page
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });

// Admin/User Management Pages
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });

//app.get('/mypurchases', (req, res) => { res.render('mypurchases', { title: 'Purchases' }) });
// PROBLEM LINE FROM YOUR ORIGINAL CODE (previously line 60):
// This route was trying to render a view named "purchases" which does not exist,
// and it did not fetch dynamic purchase data.
// The correct dynamic route for "My Purchases" is '/view-my-purchases' 
// which is handled by your bookingsalesroute.js (mounted above).
// This line is commented out to prevent the "Failed to lookup view" error.
// If you navigate to '/mypurchases' now, it will likely result in a 404.
// Make sure your frontend navigation links to '/view-my-purchases' for dynamic data.
// app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'Purchases' }) }); 


// Other Frontend Pages
app.get('/Dashboard', (req, res) => { res.render('Dashboard', { title: 'Dashboard' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' });});
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar '})});
app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})}); // Redundant, better to use /carllisting
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
