import React, { useState, useEffect } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const PaymentPage = ({ setPage, clearCart, cart, addOrder, discountCodes, applyDiscountCode }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [message, setMessage] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const validCart = cart.filter(item => item.groceryId);
  const subtotal = validCart.reduce((sum, item) => sum + (item.groceryId?.price || 0) * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discountPercentage) / 100 : 0;
  const total = subtotal - discountAmount;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
          setMessage('Session expired. Please log in again.');
          setTimeout(() => setPage('login'), 2000);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setCurrentUser(null);
        setMessage('Please log in to place an order.');
        setTimeout(() => setPage('login'), 2000);
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchCurrentUser();
  }, [setPage]);

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;
    const newErrors = {};
    if (!cardDetails.name) newErrors.name = 'Name is required.';
    if (!cardDetails.number || cardDetails.number.length < 16) newErrors.number = 'Valid card number is required.';
    if (!cardDetails.expiry) newErrors.expiry = 'Expiry date is required.';
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) newErrors.cvc = 'CVC is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = () => {
    const code = discountCodes.find(c => c.code.toLowerCase() === selectedCode.toLowerCase());
    if (code) {
      if (code.usedCount < code.limit) {
        setAppliedDiscount(code);
        setDiscountError('');
      } else {
        setDiscountError('This discount code has expired.');
        setAppliedDiscount(null);
      }
    } else {
      setDiscountError('Invalid discount code.');
      setAppliedDiscount(null);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateCardDetails()) return;

    if (!currentUser || !currentUser.id) {
      setMessage('Please log in to place an order.');
      setTimeout(() => setPage('login'), 2000);
      return;
    }

    const orderData = {
      userId: currentUser.id, // Use actual MongoDB _id from backend
      userName: currentUser.name,
      address: currentUser.address || 'Default Address', // Fallback if no address
      items: validCart.map(item => ({
        id: item.groceryId._id,
        name: item.groceryId.name,
        price: item.groceryId.price,
        quantity: item.quantity
      })),
      totalAmount: total,
      date: new Date(),
      discountApplied: appliedDiscount ? appliedDiscount.code : null,
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        credentials: 'include', // Include cookies and session
      });

      if (response.ok) {
        const savedOrder = await response.json();
        console.log('Order saved:', savedOrder);
        if (appliedDiscount) {
          // Optionally update discount usage via API if needed, but backend handles it
          applyDiscountCode(appliedDiscount.code);
        }
        setMessage('Payment successful! Thank you for your order. Order ID: ' + savedOrder._id);
        clearCart();
        setTimeout(() => setPage('home'), 3000);
      } else {
        const errorData = await response.json();
        setMessage('Failed to place order: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Error placing order. Please try again.');
    }
  };

  const handleCardInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.id.replace('card', '').toLowerCase()]: e.target.value });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">Checkout</h2>
        {message ? (
          <Card><p className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-medium">{message}</p></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Payment Method</h3>
              <div className="space-y-4">
                <label htmlFor="card" className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-green-500 ring-2 ring-green-500' : 'border-slate-300'}`}>
                  <input id="card" type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="form-radio text-green-600" />
                  <span className="ml-4 font-semibold">Credit/Debit Card</span>
                </label>
                <label htmlFor="cod" className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-green-500 ring-2 ring-green-500' : 'border-slate-300'}`}>
                  <input id="cod" type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="form-radio text-green-600" />
                  <span className="ml-4 font-semibold">Cash on Delivery</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <form id="payment-form" onSubmit={handlePlaceOrder} className="space-y-4 mt-6">
                  <Input id="cardName" type="text" label="Name on Card" placeholder="John M. Doe" value={cardDetails.name} onChange={handleCardInputChange} error={errors.name} />
                  <Input id="cardNumber" type="text" label="Card Number" placeholder="1111-2222-3333-4444" value={cardDetails.number} onChange={handleCardInputChange} error={errors.number} />
                  <Input id="expiry" type="text" label="Expiry Date" placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardInputChange} error={errors.expiry} />
                  <Input id="cvc" type="text" label="CVC" placeholder="123" value={cardDetails.cvc} onChange={handleCardInputChange} error={errors.cvc} />
                </form>
              )}
            </Card>
            
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-bold mb-4">Discount Code</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Available Codes</label>
                    <select 
                      value={selectedCode}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCode(value);
                      }} 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="">Select a code</option>
                      {discountCodes
                        .filter(code => code.usedCount < code.limit)
                        .map(code => (
                          <option key={code._id} value={code.code}>
                            {code.code} ({code.discountPercentage}% off, {code.limit - code.usedCount} uses left)
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="mt-3">
                    <Button onClick={handleApplyDiscount} className="w-full">Apply</Button>
                  </div>
                  {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                  {appliedDiscount && <p className="text-green-600 font-semibold text-sm mt-2">"{appliedDiscount.code}" applied! You get {appliedDiscount.discountPercentage}% off.</p>}
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600"><span>Discount ({appliedDiscount.discountPercentage}%)</span><span>- ₹{discountAmount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-lg text-slate-800 border-t pt-4 mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <Button onClick={handlePlaceOrder} form={paymentMethod === 'card' ? 'payment-form' : ''} type={paymentMethod === 'card' ? 'submit' : 'button'} className="mt-6">
                  {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
