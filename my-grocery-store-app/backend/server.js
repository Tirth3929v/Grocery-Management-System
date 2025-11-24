const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const groceryRoutes = require('./routes/groceryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const discountRoutes = require('./routes/discountRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const Order = require('./models/Order');

const app = express();

// Add to existing routes
const categoryRoutes = require('./routes/categoryRoutes');


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key', // Replace with environment variable in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(bodyParser.json());

// Serve static files from uploads directory with cache control
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.json({ status: 'OK', message: 'Database connected' });
  } else {
    res.status(500).json({ status: 'Error', message: 'Database not connected' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
