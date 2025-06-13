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
const session = require('express-session'); // Import express-session
const MongoStore = require('connect-mongo'); // Import connect-mongo

// Import your route files
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
// Uncomment the following line ONLY if you have an 'adminRoutes.js' file
// const adminRoutes = require('./routes/adminRoutes');

// Commented out to fix "Cannot find module" error
// const contactRoutes = require('./routes/contactRoutes');


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

// 3. Cookie parser (CRUCIAL: This must run before any middleware that accesses req.cookies)
app.use(cookieParser());

// 4. Serve static files (HTML, CSS, JS, images from 'public' directory)
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public'));

// 5. EJS View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// 6. express-session middleware with MongoStore - This must come BEFORE your custom sessionAuth middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // A strong secret from your .env file
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({ // Use connect-mongo to store sessions in MongoDB
        mongoUrl: process.env.MONGO_URI, // Your MongoDB connection string
        collectionName: 'sessions', // The collection name for your session data
        ttl: 14 * 24 * 60 * 60, // Session TTL (Time To Live) in seconds (e.g., 14 days)
        autoRemove: 'interval', // Auto-remove expired sessions
        autoRemoveInterval: 10 // In minutes
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * (process.env.SESSION_COOKIE_EXPIRE_DAYS || 1), // e.g., 1 day (default 1 day if not set in .env)
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'Lax' // Protects against CSRF in some cases
    }
}));

// NEW: Import your sessionAuth middleware. We will apply it selectively below.
const sessionAuth = require('./middleware/sessionAuth');


// --- MOUNT API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.
// The order here also matters for specificity.
app.use('/api/auth', authRoutes); // Auth routes (e.g., /api/auth/login, /api/auth/logout)
app.use('/addcars', carRoutes); // For adding cars
app.use('/api/bookingsales', bookingsalesroute); // For bookings and sales (includes /api/bookingsales/view-my-purchases)
app.use('/api/cart', cartRoutes); // For cart functionality
// app.use('/admin', require('./routes/adminRoutes')); // If you have admin routes, ensure this is correct
// --- USE API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/cart', require('./routes/cart'));
app.use('/addcars', require('./routes/carRoutes')); 
app.use('/api/bookingsales', require('./routes/bookingsalesroute')); 
app.use('/api/cart', require('./routes/cart')); // Directly require here
app.use('/api/contact', require('./routes/contactRoutes')); 
//app.use('/admin', require('./routes/adminRoutes')); // Ensure this route is handled by adminRoutes for /admin/xyz


// --- RENDER FRONTEND VIEWS (EJS Pages for direct browser navigation) ---

// Public routes (NO sessionAuth middleware applied here)
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page', user: req.user || null }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact', user: req.user || null }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login', user: req.user || null }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy', user: req.user || null }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term', user: req.user || null }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register', user: req.user || null }) });
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing', user: req.user || null})});


// Protected routes (APPLY sessionAuth middleware here)
// These routes will ONLY be accessible if sessionAuth successfully authenticates the user.
app.get('/Dashboard', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('Dashboard', { title: 'Dashboard', user: req.user || null });
});
app.get('/usersmangment', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('usersmangment', { title: 'usersmangment', user: req.user || null });
});
app.get('/admin', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('admin', { title: 'admin page', user: req.user || null });
});
app.get('/admin-orders', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('admin-orders', { title: 'Admin Orders', user: req.user || null });
});
app.get('/checkout', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('checkout', { title: 'Checkout', user: req.user || null });
});
app.get('/cart', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('cart', { title: 'Cart', user: req.user || null });
});
app.get('/inventory', sessionAuth, (req, res) => { // <-- sessionAuth applied here
    res.render('inventory', { title: 'Inventory', user: req.user || null });
});
app.get ('/addcar', sessionAuth, (req,res)=> { // <-- sessionAuth applied here
    res.render ('addcar',{title:'form for addcar ', user: req.user || null});
});
app.get('/mypurchases', sessionAuth, (req, res) => { // Added if this was a protected route
    res.render('mypurchases', { title: 'My Purchases', user: req.user || null });
});


const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
