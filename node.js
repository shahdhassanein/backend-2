require('dotenv').config();

const express=require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

//tells the node.js to go to the routes files and bring whatever exported from it 
const app = express();

const carRoutes= require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
//to connect to the database 
connectDB();


app.use(express.json());
app.use(express.static('./public'));

// hena al routes ya shabab add it hena 
app.use('/',carRoutes);
app.use('/api/users', userRoutes);

app.use(express.static('./public'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});//i added it 3ashan bas a3raf law server crashed aw l2 okay.