# User Components

This document provides detailed information about the React components used in the user-facing parts of the Grocery Store App.

## HomePage

### File Location
`src/components/User/HomePage.js`

### Purpose
The main landing page for users, showcasing featured products, categories, and promotional banners.

### Features
- **Banner Carousel**: Displays promotional banners fetched from the backend.
- **Category Navigation**: Grid of categories with images for quick navigation.
- **Featured Products**: Section highlighting popular or new products.
- **Search Integration**: Search bar that filters products in real-time.
- **Product Grid**: Responsive layout for product cards.
- **Loading States**: Spinner while fetching data.

### Props
- `products`: Array of grocery items from backend.
- `categories`: Array of category objects.
- `banners`: Array of banner images/URLs.
- `addToCart`: Function to add products to cart.
- `setPage`: Function to navigate between pages.
- `setSelectedCategory`: Function to filter by category.
- `searchTerm`: Current search string.

### State Management
- Local state for search

### Key Functions
- `filteredProducts`: Filters products based on search term
- `handleCategoryClick`: Navigates to category page
- `handleAddToCart`: Calls addToCart prop

### UI Elements
- Banner slider with auto-rotation
- Category cards with hover effects
- Product grid with infinite scroll (future)
- Search input with debounced filtering

## CategoryPage

### File Location
`src/components/User/CategoryPage.js`

### Purpose
Displays products filtered by a specific category.

### Features
- **Category Filtering**: Shows only products in selected category.
- **Search within Category**: Additional filtering by search term.
- **Sorting Options**: By price, name, popularity.
- **Breadcrumb Navigation**: Shows current category path.

### Props
- `products`: Full product array.
- `addToCart`: Function to add to cart.
- `selectedCategory`: Current category filter.
- `searchTerm`: Search filter.

### State Management
- Local sorting state

### Key Functions
- `filteredProducts`: Applies category and search filters
- `sortProducts`: Sorts by selected criteria

## CartPage

### File Location
`src/components/User/CartPage.js`

### Purpose
Manages the shopping cart, allowing users to view, update, and remove items.

### Features
- **Cart Item List**: Displays each item with quantity controls.
- **Quantity Updates**: Increment/decrement buttons.
- **Item Removal**: Delete buttons with confirmation.
- **Price Calculations**: Subtotal, taxes, total.
- **Empty Cart State**: Message when cart is empty.
- **Checkout Button**: Proceeds to payment page.

### Props
- `cart`: Array of cart items.
- `updateQuantity`: Function to update item quantity.
- `removeFromCart`: Function to remove item.
- `setPage`: Navigation function.

### State Management
- No local state, all managed via props

### Key Functions
- `calculateSubtotal`: Computes cart total
- `handleQuantityChange`: Updates quantity with validation
- `handleRemove`: Removes item with confirmation

### UI Elements
- Item cards with images and details
- Quantity input with +/- buttons
- Price breakdown section
- Sticky checkout button

## PaymentPage

### File Location
`src/components/User/PaymentPage.js`

### Purpose
Handles the checkout process, including address entry, payment details, and order placement.

### Features
- **Address Form**: Delivery address input fields.
- **Payment Method**: Selection (credit card, PayPal, etc.) - simulated.
- **Discount Code**: Input field for promo codes.
- **Order Summary**: Review of cart items and totals.
- **Terms Agreement**: Checkbox for terms and conditions.
- **Place Order**: Final order submission.

### Props
- `setPage`: Navigation function.
- `clearCart`: Function to empty cart after order.
- `cart`: Cart items array.
- `user`: Current user object.
- `addOrder`: Function to create order.
- `discountCodes`: Available discount codes.
- `applyDiscountCode`: Function to apply discount.

### State Management
- Form data (address, payment, discount)
- Loading state during submission
- Validation errors

### Key Functions
- `handleSubmit`: Validates and submits order
- `validateForm`: Client-side validation
- `calculateTotal`: Applies discounts to total
- `applyDiscount`: Validates and applies discount code

### UI Elements
- Multi-step form wizard
- Address autocomplete (future)
- Payment icons
- Order summary sidebar
- Progress indicator

## ProfilePage

### File Location
`src/components/User/ProfilePage.js`

### Purpose
User account management and order history.

### Features
- **Profile Information**: Display and edit user details.
- **Profile Picture**: Upload and display profile image.
- **Order History**: List of past orders with details.
- **Order Tracking**: Status and tracking information.
- **Account Settings**: Change password, preferences.

### Props
- `user`: Current user object.
- `setUser`: Function to update user data.
- `setPage`: Navigation function.

### State Management
- Edit mode toggle
- Form data for updates

### Key Functions
- `handleUpdateProfile`: Submits profile changes
- `handleImageUpload`: Uploads profile picture
- `viewOrderDetails`: Shows order modal/details

### UI Elements
- Profile card with avatar
- Editable form fields
- Order history table
- Settings tabs

## Component Patterns

### Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Fallback UI for failed states

### Loading States
- Skeleton loaders for content
- Spinner buttons for actions
- Progressive loading for lists

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management

### Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions

## Performance Optimizations

### Memoization
- `useMemo` for expensive calculations
- `useCallback` for event handlers

### Code Splitting
- Lazy loading of heavy components
- Route-based splitting

### Image Optimization
- Lazy loading for product images
- Responsive image sizes
- WebP format support (future)

## Future Enhancements

- **Wishlist**: Save items for later
- **Product Reviews**: User ratings and comments
- **Recommendations**: AI-powered suggestions
- **Social Sharing**: Share products/favorites
- **Multi-language**: Internationalization support
- **Progressive Web App**: Offline functionality

For common components used across user pages, see [Common Components](./common-components.md).
