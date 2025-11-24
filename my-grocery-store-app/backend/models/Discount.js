 
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discountPercentage: Number,
  limit: Number,
  usedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Discount', discountSchema);