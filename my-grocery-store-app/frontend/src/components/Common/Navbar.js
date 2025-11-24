import React from 'react';

const Navbar = ({ setPage, loggedInUser, setLoggedInUser, cart, searchTerm, setSearchTerm }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setLoggedInUser(null);
        setPage('login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setLoggedInUser(null);
      setPage('login');
    }
  };

  const cartItemCount = cart.filter(item => item.groceryId).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-green-600 cursor-pointer whitespace-nowrap" onClick={() => setPage('home')}>Team-18 Store</h1>
        <div className="relative flex-grow max-w-xl">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            className="w-full py-2 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center space-x-6">
          {loggedInUser ? (
            <>
              {loggedInUser.role === 'admin' ? (
                <button onClick={() => setPage('admin')} className="text-slate-600 hover:text-green-600 font-medium">Admin</button>
              ) : (
                <>
                  <button onClick={() => setPage('cart')} className="text-slate-600 hover:text-green-600 relative" aria-label="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {cartItemCount > 0 && <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>}
                  </button>
                </>
              )}
              <button onClick={() => setPage('profile')} className="flex items-center space-x-2 text-slate-600 hover:text-green-600" aria-label="User Profile">
                <img src={loggedInUser.profileImage ? `http://localhost:5000${loggedInUser.profileImage}` : '/images/default-profile.png'} alt="Profile" className="w-9 h-9 rounded-full object-cover"/>
              </button>
              <button onClick={handleLogout} className="text-slate-600 hover:text-green-600 font-medium">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} className="text-slate-600 hover:text-green-600 font-medium">Login</button>
              <button onClick={() => setPage('signup')} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">Sign Up</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
