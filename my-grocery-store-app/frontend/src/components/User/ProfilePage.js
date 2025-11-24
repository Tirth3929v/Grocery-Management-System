import React, { useState, useEffect } from 'react';
import Card from '../Common/Card';
import Button from '../Common/Button';

const ProfilePage = ({ user, setUser, setPage }) => {
  const [name, setName] = useState(user ? user.name || '' : '');
  const [address, setAddress] = useState(user ? user.address || '' : '');
  const [imagePreview, setImagePreview] = useState(user && user.profileImage ? `http://localhost:5000${user.profileImage}` : '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddress(user.address || '');
      setImagePreview(user.profileImage ? `http://localhost:5000${user.profileImage}` : '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setImagePreview(data.user.profileImage ? `http://localhost:5000${data.user.profileImage}` : '');
        setSelectedFile(null);
        setIsEditing(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Update failed');
      }
    } catch (err) {
      alert('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-10">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">My Profile</h1>
      <Card className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img src={imagePreview || '/images/default-profile.png'} alt="Profile" className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-green-200"/>
            {isEditing && (
              <label htmlFor="profileImageUpload" className="absolute -bottom-0 -right-2 cursor-pointer bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                <input id="profileImageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
              </label>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-600">Email</label><p className="mt-1 text-lg text-slate-800 p-2 bg-slate-100 rounded-md">{user.email}</p></div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
            {isEditing ? <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"/> : <p className="mt-1 text-lg text-slate-800">{user.name}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-600">Shipping Address</label>
            {isEditing ? <input id="address" name="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg"/> : <p className="mt-1 text-lg text-slate-800">{user.address || 'No address set'}</p>}
          </div>
          {isEditing ? (
            <div className="flex space-x-4 mt-6">
              <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
              <Button onClick={() => setIsEditing(false)} className="bg-slate-500 hover:bg-slate-600" disabled={loading}>Cancel</Button>
            </div>
          ) : ( <Button onClick={() => setIsEditing(true)} className="mt-6">Edit Profile</Button> )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;