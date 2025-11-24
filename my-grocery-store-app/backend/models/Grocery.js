 
const mongoose = require('mongoose');

const grocerySchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  stock: { type: Number, default: 0 }
});

module.exports = mongoose.model('Grocery', grocerySchema);