# Admin Data Flow

This document details the data flow for admin-side operations in the Grocery Store App, covering dashboard management, inventory control, and order processing.

## 1. Admin Login

### Flow Diagram
```
Admin enters credentials → POST /api/auth/login → Backend verifies role → Redirect to admin dashboard
```

### Steps
1. **Authentication**: Same as user login, but role check ensures 'admin'.
2. **Dashboard Access**: On successful login, redirect to AdminDashboard.
3. **Initial Data Fetch**: Load overview stats, recent orders, etc.

## 2. Dashboard Overview

### Flow Diagram
```
Admin logs in → GET multiple endpoints → Display analytics → Real-time updates
```

### Steps
1. **Data Aggregation**:
   - GET `/api/orders` for order statistics.
   - GET `/api/groceries` for inventory counts.
   - GET `/api/users` (if implemented) for user metrics.
2. **Analytics Calculation**: Frontend computes totals, trends, low stock alerts.
3. **Display**: AdminOverview component shows charts, KPIs, recent activity.
4. **Auto-refresh**: Periodic fetches for real-time data.

## 3. Product Management

### Flow Diagram
```
Admin views products → GET /api/groceries → Add/Edit/Delete → POST/PUT/DELETE /api/groceries → Update display
```

### Steps
1. **List Products**: AdminProducts fetches and displays all groceries.
2. **Add Product**:
   - Fill form with name, price, category, image upload.
   - POST `/api/groceries` with FormData (including file).
   - Backend: Save image to uploads/groceries, create Grocery document.
3. **Edit Product**:
   - Select product, update fields.
   - PUT `/api/groceries/:id` with changes.
4. **Delete Product**:
   - Confirm deletion.
   - DELETE `/api/groceries/:id`.
5. **Stock Management**: Update stock levels via PUT requests.

## 4. Category Management

### Flow Diagram
```
View categories → GET /api/categories → CRUD operations → Update product associations
```

### Steps
1. **List Categories**: AdminCategories displays category grid with images.
2. **Add Category**:
   - Upload image, enter name/description.
   - POST `/api/categories` with FormData.
3. **Edit/Delete**: Similar to products, with image replacement option.
4. **Association**: Categories linked to products via category field.

## 5. Order Management

### Flow Diagram
```
Fetch orders → GET /api/orders → View details → Update status → PUT /api/orders/:id
```

### Steps
1. **Order List**: AdminOrders displays all orders with status, date, total.
2. **Order Details**: Expand to show items, customer info, address.
3. **Status Updates**: Change from 'pending' to 'shipped', 'delivered', etc.
4. **PUT Request**: Update order status in database.
5. **Notifications**: (Future) Email notifications to customers.

## 6. Discount Management

### Flow Diagram
```
View discounts → GET /api/discounts → Create/Edit/Delete → POST/PUT/DELETE /api/discounts
```

### Steps
1. **Discount List**: AdminDiscounts shows active codes, usage counts.
2. **Create Discount**:
   - Enter code, discount amount/percentage, expiry.
   - POST `/api/discounts`.
3. **Track Usage**: Update usedCount on application during checkout.
4. **Expiry Handling**: Backend checks validity before application.

## 7. Banner Management

### Flow Diagram
```
Upload banners → POST /api/banners → Display on frontend → Delete old banners
```

### Steps
1. **Banner Upload**: AdminBanners allows multiple image uploads.
2. **POST Request**: Send images to `/api/banners`.
3. **Storage**: Save to uploads/banners with timestamps.
4. **Frontend Integration**: Banners fetched and displayed on HomePage.
5. **Rotation**: Cycle through active banners.

## 8. User Management (Future Feature)

### Flow Diagram
```
GET /api/users → View user list → Edit roles → PUT /api/users/:id
```

### Steps
1. **User List**: Display all registered users.
2. **Role Changes**: Promote/demote users to admin.
3. **Account Management**: Deactivate accounts if needed.

## Data Synchronization

- **Real-time Updates**: Admin actions immediately reflect in user views.
- **Consistency**: Database transactions ensure data integrity.
- **Caching**: Avoid over-fetching with efficient state management.

## Security and Permissions

- **Role-based Access**: Only admins can access admin routes.
- **Session Validation**: All admin API calls check session and role.
- **Audit Logging**: (Future) Log admin actions for accountability.

## Performance Considerations

- **Pagination**: For large lists (products, orders).
- **Image Optimization**: Resize/compress uploaded images.
- **Bulk Operations**: Allow batch updates for efficiency.

## Error Handling

- **Validation Errors**: Display form validation messages.
- **Network Issues**: Retry mechanisms with user feedback.
- **Permission Denied**: Redirect to login or show access denied.

## Integration with User Flows

- Admin changes (e.g., stock updates) immediately affect user experience.
- Order status changes trigger user notifications (future).
- Discount codes created by admin are applied in user checkout.

For user data flows, see [User Data Flow](./user-data-flow.md).
