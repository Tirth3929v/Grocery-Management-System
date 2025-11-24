const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  address: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  discountApplied: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
