# Order Processing Flow

This document outlines the complete order lifecycle from cart checkout to delivery.

## Order States

- **Pending**: Order placed, awaiting processing
- **Processing**: Order being prepared
- **Shipped**: Order dispatched
- **Delivered**: Order completed
- **Cancelled**: Order cancelled

## Order Placement

### Checkout Initiation
1. User clicks "Checkout" from CartPage
2. Navigate to PaymentPage
3. Pre-fill user address from profile

### Payment Form
- **Fields**: Delivery address, payment method (simulated)
- **Validation**: Required fields, address format
- **Discount Code**: Optional input field

### Discount Application
1. User enters discount code
2. Frontend validates format
3. API call: POST /api/discounts/validate
4. Backend checks:
   - Code exists and active
   - Not expired
   - Usage limit not exceeded
5. Apply discount to total
6. Update usedCount

### Order Submission
1. **API Call**: POST /api/orders
   ```javascript
   body: {
     items: cartItems,
     address: deliveryAddress,
     discountCode: appliedCode
   }
   ```
2. **Frontend**: Show loading state

### Backend Processing
1. **Validation**:
   - User authenticated
   - Cart not empty
   - Sufficient stock for all items
   - Discount valid (if applied)

2. **Order Creation**:
   - Calculate totals (subtotal, discount, final)
   - Create Order document
   - Generate order ID

3. **Inventory Update**:
   - Reduce stock for each ordered item
   - Check for low stock alerts

4. **Cart Clearance**:
   - Delete all user's CartItems

5. **Discount Update**:
   - Increment usedCount

6. **Response**: Order confirmation with details

### Frontend Completion
1. Clear cart state
2. Show success message with order ID
3. Redirect to ProfilePage

## Order Management (Admin)

### Order List View
1. **Fetch Orders**: GET /api/orders
2. **Display**: Table with order ID, customer, date, status, total
3. **Filtering**: By status, date range
4. **Sorting**: By date, total

### Order Details
1. **Expand View**: Show full order information
2. **Items List**: Product name, quantity, price
3. **Customer Info**: Name, address, contact
4. **Order Timeline**: Status changes with timestamps

### Status Updates
1. **Admin Action**: Change status dropdown
2. **API Call**: PUT /api/orders/:id
   ```javascript
   body: { status: newStatus }
   ```
3. **Backend**: Update order status and timestamp
4. **Notifications**: (Future) Email to customer

## Order History (User)

### Profile Orders
1. **Fetch User Orders**: GET /api/orders/user
2. **Display**: List of past orders
3. **Details**: Click to expand order details

### Order Tracking
- Show current status
- Estimated delivery dates
- Tracking numbers (future)

## Data Structures

### Order Document
```javascript
{
  userId: ObjectId,
  userName: String,
  address: String,
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  discountApplied: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Item
- Derived from CartItem + Grocery data
- Frozen at order time (price, name)

## Calculations

### Subtotal
```javascript
const subtotal = items.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0
);
```

### Discount Amount
```javascript
const discountAmount = discount.type === 'percentage' 
  ? subtotal * (discount.value / 100)
  : discount.value;
```

### Final Total
```javascript
const finalTotal = subtotal - discountAmount;
```

## Stock Management

### Order Validation
- Check stock >= ordered quantity for each item
- Fail order if any item out of stock

### Stock Deduction
- Atomic operation: reduce stock after order creation
- Prevents overselling

### Low Stock Alerts
- Trigger when stock < threshold (e.g., 5)
- Notify admin dashboard

## Error Handling

### Insufficient Stock
- Message: "Some items are out of stock"
- Highlight affected items
- Allow user to adjust cart

### Payment Failure
- Simulated: Random failure for testing
- Message: "Payment failed, please try again"

### Network Errors
- Retry order submission
- Preserve form data

## Performance Considerations

### Order Creation
- Use database transactions for consistency
- Batch stock updates

### Order Queries
- Index on userId, status, createdAt
- Pagination for large result sets

### Real-time Updates
- WebSocket for status changes (future)

## Analytics and Reporting

### Admin Dashboard
- Total orders, revenue
- Popular products
- Order status distribution
- Peak ordering times

### User Insights
- Order frequency
- Favorite categories
- Average order value

## Future Enhancements

- **Payment Integration**: Stripe/PayPal
- **Shipping Calculation**: Based on address/weight
- **Order Tracking**: Integration with carriers
- **Reorder Functionality**: Quick reorder from history
- **Gift Orders**: Send to different address
- **Subscription Orders**: Recurring deliveries

## Code Examples

### Order Creation (Backend)
```javascript
router.post('/', async (req, res) => {
  const { items, address, discountCode } = req.body;
  const userId = req.session.userId;
  
  // Validate stock
  for (const item of items) {
    const grocery = await Grocery.findById(item.id);
    if (grocery.stock < item.quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
  }
  
  // Create order
  const order = new Order({
    userId,
    userName: req.user.name,
    address,
    items,
    totalAmount: calculateTotal(items, discountCode),
    discountApplied: discountCode
  });
  
  await order.save();
  
  // Update stock
  for (const item of items) {
    await Grocery.findByIdAndUpdate(item.id, {
      $inc: { stock: -item.quantity }
    });
  }
  
  // Clear cart
  await CartItem.deleteMany({ userId });
  
  res.json(order);
});
```

### Checkout Form (Frontend)
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        items: cart.map(item => ({
          id: item.groceryId._id,
          name: item.groceryId.name,
          price: item.groceryId.price,
          quantity: item.quantity
        })),
        address,
        discountCode
      })
    });
    
    if (response.ok) {
      const order = await response.json();
      clearCart();
      navigate('/profile');
    }
  } catch (error) {
    console.error('Order failed:', error);
  } finally {
    setLoading(false);
  }
};
```

For complete user flow, see [User Data Flow](./user-data-flow.md). For admin order management, see [Admin Data Flow](./admin-data-flow.md).
