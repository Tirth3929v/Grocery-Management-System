const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Order = require('./models/Order');
const Grocery = require('./models/Grocery');
const Category = require('./models/Category');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/grocery_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Check if admin exists
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    // Check if default user exists
    let user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      user = new User({
        name: 'Default User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user'
      });
      await user.save();
      console.log('Default user created: user@example.com / password123');
    } else {
      console.log('Default user already exists.');
    }

    // Seed groceries from products.json
    const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    for (const productData of productsData) {
      let existingGrocery = await Grocery.findOne({ name: productData.name });
      if (!existingGrocery) {
        const grocery = new Grocery({
          name: productData.name,
          category: productData.category,
          price: productData.price,
          image: productData.image,
          description: productData.description,
          stock: productData.stock
        });
        await grocery.save();
        console.log(`Grocery created: ${productData.name}`);
      } else {
        // Update stock if missing or 0
        if (existingGrocery.stock === 0 || !existingGrocery.stock) {
          existingGrocery.stock = productData.stock;
          await existingGrocery.save();
          console.log(`Grocery stock updated: ${productData.name}`);
        } else {
          console.log(`Grocery already exists with stock: ${productData.name}`);
        }
      }
    }

    // Seed groceries from vegetables_products.json
    const vegetablesData = JSON.parse(fs.readFileSync('./data/vegetables_products.json', 'utf8'));
    for (const vegData of vegetablesData) {
      let existingGrocery = await Grocery.findOne({ name: vegData.name });
      if (!existingGrocery) {
        const grocery = new Grocery({
          name: vegData.name,
          category: vegData.category,
          price: vegData.price,
          image: vegData.image,
          description: vegData.description,
          stock: vegData.stock
        });
        await grocery.save();
        console.log(`Grocery created: ${vegData.name}`);
      } else {
        // Update stock if missing or 0
        if (existingGrocery.stock === 0 || !existingGrocery.stock) {
          existingGrocery.stock = vegData.stock;
          await existingGrocery.save();
          console.log(`Grocery stock updated: ${vegData.name}`);
        } else {
          console.log(`Grocery already exists with stock: ${vegData.name}`);
        }
      }
    }

    // Seed categories
    const categoriesData = [
      { name: 'Fruits', image: '/images/Fruits.png', description: 'Fresh and juicy fruits' },
      { name: 'Bakery', image: '/images/Bakery.png', description: 'Freshly baked goods' },
      { name: 'Dairy', image: '/images/Dairy.png', description: 'Milk and dairy products' },
      { name: 'Vegetables', image: '/images/Vegetables.png', description: 'Fresh and healthy vegetables' }
    ];
    for (const catData of categoriesData) {
      const existingCategory = await Category.findOne({ name: catData.name });
      if (!existingCategory) {
        const category = new Category(catData);
        await category.save();
        console.log(`Category created: ${catData.name}`);
      } else {
        console.log(`Category already exists: ${catData.name}`);
      }
    }

    // Seed sample orders
    const sampleOrders = [
      {
        userId: user._id.toString(),
        userName: user.name,
        address: '123 Main St, City, State 12345',
        items: [
          { id: '1', name: 'Apple', price: 1.5, quantity: 2 },
          { id: '2', name: 'Banana', price: 0.5, quantity: 3 }
        ],
        totalAmount: 4.5,
        date: new Date(Date.now() - 86400000), // Yesterday
        discountApplied: null
      },
      {
        userId: user._id.toString(),
        userName: user.name,
        address: '456 Oak Ave, City, State 12345',
        items: [
          { id: '3', name: 'Milk', price: 3.0, quantity: 1 }
        ],
        totalAmount: 3.0,
        date: new Date(Date.now() - 172800000), // 2 days ago
        discountApplied: 'WELCOME10'
      }
    ];

    for (const orderData of sampleOrders) {
      const existingOrder = await Order.findOne({ userId: orderData.userId, date: orderData.date });
      if (!existingOrder) {
        const order = new Order(orderData);
        await order.save();
        console.log(`Sample order created for ${orderData.userName}`);
      }
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData().catch(err => console.error(err));
