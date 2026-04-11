import React from 'react';
import { Heart, Star } from 'lucide-react';

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition transform overflow-hidden group relative">
      {product.badge && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full z-10">
          {product.badge}
        </div>
      )}
      <div className="p-8 text-center">
        <div className="text-8xl mb-4 group-hover:scale-110 transition transform">{product.image}</div>
        <span className="text-purple-300 text-sm font-semibold">{product.category}</span>
        <h3 className="text-xl font-bold text-white mt-2 mb-3">{product.name}</h3>
        <div className="flex items-center justify-center mb-4">
          <Star className="text-yellow-400 fill-yellow-400" size={16} />
          <span className="text-white ml-2 font-semibold">{product.rating}</span>
        </div>
        <div className="text-3xl font-bold text-white mb-6">{product.price}€</div>
        <div className="flex gap-3">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Ajouter
          </button>
          <button className="p-3 backdrop-blur-md bg-white/20 rounded-xl hover:bg-white/30 transition">
            <Heart className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
