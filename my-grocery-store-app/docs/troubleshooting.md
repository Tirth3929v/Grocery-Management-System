# Troubleshooting Guide

This comprehensive troubleshooting guide helps diagnose and resolve common issues encountered while developing, deploying, and maintaining the Grocery Store App.

## Development Environment Issues

### Node.js Installation Problems

**Issue**: `node: command not found`
```
$ node --version
bash: node: command not found
```

**Solutions**:
```bash
# Check if Node.js is installed
which node

# Install Node.js using NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Issue**: Permission denied when installing global packages
```
npm ERR! Error: EACCES: permission denied
```

**Solutions**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use a Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### MongoDB Connection Issues

**Issue**: MongoDB connection refused
```
MongoNetworkError: failed to connect to server localhost:27017
```

**Solutions**:
```bash
# Start MongoDB service
sudo systemctl start mongod

# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB manually
mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log

# Check if port 27017 is open
netstat -tlnp | grep 27017

# Test connection
mongo --eval "db.stats()"
```

**Issue**: Authentication failed
```
MongoError: Authentication failed
```

**Solutions**:
```bash
# Connect with authentication
mongo -u username -p password --authenticationDatabase admin

# Check user credentials
mongo admin --eval "db.system.users.find()"

# Reset user password
mongo admin
db.changeUserPassword("username", "newpassword")
```

### Dependency Installation Issues

**Issue**: npm install fails with network errors
```
npm ERR! network request to https://registry.npmjs.org/ failed
```

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Use different registry
npm config set registry https://registry.npmjs.org/

# Use npm with verbose logging
npm install --verbose

# Check network connectivity
ping registry.npmjs.org

# Use yarn as alternative
npm install -g yarn
yarn install
```

**Issue**: Package version conflicts
```
npm ERR! Conflicting peer dependencies
```

**Solutions**:
```bash
# Use npm resolutions
# In package.json
"resolutions": {
  "package-name": "specific-version"
}

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use npm-force-resolutions
npm install --save-dev npm-force-resolutions
npx npm-force-resolutions
npm install
```

## Application Startup Issues

### Port Already in Use

**Issue**: `Error: listen EADDRINUSE: address already in use :::5000`
```
events.js:183
      throw er; // Unhandled 'error' event
      ^
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:
```bash
# Find process using the port
lsof -i :5000
netstat -tlnp | grep :5000

# Kill the process
kill -9 <PID>

# Or change the port in environment
PORT=5001 npm start

# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Environment Variables Not Loading

**Issue**: Application uses default values instead of .env values
```
Connected to MongoDB: mongodb://localhost:27017/grocery-store
```

**Solutions**:
```bash
# Check if .env file exists
ls -la .env

# Verify .env content
cat .env

# Install dotenv package
npm install dotenv

# Ensure dotenv is loaded at the top of server.js
require('dotenv').config();

# Check environment variable loading
node -e "console.log(process.env.MONGODB_URI)"
```

### Database Seeding Issues

**Issue**: Seed script fails with validation errors
```
ValidationError: Path `name` is required
```

**Solutions**:
```bash
# Check seed data format
cat backend/data/products.json

# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('backend/data/products.json', 'utf8')).length)"

# Run seed script with debug
DEBUG=* npm run seed

# Clear existing data first
mongo grocery-store --eval "db.dropDatabase()"
```

## Frontend Development Issues

### React Compilation Errors

**Issue**: Module not found errors
```
Module not found: Can't resolve './components/ProductCard'
```

**Solutions**:
```bash
# Check file existence and path
ls -la src/components/ProductCard.js

# Verify import statement
# Correct: import ProductCard from './components/ProductCard'
# Incorrect: import ProductCard from './components/ProductCard.jsx'

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for case sensitivity (Linux/Mac)
mv src/components/productcard.js src/components/ProductCard.js
```

**Issue**: Hot reload not working
```
[HMR] Waiting for update signal from WDS...
```

**Solutions**:
```bash
# Check webpack dev server
ps aux | grep webpack

# Restart development server
npm run dev

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Linux/Windows), Cmd+Shift+R (Mac)

# Check for file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### CORS Issues

**Issue**: CORS policy blocking requests
```
Access to XMLHttpRequest at 'http://localhost:5000/api/products'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions**:
```javascript
// In backend server.js, ensure CORS is configured
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Check frontend API calls include credentials
fetch('/api/products', {
  credentials: 'include'
});
```

### State Management Issues

**Issue**: React state not updating
```javascript
const [products, setProducts] = useState([]);
useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  const response = await fetch('/api/products');
  const data = await response.json();
  setProducts(data); // This doesn't trigger re-render
};
```

**Solutions**:
```javascript
// Ensure state updates are immutable
setProducts([...data]);

// Or use functional update
setProducts(prevProducts => [...prevProducts, ...data]);

// Check for dependency array issues
useEffect(() => {
  fetchProducts();
}, []); // Empty array means run once

// Debug with console logs
console.log('Products updated:', products);
```

## API and Backend Issues

### Authentication Problems

**Issue**: Session not persisting
```
401 Unauthorized
```

**Solutions**:
```javascript
// Check session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Verify session middleware order
app.use(session({...}));
app.use(express.json()); // After session
```

**Issue**: Password hashing fails
```
Error: data and hash arguments required
```

**Solutions**:
```javascript
// Use bcrypt properly
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### File Upload Issues

**Issue**: Multer file upload fails
```
MulterError: Unexpected field
```

**Solutions**:
```javascript
// Check multer configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

