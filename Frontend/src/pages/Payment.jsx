// src/pages/Payment.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const DELIVERY_HOME_COST = 5; // par ex. 5 €

export default function Payment() {
  const navigate = useNavigate();
  const { cart, cartTotal, checkout } = useCart();
  const [deliveryType, setDeliveryType] = useState("store"); // "store" ou "home"
  const [paymentType, setPaymentType] = useState("cash"); // "card", "paypal", "cash", "bank_transfer"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryCost = useMemo(
    () => (deliveryType === "home" ? DELIVERY_HOME_COST : 0),
    [deliveryType]
  );

  const grandTotal = useMemo(
    () => cartTotal + deliveryCost,
    [cartTotal, deliveryCost]
  );

  const handleConfirm = async () => {
    if (cart.length === 0) {
      setError("Votre panier est vide.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // extraData sera reçu par ta vue /orders/ via request.data
      const order = await checkout({
        shipping_type: deliveryType,
        shipping_cost: deliveryCost,
        payment_type: paymentType,
      });

      if (!order) {
        setError("Impossible de créer la commande.");
        return;
      }

      // Redirection vers profil ou une page de confirmation dédiée
      navigate("/profile");
    } catch (e) {
      console.error(e);
      setError("Erreur lors de la validation du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Paiement</h1>
          <p className="auth-field-error">Votre panier est vide.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Paiement</h1>

        {/* Récap panier */}
        <div className="auth-field">
          <label className="auth-label">Récapitulatif</label>
          <ul className="orders-list">
            {cart.map((item) => (
              <li key={item.id} className="orders-item">
                <div className="orders-main">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
                <div className="orders-meta">
                  <span>PU : {item.current_price} F CFA</span>
                  <span>
                    Sous-total :{" "}
                    {(
                      parseFloat(item.current_price) * item.quantity
                    ).toFixed(2)}{" "}
                    F CFA
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Livraison */}
        <div className="auth-field" style={{ marginTop: "1rem" }}>
          <label className="auth-label">Mode de livraison</label>
          <div className="orders-meta">
            <label>
              <input
                type="radio"
                name="delivery"
                value="store"
                checked={deliveryType === "store"}
                onChange={() => setDeliveryType("store")}
              />{" "}
              Retrait en magasin (0 €)
            </label>
          </div>
          <div className="orders-meta">
            <label>
              <input
                type="radio"
                name="delivery"
                value="home"
                checked={deliveryType === "home"}
                onChange={() => setDeliveryType("home")}
              />{" "}
              Livraison à domicile (+{DELIVERY_HOME_COST} €)
            </label>
          </div>
        </div>

        {/* Type de paiement */}
        <div className="auth-field" style={{ marginTop: "1rem" }}>
          <label className="auth-label">Mode de paiement</label>
          <select
            className="auth-input"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="cash">Espèces</option>
            <option value="card">Carte</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Virement bancaire</option>
          </select>
        </div>

        {/* Totaux */}
        <div className="auth-field" style={{ marginTop: "1rem" }}>
          <div className="orders-meta">
            <span>Sous-total produits :</span>
            <span>{cartTotal.toFixed(2)} F CFA</span>
          </div>
          <div className="orders-meta">
            <span>Livraison :</span>
            <span>{deliveryCost.toFixed(2)} F CFA</span>
          </div>
          <div className="orders-main" style={{ marginTop: "0.5rem" }}>
            <strong>Total :</strong>
            <strong>{grandTotal.toFixed(2)} F CFA</strong>
          </div>
        </div>

        {error && <p className="auth-field-error">{error}</p>}

        <button
          type="button"
          disabled={loading}
          className="auth-submit"
          onClick={handleConfirm}
        >
          {loading
            ? "Validation..."
            : paymentType === "cash"
            ? "Confirmer la commande"
            : "Confirmer et payer"}
        </button>

      </div>
    </div>
  );
}
