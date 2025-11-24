import React, { useState, useEffect } from 'react';
import ProductCard from '../Common/ProductCard';

const HomePage = ({ products, categories, banners, addToCart, setPage, setSelectedCategory, searchTerm }) => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 3000); // Change banner every 3 seconds
      return () => clearInterval(timer);
    }
  }, [banners]);
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setPage('category');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-around items-center overflow-x-auto pb-2">
            {categories.map(category => (
              <button key={category._id} onClick={() => handleCategoryClick(category.name)} className="flex flex-col items-center space-y-2 text-center font-semibold text-slate-700 hover:text-green-600 flex-shrink-0 px-4">
                <img src={`http://localhost:5000${category.image}`} alt={category.name} className="w-16 h-16 object-contain rounded-full" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-lg overflow-hidden shadow-sm relative">
          {banners.length > 0 ? (
            <>
              <div className="relative w-full h-64 md:h-80 overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                  {banners.map((banner) => (
                    <div key={banner._id} className="w-full h-full flex-shrink-0 relative">
                      <img
                        src={`http://localhost:5000${banner.imageUrl}`}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-start pl-8 md:pl-12">
                        <div className="text-white max-w-md">
                          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-yellow-300">{banner.title}</h2>
                          <p className="text-lg md:text-xl mb-4">{banner.description}</p>
                          <p className="text-xl md:text-2xl font-semibold bg-yellow-400 text-black px-4 py-2 rounded inline-block">Up to {banner.discount}% OFF</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentBanner ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <img
              src="/Gemini_Generated_Image_np4py9np4py9np4p.png"
              alt="Default Banner"
              className="w-full h-64 md:h-80 object-cover"
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          {searchTerm ? `Showing results for "${searchTerm}"` : "Featured Products"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map(product => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
