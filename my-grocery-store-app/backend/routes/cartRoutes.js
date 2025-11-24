 
const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    let cartItems = await CartItem.find({ userId: req.session.user.id }).populate('groceryId');
    // Filter out items with missing grocery information
    cartItems = cartItems.filter(item => item.groceryId);
    // Remove invalid items from database
    await CartItem.deleteMany({ userId: req.session.user.id, groceryId: null });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { groceryId, quantity } = req.body;
  if (!groceryId || quantity < 1) {
    return res.status(400).json({ error: 'Invalid groceryId or quantity' });
  }
  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { userId: req.session.user.id, groceryId },
      { quantity },
      { upsert: true, new: true }
    );
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.put('/:groceryId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { quantity } = req.body;
  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }
  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { userId: req.session.user.id, groceryId: req.params.groceryId },
      { quantity },
      { new: true }
    );
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

router.delete('/:groceryId', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  try {
    await CartItem.deleteOne({ userId: req.session.user.id, groceryId: req.params.groceryId });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
