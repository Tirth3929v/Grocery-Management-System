import React, { useState, useEffect } from 'react';
import AdminOverview from './AdminOverview';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminDiscounts from './AdminDiscounts';
import AdminOrders from './AdminOrders';
import AdminBanners from './AdminBanners';

const AdminDashboard = ({ products, setProducts, orders, categories, setCategories, discountCodes, setDiscountCodes }) => {
  const [view, setView] = useState('overview');
  const [errors, setErrors] = useState({});
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/banners')
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  const AdminNav = () => (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-8 flex space-x-2 overflow-x-auto">
      <button onClick={() => setView('overview')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'overview' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Overview</button>
      <button onClick={() => setView('products')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'products' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Products</button>
      <button onClick={() => setView('categories')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'categories' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Categories</button>
      <button onClick={() => setView('banners')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'banners' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Banners</button>
      <button onClick={() => setView('discounts')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'discounts' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Discounts</button>
      <button onClick={() => setView('orders')} className={`px-4 py-2 rounded-md font-semibold whitespace-nowrap ${view === 'orders' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-600 hover:bg-green-50'}`}>Orders</button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Admin Panel</h1>
      <AdminNav />
      {view === 'overview' && <AdminOverview orders={orders} products={products} />}
      {view === 'products' && <AdminProducts products={products} setProducts={setProducts} categories={categories} errors={errors} setErrors={setErrors} />}
      {view === 'categories' && <AdminCategories categories={categories} setCategories={setCategories} errors={errors} setErrors={setErrors} />}
      {view === 'banners' && <AdminBanners banners={banners} setBanners={setBanners} errors={errors} setErrors={setErrors} />}
      {view === 'discounts' && <AdminDiscounts discountCodes={discountCodes} setDiscountCodes={setDiscountCodes} errors={errors} setErrors={setErrors} />}
      {view === 'orders' && <AdminOrders orders={orders} />}
    </div>
  );
};

export default AdminDashboard;
