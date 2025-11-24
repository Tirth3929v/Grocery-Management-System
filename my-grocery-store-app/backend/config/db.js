 
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/grocery_store';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Please ensure MongoDB is running and the connection string is correct.');
    // Do not exit, allow server to start but database operations will fail
  }
};

module.exports = connectDB;
