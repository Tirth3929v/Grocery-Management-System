import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const AdminCategories = ({ categories, setCategories, errors, setErrors }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });

  const validateCategoryForm = () => {
    const newErrors = {};
    if (!categoryForm.name) newErrors.name = "Category name is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryFormChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'categoryImage' && files && files[0]) {
      setCategoryForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setCategoryForm(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleEditCategoryClick = (category) => { 
    setErrors({});
    setEditingCategory(category); 
    setCategoryForm({ name: category.name, description: category.description || '', image: category.image || null }); 
    setShowCategoryForm(true); 
  };
  
  const handleAddNewCategoryClick = () => {
    setErrors({});
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', image: null });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      setCategories(categories.filter(c => c._id !== categoryId));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };
  
  const handleCategoryFormSubmit = async (e) => {
    e.preventDefault();
    if(!validateCategoryForm()) return;
    const { name, description, image } = categoryForm;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      let response;
      if (editingCategory) {
        response = await fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:5000/api/categories', {
          method: 'POST',
          body: formData,
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCategory = await response.json();
      console.log('Category saved:', updatedCategory);

      // Refetch categories to update local state
      const fetchResponse = await fetch('http://localhost:5000/api/categories');
      if (!fetchResponse.ok) {
        throw new Error(`Failed to refetch categories: ${fetchResponse.status}`);
      }
      const allCategories = await fetchResponse.json();
      setCategories(allCategories);
      setShowCategoryForm(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to save category:', error);
      setErrors({ ...errors, general: `Failed to save category: ${error.message}` });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Category Management</h2>
        <Button onClick={handleAddNewCategoryClick} className="w-auto px-6">Add New Category</Button>
      </div>
      {showCategoryForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleCategoryFormSubmit} className="space-y-4">
            <Input id="name" type="text" label="Category Name" value={categoryForm.name} onChange={handleCategoryFormChange} error={errors.name} />
            <Input id="description" type="text" label="Category Description" value={categoryForm.description} onChange={handleCategoryFormChange} />
            <div>
              <label htmlFor="categoryImage" className="block text-sm font-medium text-slate-600 mb-1">Category Image</label>
              <div className="flex items-center space-x-4 mt-2">
                {categoryForm.image && <img src={categoryForm.image instanceof File ? URL.createObjectURL(categoryForm.image) : `http://localhost:5000${categoryForm.image}`} alt="Preview" className="w-20 h-20 object-cover rounded-md bg-slate-100"/>}
                <input id="categoryImage" type="file" accept="image/*" onChange={handleCategoryFormChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            <div className="flex space-x-4 pt-2"><Button type="submit">{editingCategory ? 'Update Category' : 'Create Category'}</Button><Button onClick={() => setShowCategoryForm(false)} className="bg-slate-500 hover:bg-slate-600">Cancel</Button></div>
          </form>
        </Card>
      )}
      <Card><table className="w-full text-left">
          <thead><tr className="border-b border-slate-200"><th className="p-4 text-slate-600">Image</th><th className="p-4 text-slate-600">Category Name</th><th className="p-4 text-slate-600">Description</th><th className="p-4 text-slate-600">Actions</th></tr></thead>
          <tbody>{categories.map(cat => (<tr key={cat._id || cat.id} className="border-b border-slate-200 hover:bg-slate-50">
            <td className="p-4"><img src={`http://localhost:5000${cat.image}`} alt={cat.name} className="w-16 h-16 object-cover rounded-md"/></td>
            <td className="p-4 font-semibold text-slate-800">{cat.name}</td>
            <td className="p-4 text-slate-700">{cat.description || 'No description'}</td>
            <td className="p-4 flex space-x-4"><button onClick={() => handleEditCategoryClick(cat)} className="text-green-600 hover:underline font-semibold">Edit</button><button onClick={() => handleDeleteCategory(cat._id || cat.id)} className="text-red-500 hover:underline font-semibold">Delete</button></td>
          </tr>))}</tbody>
      </table></Card>
    </div>
  );
};

export default AdminCategories;
