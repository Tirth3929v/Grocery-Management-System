export const initialProducts = [
  { id: 1, name: 'Organic Apples', price: 2.99, category: 'Fruits', image: '/images/OrganicApples.jpg', stock: 100 },
  { id: 2, name: 'Whole Wheat Bread', price: 3.49, category: 'Bakery', image: '/images/WholeWheatBread.jpg', stock: 50 },
  { id: 3, name: 'Free-Range Eggs', price: 4.99, category: 'Dairy', image: '/images/FreeRangeEggs.jpg', stock: 75 },
  { id: 4, name: 'Organic Spinach', price: 2.50, category: 'Vegetables', image: '/images/OrganicSpinach.png', stock: 60 },
  { id: 5, name: 'Almond Milk', price: 3.29, category: 'Dairy', image: '/images/Almond Milk.png', stock: 40 },
  { id: 6, name: 'Chicken Breast', price: 8.99, category: 'Meat', image: '/images/ChickenBreast.jpg', stock: 30 },
  { id: 7, name: 'Bananas', price: 1.50, category: 'Fruits', image: '/images/Bananas.jpg', stock: 120 },
  { id: 8, name: 'Sourdough Loaf', price: 4.50, category: 'Bakery', image: '/images/SourdoughLoaf.jpg', stock: 0 },
];

export const initialUsers = [
  { id: 1, email: 'user@example.com', password: 'password123', role: 'user', name: 'Tirth', address: '123 Main St, Anytown, USA', profileImage: '/images/ProfileJD.png' },
  { id: 2, email: 'admin@example.com', password: 'admin123', role: 'admin', name: 'Admin User', address: '456 Admin Ave, Control City, USA', profileImage: '/images/ProfileAU.png' },
];

export const initialCategories = [
  { id: 1, name: 'Fruits', image: '/images/Fruits.png' },
  { id: 2, name: 'Bakery', image: '/images/Bakery.png' },
  { id: 3, name: 'Dairy', image: '/images/Dairy.png' },
  { id: 4, name: 'Vegetables', image: '/images/Vegetables.png' },
  { id: 5, name: 'Meat', image: '/images/Meat.png' },
  { id: 6, name: 'Grocery', image: '/images/Grocery.png' },
];

export const initialOrders = [
  {
    id: `ORD-1672531200000`, // Jan 1, 2023
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    userId: 1,
    userName: 'John Doe',
    items: [{ id: 1, name: 'Organic Apples', price: 2.99, quantity: 5 }],
    totalAmount: 14.95
  },
  {
    id: `ORD-1672617600000`, // Jan 2, 2023
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    userId: 1,
    userName: 'John Doe',
    items: [
      { id: 3, name: 'Free-Range Eggs', price: 4.99, quantity: 2 },
      { id: 2, name: 'Whole Wheat Bread', price: 3.49, quantity: 1 }
    ],
    totalAmount: 13.47
  }
];

export const initialDiscountCodes = [
  { id: 1, code: 'SAVE10', discountPercentage: 10, limit: 100, usedCount: 20 },
  { id: 2, code: 'FRESH20', discountPercentage: 20, limit: 50, usedCount: 48 },
  { id: 3, code: 'EXPIRED', discountPercentage: 15, limit: 10, usedCount: 10 },
];