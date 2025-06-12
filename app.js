// Load environment variables from .env file
require('dotenv').config();

console.log('--- Dotenv Load Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV); // Check if any env var is loaded
console.log('SESSION_SECRET from .env:', process.env.SESSION_SECRET);
console.log('MONGO_URI from .env:', process.env.MONGO_URI);
console.log('-------------------------');
// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function
const sessionAuth = require('./middleware/sessionAuth'); // <--- ADD THIS IMPORT!


// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();

// --- MIDDLEWARE ---
// Order matters!
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded form data (important for logins/forms)

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET, // Make sure this is in your .env file
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI // Make sure this is in your .env file
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
        // secure: true, // Use this in production with HTTPS
    }
}));

app.use(express.static(path.join(__dirname,'public')));

// Set the view engine to EJS and specify views directory
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));

// --- USE API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/addcars', require('./routes/carRoutes')); 
app.use('/api/bookingsales', require('./routes/bookingsalesroute')); 
app.use('/api/cart', require('./routes/cart')); // Directly require here
//app.use('/admin', require('./routes/adminRoutes')); // Ensure this route is handled by adminRoutes for /admin/xyz

app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page', user: req.user }) }); // Pass user to homepage too
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment', user: req.user }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page', user: req.user }) });
app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'Purchases', user: req.user }) });

app.get('/Dashboard', sessionAuth, (req, res) => { 
    res.render('Dashboard', { title: 'Dashboard', user: req.user }); 
});

app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact', user: req.user }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout', user: req.user }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart', user: req.user }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders', user: req.user }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory', user: req.user }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) }); // Login page doesn't need user initially
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy', user: req.user }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term', user: req.user }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' }) });
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar ', user: req.user })});
app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing', user: req.user })}); // If you're linking to .ejs directly
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing', user: req.user })});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});