# Frontend State Management

This document explains how application state is managed in the Grocery Store App frontend.

## State Architecture

The app uses React's built-in state management with hooks, organized in a hierarchical structure.

## Global State (App.js)

### State Variables
```javascript
const [page, setPage] = useState('home');
const [loggedInUser, setLoggedInUser] = useState(null);
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [orders, setOrders] = useState([]);
const [cart, setCart] = useState([]);
const [banners, setBanners] = useState([]);
const [discountCodes, setDiscountCodes] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState(null);
```

### State Initialization
On app mount, fetches initial data:
- Products and categories for browsing
- User session if logged in
- Cart items if user authenticated

### State Updates
- **Page Navigation**: `setPage()` changes current view
- **User Authentication**: Login/logout updates user and cart
- **Data Synchronization**: API responses update respective state arrays

## Component State Management

### Local State Patterns
Components use `useState` for local UI state:
- Form inputs
- Loading states
- Modal visibility
- Pagination

### State Lifting
Complex state interactions are lifted to parent components:
- Cart operations managed in App.js
- Search filtering centralized

## Data Fetching Strategy

### Initial Load
```javascript
useEffect(() => {
  fetchProducts();
  fetchCategories();
  fetchBanners();
  checkAuthStatus();
}, []);
```

### Conditional Fetching
- User-specific data (cart, orders) fetched after login
- Admin data loaded only for admin users

### Error Handling
- Try-catch blocks in async functions
- User-friendly error messages
- Fallback UI states

## State Synchronization

### API Integration
All state changes trigger API calls:
- Optimistic updates for better UX
- Rollback on API failure

### Real-time Updates
- Polling for order status changes (future)
- WebSocket integration (future)

## Cart Management

### Cart State Structure
```javascript
cart: [
  {
    groceryId: {
      _id: 'product_id',
      name: 'Product Name',
      price: 9.99,
      image: '/path/to/image.jpg'
    },
    quantity: 2
  }
]
```

### Cart Operations
- **Add to Cart**: Updates local state, persists to backend
- **Update Quantity**: Immediate UI update, debounced API call
- **Remove Item**: Optimistic removal with confirmation
- **Clear Cart**: On successful order placement

### Cart Persistence
- Stored in database per user
- Survives browser refresh
- Synced across devices

## Authentication State

### Session Management
- User object stored in state
- Session cookie maintained by browser
- Automatic logout on session expiry

### Role-Based Access
```javascript
const isAdmin = loggedInUser?.role === 'admin';
const isLoggedIn = !!loggedInUser;
```

### Protected Routes
Conditional rendering based on auth status:
- Login page for unauthenticated users
- Admin dashboard for admin users
- User pages for authenticated users

## Product and Category State

### Data Structure
- Products array with full details
- Categories array for navigation
- Banners array for homepage carousel

### Filtering and Search
- Client-side filtering for performance
- Search across product names and descriptions
- Category-based filtering

### Caching Strategy
- Data cached in state during session
- Manual refresh for latest data
- No external caching library (simple approach)

## Order State

### Order History
- User's orders fetched on profile load
- Admin sees all orders
- Real-time status updates

### Order Creation
- Cart items converted to order format
- Temporary order state during checkout
- Clear cart on successful order

## Admin State Management

### Admin Data
- Products, categories, orders, discounts
- Separate state arrays for admin operations
- Bulk operations support

### CRUD Operations
- Create: Add to local state, API call
- Read: Display from state
- Update: Optimistic update, API sync
- Delete: Remove from state, API call

## Performance Optimizations

### Memoization
```javascript
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [products, searchTerm]);
```

### Debouncing
- Search input debounced to reduce filtering
- API calls for quantity updates debounced

### Lazy Loading
- Components loaded on demand
- Images lazy loaded

## State Debugging

### Development Tools
- React DevTools for state inspection
- Console logging for state changes
- Error boundaries for crash reporting

### State Validation
- PropTypes for component props
- Runtime state validation
- Immutable update patterns

## Future Enhancements

### State Management Library
- Redux or Zustand for complex state
- Centralized store for better debugging
- Time-travel debugging

### Server State Management
- React Query for server state
- Automatic caching and synchronization
- Background refetching

### Real-time Updates
- WebSocket integration
- Live order status updates
- Real-time inventory changes

### Offline Support
- Service worker for offline functionality
- Local storage for critical data
- Sync when online

## Code Examples

### State Update Pattern
```javascript
const updateProduct = async (productId, updates) => {
  // Optimistic update
  setProducts(prev => prev.map(p => 
    p._id === productId ? { ...p, ...updates } : p
  ));
  
  try {
    await api.updateProduct(productId, updates);
  } catch (error) {
    // Rollback on error
    setProducts(prev => prev.map(p => 
      p._id === productId ? originalProduct : p
    ));
  }
};
```

### Authentication Check
```javascript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const { user } = await response.json();
        setLoggedInUser(user);
        fetchCart(user._id);
      }
    } catch (error) {
      // User not authenticated
    }
  };
  
  checkAuth();
}, []);
```

This state management approach provides a good balance of simplicity and functionality for the application scale.
