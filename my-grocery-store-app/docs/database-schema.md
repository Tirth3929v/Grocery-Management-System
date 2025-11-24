# Database Schema

This document provides a comprehensive overview of the MongoDB database schema used in the Grocery Store App, including collections, indexes, and relationships.

## Database Overview

### Database Name
`grocery-store`

### Connection Configuration
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
```

### Collections
- **users**: User accounts and authentication
- **groceries**: Product catalog
- **categories**: Product categories
- **orders**: Customer orders
- **cartitems**: Shopping cart items
- **discounts**: Discount codes
- **banners**: Promotional banners

## Users Collection

### Schema Definition
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  address: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Unique index on email
userSchema.index({ email: 1 }, { unique: true });

// Index on role for admin queries
userSchema.index({ role: 1 });

// Compound index for user search
userSchema.index({ name: 1, email: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439011')",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$hashedpassword...",
  "address": "123 Main St, City, State 12345",
  "profileImage": "/uploads/profiles/1234567890.jpg",
  "role": "user",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Groceries Collection

### Schema Definition
```javascript
const grocerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'pack'],
    default: 'pcs'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Text index for search
grocerySchema.index({ name: 'text', description: 'text' });

// Index on category for filtering
grocerySchema.index({ category: 1 });

// Index on isActive for active products
grocerySchema.index({ isActive: 1 });

// Compound index for category filtering
grocerySchema.index({ category: 1, isActive: 1 });

// Index on stock for inventory queries
grocerySchema.index({ stock: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439012')",
  "name": "Organic Apples",
  "price": 2.99,
  "image": "/uploads/groceries/1234567890.jpg",
  "category": "ObjectId('507f1f77bcf86cd799439013')",
  "description": "Fresh organic apples from local farms",
  "stock": 100,
  "unit": "kg",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Categories Collection

### Schema Definition
```javascript
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Unique index on name
categorySchema.index({ name: 1 }, { unique: true });

// Index on isActive and sortOrder for ordered queries
categorySchema.index({ isActive: 1, sortOrder: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439013')",
  "name": "Fruits",
  "description": "Fresh fruits and produce",
  "image": "/uploads/categories/1234567890.jpg",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Orders Collection

### Schema Definition
```javascript
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  items: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountApplied: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Index on userId for user order history
orderSchema.index({ userId: 1 });

// Index on status for filtering
orderSchema.index({ status: 1 });

// Index on createdAt for chronological sorting
orderSchema.index({ createdAt: -1 });

// Compound index for user orders by status
orderSchema.index({ userId: 1, status: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439014')",
  "userId": "ObjectId('507f1f77bcf86cd799439011')",
  "userName": "John Doe",
  "address": "123 Main St, City, State 12345",
  "items": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Organic Apples",
      "price": 2.99,
      "quantity": 2
    }
  ],
  "totalAmount": 5.98,
  "discountApplied": "SAVE10",
  "status": "pending",
  "createdAt": "2023-01-01T10:00:00.000Z",
  "updatedAt": "2023-01-01T10:00:00.000Z"
}
```

## CartItems Collection

### Schema Definition
```javascript
const cartItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groceryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grocery',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Compound unique index on userId + groceryId
cartItemSchema.index({ userId: 1, groceryId: 1 }, { unique: true });

// Index on userId for cart queries
cartItemSchema.index({ userId: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439015')",
  "userId": "ObjectId('507f1f77bcf86cd799439011')",
  "groceryId": "ObjectId('507f1f77bcf86cd799439012')",
  "quantity": 2,
  "createdAt": "2023-01-01T09:00:00.000Z",
  "updatedAt": "2023-01-01T09:00:00.000Z"
}
```

## Discounts Collection

### Schema Definition
```javascript
const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  maxUses: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Unique index on code
discountSchema.index({ code: 1 }, { unique: true });

// Index on expiryDate and isActive for active codes
discountSchema.index({ expiryDate: 1, isActive: 1 });

// Index on isActive for active codes query
discountSchema.index({ isActive: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439016')",
  "code": "SAVE10",
  "description": "10% off your order",
  "type": "percentage",
  "value": 10,
  "maxUses": 100,
  "usedCount": 5,
  "expiryDate": "2023-12-31T23:59:59.000Z",
  "isActive": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Banners Collection

### Schema Definition
```javascript
const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
```

### Indexes
```javascript
// Index on isActive and sortOrder for ordered display
bannerSchema.index({ isActive: 1, sortOrder: 1 });
```

### Sample Document
```json
{
  "_id": "ObjectId('507f1f77bcf86cd799439017')",
  "image": "/uploads/banners/1234567890.jpg",
  "title": "Summer Sale",
  "description": "Up to 50% off on fresh produce",
  "link": "/category/fruits",
  "isActive": true,
  "sortOrder": 1,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## Relationships Overview

### Entity Relationships
```
User (1) ──── (many) Order
User (1) ──── (many) CartItem

Category (1) ──── (many) Grocery

Grocery (1) ──── (many) CartItem
Grocery (1) ──── (embedded) Order.items

Order (many) ──── (1) Discount (optional)
```

### Population Strategy
```javascript
// Populate user in orders
const orders = await Order.find().populate('userId', 'name email');

// Populate category in groceries
const products = await Grocery.find().populate('category', 'name image');

// Populate grocery in cart
const cart = await CartItem.find({userId}).populate('groceryId');
```

## Data Validation

### Schema Validation
- **Required Fields**: Enforced at schema level
- **Data Types**: Strict type checking
- **Enum Values**: Restricted to predefined options
- **Custom Validators**: Business logic validation

### Application-Level Validation
- **Cross-Field Validation**: Dependent field checks
- **Business Rules**: Stock availability, discount validity
- **Uniqueness Checks**: Custom uniqueness validation

## Indexing Strategy

### Performance Indexes
- **Single Field**: Frequently queried fields
- **Compound**: Multi-field query optimization
- **Text**: Full-text search capabilities
- **Unique**: Data integrity constraints

### Index Maintenance
- **Monitoring**: Index usage statistics
- **Cleanup**: Remove unused indexes
- **Rebuilding**: Periodic index optimization

## Migration and Seeding

### Seed Data Structure
```javascript
// Initial categories
const categories = [
  { name: 'Fruits', image: '/images/fruits.jpg' },
  { name: 'Vegetables', image: '/images/vegetables.jpg' }
];

// Sample products
const products = [
  {
    name: 'Organic Apples',
    price: 2.99,
    category: categoryId,
    stock: 100
  }
];
```

### Migration Scripts
- **Schema Updates**: Adding new fields
- **Data Transformation**: Updating existing data
- **Index Creation**: New index deployment

## Backup and Recovery

### Backup Strategy
- **Automated Backups**: Daily database dumps
- **Point-in-Time Recovery**: Continuous backup
- **Offsite Storage**: Cloud backup storage

### Recovery Procedures
- **Data Restoration**: Step-by-step recovery process
- **Integrity Checks**: Post-recovery validation
- **Downtime Minimization**: Quick recovery procedures

## Performance Considerations

### Query Optimization
- **Covered Queries**: Indexes covering query fields
- **Projection**: Return only needed fields
- **Pagination**: Limit result sets
- **Aggregation**: Efficient data processing

### Connection Pooling
```javascript
const connection = mongoose.createConnection(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

### Monitoring
- **Slow Queries**: Query performance tracking
- **Connection Stats**: Database connection monitoring
- **Index Usage**: Index effectiveness analysis

This database schema provides a solid foundation for the grocery store application with proper relationships, indexing, and performance optimizations.
