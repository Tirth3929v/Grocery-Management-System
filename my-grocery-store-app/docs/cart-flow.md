# Cart Management Flow

This document details the shopping cart functionality, including adding items, updating quantities, and persistence.

## Overview

The cart system allows users to collect items for purchase, with persistence across sessions and real-time updates.

## Cart Data Structure

### Frontend State
```javascript
cart: [
  {
    groceryId: { _id, name, price, image, ... },
    quantity: 1
  }
]
```

### Backend Model (CartItem)
```javascript
{
  userId: ObjectId (ref: User),
  groceryId: ObjectId (ref: Grocery),
  quantity: Number
}
```

## Adding Items to Cart

### User Action
- Click "Add to Cart" on ProductCard or HomePage/CategoryPage

### Frontend Process
1. **Validation**: Check if item already in cart
2. **API Call**: POST /api/cart
   ```javascript
   body: { groceryId: product._id, quantity: 1 }
   ```
3. **Optimistic Update**: Immediately update local cart state
4. **Error Handling**: Revert on failure

### Backend Process
1. **Route**: POST /api/cart
2. **Authentication**: Check session userId
3. **Validation**: Verify grocery exists and has stock
4. **Database Operation**:
   - Find existing CartItem for user + grocery
   - If exists, increment quantity
   - If not, create new CartItem
5. **Response**: Success confirmation

## Fetching Cart

### Trigger
- User login
- App initialization for logged-in users

### API Call
- GET /api/cart
- Credentials: include

### Backend Process
1. **Query**: Find all CartItems for current userId
2. **Populate**: Join with Grocery documents for full item details
3. **Response**: Array of cart items with populated grocery data

### Frontend Update
- Set cart state with fetched data
- Update cart count in Navbar

## Updating Quantities

### User Action
- Change quantity input in CartPage

### Frontend Process
1. **Input Change**: Update local state immediately
2. **Debounced API Call**: PUT /api/cart/:groceryId
   ```javascript
   body: { quantity: newQuantity }
   ```
3. **Validation**: Ensure quantity > 0

### Backend Process
1. **Route**: PUT /api/cart/:groceryId
2. **Find CartItem**: By userId and groceryId
3. **Update**: Set new quantity
4. **Stock Check**: Ensure sufficient inventory
5. **Response**: Updated cart item

## Removing Items

### User Action
- Click "Remove" button in CartPage

### Frontend Process
1. **Confirmation**: Optional user confirmation
2. **API Call**: DELETE /api/cart/:groceryId
3. **Optimistic Update**: Remove from local cart state

### Backend Process
1. **Route**: DELETE /api/cart/:groceryId
2. **Delete Operation**: Remove CartItem document
3. **Response**: Success confirmation

## Cart Calculations

### Subtotal
```javascript
const subtotal = cart.reduce((sum, item) => 
  sum + (item.groceryId.price * item.quantity), 0
);
```

### Total with Discounts
- Applied during checkout (see Order Flow)
- Frontend calculates final total

## Persistence

### Session Persistence
- Cart items stored in database
- Survives browser refresh and logout/login

### Cross-Device
- Cart tied to user account
- Accessible from any device after login

## Stock Management

### Add to Cart
- Check available stock before adding
- Prevent adding if quantity > stock

### Update Quantity
- Validate against current stock
- Reduce stock on order placement (not on add)

## Error Handling

### Out of Stock
- Display message: "Item out of stock"
- Disable add to cart button

### Network Errors
- Retry failed operations
- Show user-friendly error messages

### Concurrent Updates
- Last update wins
- No conflict resolution (simple implementation)

## Performance Optimizations

### Debouncing
- Quantity updates debounced to reduce API calls

### Optimistic Updates
- UI updates immediately, reverts on error

### Efficient Queries
- Indexed database queries
- Populate only necessary fields

## Integration with Orders

### Checkout Process
- Cart items converted to order items
- Cart cleared after successful order

### Stock Deduction
- On order placement, reduce grocery stock
- Update cart quantities if necessary

## Future Enhancements

- **Persistent Cart for Guests**: Local storage for non-logged users
- **Cart Sharing**: Share cart with other users
- **Saved Carts**: Multiple saved carts per user
- **Cart Recommendations**: AI-based suggestions
- **Bulk Operations**: Add multiple items at once

## Code Examples

### Add to Cart (Frontend)
```javascript
const addToCart = async (product) => {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ groceryId: product._id, quantity: 1 })
  });
  if (response.ok) {
    setCart(prev => [...prev, { groceryId: product, quantity: 1 }]);
  }
};
```

### Cart Route (Backend)
```javascript
router.post('/', async (req, res) => {
  const { groceryId, quantity } = req.body;
  const userId = req.session.userId;
  
  const cartItem = await CartItem.findOneAndUpdate(
    { userId, groceryId },
    { $inc: { quantity } },
    { upsert: true, new: true }
  );
  
  res.json(cartItem);
});
```

For complete user flow including cart, see [User Data Flow](./user-data-flow.md).
