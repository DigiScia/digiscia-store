import React, { useState } from 'react';
import { ShoppingCart, Search, Heart, Menu, X, Zap } from 'lucide-react';

export default function Header({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white">GlassShop</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-purple-300 transition">Accueil</a>
            <a href="#" className="text-white hover:text-purple-300 transition">Produits</a>
            <a href="#" className="text-white hover:text-purple-300 transition">Nouveautés</a>
            <a href="#" className="text-white hover:text-purple-300 transition">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Search className="text-white" size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Heart className="text-white" size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition relative">
              <ShoppingCart className="text-white" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="text-white" size={24} /> : <Menu className="text-white" size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden backdrop-blur-md bg-white/10 border-t border-white/20">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a href="#" className="block py-2 text-white hover:text-purple-300">Accueil</a>
            <a href="#" className="block py-2 text-white hover:text-purple-300">Produits</a>
            <a href="#" className="block py-2 text-white hover:text-purple-300">Nouveautés</a>
            <a href="#" className="block py-2 text-white hover:text-purple-300">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
}
