# Database Models

This document details the Mongoose schemas and data models used in the Grocery Store App backend.

## User Model

### File Location
`backend/models/User.js`

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

### Fields Description
- **name**: User's full name (required, trimmed)
- **email**: Unique email address (required, lowercase)
- **password**: Hashed password (required, min 6 chars)
- **address**: Delivery address (required)
- **profileImage**: Path to profile picture (optional)
- **role**: User role for authorization (default: 'user')

### Indexes
- Unique index on email
- Compound index on role for admin queries

### Methods
- `comparePassword(candidatePassword)`: Compares hashed password
- `toJSON()`: Excludes password from JSON output

## Grocery Model

### File Location
`backend/models/Grocery.js`

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

### Fields Description
- **name**: Product name (required)
- **price**: Product price in currency units (required, >=0)
- **image**: Path to product image (required)
- **category**: Reference to Category model (required)
- **description**: Product description (optional)
- **stock**: Available quantity (required, >=0)
- **unit**: Unit of measurement (enum)
- **isActive**: Product availability flag (default: true)

### Indexes
- Text index on name and description for search
- Index on category for filtering
- Index on isActive for active products query

### Virtuals
- `formattedPrice`: Returns price with currency symbol

## Category Model

### File Location
`backend/models/Category.js`

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

### Fields Description
- **name**: Category name (required, unique)
- **description**: Category description (optional)
- **image**: Category image path (required)
- **isActive**: Category visibility (default: true)
- **sortOrder**: Display order (default: 0)

### Indexes
- Unique index on name
- Index on isActive and sortOrder for ordered queries

## Order Model

### File Location
`backend/models/Order.js`

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

### Fields Description
- **userId**: Reference to User model (required)
- **userName**: Customer name at order time (required)
- **address**: Delivery address (required)
- **items**: Array of ordered items with details (required)
- **totalAmount**: Order total (required, >=0)
- **discountApplied**: Applied discount code (optional)
- **status**: Order status (enum, default: 'pending')

### Indexes
- Index on userId for user order history
- Index on status for filtering
- Index on createdAt for chronological sorting

### Methods
- `calculateTotal()`: Recalculates total from items
- `canCancel()`: Checks if order can be cancelled

## CartItem Model

### File Location
`backend/models/CartItem.js`

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

### Fields Description
- **userId**: Reference to User model (required)
- **groceryId**: Reference to Grocery model (required)
- **quantity**: Item quantity in cart (required, >=1)

### Indexes
- Compound unique index on userId + groceryId
- Index on userId for cart queries

## Discount Model

### File Location
`backend/models/Discount.js`

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

### Fields Description
- **code**: Discount code (required, unique, uppercase)
- **description**: Code description (optional)
- **type**: 'percentage' or 'fixed' (required)
- **value**: Discount amount/value (required, >=0)
- **maxUses**: Maximum redemption count (optional)
- **usedCount**: Current usage count (default: 0)
- **expiryDate**: Expiration date (required)
- **isActive**: Code active status (default: true)

### Indexes
- Unique index on code
- Index on expiryDate and isActive for active codes query

### Methods
- `isValid()`: Checks if code is usable
- `canUse()`: Verifies usage limits

## Banner Model

### File Location
`backend/models/Banner.js`

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

### Fields Description
- **image**: Banner image path (required)
- **title**: Banner title (optional)
- **description**: Banner description (optional)
- **link**: Click-through URL (optional)
- **isActive**: Banner visibility (default: true)
- **sortOrder**: Display order (default: 0)

### Indexes
- Index on isActive and sortOrder for ordered display

## Model Relationships

### User Relationships
- User → Orders (one-to-many)
- User → CartItems (one-to-many)

### Product Relationships
- Category → Groceries (one-to-many)
- Grocery → CartItems (one-to-many)
- Grocery → Order.items (embedded)

### Order Relationships
- Order → User (many-to-one)
- Order → Discount (many-to-one, optional)

## Data Validation

### Pre-save Hooks
- Password hashing for User model
- Stock validation for Grocery model
- Total calculation for Order model

### Custom Validators
- Email format validation
- URL format for images and links
- Date validation for expiry dates

## Population

### Common Populations
- Orders populate user details
- CartItems populate grocery details
- Groceries populate category details

### Population Examples
```javascript
// Populate user in orders
const orders = await Order.find().populate('userId', 'name email');

// Populate grocery in cart
const cart = await CartItem.find({userId}).populate('groceryId');
```

## Migration and Seeding

### Seed Data
- Initial categories and products
- Admin user creation
- Sample orders for testing

### Migration Scripts
- Schema updates
- Data transformations
- Index creation

For database schema details, see [Database Schema](./database-schema.md).
