const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../uploads/profiles');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'user' });
    await user.save();
    req.session.userId = user._id;
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage };
    res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage } });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage };
      res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.post('/update', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { name, address } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (name) user.name = name;
    if (address !== undefined) user.address = address;
    if (req.file) {
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }
    await user.save();
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage };
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
