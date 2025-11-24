# Discount Management

This document covers the discount code system, including creation, validation, usage tracking, and application during checkout.

## Discount Model

### Schema Structure
```javascript
{
  code: String (required, unique, uppercase),
  description: String,
  type: String (enum: ['percentage', 'fixed'], required),
  value: Number (required, min: 0),
  maxUses: Number (optional),
  usedCount: Number (default: 0),
  expiryDate: Date (required),
  isActive: Boolean (default: true)
}
```

### Key Fields
- **code**: Unique discount code (e.g., "SAVE10")
- **description**: Human-readable description
- **type**: "percentage" (e.g., 10% off) or "fixed" (e.g., $10 off)
- **value**: Discount amount (percentage or fixed value)
- **maxUses**: Maximum number of redemptions (optional)
- **usedCount**: Current usage count
- **expiryDate**: Expiration date and time
- **isActive**: Code active status

## Admin Discount Management

### Discount Dashboard
- **Code List**: Table of all discount codes
- **Status Overview**: Active, expired, exhausted codes
- **Usage Statistics**: Redemption counts and rates
- **Quick Actions**: Create, edit, deactivate codes

### Creating Discount Codes
1. **Access**: Admin Dashboard → Discounts → Add Discount
2. **Form Fields**:
   - Code (required, unique, auto-uppercase)
   - Description (optional)
   - Type (percentage/fixed dropdown)
   - Value (required, validated by type)
   - Maximum uses (optional)
   - Expiry date (required, date picker)
3. **Validation**:
   - Code uniqueness check
   - Value validation (percentage: 0-100, fixed: positive number)
   - Date validation (future date)
4. **API Call**: POST /api/discounts
5. **Success**: Code added to list with generated statistics

### Editing Discounts
1. **Select Code**: Click edit on table row
2. **Modal Form**: Pre-populated with current values
3. **Usage Preservation**: Cannot reduce maxUses below usedCount
4. **Update**: PUT /api/discounts/:id
5. **Real-time Refresh**: List updates with changes

### Deactivating Codes
1. **Toggle Active**: Switch to deactivate expired or unwanted codes
2. **Soft Delete**: Maintains usage history
3. **Reactivation**: Can reactivate if needed
4. **API Call**: PUT /api/discounts/:id with isActive: false

## Discount Validation

### Code Validation Process
1. **Input Sanitization**: Trim whitespace, convert to uppercase
2. **Database Lookup**: Find code in active discounts
3. **Expiry Check**: Compare current date with expiryDate
4. **Usage Check**: Verify usedCount < maxUses (if set)
5. **Active Status**: Ensure isActive is true

### Validation Function
```javascript
async function validateDiscount(code) {
  const discount = await Discount.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gt: new Date() }
  });
  
  if (!discount) {
    throw new Error('Invalid or expired discount code');
  }
  
  if (discount.maxUses && discount.usedCount >= discount.maxUses) {
    throw new Error('Discount code has reached maximum uses');
  }
  
  return discount;
}
```

### Usage Tracking
- **Increment on Use**: usedCount++ when code applied to order
- **Atomic Updates**: Prevent race conditions with database transactions
- **Audit Trail**: Track when and by whom codes are used

## Checkout Integration

### Discount Application
1. **Code Entry**: User inputs discount code in PaymentPage
2. **Frontend Validation**: Basic format checking
3. **API Call**: POST /api/discounts/validate
4. **Backend Validation**: Full business logic checks
5. **Calculation**: Apply discount to cart total
6. **Display**: Show discount amount and new total

### Discount Calculations
```javascript
// Percentage discount
const discountAmount = subtotal * (discount.value / 100);

// Fixed discount
const discountAmount = Math.min(discount.value, subtotal);

// Apply to total
const finalTotal = subtotal - discountAmount;
```

### Order Processing
1. **Validate Code**: During order creation
2. **Apply Discount**: Calculate discounted total
3. **Record Usage**: Increment usedCount
4. **Store in Order**: Save discount code and amount

## Frontend Discount Features

