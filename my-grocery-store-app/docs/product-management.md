# Product Management

This document details the product management system, including CRUD operations, inventory tracking, and product display features.

## Product Model

### Schema Structure
```javascript
{
  name: String (required),
  price: Number (required, min: 0),
  image: String (required),
  category: ObjectId (ref: 'Category', required),
  description: String,
  stock: Number (required, min: 0, default: 0),
  unit: String (enum: ['kg', 'g', 'l', 'ml', 'pcs', 'pack']),
  isActive: Boolean (default: true)
}
```

### Key Fields
- **name**: Product display name
- **price**: Selling price in currency units
- **image**: Path to product image
- **category**: Reference to Category model
- **description**: Detailed product information
- **stock**: Available quantity
- **unit**: Unit of measurement
- **isActive**: Product visibility flag

## Admin Product Management

### Product Dashboard
- **Grid/List View**: Toggle between card and table layouts
- **Search and Filter**: By name, category, stock status
- **Bulk Actions**: Select multiple products for batch operations
- **Stock Alerts**: Low inventory warnings
- **Quick Actions**: Edit, delete, toggle active status

### Adding Products
1. **Access**: Admin Dashboard → Products → Add Product
2. **Form Fields**:
   - Product name (required)
   - Price (required, decimal)
   - Category selection (required)
   - Description (optional, rich text)
   - Stock quantity (required)
   - Unit selection (dropdown)
   - Product image (required)
3. **Validation**:
   - Required field checks
   - Price format validation
   - Image file validation
   - Category existence check
4. **API Call**: POST /api/groceries
5. **Success Feedback**: Product added, redirect to list

### Editing Products
1. **Select Product**: Click edit on product card/table row
2. **Pre-populated Form**: Current values loaded
3. **Image Replacement**: Option to upload new image
4. **Stock Updates**: Real-time inventory management
5. **Save Changes**: PUT /api/groceries/:id
6. **Optimistic Updates**: UI updates immediately

### Deleting Products
1. **Confirmation Dialog**: "Are you sure?" with product details
2. **Impact Assessment**: Check for active cart items or orders
3. **Soft Delete Option**: Deactivate instead of permanent deletion
4. **API Call**: DELETE /api/groceries/:id
5. **Cleanup**: Remove associated image file

## Inventory Management

### Stock Tracking
- **Real-time Updates**: Stock changes on orders
- **Low Stock Alerts**: Configurable thresholds (default: 5)
- **Out of Stock Handling**: Hide from frontend or show "Out of Stock"
- **Stock History**: Track changes over time (future)

### Stock Operations
```javascript
// Reduce stock on order
await Grocery.findByIdAndUpdate(productId, {
  $inc: { stock: -quantity }
});

// Check stock before adding to cart
const product = await Grocery.findById(productId);
if (product.stock < requestedQuantity) {
  throw new Error('Insufficient stock');
}
```

### Inventory Reports
- **Current Stock Levels**: All products with quantities
- **Low Stock Items**: Items below threshold
- **Stock Value**: Total inventory value calculation
- **Stock Movement**: Recent changes

## Product Display (Frontend)

### Product Cards
- **Image Display**: Optimized loading with fallbacks
- **Product Info**: Name, price, unit
- **Stock Status**: Available quantity or "Out of Stock"
- **Add to Cart**: Button with loading states
- **Hover Effects**: Enhanced interactivity

### Product Details
- **Modal/Popup**: Detailed product view
- **Full Description**: Rich text content
- **Image Gallery**: Multiple product images (future)
- **Related Products**: Similar items

### Search and Filtering
- **Text Search**: Across name and description
- **Category Filter**: Dropdown selection
- **Price Range**: Min/max price filters
- **Stock Filter**: In stock only
- **Sorting**: By price, name, popularity

## Image Management

### Upload Process
1. **File Selection**: Drag-and-drop or click to select
2. **Client Validation**: File type, size, dimensions
3. **Preview**: Show image before upload
4. **Upload**: AJAX with progress indicator
5. **Server Processing**:
   - Store in `/uploads/groceries/`
   - Generate unique filename
   - Resize for consistency (future)
6. **Database Update**: Store path in product record

### Image Requirements
- **Supported Formats**: JPEG, PNG, WebP
- **Maximum Size**: 5MB
- **Recommended Dimensions**: 400x400px
- **Aspect Ratio**: Square preferred

