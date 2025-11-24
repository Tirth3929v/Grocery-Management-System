const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: String,
  description: String,
  discount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Banner', bannerSchema);