// Ensure form data is sent correctly
const formData = new FormData();
formData.append('image', file);
formData.append('name', productName);

fetch('/api/products', {
  method: 'POST',
  body: formData
});
```

### Database Query Issues

**Issue**: Mongoose queries return empty results
```javascript
const products = await Product.find({ category: categoryId });
// Returns []
```

**Solutions**:
```javascript
// Check data types
console.log(typeof categoryId); // Should be ObjectId or string

// Convert string to ObjectId if needed
const { ObjectId } = require('mongoose').Types;
const products = await Product.find({ category: new ObjectId(categoryId) });

// Verify data exists
await Product.find().limit(5) // Check if any products exist

// Check indexes
db.products.getIndexes()
```

## Production Deployment Issues

### PM2 Process Management

**Issue**: PM2 process crashes immediately
```
PM2        | App [grocery-store:0] exited with code [1]
```

**Solutions**:
```bash
# Check application logs
pm2 logs grocery-store

# Test application manually
node backend/server.js

# Check for missing dependencies
npm ls --depth=0

# Verify environment variables
pm2 show grocery-store
```

**Issue**: PM2 cluster mode not working
```
PM2        | [PM2] Spawning PM2 daemon with pm2_home=/home/user/.pm2
```

**Solutions**:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'grocery-store',
    script: 'backend/server.js',
    instances: 1, // Start with 1, then scale
    exec_mode: 'fork', // Use fork first, then cluster
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

### Nginx Configuration Issues

**Issue**: 502 Bad Gateway
```
502 Bad Gateway nginx/1.18.0
```

**Solutions**:
```nginx
# Check Nginx configuration
sudo nginx -t

# Verify upstream server is running
curl http://localhost:5000

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Update nginx config
server {
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL Certificate Issues

**Issue**: SSL certificate expired
```
NET::ERR_CERT_DATE_INVALID
```

**Solutions**:
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot certonly --standalone -d yourdomain.com

# Update Nginx and reload
sudo systemctl reload nginx
```

## Performance Issues

### Memory Leaks

**Issue**: Application memory usage keeps growing
```
PM2        | Memory: 500MB
```

**Solutions**:
```javascript
// Monitor memory usage
const memUsage = process.memoryUsage();
console.log(memUsage);

// Use memory monitoring
const heapdump = require('heapdump');
setInterval(() => {
  heapdump.writeSnapshot();
}, 60000); // Every minute

// Check for circular references
// Use weak maps for caches
const cache = new WeakMap();
```

### Slow Database Queries

**Issue**: Queries taking too long
```
[Mongoose] Query took 5000ms
```

**Solutions**:
```javascript
// Add indexes
db.products.createIndex({ category: 1, isActive: 1 });

// Use explain() to analyze queries
db.products.find({ category: categoryId }).explain('executionStats');

// Optimize population
Product.find().populate('category', 'name').lean();

// Use aggregation pipeline for complex queries
Product.aggregate([
  { $match: { isActive: true } },
  { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } }
]);
```

### Frontend Performance

**Issue**: Large bundle size
```
Built at: 12/01/2023 10:00 AM
Asset      Size
bundle.js  2.5MB
```

**Solutions**:
```javascript
// Code splitting
const ProductList = lazy(() => import('./components/ProductList'));

// Optimize bundle
// In webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}

// Use dynamic imports
const module = await import('./heavy-module');
```

## Security Issues

### Vulnerable Dependencies

**Issue**: Security audit shows vulnerabilities
```
found 15 vulnerabilities (8 low, 5 moderate, 2 high)
```

**Solutions**:
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Update dependencies
npm update

# Use npm-check-updates
npx npm-check-updates -u

# For critical vulnerabilities, update manually
npm install package@latest
```

### Exposed Secrets

**Issue**: API keys in version control
```
MONGODB_URI=mongodb://user:password@localhost:27017/db
```

**Solutions**:
```bash
# Remove from git history
git filter-branch --tree-filter 'rm -f .env' HEAD

# Use environment variables
process.env.MONGODB_URI

# Create .env.example with placeholders
# Add .env to .gitignore
echo ".env" >> .gitignore
```

## Monitoring and Logging

### Application Logging

**Issue**: No logs for debugging
```
console.log not showing in production
```

**Solutions**:
```javascript
// Use a logging library
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in application
logger.info('Application started');
logger.error('Database connection failed', { error: err });
```

### Error Tracking

**Issue**: Unhandled errors crashing application
```
UnhandledPromiseRejectionWarning
```

**Solutions**:
```javascript
// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Use error tracking service
// Sentry, Rollbar, or Bugsnag
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Database Issues

### Data Corruption

**Issue**: Inconsistent data in database
```
Duplicate key error
```

**Solutions**:
```bash
# Backup database
mongodump --db grocery-store --out backup

# Repair database
mongod --repair --dbpath /var/lib/mongodb

# Check data integrity
db.products.validate()
db.categories.validate()

# Clean up orphaned references
// Find products with invalid category references
db.products.find({ category: { $type: 'objectId' } }).forEach(doc => {
  if (!db.categories.findOne({ _id: doc.category })) {
    print('Orphaned product:', doc._id);
  }
});
```

### Connection Pool Issues

**Issue**: Too many database connections
```
MongoError: connection pool exhausted
```

**Solutions**:
```javascript
// Configure connection pool
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

// Monitor connections
db.serverStatus().connections

// Close connections properly
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
```

This troubleshooting guide covers the most common issues and provides practical solutions for maintaining a healthy Grocery Store App deployment.
