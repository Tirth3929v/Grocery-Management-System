import React, { useState, useEffect, useCallback } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const AdminDiscounts = ({ discountCodes, setDiscountCodes, errors, setErrors }) => {
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountForm, setDiscountForm] = useState({ code: '', discountPercentage: '', limit: '' });

  const fetchDiscounts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/discounts');
      if (response.ok) {
        const data = await response.json();
        setDiscountCodes(data);
      } else {
        console.error('Failed to fetch discounts');
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  }, [setDiscountCodes]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const validateDiscountForm = () => {
    const newErrors = {};
    if (!discountForm.code) newErrors.code = "Discount code is required.";
    if (!discountForm.discountPercentage || discountForm.discountPercentage <= 0 || discountForm.discountPercentage > 100) newErrors.discountPercentage = "Discount must be between 1 and 100.";
    if (!discountForm.limit || discountForm.limit <= 0) newErrors.limit = "Usage limit must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewDiscountClick = () => {
    setErrors({});
    setShowDiscountForm(true);
    setDiscountForm({ code: '', discountPercentage: '', limit: '' });
  };

  const handleDeleteDiscount = async (codeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/discounts/${codeId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchDiscounts();
      } else {
        console.error('Failed to delete discount');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const handleDiscountFormSubmit = async (e) => {
    e.preventDefault();
    if(!validateDiscountForm()) return;
    try {
      const response = await fetch('http://localhost:5000/api/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountForm.code.toUpperCase(),
          discountPercentage: parseInt(discountForm.discountPercentage),
          limit: parseInt(discountForm.limit),
        }),
      });
      if (response.ok) {
        setShowDiscountForm(false);
        setDiscountForm({ code: '', discountPercentage: '', limit: '' });
        fetchDiscounts();
      } else {
        const errorData = await response.json();
        setErrors({ ...errors, general: errorData.error || 'Failed to create discount' });
      }
    } catch (error) {
      setErrors({ ...errors, general: 'Error creating discount' });
      console.error('Error creating discount:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Discount Code Management</h2>
        <Button onClick={handleAddNewDiscountClick} className="w-auto px-6">Create New Code</Button>
      </div>
      {showDiscountForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Discount Code</h2>
          <form onSubmit={handleDiscountFormSubmit} className="space-y-4">
            <Input id="code" type="text" label="Discount Code" value={discountForm.code} onChange={e => setDiscountForm({...discountForm, code: e.target.value})} error={errors.code} />
            <Input id="discountPercentage" type="number" label="Discount (%)" value={discountForm.discountPercentage} onChange={e => setDiscountForm({...discountForm, discountPercentage: e.target.value})} error={errors.discountPercentage} />
            <Input id="limit" type="number" label="Usage Limit" value={discountForm.limit} onChange={e => setDiscountForm({...discountForm, limit: e.target.value})} error={errors.limit} />
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            <div className="flex space-x-4 pt-2"><Button type="submit">Create Code</Button><Button onClick={() => setShowDiscountForm(false)} className="bg-slate-500 hover:bg-slate-600">Cancel</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-slate-600">Code</th>
              <th className="p-4 text-slate-600">Discount</th>
              <th className="p-4 text-slate-600">Usage</th>
              <th className="p-4 text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discountCodes.map(c => (
              <tr key={c._id || c.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4 font-semibold font-mono text-slate-800">{c.code}</td>
                <td className="p-4 text-slate-700">{c.discountPercentage}%</td>
                <td className="p-4 text-slate-700">{c.usedCount} / {c.limit}</td>
                <td className="p-4"><button onClick={() => handleDeleteDiscount(c._id || c.id)} className="text-red-500 hover:underline font-semibold">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminDiscounts;
