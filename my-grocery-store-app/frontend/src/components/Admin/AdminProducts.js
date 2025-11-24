import React, { useState, useEffect, useCallback } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const AdminProducts = ({ products, setProducts, categories, errors, setErrors }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', price: '', category: '', image: '', stock: '' });

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groceries');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const validateProductForm = () => {
    const newErrors = {};
    if (!productForm.name) newErrors.name = "Product name is required.";
    if (!productForm.price || productForm.price <= 0) newErrors.price = "Price must be a positive number.";
    if (productForm.stock <= 0 || productForm.stock === '') newErrors.stock = "Stock must be greater than 0.";
    if (!productForm.category) newErrors.category = "Category is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleProductFormChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'image' && files && files[0]) setProductForm(prev => ({ ...prev, image: files[0] }));
    else setProductForm(prev => ({ ...prev, [id]: value }));
  };
  
  const handleEditProductClick = (product) => {
    setErrors({});
    setEditingProduct(product);
    setProductForm({ name: product.name, price: product.price, category: product.category, image: product.image, stock: product.stock });
    setShowProductForm(true);
  };

  const handleAddNewProductClick = () => {
    setErrors({});
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: '', image: '', stock: '' });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groceries/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('stock', productForm.stock);
    if (productForm.image instanceof File) {
      formData.append('image', productForm.image);
    } else if (editingProduct) {
      formData.append('image', productForm.image);
    }

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`http://localhost:5000/api/groceries/${editingProduct._id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:5000/api/groceries', {
          method: 'POST',
          body: formData,
        });
      }
      if (response.ok) {
        setShowProductForm(false);
        setProductForm({ name: '', price: '', category: '', image: '', stock: '' });
        setEditingProduct(null);
        fetchProducts();
      } else {
        const errorData = await response.json();
        setErrors({ ...errors, general: errorData.error || 'Failed to save product' });
      }
    } catch (error) {
      setErrors({ ...errors, general: 'Error saving product' });
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Product Management</h2>
        <Button onClick={handleAddNewProductClick} className="w-auto px-6">Add New Product</Button>
      </div>
      {showProductForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleProductFormSubmit} className="space-y-4">
            <Input id="name" type="text" label="Product Name" value={productForm.name} onChange={handleProductFormChange} error={errors.name} />
            <Input id="price" type="number" label="Price" value={productForm.price} onChange={handleProductFormChange} error={errors.price} />
            <Input id="stock" type="number" label="Stock Quantity" value={productForm.stock} onChange={handleProductFormChange} error={errors.stock} />
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-600 mb-1">Category</label>
              <select id="category" value={productForm.category} onChange={handleProductFormChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.category ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-green-500'}`} required>
                <option value="">Select a category</option>
                {categories.map(cat => (<option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-600 mb-1">Product Image</label>
              <div className="flex items-center space-x-4 mt-2">
                {productForm.image && <img src={productForm.image instanceof File ? URL.createObjectURL(productForm.image) : `http://localhost:5000${productForm.image}`} alt="Preview" className="w-20 h-20 object-cover rounded-md bg-slate-100"/>}
                <input id="image" type="file" accept="image/*" onChange={handleProductFormChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            <div className="flex space-x-4 pt-2"><Button type="submit">{editingProduct ? 'Update Product' : 'Create Product'}</Button><Button onClick={() => setShowProductForm(false)} className="bg-slate-500 hover:bg-slate-600">Cancel</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-slate-600">Name</th>
              <th className="p-4 text-slate-600">Category</th>
              <th className="p-4 text-slate-600">Price</th>
              <th className="p-4 text-slate-600">Stock</th>
              <th className="p-4 text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id || product.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{product.name}</td>
                <td className="p-4 text-slate-700">{product.category}</td>
                <td className="p-4 text-slate-700">₹{product.price.toFixed(2)}</td>
                <td className="p-4 text-slate-700">
                  {product.stock > 0 ? product.stock : <span className="text-red-500 font-semibold">Out of Stock</span>}
                </td>
                <td className="p-4 flex space-x-4">
                  <button onClick={() => handleEditProductClick(product)} className="text-green-600 hover:underline font-semibold">Edit</button>
                  <button onClick={() => handleDeleteProduct(product._id || product.id)} className="text-red-500 hover:underline font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminProducts;
