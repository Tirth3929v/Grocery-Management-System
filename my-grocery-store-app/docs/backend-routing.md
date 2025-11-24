# Backend Routing

This document details the Express.js routing structure and middleware used in the Grocery Store App backend.

## Router Structure

Routes are organized by feature in separate files:

```
backend/routes/
├── authRoutes.js      # Authentication routes
├── groceryRoutes.js   # Product management
├── categoryRoutes.js  # Category management
├── cartRoutes.js      # Shopping cart
├── orderRoutes.js     # Order processing
├── discountRoutes.js  # Discount codes
├── bannerRoutes.js    # Banner management
```

## Main Server Setup (server.js)

### Dependencies
```javascript
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
```

### Middleware Configuration
```javascript
// CORS setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true in production with HTTPS
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Route Registration
```javascript
app.use('/api/auth', authRoutes);
app.use('/api/groceries', groceryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/banners', bannerRoutes);
```

## Authentication Routes (authRoutes.js)

### Middleware
- **bcrypt**: Password hashing
- **express-validator**: Input validation

### Routes
```javascript
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('address').notEmpty()
], registerUser);

router.post('/login', loginUser);
router.post('/logout', logoutUser);
```

### Controller Functions
- **registerUser**: Create new user with hashed password
- **loginUser**: Verify credentials and create session
- **logoutUser**: Destroy session

## Grocery Routes (groceryRoutes.js)

### Middleware
- **multer**: File upload handling
- **auth**: Session-based authentication
- **adminAuth**: Admin role verification

### File Upload Configuration
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/groceries/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});
```

### Routes
```javascript
router.get('/', getGroceries);
router.post('/', adminAuth, upload.single('image'), createGrocery);
router.put('/:id', adminAuth, upload.single('image'), updateGrocery);
router.delete('/:id', adminAuth, deleteGrocery);
```

### Controller Functions
- **getGroceries**: Fetch products with filtering and pagination
- **createGrocery**: Create product with image upload
- **updateGrocery**: Update product details
- **deleteGrocery**: Remove product

## Category Routes (categoryRoutes.js)

Similar structure to grocery routes with image upload for category icons.

### Routes
```javascript
router.get('/', getCategories);
router.post('/', adminAuth, upload.single('image'), createCategory);
router.put('/:id', adminAuth, upload.single('image'), updateCategory);
router.delete('/:id', adminAuth, deleteCategory);
```

## Cart Routes (cartRoutes.js)

### Middleware
- **auth**: User authentication required

### Routes
```javascript
router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:groceryId', auth, updateCartItem);
router.delete('/:groceryId', auth, removeFromCart);
```

### Controller Functions
- **getCart**: Retrieve user's cart with populated product details
- **addToCart**: Add or increment cart item
- **updateCartItem**: Change quantity
- **removeFromCart**: Delete cart item

## Order Routes (orderRoutes.js)

### Routes
```javascript
router.get('/', auth, getOrders);
router.post('/', auth, createOrder);
router.put('/:id', adminAuth, updateOrderStatus);
```

### Controller Functions
- **getOrders**: Admin sees all, users see their orders
- **createOrder**: Process cart into order, update inventory
- **updateOrderStatus**: Admin updates order status

## Discount Routes (discountRoutes.js)

### Routes
```javascript
router.get('/', adminAuth, getDiscounts);
router.post('/', adminAuth, createDiscount);
router.put('/:id', adminAuth, updateDiscount);
router.delete('/:id', adminAuth, deleteDiscount);
router.post('/validate', auth, validateDiscount);
```

### Controller Functions
- **validateDiscount**: Check discount code validity and usage

## Banner Routes (bannerRoutes.js)

### Routes
```javascript
router.get('/', getBanners);
router.post('/', adminAuth, upload.single('image'), createBanner);
router.put('/:id', adminAuth, upload.single('image'), updateBanner);
router.delete('/:id', adminAuth, deleteBanner);
```

## Custom Middleware

### Authentication Middleware
```javascript
const auth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};
```

### Admin Authorization Middleware
```javascript
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.role === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Admin access required' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

## Error Handling

### Global Error Handler
```javascript
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});
```

### Route-Level Error Handling
```javascript
router.post('/register', async (req, res) => {
  try {
    // Route logic
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

## Validation

### Input Validation
Using express-validator for request validation:

```javascript
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 1 }),
  body('address').trim().isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  // Continue with registration
});
```

## File Upload Handling

### Storage Configuration
- **Destination**: Organized by type (groceries, categories, banners, profiles)
- **Naming**: Timestamp + random string to prevent conflicts
- **Limits**: 5MB per file, image types only

### Security Considerations
- File type validation
- Size limits
- Path traversal protection
- Unique filenames

## Performance Optimizations

### Database Queries
- Proper indexing on frequently queried fields
- Population of related documents
- Pagination for large result sets

### Caching
- Static file caching headers
- Session store optimization

### Rate Limiting
- Not implemented (future enhancement)
- Could use express-rate-limit

## Testing

### Route Testing
- Unit tests for controller functions
- Integration tests for full request/response cycles
- Authentication middleware testing

### Middleware Testing
- Authentication flow testing
- File upload validation testing
- Error handling verification

## Future Enhancements

### API Versioning
- URL-based versioning (/api/v1/)
- Header-based versioning

### Rate Limiting
- Per-user and per-IP limits
- Different limits for different endpoints

### Request Logging
- Morgan middleware for request logging
- Structured logging with Winston

### API Documentation
- Swagger/OpenAPI integration
- Auto-generated documentation

### Caching Layer
- Redis for session storage
- API response caching

This routing structure provides a solid foundation for the application's API, with proper separation of concerns and security measures.
