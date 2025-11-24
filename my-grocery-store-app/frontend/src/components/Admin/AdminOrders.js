import React, { useState } from 'react';
import Card from '../Common/Card';

const AdminOrders = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const OrderTable = ({ orderList }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="p-4 text-slate-600">Order ID</th>
            <th className="p-4 text-slate-600">Date</th>
            <th className="p-4 text-slate-600">Customer</th>
            <th className="p-4 text-slate-600">Address</th>
            <th className="p-4 text-slate-600">Items Count</th>
            <th className="p-4 text-slate-600">Total</th>
            <th className="p-4 text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map(order => (
            <tr key={order._id || order.id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="p-4 font-mono text-sm text-slate-700">{order._id || order.id}</td>
              <td className="p-4 text-slate-700">{new Date(order.date).toLocaleDateString()}</td>
              <td className="p-4 text-slate-700">{order.userName}</td>
              <td className="p-4 text-slate-700 max-w-xs truncate">{order.address || 'N/A'}</td>
              <td className="p-4 text-slate-700">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
              <td className="p-4 font-semibold text-slate-800">₹{order.totalAmount.toFixed(2)}</td>
              <td className="p-4">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const OrderDetailsModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Order Details - {order._id || order.id}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Customer Information</h4>
            <p><strong>Name:</strong> {order.userName}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Address:</strong> {order.address || 'N/A'}</p>
            {order.discountApplied && <p><strong>Discount Applied:</strong> {order.discountApplied}</p>}
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-600">Qty: {item.quantity} | Price: ₹{item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-slate-800">All Orders</h2>
      <Card>
        {orders.length > 0 ? <OrderTable orderList={[...orders].reverse()} /> : <p>No orders have been placed yet.</p>}
      </Card>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default AdminOrders;
