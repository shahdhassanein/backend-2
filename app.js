// Load environment variables from .env file
require('dotenv').config();

// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db'); // Your database connection function

// --- INITIALIZATION ---
const app = express();

// Connect to Database
connectDB();

// --- MIDDLEWARE ---
// Body parsers: allow us to accept JSON and URL-encoded data
// NOTE: You only need to declare these once!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup (for EJS templates)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Folder Setup (for CSS, images, client-side JS)
// NOTE: You only need one static folder declaration.
app.use(express.static(path.join(__dirname, 'public')));


// --- IMPORT API ROUTES ---
const carRoutes = require('./routes/carRoutes');
const bookingsalesroute = require('./routes/bookingsalesroute');
const adminRoutes = require('./routes/adminRoutes'); 
//to connect purchase to the database mfysh booking

/*console.log('carRoutes:', carRoutes);
console.log('userRoutes:', userRoutes);
console.log('bookingsalesroute:', bookingsalesroute);*/ //hsybo dlw ashan nhdd fyn el error da debugging bs

app.use(express.json());
app.use(express.static('./public'));
// hena al routes ya shabab add it hena 
//app.use('/admin', adminRoutes);
//app.use('/api/cars',carRoutes);
//app.use('/api/users', userRoutes);
//app.use('/api/bookingsales', bookingsalesroute);//purchaseroute
app.use(express.static('./public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

app.get ('/',(req,res)=>{res.render('homepage',{title: 'Home Page'})});
app.get('/usersmangment',(req,res)=>{res.render ('usersmangment',{title:'usersmangment'})});
app.get ('/admin',(req,res)=>{res.render('admin',{title: 'admin page'})});
app.get ('/mypurchases', (req,res)=>{res.render ('purchases',{title:'Purchases'})});
app.get ('/Dashboard',(req,res)=>{res.render ('Dashboard',{title:'Dashboard'})});
app.get ('/Contact', (req,res)=> {res.render('Contact', {title:'Contact'})});
app.get ('/checkout', (req,res)=> {res.render ('checkout',{title:'Checkout'})});
app.get ('/addcar', (req,res)=> {res.render ('addcar',{title:'form for addcar '})});
app.get ('/cart', (req,res)=> {res.render ('cart', {title:'Cart'})});

app.get ('/carllisting.ejs', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
app.get ('/carllisting', (req, res)=> {res.render ('carllisting', {title:'Car Listing'})});
app.get ('/admin-orders', (req,res)=>{res.render ('admin-orders', {title:'Admin Orders'})});
app.get ('/inventory',(req,res)=>{res.render('inventory', {title: 'Inventory'})});
app.get ('/login', (req,res)=>{ res.render ('login', {title:'Login'})});
app.get ('/Privacy', (req,res)=> {res.render ('Privacy', {title:'Privacy'})});
app.get ('/Term', (req,res)=> {res.render ('Term', {titl:'Term'})});
app.get ('/admin-orders', (req,res)=>{res.render ('admin-orders', {title:'Admin Orders'})});
app.post('/api/cars', (req, res) => {
    const newCar = req.body;
    
    res.status(201).json({ message: 'Car added' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});