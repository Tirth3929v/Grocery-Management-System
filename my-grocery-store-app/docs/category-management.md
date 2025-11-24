# Category Management

This document covers the category management system in the Grocery Store App, including creation, organization, and display of product categories.

## Category Model

### Schema Structure
```javascript
{
  name: String (required, unique),
  description: String,
  image: String (required),
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0)
}
```

### Key Fields
- **name**: Unique category name (e.g., "Fruits", "Vegetables")
- **description**: Optional detailed description
- **image**: Path to category display image
- **isActive**: Controls visibility in frontend
- **sortOrder**: Determines display order

## Admin Category Management

### Category List View
- Grid layout displaying category cards
- Each card shows image, name, and action buttons
- Active/inactive status indicators
- Drag-and-drop reordering (future feature)

### Creating Categories
1. **Access**: Admin Dashboard → Categories
2. **Form Fields**:
   - Category name (required, unique)
   - Description (optional)
   - Image upload (required)
   - Sort order (optional)
3. **Validation**:
   - Name uniqueness check
   - Image file type validation
   - Required field validation
4. **API Call**: POST /api/categories
5. **Success**: Category added to list, image uploaded

### Editing Categories
1. **Select Category**: Click edit button on category card
2. **Modal Form**: Pre-populated with current values
3. **Image Replacement**: Option to upload new image
4. **Update**: PUT /api/categories/:id
5. **Real-time Update**: List refreshes with changes

### Deleting Categories
1. **Confirmation**: Delete button with confirmation dialog
2. **Impact Check**: Verify no products use this category
3. **Reassignment**: Option to move products to another category
4. **API Call**: DELETE /api/categories/:id
5. **Cleanup**: Remove associated image file

## Frontend Category Display

### Homepage Categories
- Grid of category cards on HomePage
- Each card links to CategoryPage
- Images load lazily for performance
- Hover effects for interactivity

### Category Navigation
- Navbar dropdown or sidebar menu
- Alphabetical or custom ordering
- Active category highlighting

### Category Page
- Filtered product display
- Category banner/header
- Breadcrumb navigation
- Subcategory support (future)

## Category-Product Relationships

### Product Assignment
- Products linked to categories via category field
- Single category per product (flat structure)
- Category required for product creation

### Category Filtering
- Products filtered by selected category
- Combined with search functionality
- Real-time filtering without page reload

### Orphaned Products
- Products without active categories hidden
- Admin notification for cleanup
- Bulk reassignment tools

## Image Management

### Upload Process
1. **File Selection**: Admin selects image file
2. **Client Validation**: Check file type and size
3. **Upload**: FormData POST to /api/categories
4. **Server Processing**:
   - Multer handles file storage
   - Unique filename generation
   - Path stored in database
5. **Display**: Image served from /uploads/categories/

### Image Requirements
- **Formats**: JPEG, PNG, WebP
- **Size Limit**: 5MB per file
- **Dimensions**: Recommended 400x300px
- **Optimization**: Automatic resizing (future)

### Image Updates
- Replace existing image on edit
- Delete old file when replaced
- Maintain image if not changed

## Sorting and Organization

### Sort Order
- Manual sort order field
- Default alphabetical fallback
- Admin-configurable ordering

### Display Logic
```javascript
const sortedCategories = categories
  .filter(cat => cat.isActive)
  .sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.name.localeCompare(b.name);
  });
```

### Future Enhancements
- Drag-and-drop reordering
- Nested subcategories
- Category hierarchies

## Performance Considerations

### Database Queries
- Indexed queries for active categories
- Population of related products (when needed)
- Cached category data

### Image Optimization
- Lazy loading on frontend
- Compressed image storage
- CDN integration (future)

### Caching Strategy
- Category list cached in memory
- Invalidate on changes
- Client-side caching

## Analytics and Insights

### Category Performance
- Product count per category
- Sales by category
- Popular categories tracking

### Admin Dashboard
- Category overview in AdminOverview
- Low-product categories alerts
- Category usage statistics

## Error Handling

### Validation Errors
- Duplicate category names
- Invalid image files
- Missing required fields

### File Upload Errors
- File too large
- Invalid file type
- Upload failure recovery

### Deletion Constraints
- Prevent deletion of categories with products
- Offer reassignment options
- Cascade delete warnings

## API Integration

### Category Endpoints
- GET /api/categories - Fetch all active categories
- POST /api/categories - Create new category
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

### Request/Response Examples
```javascript
// Create category
POST /api/categories
Content-Type: multipart/form-data
{
  name: "Organic Produce",
  description: "Fresh organic fruits and vegetables",
  image: [file],
  sortOrder: 1
}

// Response
{
  "category": {
    "_id": "category_id",
    "name": "Organic Produce",
    "image": "/uploads/categories/timestamp-random.jpg"
  }
}
```

## Testing

### Unit Tests
- Category model validation
- Image upload handling
- Sort order logic

### Integration Tests
- Full CRUD operations
- File upload workflows
- Frontend category display

### E2E Tests
- Admin category management flow
- User category browsing
- Image upload and display

## Future Features

### Advanced Organization
- **Subcategories**: Nested category structure
- **Tags**: Additional classification system
- **Custom Ordering**: Drag-and-drop interface

### Enhanced Display
- **Category Banners**: Promotional images per category
- **Featured Categories**: Homepage highlighting
- **Category Descriptions**: Rich text descriptions

### Analytics
- **Category Performance**: Sales and view tracking
- **User Preferences**: Popular categories per user
- **Seasonal Categories**: Time-based category features

### Mobile Optimization
- **Touch-Friendly**: Larger touch targets
- **Swipe Navigation**: Category browsing
- **Offline Categories**: Cached category data

This category management system provides a solid foundation for organizing products while maintaining flexibility for future enhancements.
