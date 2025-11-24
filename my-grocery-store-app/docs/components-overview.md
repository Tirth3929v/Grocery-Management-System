# Components Overview

This document provides an overview of all React components in the Grocery Store App, organized by category.

## Component Structure

```
src/components/
├── Admin/          # Admin-specific components
├── Auth/           # Authentication components
├── Common/         # Shared components
└── User/           # User-facing components
```

## Common Components

### Navbar
- **File**: `Common/Navbar.js`
- **Purpose**: Main navigation bar with logo, search, cart icon, user menu
- **Features**:
  - Search functionality
  - Cart item count display
  - User dropdown (profile, logout)
  - Responsive design
- **Props**: `setPage`, `loggedInUser`, `setLoggedInUser`, `cart`, `searchTerm`, `setSearchTerm`

### Footer
- **File**: `Common/Footer.js`
- **Purpose**: Site footer with links and information
- **Features**: Static content, contact info, social links

### ProductCard
- **File**: `Common/ProductCard.js`
- **Purpose**: Display individual product information
- **Features**:
  - Product image, name, price
  - "Add to Cart" button
  - Stock status
- **Props**: `product`, `addToCart`

### Button
- **File**: `Common/Button.js`
- **Purpose**: Reusable button component
- **Features**: Variants (primary, secondary), loading states
- **Props**: `children`, `onClick`, `variant`, `disabled`, `loading`

### Input
- **File**: `Common/Input.js`
- **Purpose**: Form input component
- **Features**: Validation states, icons, different types
- **Props**: `type`, `placeholder`, `value`, `onChange`, `error`

### Card
- **File**: `Common/Card.js`
- **Purpose**: Container component for content sections
- **Features**: Shadow, padding, hover effects

## Authentication Components

### LoginPage
- **File**: `Auth/LoginPage.js`
- **Purpose**: User login form
- **Features**:
  - Email/password fields
  - Remember me option
  - Error handling
  - Link to signup
- **Props**: `setPage`, `setLoggedInUser`

### SignupPage
- **File**: `Auth/SignupPage.js`
- **Purpose**: User registration form
- **Features**:
  - Name, email, password, address fields
  - Password confirmation
  - Validation
  - Link to login
- **Props**: `setPage`

### AuthLayout
- **File**: `Auth/AuthLayout.js`
- **Purpose**: Layout wrapper for auth pages
- **Features**: Centered layout, branding

## User Components

### HomePage
- **File**: `User/HomePage.js`
- **Purpose**: Main shopping page
- **Features**:
  - Banner carousel
  - Featured products
  - Category navigation
  - Search results
- **Props**: `products`, `categories`, `banners`, `addToCart`, `setPage`, `setSelectedCategory`, `searchTerm`

### CategoryPage
- **File**: `User/CategoryPage.js`
- **Purpose**: Products filtered by category
- **Features**:
  - Category-specific products
  - Sorting options
  - Pagination
- **Props**: `products`, `addToCart`, `selectedCategory`, `searchTerm`

### CartPage
- **File**: `User/CartPage.js`
- **Purpose**: Shopping cart management
- **Features**:
  - Item list with quantities
  - Price calculations
  - Update/remove items
  - Checkout button
- **Props**: `cart`, `updateQuantity`, `removeFromCart`, `setPage`

### PaymentPage
- **File**: `User/PaymentPage.js`
- **Purpose**: Checkout and payment
- **Features**:
  - Delivery address form
  - Payment method selection
  - Discount code application
  - Order summary
  - Place order functionality
- **Props**: `setPage`, `clearCart`, `cart`, `user`, `addOrder`, `discountCodes`, `applyDiscountCode`

### ProfilePage
- **File**: `User/ProfilePage.js`
- **Purpose**: User profile and order history
- **Features**:
  - Profile information display/edit
  - Order history
  - Account settings
- **Props**: `user`, `setUser`, `setPage`

## Admin Components

### AdminDashboard
- **File**: `Admin/AdminDashboard.js`
- **Purpose**: Main admin interface
- **Features**:
  - Navigation between admin sections
  - Overview statistics
  - Sub-component rendering
- **Props**: `products`, `setProducts`, `orders`, `categories`, `setCategories`, `discountCodes`, `setDiscountCodes`

### AdminOverview
- **File**: `Admin/AdminOverview.js`
- **Purpose**: Dashboard analytics
- **Features**:
  - Sales charts
  - Order statistics
  - Inventory alerts
  - Recent activity
- **Props**: `products`, `orders`

### AdminProducts
- **File**: `Admin/AdminProducts.js`
- **Purpose**: Product inventory management
- **Features**:
  - Product list with CRUD operations
  - Image upload
  - Stock management
  - Bulk actions
- **Props**: `products`, `setProducts`

### AdminCategories
- **File**: `Admin/AdminCategories.js`
- **Purpose**: Category management
- **Features**:
  - Category grid/list
  - Image management
  - Product associations
- **Props**: `categories`, `setCategories`

### AdminOrders
- **File**: `Admin/AdminOrders.js`
- **Purpose**: Order processing and management
- **Features**:
  - Order list with filtering
  - Status updates
  - Order details view
  - Customer information
- **Props**: `orders`

### AdminDiscounts
- **File**: `Admin/AdminDiscounts.js`
- **Purpose**: Discount code management
- **Features**:
  - Create/edit discount codes
  - Usage tracking
  - Expiry management
- **Props**: `discountCodes`, `setDiscountCodes`

### AdminBanners
- **File**: `Admin/AdminBanners.js`
- **Purpose**: Promotional banner management
- **Features**:
  - Banner upload
  - Display order management
  - Active/inactive status
- **Props**: None (manages own state)

### AdminPage (Legacy)
- **File**: `Admin/AdminPage.js`
- **Purpose**: Older admin interface (may be deprecated)
- **Features**: Basic admin functions

## Component Patterns

### State Management
- Global state in `App.js`
- Local state with `useState`
- Effects for data fetching with `useEffect`

### Props vs Context
- Props drilling for simple cases
- No Context API usage (could be future enhancement)

### Code Splitting
- Lazy loading with `React.lazy()`
- Suspense boundaries for loading states

### Styling
- Tailwind CSS for utility classes
- Responsive design with mobile-first approach
- Consistent color scheme and typography

### Error Boundaries
- Not implemented (future enhancement)
- Error handling via try-catch in async operations

## Component Lifecycle

### Mounting
1. Component renders
2. useEffect runs for data fetching
3. State updates trigger re-renders

### Updating
1. Props/state changes
2. Re-render with new data
3. Effects run if dependencies changed

### Unmounting
- Cleanup in useEffect return functions

## Performance Optimizations

### Memoization
- `React.memo` not used (could be added)
- useCallback for event handlers

### Lazy Loading
- Route-based code splitting
- Image lazy loading (future)

### Virtualization
- Not implemented (for large lists)

## Testing

### Unit Tests
- Component rendering
- Props handling
- State updates

### Integration Tests
- User flows
- API interactions

### E2E Tests
- Full user journeys

## Future Improvements

- **Component Library**: Extract common patterns
- **TypeScript**: Add type safety
- **Storybook**: Component documentation
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation
- **Internationalization**: Multi-language support

For detailed component implementations, see [User Components](./user-components.md), [Admin Components](./admin-components.md), and [Common Components](./common-components.md).
