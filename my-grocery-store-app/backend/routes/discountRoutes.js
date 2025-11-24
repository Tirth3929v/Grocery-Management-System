 
const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');

router.get('/', async (req, res) => {
  const discounts = await Discount.find();
  res.json(discounts);
});

router.post('/apply', async (req, res) => {
  const { code } = req.body;
  const discount = await Discount.findOne({ code });
  if (discount && discount.usedCount < discount.limit) {
    await Discount.updateOne({ code }, { $inc: { usedCount: 1 } });
    res.json(discount);
  } else {
    res.status(400).json({ error: 'Invalid or expired discount code' });
  }
});

// Add to existing discountRoutes.js
router.post('/', async (req, res) => {
  const { code, discountPercentage, limit } = req.body;
  try {
    const discount = new Discount({ code, discountPercentage, limit });
    await discount.save();
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add discount' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discount' });
  }
});

module.exports = router;
