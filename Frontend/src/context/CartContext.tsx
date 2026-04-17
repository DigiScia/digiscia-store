import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Normalize product data for the cart (handle backend objects)
    const normalizedProduct = {
      ...product,
      category: typeof product.category === 'object' ? (product.category as any).name : product.category,
      price: (product as any).price || (product as any).discounted_price || (product as any).current_price
    };

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === normalizedProduct.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === normalizedProduct.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...normalizedProduct, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const parsePrice = (p: any): number => {
    if (typeof p === "number") return isNaN(p) ? 0 : p;
    if (!p) return 0;
    const cleaned = String(p).replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const cartCount = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const cartTotal = cart.reduce((total, item) => {
    const p = Number(item.price) || 0;
    const q = Number(item.quantity) || 0;
    return total + (p * q);
  }, 0);

  // Self-healing: if cart total is NaN, something is wrong with the data structure
  useEffect(() => {
    if (isNaN(cartTotal)) {
      setCart([]);
    }
  }, [cartTotal]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
