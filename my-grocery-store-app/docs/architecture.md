# Architecture Overview

This document outlines the high-level architecture of the Grocery Store App, including the overall system design, data flow, and component interactions.

## System Architecture

The application follows a client-server architecture with a clear separation of concerns:

### Frontend (Client)
- **Technology**: React.js with hooks for state management.
- **Purpose**: Handles user interface, user interactions, and API communication.
- **Key Components**:
  - `App.js`: Main application component managing global state and routing.
  - Component folders: `Admin/`, `Auth/`, `Common/`, `User/`.
  - State: Managed via React hooks (useState, useEffect) in App.js.
  - API Calls: Fetch API for HTTP requests to backend.

### Backend (Server)
- **Technology**: Node.js with Express.js framework.
- **Purpose**: Handles business logic, database operations, and API endpoints.
- **Key Components**:
  - `server.js`: Main server file with middleware and route setup.
  - Models: Mongoose schemas for data validation.
  - Routes: RESTful API endpoints for CRUD operations.
  - Middleware: CORS, session management, file uploads.

### Database
- **Technology**: MongoDB with Mongoose ODM.
- **Purpose**: Persistent data storage.
- **Collections**: Users, Groceries, Orders, Categories, Banners, Discounts, CartItems.

## Data Flow

### User Registration/Login
1. User submits form on frontend.
2. Frontend sends POST request to `/api/auth/register` or `/api/auth/login`.
3. Backend validates credentials, creates/updates session.
4. Response sent back with user data.
5. Frontend updates state and redirects.

### Product Browsing
1. On app load, frontend fetches products via GET `/api/groceries`.
2. Backend queries MongoDB for grocery items.
3. Data returned as JSON array.
4. Frontend renders products in components like HomePage.

### Adding to Cart
1. User clicks "Add to Cart" on ProductCard.
2. Frontend sends POST to `/api/cart` with product ID and quantity.
3. Backend adds item to user's cart in database.
4. Frontend updates local cart state.

### Order Placement
1. User proceeds to checkout.
2. Frontend sends POST to `/api/orders` with cart items and user details.
3. Backend creates order, updates inventory, clears cart.
4. Frontend redirects to profile or confirmation page.

### Admin Operations
1. Admin logs in, accesses dashboard.
2. Frontend fetches data (products, orders) via various GET endpoints.
3. Admin performs CRUD operations via POST/PUT/DELETE requests.
4. Backend updates database accordingly.

## Component Hierarchy

```
App.js
├── Navbar (Common)
├── Main Content
│   ├── Auth Pages (LoginPage, SignupPage)
│   ├── User Pages
│   │   ├── HomePage
│   │   ├── CategoryPage
│   │   ├── CartPage
│   │   ├── PaymentPage
│   │   └── ProfilePage
│   └── Admin Pages (AdminDashboard)
│       ├── AdminOverview
│       ├── AdminProducts
│       ├── AdminCategories
│       ├── AdminOrders
│       ├── AdminDiscounts
│       └── AdminBanners
└── Footer (Common)
```

## State Management

- **Global State**: Managed in `App.js` using React hooks.
  - `page`: Current page/route.
  - `loggedInUser`: Current user object.
  - `products`, `categories`, `orders`, `cart`: Application data.
- **Local State**: Managed within individual components for form inputs, loading states, etc.
- **Persistence**: Session-based via backend, with cookies for authentication.

## API Design

- **RESTful Endpoints**: Standard HTTP methods (GET, POST, PUT, DELETE).
- **Base URL**: `/api`
- **Authentication**: Session-based, with `credentials: 'include'` in fetch requests.
- **Response Format**: JSON for data, appropriate HTTP status codes.
- **Error Handling**: Consistent error responses with messages.

## Security Considerations

- **Authentication**: Password hashing with bcrypt, session management.
- **Authorization**: Role-based access (user vs admin).
- **CORS**: Configured for localhost origins.
- **Input Validation**: Server-side validation using Mongoose schemas.
- **File Uploads**: Secure handling with Multer, stored in `/uploads` directory.

## Scalability

- **Frontend**: Code splitting with lazy loading reduces initial bundle size.
- **Backend**: Modular routes and models allow easy extension.
- **Database**: MongoDB's flexibility supports schema evolution.
- **Caching**: Static file caching for images (1 year).

## Deployment

- **Frontend**: Static build served by web server or CDN.
- **Backend**: Node.js server on cloud platform (e.g., Heroku, AWS).
- **Database**: MongoDB Atlas for cloud hosting.
- **Environment**: Separate configs for development/production.

For detailed data flows, see [User Data Flow](./user-data-flow.md) and [Admin Data Flow](./admin-data-flow.md).
