const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  console.log('Order POST request body:', req.body);
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder._id);

    // Update discount used count if discount was applied
    if (savedOrder.discountApplied) {
      const Discount = require('../models/Discount');
      const discount = await Discount.findOne({ code: savedOrder.discountApplied });
      if (discount && discount.usedCount < discount.limit) {
        discount.usedCount += 1;
        await discount.save();
        console.log('Discount used count updated for:', savedOrder.discountApplied);
      }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }).populate('userId', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
