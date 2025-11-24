import React, { useState } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';

const AdminBanners = ({ banners, setBanners, errors, setErrors }) => {
  const [editingBanner, setEditingBanner] = useState(null);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', discount: '', image: null });

  const validateBannerForm = () => {
    const newErrors = {};
    if (!bannerForm.title) newErrors.title = "Banner title is required.";
    if (!bannerForm.discount || bannerForm.discount <= 0 || bannerForm.discount > 100) newErrors.discount = "Discount must be between 1 and 100.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBannerFormChange = (e) => {
    const { id, value, files } = e.target;
    if (id === 'bannerImage' && files && files[0]) {
      setBannerForm(prev => ({ ...prev, image: files[0] }));
    } else {
      setBannerForm(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleEditBannerClick = (banner) => {
    setErrors({});
    setEditingBanner(banner);
    setBannerForm({ title: banner.title, description: banner.description, discount: banner.discount, image: null });
    setShowBannerForm(true);
  };

  const handleAddNewBannerClick = () => {
    setErrors({});
    setEditingBanner(null);
    setBannerForm({ title: '', description: '', discount: '', image: null });
    setShowBannerForm(true);
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      await fetch(`http://localhost:5000/api/banners/${bannerId}`, {
        method: 'DELETE',
      });
      setBanners(banners.filter(b => b._id !== bannerId));
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleBannerFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateBannerForm()) return;
    const { title, description, discount, image } = bannerForm;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('discount', discount);
    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      let response;
      if (editingBanner) {
        response = await fetch(`http://localhost:5000/api/banners/${editingBanner._id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('http://localhost:5000/api/banners/upload', {
          method: 'POST',
          body: formData,
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedBanner = await response.json();
      console.log('Banner saved:', updatedBanner);

      // Refetch banners to update local state
      const fetchResponse = await fetch('http://localhost:5000/api/banners');
      if (!fetchResponse.ok) {
        throw new Error(`Failed to refetch banners: ${fetchResponse.status}`);
      }
      const allBanners = await fetchResponse.json();
      setBanners(allBanners);
      setShowBannerForm(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to save banner:', error);
      setErrors({ ...errors, general: `Failed to save banner: ${error.message}` });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Banner Management</h2>
        <Button onClick={handleAddNewBannerClick} className="w-auto px-6">Add New Banner</Button>
      </div>
      {showBannerForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-bold mb-4">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
          <form onSubmit={handleBannerFormSubmit} className="space-y-4">
            <Input id="title" type="text" label="Banner Title" value={bannerForm.title} onChange={handleBannerFormChange} error={errors.title} />
            <Input id="description" type="text" label="Description" value={bannerForm.description} onChange={handleBannerFormChange} />
            <Input id="discount" type="number" label="Discount (%)" value={bannerForm.discount} onChange={handleBannerFormChange} error={errors.discount} />
            <div>
              <label htmlFor="bannerImage" className="block text-sm font-medium text-slate-600 mb-1">Banner Image</label>
              <div className="flex items-center space-x-4 mt-2">
                {bannerForm.image && <img src={bannerForm.image instanceof File ? URL.createObjectURL(bannerForm.image) : bannerForm.image} alt="Preview" className="w-20 h-20 object-cover rounded-md bg-slate-100"/>}
                <input id="bannerImage" type="file" accept="image/*" onChange={handleBannerFormChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            <div className="flex space-x-4 pt-2"><Button type="submit">{editingBanner ? 'Update Banner' : 'Create Banner'}</Button><Button onClick={() => setShowBannerForm(false)} className="bg-slate-500 hover:bg-slate-600">Cancel</Button></div>
          </form>
        </Card>
      )}
      <Card>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-slate-600">Image</th>
              <th className="p-4 text-slate-600">Title</th>
              <th className="p-4 text-slate-600">Description</th>
              <th className="p-4 text-slate-600">Discount</th>
              <th className="p-4 text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner._id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-4"><img src={`http://localhost:5000${banner.imageUrl}`} alt={banner.title} className="w-16 h-16 object-cover rounded-md"/></td>
                <td className="p-4 font-semibold text-slate-800">{banner.title}</td>
                <td className="p-4 text-slate-700">{banner.description}</td>
                <td className="p-4 text-slate-700">{banner.discount}%</td>
                <td className="p-4 flex space-x-4">
                  <button onClick={() => handleEditBannerClick(banner)} className="text-green-600 hover:underline font-semibold">Edit</button>
                  <button onClick={() => handleDeleteBanner(banner._id)} className="text-red-500 hover:underline font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminBanners;
