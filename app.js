// Load environment variables from .env file
require('dotenv').config();

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
//const session = require ('express-session');
const MongoStore = require ('connect-mongo');
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function


// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();

const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const authRoutes = require('./routes/authRoutes'); // <-- IMPORT YOUR NEW AUTH ROUTES FILE
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/adminRoutes'); 

// --- USE API ROUTES ---
// This tells Express to use your route files for any URL starting with the specified prefix.
// This is the organized way to handle your APIs.
app.use('/api/auth', authRoutes); // <-- USE THE AUTH ROUTES for URLs like /api/auth/login
app.use('/addcars', carRoutes);
app.use('/api/bookingsales', bookingsalesroute);
app.use('/api/cart', cartRoutes);
//to connect purchase to the database mfysh booking

/*console.log('carRoutes:', carRoutes);
console.log('userRoutes:', userRoutes);
console.log('bookingsalesroute:', bookingsalesroute);*/ //hsybo dlw ashan nhdd fyn el error da debugging bs
//>>>>>>> fbfb4a4ee56a212ecd816ee22d367e9d84f45612
/*app.use(session({
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

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static('./public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));
app.get('/', (req, res) => { res.render('homepage', { title: 'Home Page' }) });
app.get('/usersmangment', (req, res) => { res.render('usersmangment', { title: 'usersmangment' }) });
app.get('/admin', (req, res) => { res.render('admin', { title: 'admin page' }) });
app.get('/mypurchases', (req, res) => { res.render('purchases', { title: 'Purchases' }) });
app.get('/Dashboard', (req, res) => { res.render('Dashboard', { title: 'Dashboard' }) });
app.get('/Contact', (req, res) => { res.render('Contact', { title: 'Contact' }) });
app.get('/checkout', (req, res) => { res.render('checkout', { title: 'Checkout' }) });
app.get('/cart', (req, res) => { res.render('cart', { title: 'Cart' }) });
app.get('/admin-orders', (req, res) => { res.render('admin-orders', { title: 'Admin Orders' }) });
app.get('/inventory', (req, res) => { res.render('inventory', { title: 'Inventory' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' }) });
app.get('/Privacy', (req, res) => { res.render('Privacy', { title: 'Privacy' }) });
app.get('/Term', (req, res) => { res.render('Term', { title: 'Term' }) });
app.get('/login', (req, res) => { res.render('login', { title: 'Login' });});
app.get('/register', (req, res) => {res.render('register', { title: 'Register' });});
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar '})});
app.get ('/cart', (req,res)=> {res.render ('cart', {title:'Cart'})});
app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
app.get ('/admin-orders', (req,res)=>{res.render ('admin-orders', {title:'Admin Orders'})});
const PORT = process.env.PORT || 3000;
const sessionMiddleware = require('./middleware/session');
app.use(sessionMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
