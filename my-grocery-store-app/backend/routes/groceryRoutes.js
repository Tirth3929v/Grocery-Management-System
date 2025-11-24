const express = require('express');
const router = express.Router();
const Grocery = require('../models/Grocery');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer to save files to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/groceries');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, category, stock } = req.body;
  try {
    const imageUrl = req.file
      ? `/uploads/groceries/${req.file.filename}`
      : req.body.image || '/images/Almond Milk.png';
    const grocery = new Grocery({ name, price: parseFloat(price), image: imageUrl, category, stock: parseInt(stock) });
    await grocery.save();
    res.status(201).json(grocery);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add product' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;
  try {
    const updateData = { name, price: parseFloat(price), category, stock: parseInt(stock) };
    if (req.file) {
      // Delete old image if exists
      const oldProduct = await Grocery.findById(id);
      if (oldProduct && oldProduct.image && oldProduct.image.startsWith('/uploads/groceries/')) {
        const oldImagePath = path.join(__dirname, '../', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/groceries/${req.file.filename}`;
    }
    const grocery = await Grocery.findByIdAndUpdate(id, updateData, { new: true });
    if (!grocery) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(grocery);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update product' });
  }
});

// Add GET route to fetch all groceries
router.get('/', async (req, res) => {
  try {
    const groceries = await Grocery.find();
    res.json(groceries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch groceries' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const grocery = await Grocery.findById(id);
    if (!grocery) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Delete image file if exists
    if (grocery.image && grocery.image.startsWith('/uploads/groceries/')) {
      const imagePath = path.join(__dirname, '../', grocery.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Grocery.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
