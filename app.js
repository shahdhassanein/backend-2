<<<<<<< HEAD
// File: app.js
// Load environment variables from .env file at the very top
require('dotenv').config();

// --- CORE & VENDOR IMPORTS ---
=======
// --- Load environment variables ---
require('dotenv').config();

// --- Imports ---
>>>>>>> bbbb297ec6687d1a4a20160afb9fe5ce2d2f13b0
const express = require('express');
const path = require('path');
<<<<<<< HEAD
const session = require('express-session');
const MongoStore = require('connect-mongo');

// --- LOCAL IMPORTS (WITH ADDITIONS) ---
const connectDB = require('./config/db');
const { protect } = require('./middleware/auth'); // Added
const Booking = require('./models/bookingschema');   // Added
const User = require('./models/usersschema');   // Added

const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const adminRoutes = require('./routes/adminRoutes');
=======
>>>>>>> bbbb297ec6687d1a4a20160afb9fe5ce2d2f13b0

// --- Import your MongoDB connection ---
const connectDB = require('./config/db'); // make sure this is a function

// --- App Setup ---
const app = express();
<<<<<<< HEAD
connectDB();

<<<<<<< Updated upstream
// --- USE API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.
// This is the organized way to handle your APIs.
app.use('/api/auth', authRoutes); // <-- USE THE AUTH ROUTES for URLs like /api/auth/login
app.use('/api/bookingsales', bookingsalesroute);
app.use('/api/cars', carRoutes); 
const adminRoutes = require('./routes/adminRoutes'); 
//to connect purchase to the database mfysh booking
=======
// --- MIDDLEWARE CONFIGURATION (Declare only ONCE) ---
>>>>>>> Stashed changes

// 1. Body Parsers
app.use(express.json());
<<<<<<< Updated upstream
app.use(express.static('./public'));
app.use(express.static('./public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/cars', carRoutes); 
=======
app.use(express.urlencoded({ extended: true }));

// 2. Session Middleware (for the "Sessions" requirement)
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

// 3. View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 4. Static Folder Setup
app.use(express.static(path.join(__dirname, 'public')));


// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookingschema', bookingsalesroute);
app.use('/api/admin', adminRoutes);


// --- PAGE RENDERING ROUTES (No Duplicates) ---
>>>>>>> Stashed changes
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/register', (req, res) => { res.render('register', { title: 'Register' }) });
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page' }) });
app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'Purchases' }) });

// THIS IS THE EDITED ROUTE
app.get('/Dashboard', protect, async (req, res) => {
    try {
        const orders = await Booking.find({ user: req.user.id }).populate('car');
        res.render('Dashboard', {
            title: 'My Dashboard',
            user: req.user,
            orders: orders
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send("There was an error loading your dashboard.");
    }
});

app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/carllisting', (req, res) => { res.render('carllisting', { title: 'Car Listing' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/addcar', (req,res)=> { res.render('addcar',{ title:'form for addcar '}) });


// --- SERVER STARTUP ---
=======

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
>>>>>>> bbbb297ec6687d1a4a20160afb9fe5ce2d2f13b0
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
