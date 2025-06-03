const mongoose=require('mongoose')
const carSchema = new mongoose.Schema({
  brand: String,
  model: String,
  year: Number,
  color: String,
  price: Number,
  availability: { type: Boolean, default: true }
});
