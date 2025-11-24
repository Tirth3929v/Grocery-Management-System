import React from 'react';
import Card from './Card';
import Button from './Button';

const ProductCard = ({ product, addToCart }) => (
  <Card className="flex flex-col group">
    <div className="relative">
      <img src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt={product.name} loading="lazy" className="rounded-lg mb-4 w-full h-48 object-cover"/>
      {product.stock === 0 && <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">OUT OF STOCK</div>}
    </div>
    <div className="flex-grow">
      <p className="text-sm text-slate-500">{product.category}</p>
      <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
    </div>
    <div className="flex justify-between items-center mt-4">
      <p className="text-xl font-semibold text-slate-900">₹{product.price.toFixed(2)}</p>
      <Button onClick={() => addToCart(product)} className="w-auto px-5" disabled={product.stock === 0}>Add</Button>
    </div>
  </Card>
);

export default ProductCard;