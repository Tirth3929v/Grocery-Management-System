const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer to save files to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/categories');
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
  const { name, description } = req.body;
  try {
    const imageUrl = req.file
      ? `/uploads/categories/${req.file.filename}`
      : req.body.image || '/images/Bakery.png';
    const category = new Category({ name, description, image: imageUrl });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to add category' });
  }
});

// Update category
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, description, image: existingImage } = req.body;
  try {
    const updateData = { name, ...(description && { description }) };
    if (req.file) {
      updateData.image = `/uploads/categories/${req.file.filename}`;
    } else if (existingImage) {
      updateData.image = existingImage;
    }
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Add GET route to fetch all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
