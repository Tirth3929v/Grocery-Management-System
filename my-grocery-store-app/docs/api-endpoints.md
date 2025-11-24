# API Endpoints

This document provides comprehensive documentation for all REST API endpoints in the Grocery Store App backend.

## Base URL
```
http://localhost:5000/api
```

All endpoints require JSON content type and include credentials for session management.

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main St, City, State 12345"
}
```

**Response (201):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "role": "user"
  }
}
```

**Error Responses:**
- 400: Validation error (missing fields, invalid email)
- 409: Email already exists

### POST /auth/login
Authenticate user login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- 401: Invalid credentials
- 400: Missing email or password

### POST /auth/logout
Destroy user session.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

## Product Endpoints

### GET /groceries
Retrieve all active products.

**Query Parameters:**
- `category`: Filter by category ID
- `search`: Search in name and description
- `limit`: Number of results (default: 50)
- `skip`: Pagination offset

**Response (200):**
```json
[
  {
    "_id": "product_id",
    "name": "Organic Apples",
    "price": 2.99,
    "image": "/uploads/groceries/apple.jpg",
    "category": {
      "_id": "category_id",
      "name": "Fruits"
    },
    "description": "Fresh organic apples",
    "stock": 100,
    "unit": "kg",
    "isActive": true
  }
]
```

### POST /groceries
Create a new product (Admin only).

**Request Body (FormData):**
- `name`: Product name
- `price`: Product price
- `category`: Category ID
- `description`: Product description
- `stock`: Initial stock
- `unit`: Unit of measurement
- `image`: Product image file

**Response (201):**
```json
{
  "product": {
    "_id": "product_id",
    "name": "New Product",
    "price": 9.99,
    "image": "/uploads/groceries/image.jpg",
    "category": "category_id",
    "stock": 50
  }
}
```

**Error Responses:**
- 403: Admin access required
- 400: Validation error

### PUT /groceries/:id
Update existing product (Admin only).

**Request Body:** Same as POST, all fields optional.

**Response (200):**
```json
{
  "product": {
    "_id": "product_id",
    "name": "Updated Product",
    "price": 12.99
  }
}
```

### DELETE /groceries/:id
Delete product (Admin only).

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

## Category Endpoints

### GET /categories
Retrieve all active categories.

**Response (200):**
```json
[
  {
    "_id": "category_id",
    "name": "Fruits",
    "description": "Fresh fruits",
    "image": "/uploads/categories/fruits.jpg",
    "isActive": true,
    "sortOrder": 1
  }
]
```

### POST /categories
Create new category (Admin only).

**Request Body (FormData):**
- `name`: Category name
- `description`: Category description
- `image`: Category image file
- `sortOrder`: Display order

**Response (201):**
```json
{
  "category": {
    "_id": "category_id",
    "name": "New Category",
    "image": "/uploads/categories/image.jpg"
  }
}
```

### PUT /categories/:id
Update category (Admin only).

**Request Body:** Same as POST, fields optional.

### DELETE /categories/:id
Delete category (Admin only).

## Cart Endpoints

### GET /cart
Retrieve user's cart items.

**Response (200):**
```json
[
  {
    "_id": "cart_item_id",
    "groceryId": {
      "_id": "product_id",
      "name": "Organic Apples",
      "price": 2.99,
      "image": "/uploads/groceries/apple.jpg"
    },
    "quantity": 2
  }
]
```

### POST /cart
Add item to cart.

**Request Body:**
```json
{
  "groceryId": "product_id",
  "quantity": 1
}
```

**Response (200):**
```json
{
  "cartItem": {
    "_id": "cart_item_id",
    "groceryId": "product_id",
    "quantity": 3
  }
}
```

### PUT /cart/:groceryId
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (200):**
```json
{
  "cartItem": {
    "_id": "cart_item_id",
    "quantity": 5
  }
}
```

### DELETE /cart/:groceryId
Remove item from cart.

**Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

## Order Endpoints

