# Admin Components

This document details the React components used in the admin dashboard for managing the grocery store.

## AdminDashboard

### File Location
`src/components/Admin/AdminDashboard.js`

### Purpose
Main container for all admin functionality, providing navigation between different admin sections.

### Features
- **Section Navigation**: Tabs or sidebar for switching between admin areas.
- **Overview Display**: Quick stats and recent activity.
- **Sub-component Rendering**: Dynamically loads admin components.
- **Permission Checks**: Ensures only admins can access.

### Props
- `products`, `setProducts`: Product management.
- `orders`: Order data.
- `categories`, `setCategories`: Category management.
- `discountCodes`, `setDiscountCodes`: Discount management.

### State Management
- Current active section
- Loading states for data

### Key Functions
- `handleSectionChange`: Switches admin views
- `loadData`: Fetches required data for sections

## AdminOverview

### File Location
`src/components/Admin/AdminOverview.js`

### Purpose
Dashboard analytics and key performance indicators for the store.

### Features
- **Sales Charts**: Revenue trends over time.
- **Order Statistics**: Total orders, pending, completed.
- **Top Products**: Best-selling items.
- **Inventory Alerts**: Low stock warnings.
- **Recent Activity**: Latest orders and user registrations.

### Props
- `products`: For inventory data.
- `orders`: For order analytics.

### State Management
- Chart data
- Date range filters

### Key Functions
- `calculateRevenue`: Aggregates sales data
- `getTopProducts`: Identifies best sellers
- `checkLowStock`: Identifies items below threshold

### UI Elements
- Chart.js or similar for visualizations
- KPI cards with icons
- Activity feed
- Filter controls

## AdminProducts

### File Location
`src/components/Admin/AdminProducts.js`

### Purpose
Complete product inventory management interface.

### Features
- **Product List**: Table/grid view of all products.
- **Add Product**: Form for creating new items.
- **Edit Product**: Inline or modal editing.
- **Delete Product**: Removal with confirmation.
- **Image Upload**: File upload for product photos.
- **Stock Management**: Update quantities.
- **Bulk Actions**: Select multiple for batch operations.

### Props
- `products`, `setProducts`: Product array and updater.

### State Management
- Form data for add/edit
- Selected products for bulk actions
- Search/filter state

### Key Functions
- `handleAddProduct`: Creates new product
- `handleEditProduct`: Updates existing product
- `handleDeleteProduct`: Removes product
- `handleImageUpload`: Processes file uploads

### UI Elements
- Data table with sorting/pagination
- Modal forms for add/edit
- Image preview and upload
- Bulk action toolbar

## AdminCategories

### File Location
`src/components/Admin/AdminCategories.js`

### Purpose
Management of product categories and their organization.

### Features
- **Category Grid**: Visual display of categories with images.
- **Add Category**: Create new category with image.
- **Edit Category**: Update name, description, image.
- **Delete Category**: Remove with reassignment option.
- **Drag & Drop**: Reorder categories (future).
- **Product Association**: View products in each category.

### Props
- `categories`, `setCategories`: Category array and updater.

### State Management
- Form data
- Selected category for editing

### Key Functions
- `handleAddCategory`: Creates new category
- `handleEditCategory`: Updates category
- `handleDeleteCategory`: Removes category

### UI Elements
- Card-based grid layout
- Image upload for category icons
- Edit modal
- Category statistics

## AdminOrders

### File Location
`src/components/Admin/AdminOrders.js`

### Purpose
Order processing and management for administrators.

### Features
- **Order List**: Comprehensive order table.
- **Status Filtering**: Filter by order status.
- **Order Details**: Expandable order information.
- **Status Updates**: Change order status.
- **Customer Info**: Contact details and history.
- **Export Orders**: CSV/PDF export functionality.

### Props
- `orders`: Array of all orders.

### State Management
- Filter criteria
- Selected order for details

### Key Functions
- `updateOrderStatus`: Changes order status
- `viewOrderDetails`: Shows detailed order modal
- `exportOrders`: Generates export file

### UI Elements
- Advanced data table
- Status badges with colors
- Order detail modal
- Filter sidebar

## AdminDiscounts

### File Location
`src/components/Admin/AdminDiscounts.js`

### Purpose
Management of discount codes and promotional offers.

### Features
- **Discount List**: Active and expired codes.
- **Create Discount**: Form for new discount codes.
- **Edit Discount**: Modify existing discounts.
- **Usage Tracking**: View redemption statistics.
- **Expiry Management**: Set and monitor expiry dates.
- **Bulk Generation**: Create multiple codes at once.

### Props
- `discountCodes`, `setDiscountCodes`: Discount array and updater.

### State Management
- Form data for new discounts
- Usage statistics

### Key Functions
- `handleCreateDiscount`: Adds new discount
- `handleEditDiscount`: Updates discount
- `trackUsage`: Monitors code redemptions

### UI Elements
- Discount table with usage metrics
- Creation form with validation
- Usage charts
- Expiry warnings

## AdminBanners

### File Location
`src/components/Admin/AdminBanners.js`

### Purpose
Management of promotional banner images displayed on the homepage.

### Features
- **Banner Gallery**: Grid view of uploaded banners.
- **Upload Banner**: File upload with preview.
- **Reorder Banners**: Drag-and-drop ordering.
- **Activate/Deactivate**: Toggle banner visibility.
- **Delete Banner**: Remove unused banners.
- **Banner Analytics**: View click-through rates (future).

### Props
- None (manages own state via API calls)

### State Management
- Banner list
- Upload progress
- Selected banner for editing

### Key Functions
- `handleUpload`: Processes banner uploads
- `handleReorder`: Updates banner order
- `toggleActive`: Shows/hides banner

### UI Elements
- Image gallery with thumbnails
- Upload dropzone
- Drag handles for reordering
- Status toggles

## AdminPage (Legacy)

### File Location
`src/components/Admin/AdminPage.js`

### Purpose
Older admin interface, potentially deprecated in favor of AdminDashboard.

### Features
- Basic admin functions
- May contain duplicate functionality

## Component Patterns

### Data Fetching
- useEffect hooks for initial data loading
- Real-time updates via polling or WebSockets (future)

### Form Handling
- Controlled components for form inputs
- Validation with error display
- File upload handling with progress

### Table/List Management
- Sorting and filtering capabilities
- Pagination for large datasets
- Bulk selection and actions

### Modal Management
- Centralized modal state
- Overlay for focused editing
- Confirmation dialogs for destructive actions

## Security Considerations

### Access Control
- Role-based rendering
- API-level permission checks
- Audit logging for admin actions

### Data Validation
- Server-side validation
- Sanitization of user inputs
- File type restrictions for uploads

## Performance Optimizations

### Lazy Loading
- Load admin components only when accessed
- Image lazy loading for galleries

### Efficient Rendering
- Memoization of expensive operations
- Virtual scrolling for large lists (future)

### Caching
- Cache admin data to reduce API calls
- Invalidate cache on updates

## Future Enhancements

- **Advanced Analytics**: Detailed reporting and dashboards
- **Bulk Import/Export**: CSV upload for products/categories
- **Workflow Automation**: Automated order processing
- **Multi-admin Support**: User management for admin team
- **Audit Logs**: Complete action history
- **Real-time Notifications**: Live updates for order changes

For common components used in admin pages, see [Common Components](./common-components.md).
