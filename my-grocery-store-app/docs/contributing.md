# Contributing Guide

Welcome to the Grocery Store App contribution guide! This document provides comprehensive information for developers who want to contribute to the project.

## Getting Started

### Development Environment Setup

1. **Prerequisites**
   ```bash
   # Install Node.js (version 16+)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   sudo apt-get install -y mongodb

   # Install Git
   sudo apt-get install -y git
   ```

2. **Clone and Setup**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork
   git clone https://github.com/yourusername/grocery-store-app.git
   cd grocery-store-app

   # Install dependencies
   npm install

   # Set up environment
   cp .env.example .env
   # Edit .env with your configuration

   # Start MongoDB
   sudo systemctl start mongodb

   # Seed the database
   npm run seed

   # Start development server
   npm run dev
   ```

3. **Verify Setup**
   ```bash
   # Check application is running
   curl http://localhost:3000

   # Check API endpoints
   curl http://localhost:5000/api/groceries
   ```

## Development Workflow

### Branching Strategy

We use a Git flow branching model:

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch for features

# Supporting branches
feature/*     # New features (e.g., feature/user-auth)
bugfix/*      # Bug fixes (e.g., bugfix/login-validation)
hotfix/*      # Critical fixes for production
release/*     # Release preparation
```

### Creating a Feature Branch

```bash
# Sync with upstream
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Commit regularly with descriptive messages
git add .
git commit -m "feat: add user authentication"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```bash
# Format: type(scope): description

# Examples
feat(auth): add JWT token validation
fix(cart): resolve duplicate item issue
docs(api): update endpoint documentation
style(ui): format login component
refactor(db): optimize query performance
test(auth): add login validation tests
chore(deps): update React to v18

# Breaking changes
feat(auth)!: migrate to OAuth2 authentication
```

### Pull Request Process

1. **Create Pull Request**
   - Target branch: `develop` (not `main`)
   - Title: Follow commit message format
   - Description: Include what, why, and how

2. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots of UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] Tests pass
   - [ ] No breaking changes
   ```

3. **Code Review Process**
   - At least one maintainer review required
   - Address review comments
   - CI/CD checks must pass
   - Squash commits before merge

## Code Standards

### JavaScript/React Guidelines

```javascript
// Use ES6+ features
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/orders', data);
    setOrder(response.data);
  } catch (error) {
    console.error('Order submission failed:', error);
  }
};

// Use functional components with hooks
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product, quantity)}>
        Add to Cart
      </button>
    </div>
  );
};

// Use PropTypes for type checking
ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};
```

### CSS/Styling Guidelines

```css
/* Use CSS modules or styled-components */
.productCard {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s ease;
}

.productCard:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Use consistent naming conventions */
.btnPrimary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.btnPrimary:hover {
  background-color: #0056b3;
}
```

### Backend/Node.js Guidelines

```javascript
// Use async/await over promises
const getProducts = async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .populate('category', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Use middleware for common functionality
const auth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!price || price <= 0) {
    errors.push('Valid price is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
```

## Testing Guidelines

### Unit Tests

```javascript
// Use Jest and React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Apple',
    price: 1.99,
    image: '/apple.jpg'
  };

  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it('renders product information', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockOnAddToCart}
      />
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });
});
```

### Integration Tests

```javascript
// Test API endpoints with Supertest
const request = require('supertest');
const app = require('../server');

describe('Product API', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/groceries', () => {
    it('returns empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/groceries')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('returns products when they exist', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 9.99,
        category: categoryId,
        stock: 10
      });

      const response = await request(app)
        .get('/api/groceries')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Product');
    });
  });
});
```

### E2E Tests

```javascript
// Use Cypress for end-to-end testing
describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('test@example.com', 'password');
  });

  it('adds product to cart', () => {
    cy.contains('Apple').parent().find('button').click();
    cy.get('[data-cy=cart-count]').should('contain', '1');
  });

  it('completes checkout process', () => {
    // Add product to cart
    cy.contains('Apple').parent().find('button').click();

    // Go to cart
    cy.get('[data-cy=cart-link]').click();

    // Proceed to checkout
    cy.contains('Checkout').click();

    // Fill payment form
    cy.get('[data-cy=address]').type('123 Main St');
    cy.get('[data-cy=submit-order]').click();

    // Verify success
    cy.contains('Order placed successfully').should('be.visible');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test ProductCard.test.js

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Documentation

### Code Documentation

```javascript
/**
 * Calculates the total price of items in the cart
 * @param {Array} items - Array of cart items
 * @param {string} discountCode - Optional discount code
 * @returns {number} Total price after discount
 */
