import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import {
  initialUsers,
  initialOrders
} from './data/mockData';

// Lazy load components for code splitting
const HomePage = lazy(() => import('./components/User/HomePage'));
const CategoryPage = lazy(() => import('./components/User/CategoryPage'));
const CartPage = lazy(() => import('./components/User/CartPage'));
const PaymentPage = lazy(() => import('./components/User/PaymentPage'));
const ProfilePage = lazy(() => import('./components/User/ProfilePage'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));

function App() {
  const [page, setPage] = useState('login');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [discountCodes, setDiscountCodes] = useState([]);
  const [banners, setBanners] = useState([]);

  const addToCart = async (productToAdd) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ groceryId: productToAdd._id, quantity: 1 }),
      });
      if (response.ok) {
        // Update local cart state
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.groceryId && item.groceryId._id === productToAdd._id);
          if (existingItem) {
            return prevCart.map(item => item.groceryId && item.groceryId._id === productToAdd._id ? { ...item, quantity: item.quantity + 1 } : item);
          } else {
            return [...prevCart, { groceryId: productToAdd, quantity: 1 }];
          }
        });
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        credentials: 'include',
      });
      if (response.ok) {
        const cartItems = await response.json();
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (groceryId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${groceryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (response.ok) {
        setCart(cart.map(item => item.groceryId && item.groceryId._id === groceryId ? { ...item, quantity: newQuantity } : item));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (groceryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${groceryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setCart(cart.filter(item => item.groceryId && item.groceryId._id !== groceryId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/groceries')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/discounts')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setDiscountCodes(data))
      .catch(err => console.error('Failed to fetch discounts:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/banners')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setBanners(data))
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const user = data.user;
          setLoggedInUser(user);
          setPage(user.role === 'admin' ? 'admin' : 'home');
          fetchCart();
        } else {
          setLoggedInUser(null);
          setPage('login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLoggedInUser(null);
        setPage('login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === 'admin') {
      const fetchOrders = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/orders', {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          } else {
            console.error('Failed to fetch orders');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      fetchOrders();
    }
  }, [loggedInUser]);



  const clearCart = () => setCart([]);

  const updateUser = (updatedUser) => {
    setLoggedInUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addOrder = (newOrder) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
    let productsAfterOrder = [...products];
    newOrder.items.forEach(orderItem => {
      productsAfterOrder = productsAfterOrder.map(p => p.id === orderItem.id ? { ...p, stock: p.stock - orderItem.quantity } : p);
    });
    setProducts(productsAfterOrder);
  };

  const applyDiscountCode = (codeToApply) => {
    setDiscountCodes(discountCodes.map(c => 
      c.code.toLowerCase() === codeToApply.toLowerCase() 
      ? { ...c, usedCount: c.usedCount + 1 } 
      : c
    ));
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (!loggedInUser) {
      if (page === 'signup') return <SignupPage setPage={setPage} />;
      return <LoginPage setPage={setPage} setLoggedInUser={setLoggedInUser} />;
    }

    if (loggedInUser.role === 'admin') {
      if (page === 'profile') return <ProfilePage user={loggedInUser} setUser={updateUser} setPage={setPage} />;
      return <AdminDashboard products={products} setProducts={setProducts} orders={orders} categories={categories} setCategories={setCategories} discountCodes={discountCodes} setDiscountCodes={setDiscountCodes} />;
    }

    switch (page) {
      case 'home': return <HomePage products={products} categories={categories} banners={banners} addToCart={addToCart} setPage={setPage} setSelectedCategory={setSelectedCategory} searchTerm={searchTerm} />;
      case 'category': return <CategoryPage products={products} addToCart={addToCart} selectedCategory={selectedCategory} searchTerm={searchTerm} />;
      case 'cart': return <CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} setPage={setPage} />;
      case 'payment': return <PaymentPage setPage={setPage} clearCart={clearCart} cart={cart} user={loggedInUser} addOrder={addOrder} discountCodes={discountCodes} applyDiscountCode={applyDiscountCode}/>;
      case 'profile': return <ProfilePage user={loggedInUser} setUser={updateUser} setPage={setPage} />;
      default: return <HomePage products={products} categories={categories} banners={banners} addToCart={addToCart} setPage={setPage} setSelectedCategory={setSelectedCategory} searchTerm={searchTerm} />;
    }
  };

  return (
    <div className="font-sans bg-slate-50 text-slate-800 flex flex-col min-h-screen">
      <Navbar setPage={setPage} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} cart={cart} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div></div>}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