### GET /orders
Retrieve orders (Admin: all orders, User: own orders).

**Query Parameters:**
- `status`: Filter by order status
- `limit`: Pagination limit
- `skip`: Pagination offset

**Response (200):**
```json
[
  {
    "_id": "order_id",
    "userId": "user_id",
    "userName": "John Doe",
    "address": "123 Main St",
    "items": [
      {
        "id": "product_id",
        "name": "Organic Apples",
        "price": 2.99,
        "quantity": 2
      }
    ],
    "totalAmount": 5.98,
    "discountApplied": "SAVE10",
    "status": "pending",
    "createdAt": "2023-01-01T10:00:00Z"
  }
]
```

### POST /orders
Create new order from cart.

**Request Body:**
```json
{
  "address": "123 Main St, City, State 12345",
  "discountCode": "SAVE10"
}
```

**Response (201):**
```json
{
  "order": {
    "_id": "order_id",
    "totalAmount": 5.98,
    "status": "pending"
  }
}
```

**Error Responses:**
- 400: Insufficient stock, invalid discount

### PUT /orders/:id
Update order status (Admin only).

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response (200):**
```json
{
  "order": {
    "_id": "order_id",
    "status": "shipped"
  }
}
```

## Discount Endpoints

### GET /discounts
Retrieve all active discounts (Admin only).

**Response (200):**
```json
[
  {
    "_id": "discount_id",
    "code": "SAVE10",
    "description": "10% off",
    "type": "percentage",
    "value": 10,
    "maxUses": 100,
    "usedCount": 5,
    "expiryDate": "2023-12-31T23:59:59Z",
    "isActive": true
  }
]
```

### POST /discounts
Create new discount (Admin only).

**Request Body:**
```json
{
  "code": "NEWYEAR",
  "description": "New Year Sale",
  "type": "percentage",
  "value": 15,
  "maxUses": 500,
  "expiryDate": "2024-01-01T00:00:00Z"
}
```

### PUT /discounts/:id
Update discount (Admin only).

### DELETE /discounts/:id
Delete discount (Admin only).

### POST /discounts/validate
Validate discount code.

**Request Body:**
```json
{
  "code": "SAVE10"
}
```

**Response (200):**
```json
{
  "discount": {
    "_id": "discount_id",
    "code": "SAVE10",
    "type": "percentage",
    "value": 10
  }
}
```

**Error Responses:**
- 400: Invalid or expired code

## Banner Endpoints

### GET /banners
Retrieve active banners.

**Response (200):**
```json
[
  {
    "_id": "banner_id",
    "image": "/uploads/banners/banner1.jpg",
    "title": "Special Offer",
    "description": "50% off on fruits",
    "link": "/category/fruits",
    "isActive": true,
    "sortOrder": 1
  }
]
```

### POST /banners
Upload new banner (Admin only).

**Request Body (FormData):**
- `image`: Banner image file
- `title`: Banner title
- `description`: Banner description
- `link`: Click URL
- `sortOrder`: Display order

### PUT /banners/:id
Update banner (Admin only).

### DELETE /banners/:id
Delete banner (Admin only).

## Error Response Format

All endpoints return errors in this format:

```json
{
  "error": "Error message description",
  "details": "Additional error information" // optional
}
```

## Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

## Authentication Requirements

- **Public**: GET /groceries, GET /categories, GET /banners, POST /auth/register, POST /auth/login
- **User**: All cart and order operations, profile updates
- **Admin**: All POST/PUT/DELETE operations, GET /discounts

## Rate Limiting

- Not implemented in current version
- Future: 100 requests per minute per IP

## CORS Configuration

- Allows requests from `http://localhost:3000` (development)
- Includes credentials for session cookies

## File Upload Limits

- **Images**: Max 5MB per file
- **Types**: JPEG, PNG, WebP
- **Storage**: Local filesystem in `/uploads` directory

For backend routing implementation details, see [Backend Routing](./backend-routing.md).
