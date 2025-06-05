const express=require('express');
const mongoose=require('monoose');
//tells the node.js to go to the routes files and bring whatever exported from it 
const carRoutes= require('./routes/carRoutes');
app.use('/',carRoutes);
const app=express();
app.use(express.static('./public'));

app.listen(3000);