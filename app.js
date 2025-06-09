require('dotenv').config();

const express=require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const path = require('path');

//tells the node.js to go to the routes files and bring whatever exported from it 
const app = express();

//njnjono

const carRoutes= require('../backend-2/routes/carRoutes');
const userRoutes = require('../backend-2/routes/userRoutes');

const bookingsalesroute = require('../backend-2/routes/bookingsalesroute');
//to connect purchase to the database mfysh booking
connectDB();

/*console.log('carRoutes:', carRoutes);
console.log('userRoutes:', userRoutes);
console.log('bookingsalesroute:', bookingsalesroute);*/ //hsybo dlw ashan nhdd fyn el error da debugging bs

app.use(express.json());
app.use(express.static('./public'));

// hena al routes ya shabab add it hena 
app.use('/api/cars',carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookingsales', bookingsalesroute);//purchaseroute
app.use(express.static('./public'));
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{res.render('homepage',{title: 'Home Page'})});
app.get('/admin',(req,res)=>{res.render('admin',{title: 'admin page'})});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});