const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  engine: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  image: {
    type: String, // can be a URL or filename
    required: true
  }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
