// src/components/Cart.jsx
import PropTypes from "prop-types";
import { useCart } from "/src/context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

import "./cart.css";

export default function Cart({ isOpen, onClose }) {
  const {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    checkoutLoading,
  } = useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDecrease = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleCheckoutClick = () => {
    // On ne crée plus la commande ici, on va sur la page Paiement
    onClose();              // ferme le panier
    navigate("/payment");   // ouvre la page de paiement
  };

  return (
    <div className="cart-overlay">
      <div className="cart-panel">
        <div className="cart-header">
          <h2>Mon panier</h2>
          <button className="cart-close-btn" onClick={onClose}>X</button>
        </div>

        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item) => {
                const hasPromo =
                  item.promotion &&
                  Number(item.promotion) > 0 &&
                  item.discounted_price != null;

                const unitPrice = hasPromo
                  ? Number(item.discounted_price)
                  : Number(item.current_price);

                return (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      )}
                      <div>
                        <h3>{item.name}</h3>

                        {hasPromo ? (
                          <p>
                            <span className="cart-old-price">
                              {Number(item.current_price).toLocaleString()} FCFA
                            </span>{" "}
                            <span className="cart-new-price">
                              {unitPrice.toLocaleString()} FCFA
                            </span>{" "}
                            <span className="cart-promo-badge">
                              -{item.promotion}%
                            </span>
                          </p>
                        ) : (
                          <p>{unitPrice.toLocaleString()} FCFA</p>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        className="cart-btn cart-btn-qty"
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-btn cart-btn-qty"
                        onClick={() => handleIncrease(item)}
                      >
                        +
                      </button>
                      <button
                        className="cart-btn cart-btn-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                Total : <strong>{cartTotal.toFixed(2)} FCFA</strong>
              </div>
              <div className="cart-footer-actions">
                <button
                  className="cart-btn cart-btn-clear"
                  onClick={clearCart}
                >
                  Vider le panier
                </button>
                <button
                  className="cart-btn cart-btn-checkout"
                  onClick={handleCheckoutClick}
                  disabled={checkoutLoading || cart.length === 0}
                >
                  {checkoutLoading ? "Traitement..." : "Valider ma commande"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Cart.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
