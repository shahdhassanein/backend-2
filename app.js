
require('dotenv').config();

console.log('--- Dotenv Load Check ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SESSION_SECRET from .env:', process.env.SESSION_SECRET ? 'SET' : 'NOT SET'); 
console.log('MONGO_URI from .env:', process.env.MONGO_URI ? 'SET' : 'NOT SET'); 
console.log('-------------------------');

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const carRoutes = require('./routes/carRoutes'); 
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
const consentRoutes = require('./routes/consentRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const viewRoutes = require('./routes/viewRoutes');
const contactRoutes = require('./routes/contactRoutes'); 
const adminRoutes = require('./routes/adminroute');

const sessionAuth = require('./middleware/sessionAuth'); 

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use('/', viewRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/bookingsales', bookingsalesroute); 
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes); 
app.use('/api/consent', consentRoutes);
app.use('/api/cars', carRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/register', (req, res) => {res.render('register', { title: 'Register' }) });
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
app.get('/Dashboard', (req, res) => {  res.render('Dashboard', { title: 'Dashboard' });});
app.get('/usersmangment', (req, res) => {res.render('usersmangment', { title: 'User Management' });});
app.get('/admin', (req, res) => {res.render('admin', { title: 'Admin Page' });});

app.get('/admin-orders', (req, res) => {res.render('admin-orders', { title: 'Admin Orders' });});
app.get('/checkout', (req, res) => {res.render('checkout', { title: 'Checkout' });});
app.get('/cart', (req, res) => {res.render('cart', { title: 'Cart' });});
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' });});
app.get('/mypurchases', (req, res) => { res.render('mypurchases', { title: 'My Purchases' });});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});