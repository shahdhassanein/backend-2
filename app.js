// Load environment variables from .env file
require('dotenv').config();

console.log('--- Dotenv Load Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SESSION_SECRET from .env:', process.env.SESSION_SECRET ? 'SET' : 'NOT SET'); // Masking value
console.log('MONGO_URI from .env:', process.env.MONGO_URI ? 'SET' : 'NOT SET'); // Masking value
console.log('-------------------------');

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import your route files
const carRoutes = require('./routes/carRoutes'); // Keep this if it's for public car listings
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
const consentRoutes = require('./routes/consentRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const viewRoutes = require('./routes/viewRoutes');
const contactRoutes = require('./routes/contactRoutes'); 

// Import the ADMIN ROUTES (assuming this file contains all car management logic now)
const adminRoutes = require('./routes/adminroute'); // <--- ADD THIS LINE

// Import sessionAuth middleware (your custom auth middleware)
const sessionAuth = require('./middleware/sessionAuth'); 
// IMPORTANT: Assuming 'protect' and 'authorize' are in middleware/auth.js and are imported
// if you use them directly in app.js for some EJS routes (though better handled by router.get)
// const { protect, authorize } = require('./middleware/auth'); // Uncomment if needed here

// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();
app.use(cors());

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Cookie parser (CRUCIAL: Must run before session)
app.use(cookieParser());

// 4. Express-session middleware with MongoStore
app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-fallback-key', // Use fallback for development
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60, // 14 days
        autoRemove: 'interval',
        autoRemoveInterval: 10
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.SESSION_COOKIE_EXPIRE_DAYS) || 1),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
        sameSite: 'Lax'
    }
}));

// *** CRITICAL FIX: Apply your custom sessionAuth middleware GLOBALLY and EARLY ***
// This runs for EVERY request and populates req.user based on session.
// It DOES NOT redirect for public pages (as per the corrected sessionAuth.js).
//app.use(sessionAuth);

// GLOBAL MIDDLEWARE: Make 'user' available to ALL EJS templates via res.locals
// This runs AFTER sessionAuth, so res.locals.user will be correctly populated (or null).
app.use((req, res, next) => {
    res.locals.user = req.user || null; 
    next();
});

// 5. Serve static files
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public'));

// 6. EJS View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));


// --- MOUNT ROUTES ---
// IMPORTANT ORDERING:
// 1. Mount static page view routes first (like /Term, /Privacy) that don't need authentication logic directly.
app.use('/', viewRoutes); 

// 2. Then mount your API routes
// These API routes will use 'protect' middleware which checks JWT tokens.
app.use('/api/auth', authRoutes);
// Keep this if it's for public-facing car listings
app.use('/api/users', userManagementRoutes);
app.use('/api/bookingsales', bookingsalesroute); // This contains /api/bookingsales/my-purchases
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/api/consent', consentRoutes);

// Mount the ADMIN routes (this is the new part)
app.use('/admin', adminRoutes); // <--- ADD THIS LINE: All admin-specific routes will now be under /admin/

// 3. Finally, define your direct EJS page rendering routes.
// These routes will automatically have res.locals.user populated by the global sessionAuth.
// You DO NOT need to add `sessionAuth` middleware directly to these `app.get` lines anymore.
// If you need strict login redirects for EJS pages, add a simple check inside the route.

app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' }) });
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});

// Authenticated/Protected EJS Page Routes
// They now rely on the global sessionAuth and res.locals.user
app.get('/Dashboard', (req, res) => { 
    // Example: if (!req.user) return res.redirect('/login'); // Add this line if STRICT login required
    res.render('Dashboard', { title: 'Dashboard' });
});
app.get('/usersmangment', (req, res) => {
    // Example: if (!req.user || req.user.role !== 'admin') return res.redirect('/login');
    res.render('usersmangment', { title: 'User Management' });
});

// IMPORTANT: This /admin route for EJS rendering should likely redirect
// or apply authentication if it's meant to be the *entry point* for the admin panel.
// However, since your `adminroute` already handles API calls with `protect` and `authorize`,
// your frontend `admin` EJS page (which loads your client-side JS) should be fine
// if it's simply rendering the HTML.
// The client-side JS will then make requests to /admin/all, /admin/addcars, etc.
app.get('/admin', (req, res) => {
    // Example: if (!req.user || req.user.role !== 'admin') return res.redirect('/login');
    res.render('admin', { title: 'Admin Page' }); 
});

app.get('/admin-orders', (req, res) => {
    // Example: if (!req.user || req.user.role !== 'admin') return res.redirect('/login');
    res.render('admin-orders', { title: 'Admin Orders' });
});
app.get('/checkout', (req, res) => {
    // Example: if (!req.user) return res.redirect('/login');
    res.render('checkout', { title: 'Checkout' });
});
app.get('/cart', (req, res) => {
    // Example: if (!req.user) return res.redirect('/login');
    res.render('cart', { title: 'Cart' });
});
app.get('/inventory', (req, res) => {
    // Example: if (!req.user || req.user.role !== 'admin') return res.redirect('/login');
    res.render('inventory', { title: 'Inventory' });
});
app.get('/mypurchases', (req, res) => {
    // Example: if (!req.user) return res.redirect('/login'); // Add this line if STRICT login required
    res.render('mypurchases', { title: 'My Purchases' });
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});