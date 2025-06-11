const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,
  model: String,
  price: Number,
  engine: String,
  color: String,
  image: String
});

module.exports = mongoose.model('Car', carSchema);