### Image Optimization
- **Compression**: Reduce file size while maintaining quality
- **Responsive Images**: Different sizes for different screens
- **Lazy Loading**: Load images as they enter viewport
- **CDN Integration**: Future enhancement for global delivery

## Pricing and Discounts

### Base Pricing
- **Fixed Price**: Standard selling price
- **Currency Handling**: Support for different currencies (future)
- **Price History**: Track price changes (future)

### Discount Integration
- **Discount Codes**: Applied at checkout
- **Product-Specific Discounts**: Future feature
- **Bulk Pricing**: Quantity-based discounts (future)

## Product Categories

### Category Assignment
- **Required Field**: Every product must have a category
- **Single Category**: Flat categorization structure
- **Category Validation**: Ensure category exists and is active

### Category-Based Features
- **Category Pages**: Filtered product listings
- **Category Navigation**: Homepage category grid
- **Cross-Category Search**: Search across all categories

## Performance Optimizations

### Database Queries
- **Indexing**: Text index on name/description, regular indexes on category, isActive
- **Pagination**: Limit results for large product catalogs
- **Population**: Efficient category data loading

### Frontend Performance
- **Virtual Scrolling**: For large product lists (future)
- **Image Lazy Loading**: Reduce initial page load
- **Caching**: Product data cached in state
- **Debounced Search**: Reduce API calls during typing

### API Optimization
- **Query Optimization**: Selective field retrieval
- **Aggregation**: Efficient count and statistics queries
- **Caching Layer**: Redis integration (future)

## Analytics and Reporting

### Product Performance
- **Sales Volume**: Units sold per product
- **Revenue**: Total sales per product
- **View Count**: Product page views (future)
- **Conversion Rate**: Cart additions vs purchases

### Inventory Analytics
- **Stock Turnover**: Sales velocity
- **Stockout Frequency**: How often items go out of stock
- **Inventory Value**: Current stock monetary value

### Admin Dashboard Metrics
- **Top Products**: Best-selling items
- **Low Stock Alerts**: Items needing restock
- **Sales Trends**: Product performance over time

## Error Handling

### Validation Errors
- **Missing Fields**: Required field validation
- **Invalid Data**: Price format, stock quantities
- **File Upload Errors**: Invalid images, size limits

### Business Logic Errors
- **Insufficient Stock**: Prevent overselling
- **Invalid Category**: Category existence checks
- **Duplicate Products**: Name uniqueness within category (future)

### System Errors
- **Database Errors**: Connection issues, constraint violations
- **File System Errors**: Upload directory permissions
- **Network Errors**: API call failures

## API Integration

### Product Endpoints
- GET /api/groceries - Fetch products with filtering
- POST /api/groceries - Create product
- PUT /api/groceries/:id - Update product
- DELETE /api/groceries/:id - Delete product

### Query Parameters
```javascript
GET /api/groceries?category=categoryId&search=apple&limit=20&skip=0
```

### Request/Response Examples
```javascript
// Create product
POST /api/groceries
Content-Type: multipart/form-data
{
  name: "Organic Apples",
  price: 2.99,
  category: "category_id",
  description: "Fresh organic apples",
  stock: 100,
  unit: "kg",
  image: [file]
}

// Response
{
  "product": {
    "_id": "product_id",
    "name": "Organic Apples",
    "price": 2.99,
    "image": "/uploads/groceries/timestamp-random.jpg"
  }
}
```

## Testing

### Unit Tests
- Product model validation
- Price calculations
- Stock operations

### Integration Tests
- CRUD operations
- Image upload workflow
- Search and filtering

### E2E Tests
- Admin product management
- User product browsing
- Add to cart flow

## Future Enhancements

### Advanced Features
- **Product Variants**: Size, color options
- **Bulk Upload**: CSV import for multiple products
- **Product Reviews**: User ratings and comments
- **Related Products**: AI-powered recommendations
- **Product Bundles**: Package deals

### Inventory Features
- **Automatic Reordering**: Low stock alerts to suppliers
- **Barcode Integration**: Scan for stock updates
- **Warehouse Management**: Multiple location tracking
- **Expiration Tracking**: Perishable goods management

### Analytics
- **Product Lifecycle**: Introduction to discontinuation
- **Seasonal Trends**: Sales pattern analysis
- **Customer Preferences**: Popular products by demographics

This comprehensive product management system handles all aspects of product lifecycle from creation to sales tracking, with robust inventory management and user-friendly interfaces.
