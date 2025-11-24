import React from 'react';
import Card from '../Common/Card';

const AdminOverview = ({ orders, products }) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(o => o.date.startsWith(today));
  const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const stockOutProductsCount = products.filter(p => p.stock === 0).length;
  const runningProductsCount = products.filter(p => p.stock > 0).length;

  const OrderTable = ({ orderList }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="p-4 text-slate-600">Order ID</th>
            <th className="p-4 text-slate-600">Date</th>
            <th className="p-4 text-slate-600">Customer</th>
            <th className="p-4 text-slate-600">Items</th>
            <th className="p-4 text-slate-600">Total</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map(order => (
            <tr key={order._id || order.id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="p-4 font-mono text-sm text-slate-700">{order._id || order.id}</td>
              <td className="p-4 text-slate-700">{new Date(order.date).toLocaleDateString()}</td>
              <td className="p-4 text-slate-700">Tirth</td>
              <td className="p-4 text-slate-700">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
              <td className="p-4 font-semibold text-slate-800">₹{order.totalAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Today's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <h3 className="text-slate-500 font-semibold">Today's Revenue</h3>
            <p className="text-3xl font-bold text-slate-800">₹{todaysRevenue.toFixed(2)}</p>
          </Card>
          <Card>
            <h3 className="text-slate-500 font-semibold">Today's Orders</h3>
            <p className="text-3xl font-bold text-slate-800">{todaysOrders.length}</p>
          </Card>
          <Card>
            <h3 className="text-slate-500 font-semibold">Running Products</h3>
            <p className="text-3xl font-bold text-slate-800">{runningProductsCount}</p>
          </Card>
          <Card>
            <h3 className="text-slate-500 font-semibold">Out of Stock</h3>
            <p className="text-3xl font-bold text-slate-800">{stockOutProductsCount}</p>
          </Card>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Recent Orders</h2>
        <Card>
          <OrderTable orderList={orders.slice(-5).reverse()} />
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
