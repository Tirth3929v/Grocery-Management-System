# Project Setup

This guide provides step-by-step instructions to set up the Grocery Store App on your local machine for development.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (version 14 or higher): Download from [nodejs.org](https://nodejs.org/).
- **npm** (comes with Node.js) or **yarn**.
- **MongoDB**: Install locally or use a cloud service like MongoDB Atlas.
- **Git**: For cloning the repository.

## Installation

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd my-grocery-store-app
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGO_URI=mongodb://localhost:27017/grocery-store
     PORT=5000
     SESSION_SECRET=your-secret-key-here
     ```
     - Replace `MONGO_URI` with your MongoDB connection string if using a remote database.
   - Seed the database (optional, for initial data):
     ```
     node seed.js
     ```

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - No additional configuration needed for development.

## Running the Application

1. **Start the Backend Server**
   - From the backend directory:
     ```
     npm start
     ```
   - The server will run on `http://localhost:5000`.

2. **Start the Frontend Development Server**
   - From the frontend directory:
     ```
     npm start
     ```
   - The app will open in your browser at `http://localhost:3000`.

## Building for Production

1. **Build the Frontend**
   - From the frontend directory:
     ```
     npm run build
     ```
   - This creates a `build` folder with optimized production files.

2. **Serve the Production Build**
   - You can serve the build folder using any static server, or integrate it with the backend.
   - For example, using `serve`:
     ```
     npx serve -s build
     ```

## Environment Variables

### Backend (.env)
- `MONGO_URI`: MongoDB connection string.
- `PORT`: Server port (default: 5000).
- `SESSION_SECRET`: Secret key for session management.

### Frontend
- No environment variables required for basic setup. API calls are hardcoded to `http://localhost:5000`.

## Database Setup

- Ensure MongoDB is running locally or configure a remote instance.
- The application uses Mongoose for schema definition and data validation.
- Initial data can be seeded using `seed.js`.

## Troubleshooting

- **Port Conflicts**: If port 3000 or 5000 is in use, change the port in the respective configuration.
- **MongoDB Connection Issues**: Verify the `MONGO_URI` and ensure MongoDB is running.
- **CORS Errors**: Ensure the backend allows requests from `http://localhost:3000`.
- **Build Errors**: Clear node_modules and reinstall dependencies.

For more troubleshooting tips, see [Troubleshooting](./troubleshooting.md).

## Next Steps

Once set up, explore the application:
- Register as a user or admin.
- Browse products and add to cart.
- As admin, manage inventory from the dashboard.

Refer to [Architecture Overview](./architecture.md) for a deeper understanding of the codebase.
