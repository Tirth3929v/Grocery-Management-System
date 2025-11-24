const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: String,
  groceryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Grocery' },
  quantity: Number,
});

module.exports = mongoose.model('CartItem', cartItemSchema); 
