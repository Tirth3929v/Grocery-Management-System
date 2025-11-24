const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer to save files to disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../uploads/banners');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/uploads/banners/${req.file.filename}`;
    const banner = new Banner({
      imageUrl: imageUrl,
      title: req.body.title || 'New Offer',
      description: req.body.description || 'Check out this deal!',
      discount: req.body.discount || 10,
    });
    await banner.save();

    res.status(201).json({ message: 'Banner uploaded', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/', async (req, res) => {
  const banners = await Banner.find();
  res.json(banners);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      discount: req.body.discount,
    };

    if (req.file) {
      // Delete old image if exists
      const existingBanner = await Banner.findById(id);
      if (existingBanner && existingBanner.imageUrl) {
        const oldImagePath = path.join(__dirname, '../public', existingBanner.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBanner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ message: 'Banner updated', banner: updatedBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    // Delete image file
    if (banner.imageUrl) {
      const imagePath = path.join(__dirname, '../public', banner.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Banner.findByIdAndDelete(id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
