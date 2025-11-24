# User Data Flow

This document details the data flow for user-side operations in the Grocery Store App, from registration to order completion.

## 1. User Registration

### Flow Diagram
```
User fills signup form → Frontend validates → POST /api/auth/register → Backend creates user → Session created → Redirect to home
```

### Steps
1. **Form Submission**: User enters name, email, password, address on SignupPage.
2. **Frontend Validation**: Basic client-side validation (e.g., email format, password strength).
3. **API Call**: POST request to `/api/auth/register` with user data.
4. **Backend Processing**:
   - Validate input server-side.
   - Hash password with bcrypt.
   - Create new User document in MongoDB.
   - Create session with user ID.
5. **Response**: Success response with user data (excluding password).
6. **Frontend Update**: Set loggedInUser state, redirect to home page.
7. **Error Handling**: Display error messages for invalid inputs or existing email.

## 2. User Login

### Flow Diagram
```
User enters credentials → POST /api/auth/login → Backend verifies → Session created → Redirect based on role
```

### Steps
1. **Form Submission**: User enters email and password on LoginPage.
2. **API Call**: POST to `/api/auth/login`.
3. **Backend Processing**:
   - Find user by email.
   - Compare hashed password.
   - Create session if valid.
4. **Response**: User data based on role.
5. **Frontend Update**: Set loggedInUser, redirect to home (user) or admin dashboard (admin).

## 3. Browsing Products

### Flow Diagram
```
App load → GET /api/groceries → Display products → User searches/filters → Update display
```

### Steps
1. **Initial Load**: On App.js mount, fetch products and categories.
2. **API Calls**:
   - GET `/api/groceries` for all products.
   - GET `/api/categories` for category list.
   - GET `/api/banners` for promotional banners.
3. **Data Storage**: Store in products, categories, banners state.
4. **Rendering**: HomePage displays featured products, categories, banners.
5. **User Interaction**:
   - Click category → Navigate to CategoryPage with filtered products.
   - Search → Filter products by name/description.
6. **Lazy Loading**: Components loaded on demand for performance.

## 4. Adding Items to Cart

### Flow Diagram
```
User clicks "Add to Cart" → POST /api/cart → Backend adds item → Update local cart state → Display updated cart
```

### Steps
1. **User Action**: Click "Add to Cart" button on ProductCard.
2. **API Call**: POST `/api/cart` with groceryId and quantity.
3. **Backend Processing**:
   - Verify user session.
   - Add/update CartItem in database.
4. **Response**: Success confirmation.
5. **Frontend Update**: Update cart state array with new item.
6. **UI Update**: Show updated cart count in Navbar.

## 5. Managing Cart

### Flow Diagram
```
User views cart → GET /api/cart (on login) → Update quantities → PUT /api/cart/:id → Remove items → DELETE /api/cart/:id
```

### Steps
1. **Cart Fetch**: On login, GET `/api/cart` to populate cart state.
2. **View Cart**: Navigate to CartPage, display items with quantities and totals.
3. **Update Quantity**: Change quantity input → PUT `/api/cart/:groceryId` → Update database and local state.
4. **Remove Item**: Click remove → DELETE `/api/cart/:groceryId` → Remove from database and local state.
5. **Price Calculation**: Frontend calculates subtotal, applies discounts if any.

## 6. Checkout and Payment

### Flow Diagram
```
User clicks checkout → Navigate to PaymentPage → Enter details → POST /api/orders → Backend processes order → Clear cart → Redirect to profile
```

### Steps
1. **Initiate Checkout**: From CartPage, navigate to PaymentPage.
2. **Form Entry**: User enters delivery address, payment details (simulated).
3. **Discount Application**: Enter discount code → Validate via API.
4. **Order Submission**: POST `/api/orders` with cart items, user details, total.
5. **Backend Processing**:
   - Create Order document.
   - Update product stock.
   - Clear user's cart.
   - Apply discount if valid.
6. **Response**: Order confirmation with order ID.
7. **Frontend Update**: Clear cart state, redirect to ProfilePage.

## 7. Viewing Profile and Orders

### Flow Diagram
```
User navigates to profile → Display user info → Fetch orders if admin → Show order history
```

### Steps
1. **Profile Access**: Click profile link in Navbar.
2. **Data Display**: Show user name, email, address, profile image.
3. **Order History**: Display past orders with details (for users) or all orders (for admins).
4. **Edit Profile**: Update address/image → PUT request to update user.

## 8. Logout

### Flow Diagram
```
User clicks logout → POST /api/auth/logout → Destroy session → Clear state → Redirect to login
```

### Steps
1. **Logout Action**: Click logout in Navbar.
2. **API Call**: POST `/api/auth/logout` to destroy session.
3. **Frontend Update**: Clear loggedInUser, cart, redirect to login.

## Data Persistence

- **Session Management**: Express sessions with MongoDB store (implied).
- **Cart Persistence**: Stored in database, fetched on login.
- **User Data**: Persistent in Users collection.
- **Orders**: Stored permanently for history.

## Error Handling

- Network errors: Retry mechanisms or user notifications.
- Validation errors: Display specific messages.
- Authentication errors: Redirect to login.
- Stock issues: Prevent ordering out-of-stock items.

## Performance Optimizations

- Lazy loading of components.
- Efficient state updates (immutable patterns).
- Caching of static assets (images).
- Debounced search/filtering.

For admin data flows, see [Admin Data Flow](./admin-data-flow.md).
