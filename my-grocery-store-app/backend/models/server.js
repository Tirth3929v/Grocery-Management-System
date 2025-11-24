const mongoose = require('mongoose');
const User = require('./User');
const Grocery = require('./Grocery');
const CartItem = require('./CartItem');
const Order = require('./Order');
const Category = require('./Category');
const Banner = require('./Banner');
const Discount = require('./Discount');

// Database query functions
const getAllUsers = async () => {
  return await User.find({}).select('-password');
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const getAllGroceries = async () => {
  return await Grocery.find({}).populate('category');
};

const getGroceriesByCategory = async (categoryId) => {
  return await Grocery.find({ category: categoryId }).populate('category');
};

const getGroceryById = async (id) => {
  return await Grocery.findById(id).populate('category');
};

const getCartByUserId = async (userId) => {
  return await CartItem.find({ user: userId }).populate('groceryId');
};

const addToCart = async (userId, groceryId, quantity = 1) => {
  let cartItem = await CartItem.findOne({ user: userId, groceryId });
  if (cartItem) {
    cartItem.quantity += quantity;
    return await cartItem.save();
  } else {
    return await CartItem.create({ user: userId, groceryId, quantity });
  }
};

const updateCartItem = async (cartItemId, quantity) => {
  const cartItem = await CartItem.findById(cartItemId);
  if (cartItem && quantity > 0) {
    cartItem.quantity = quantity;
    return await cartItem.save();
  } else if (quantity <= 0) {
    return await CartItem.findByIdAndDelete(cartItemId);
  }
  return null;
};

const removeFromCart = async (cartItemId) => {
  return await CartItem.findByIdAndDelete(cartItemId);
};

const getAllOrders = async (userId = null) => {
  if (userId) {
    return await Order.find({ user: userId }).populate('items.groceryId');
  }
  return await Order.find({}).populate('user', 'name email').populate('items.groceryId');
};

const createOrder = async (userId, items, totalAmount) => {
  return await Order.create({
    user: userId,
    items,
    totalAmount
  });
};

const getAllCategories = async () => {
  return await Category.find({});
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const getAllBanners = async () => {
  return await Banner.find({});
};

const getAllDiscounts = async () => {
  return await Discount.find({});
};

const applyDiscount = async (discountCode, totalAmount) => {
  const discount = await Discount.findOne({ code: discountCode, isActive: true });
  if (discount && totalAmount >= discount.minAmount) {
    return {
      discount,
      discountedAmount: totalAmount * (1 - discount.percentage / 100)
    };
  }
  return null;
};

module.exports = {
  getAllUsers,
  getUserById,
  getAllGroceries,
  getGroceriesByCategory,
  getGroceryById,
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  getAllOrders,
  createOrder,
  getAllCategories,
  getCategoryById,
  getAllBanners,
  getAllDiscounts,
  applyDiscount
};
