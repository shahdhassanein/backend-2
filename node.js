require('dotenv').config();

const express=require('express');
const mongoose = require('mongoose');
//tells the node.js to go to the routes files and bring whatever exported from it 
const app = express();

const carRoutes= require('./routes/carRoutes');
app.use('/',carRoutes);

app.use(express.static('./public'));

app.listen(3000);