

import React from 'react';
import ProductCard from '../Common/ProductCard';

const CategoryPage = ({ products, addToCart, selectedCategory, searchTerm }) => {
  const filteredProducts = products
    .filter(p => p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">{selectedCategory}</h1>
      {searchTerm && <p className="text-slate-600 mb-6">Searching for "{searchTerm}" in {selectedCategory}.</p>}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <p className="text-slate-600">No products found.</p>
      )}
    </div>
  );
};

export default CategoryPage;