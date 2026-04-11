// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();

const API_BASE_URL = "http://localhost:8000/"; // adapte (ex: /api/ si tu as un prefix)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Charger le panier depuis le localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Sauvegarder le panier à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajouter au panier (state local uniquement)
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.current_price),
    0
  );

  // Création de commande via /orders/
  const API_BASE_URL = "http://127.0.0.1:8000/"; // adapte si besoin

// ...

    const checkout = async (extraData = {}) => {
      if (cart.length === 0) return null;

      try {
        setCheckoutLoading(true);

        const token = localStorage.getItem("access_token");

        const body = {
          products: cart.map((item) => ({
            product_id: item.id,      // l'id du Product
            quantity: item.quantity,
          })),
          ...extraData, // ex: adresse, note, etc.
        };

        const res = await fetch(`${API_BASE_URL}/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Erreur création commande: ${res.status} - ${txt}`);
        }

        const data = await res.json();
        clearCart();
        return data; // contient l'order sérialisé
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setCheckoutLoading(false);
      }
    };


  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        checkout,
        checkoutLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
