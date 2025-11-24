import React, { useState } from 'react';
import Card from '../Common/Card';

const AdminPage = ({ setPage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    event.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('discount', discount);

    try {
      const response = await fetch('http://localhost:5000/api/banners/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message || data.error);
    } catch (error) {
      setMessage('Upload failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6">
      <Card className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Admin Dashboard</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-600">Banner Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-600">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-slate-600">Discount (%)</label>
            <input
              id="discount"
              name="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-600">Upload Image</label>
            <input id="image" name="image" type="file" accept="image/*" className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Upload Banner
          </button>
          {message && <p className="text-center text-green-600 mt-2">{message}</p>}
        </form>
        <button
          onClick={() => setPage('home')}
          className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Back to Home
        </button>
      </Card>
    </div>
  );
};

export default AdminPage;