### Discount Input
- **Text Field**: Prominent placement in checkout
- **Validation Feedback**: Real-time error messages
- **Loading States**: Spinner during validation
- **Success States**: Green checkmark and discount display

### Discount Display
- **Applied Discount**: Show code and amount saved
- **Updated Total**: Strike-through original, highlight new total
- **Breakdown**: Itemize discount in order breakdown

### Cart Integration
- **Persistent Codes**: Remember applied codes across sessions
- **Multiple Codes**: Future support for stacking discounts
- **Code Removal**: Easy removal with updated totals

## Analytics and Reporting

### Usage Analytics
- **Redemption Rate**: Used vs available uses
- **Popular Codes**: Most used discount codes
- **Revenue Impact**: Total discount value given
- **Conversion Impact**: Orders with vs without discounts

### Admin Dashboard
- **Active Codes**: Currently valid discounts
- **Expiring Soon**: Codes expiring within 7 days
- **Performance Metrics**: Usage statistics per code
- **Revenue Reports**: Discount impact on sales

### Code Performance
```javascript
// Calculate code effectiveness
const effectiveness = {
  totalDiscounted: discount.usedCount,
  totalValue: discount.usedCount * averageOrderValue * (discount.value / 100),
  conversionRate: (ordersWithCode / totalOrders) * 100
};
```

## Security Considerations

### Code Security
- **No Predictable Codes**: Random or admin-generated codes
- **Rate Limiting**: Prevent brute force guessing
- **Usage Limits**: Prevent abuse with maxUses
- **Expiration**: Time-limited validity

### Validation Security
- **Server-Side Validation**: Never trust client-side checks
- **Atomic Operations**: Prevent double usage with transactions
- **Audit Logging**: Track all discount usage

## Error Handling

### Validation Errors
- **Invalid Code**: "Discount code not found"
- **Expired Code**: "This discount code has expired"
- **Max Uses Reached**: "This code has been fully redeemed"
- **Inactive Code**: "This discount code is no longer available"

### System Errors
- **Database Errors**: Connection issues during validation
- **Concurrent Usage**: Race conditions in high-traffic scenarios
- **Calculation Errors**: Edge cases in discount calculations

## API Integration

### Discount Endpoints
- GET /api/discounts - Fetch all discounts (Admin)
- POST /api/discounts - Create discount (Admin)
- PUT /api/discounts/:id - Update discount (Admin)
- DELETE /api/discounts/:id - Delete discount (Admin)
- POST /api/discounts/validate - Validate discount code

### Request/Response Examples
```javascript
// Create discount
POST /api/discounts
{
  "code": "WELCOME10",
  "description": "10% off for new customers",
  "type": "percentage",
  "value": 10,
  "maxUses": 100,
  "expiryDate": "2024-12-31T23:59:59Z"
}

// Validate discount
POST /api/discounts/validate
{
  "code": "WELCOME10"
}

// Response
{
  "discount": {
    "_id": "discount_id",
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10
  }
}
```

## Testing

### Unit Tests
- Discount model validation
- Calculation logic
- Expiry date handling

### Integration Tests
- Code validation workflow
- Usage tracking
- Checkout integration

### E2E Tests
- Admin discount management
- User discount application
- Edge cases (expired, max uses)

## Future Enhancements

### Advanced Features
- **Bulk Code Generation**: Create multiple codes at once
- **Targeted Discounts**: User-specific or category-specific codes
- **Scheduled Discounts**: Time-based activation
- **Tiered Discounts**: Different rates based on order value

### Analytics Improvements
- **A/B Testing**: Compare discount effectiveness
- **Customer Segmentation**: Target discounts to user groups
- **Predictive Analytics**: Optimal discount timing

### Integration Features
- **Email Campaigns**: Automated discount distribution
- **Loyalty Program**: Points-based discount system
- **Referral Codes**: User-generated discount codes

### Security Enhancements
- **Code Encryption**: Secure storage of discount data
- **Fraud Detection**: Unusual usage pattern detection
- **Geographic Restrictions**: Location-based discount validity

This discount management system provides flexible promotional capabilities while maintaining security and tracking effectiveness.
