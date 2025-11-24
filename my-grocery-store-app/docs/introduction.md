# Introduction

## Overview

The Grocery Store App is a modern, full-stack web application designed to provide an online shopping experience for groceries. It caters to two primary user roles: regular users (customers) who can browse, add to cart, and purchase groceries, and administrators who manage the store's inventory, categories, orders, discounts, and promotional banners.

The application is built using the MERN stack (MongoDB, Express.js, React, Node.js), ensuring scalability, performance, and a seamless user experience.

## Key Features

### User Features
- **User Registration and Authentication**: Secure login and signup with session management.
- **Product Browsing**: View products by categories or search functionality.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Order Placement**: Complete purchases with payment processing (simulated).
- **User Profile**: Manage personal information and view order history.
- **Responsive Design**: Optimized for desktop and mobile devices using Tailwind CSS.

### Admin Features
- **Dashboard Overview**: Analytics on sales, orders, and inventory.
- **Product Management**: Add, edit, delete, and manage grocery items.
- **Category Management**: Organize products into categories with images.
- **Order Management**: View and update order statuses.
- **Discount Management**: Create and manage discount codes.
- **Banner Management**: Upload and manage promotional banners.
- **User Management**: (Future feature) Manage user accounts.

## Technology Stack

### Frontend
- **React**: Component-based UI library for building interactive interfaces.
- **React Router**: For client-side routing (handled via state in App.js).
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios/Fetch API**: For making HTTP requests to the backend.
- **Lazy Loading**: Code splitting for performance optimization.

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM for MongoDB, providing schema validation.
- **Multer**: Middleware for handling file uploads (images for products, categories, banners).
- **Express Session**: For session management and authentication.

### Additional Tools
- **bcrypt**: Password hashing for security.
- **CORS**: Cross-origin resource sharing for frontend-backend communication.
- **Dotenv**: Environment variable management.

## Project Structure

```
my-grocery-store-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Grocery.js
│   │   ├── Order.js
│   │   ├── Category.js
│   │   ├── Banner.js
│   │   ├── Discount.js
│   │   └── CartItem.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── groceryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── discountRoutes.js
│   │   └── bannerRoutes.js
│   ├── uploads/
│   │   ├── groceries/
│   │   ├── categories/
│   │   ├── banners/
│   │   └── profiles/
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Common/
│   │   │   └── User/
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── build/ (production build)
├── docs/ (this documentation)
└── package.json
```

## Target Audience

This documentation is intended for:
- Developers working on the project.
- Contributors interested in understanding the codebase.
- Stakeholders reviewing the application's architecture.
- DevOps engineers deploying the application.

## Getting Started

For detailed setup instructions, refer to [Setup](./setup.md).

## Contributing

See [Contributing](./contributing.md) for guidelines on how to contribute to the project.
