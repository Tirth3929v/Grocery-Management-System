import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';

const CartPage = ({ cart, updateQuantity, removeFromCart, setPage }) => {
  const [updating, setUpdating] = useState(null);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.groceryId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleQuantityChange = async (groceryId, newQuantity) => {
    setUpdating(groceryId);
    await updateQuantity(groceryId, newQuantity);
    setUpdating(null);
  };

  const handleRemove = async (groceryId) => {
    setUpdating(groceryId);
    await removeFromCart(groceryId);
    setUpdating(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Your Cart</h1>
      {cart.filter(item => item.groceryId).length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-lg text-slate-600">Your cart is empty.</p>
          <Button onClick={() => setPage('home')} className="mt-6 w-auto px-8 mx-auto">Continue Shopping</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.filter(item => item.groceryId).map(item => (
              <Card key={item._id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <img src={item.groceryId.image ? `http://localhost:5000${item.groceryId.image}` : '/images/Grocery.png'} alt={item.groceryId.name} className="w-24 h-24 object-cover rounded-lg"/>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{item.groceryId.name}</h3>
                    <p className="text-slate-600">₹{item.groceryId.price?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    id={`quantity-${item._id}`}
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.groceryId._id, parseInt(e.target.value))}
                    className="w-16 p-2 border rounded-md text-center"
                    min="1"
                    disabled={updating === item.groceryId._id}
                    autoComplete="off"
                  />
                  <button
                    onClick={() => handleRemove(item.groceryId._id)}
                    disabled={updating === item.groceryId._id}
                    className="text-red-500 hover:text-red-700 font-semibold disabled:opacity-50"
                  >
                    {updating === item.groceryId._id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <div className="sticky top-28">
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-slate-600"><span>Shipping</span><span>Free</span></div>
                <div className="flex justify-between font-bold text-lg text-slate-800 border-t pt-4 mt-2"><span>Total</span><span>₹{subtotal.toFixed(2)}</span></div>
              </div>
              <Button onClick={() => setPage('payment')} className="mt-6">Proceed to Checkout</Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