const calculateTotal = (items, discountCode = null) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  if (discountCode) {
    // Apply discount logic
    return subtotal * 0.9; // 10% discount
  }

  return subtotal;
};
```

### API Documentation

```javascript
/**
 * GET /api/groceries
 * Retrieve all active products
 *
 * Query Parameters:
 * - category: Filter by category ID
 * - search: Search in product names
 * - limit: Maximum number of results (default: 50)
 * - skip: Number of results to skip (default: 0)
 *
 * Response: Array of product objects
 * Status: 200 OK
 */
router.get('/', async (req, res) => {
  // Implementation
});
```

## Code Quality Tools

### Linting

```bash
# ESLint configuration (.eslintrc.js)
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 'error',
    'no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error'
  }
};
```

### Pre-commit Hooks

```bash
# Install husky
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"

# Set up commit-msg hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run linter
      run: npm run lint
    - name: Run tests
      run: npm test
    - name: Build application
      run: npm run build
```

## Security Guidelines

### Input Validation

```javascript
// Server-side validation
const validateUserInput = (req, res, next) => {
  const { email, password } = req.body;

  // Sanitize input
  const sanitizedEmail = validator.escape(email);
  const sanitizedPassword = password.trim();

  // Validate format
  if (!validator.isEmail(sanitizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (sanitizedPassword.length < 6) {
    return res.status(400).json({ error: 'Password too short' });
  }

  req.body.email = sanitizedEmail;
  req.body.password = sanitizedPassword;
  next();
};
```

### Authentication & Authorization

```javascript
// Protect admin routes
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Data Sanitization

```javascript
// Prevent XSS attacks
const sanitizeHtml = (html) => {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// SQL injection prevention (MongoDB)
const safeQuery = (userInput) => {
  // MongoDB is safe from SQL injection, but validate input
  if (typeof userInput !== 'string') {
    throw new Error('Invalid input type');
  }
  return userInput.trim();
};
```

## Performance Guidelines

### Frontend Optimization

```javascript
// Code splitting
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// Memoization
const ProductList = memo(({ products }) => {
  return products.map(product => (
    <ProductCard key={product.id} product={product} />
  ));
});

// Image optimization
const OptimizedImage = ({ src, alt, width, height }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0.5 }}
    />
  );
};
```

### Backend Optimization

```javascript
// Database query optimization
const getProductsOptimized = async (req, res) => {
  const { category, search, limit = 50, skip = 0 } = req.query;

  const pipeline = [
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) }
  ];

  if (category) {
    pipeline.unshift({ $match: { category: ObjectId(category) } });
  }

  if (search) {
    pipeline.unshift({
      $match: {
        $or: [
          { name: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ]
      }
    });
  }

  const products = await Product.aggregate(pipeline);
  res.json(products);
};

// Caching
const cache = require('memory-cache');
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedCategories = async () => {
  const cached = cache.get('categories');
  if (cached) return cached;

  const categories = await Category.find({ isActive: true });
  cache.put('categories', categories, CACHE_DURATION);
  return categories;
};
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, Node version
6. **Screenshots**: If applicable
7. **Console Logs**: Browser and server logs

### Feature Requests

For new features, please provide:

1. **Problem**: What problem does this solve?
2. **Solution**: Proposed implementation
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Screenshots, mockups, etc.

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn
- Maintain professional communication

### Getting Help

- **Documentation**: Check docs first
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions for questions
- **Slack/Discord**: Join community chat (if available)

### Recognition

Contributors are recognized through:
- GitHub contributor statistics
- Mention in release notes
- Contributor spotlight (quarterly)

Thank you for contributing to the Grocery Store App! Your efforts help make this project better for everyone.
