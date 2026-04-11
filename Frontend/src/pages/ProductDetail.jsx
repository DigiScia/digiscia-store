import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/productdetail.css";
import { useCart } from "/src/context/CartContext.jsx";

const API_BASE_URL = "http://127.0.0.1:8000/"; // adapte si besoin

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du produit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="product-detail-loading-text">
        Chargement du produit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error-text">
        Produit introuvable.
      </div>
    );
  }

  return (
    <div className="product-detail-container glass-card">
      <div className="product-detail-content">
        {/* IMAGE */}
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFORMATIONS */}
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>

          <p className="product-detail-category">
            Catégorie : <span>{product.category?.name}</span>
          </p>

          <p className="product-detail-price">
            {parseFloat(product.current_price).toLocaleString()} FCFA
          </p>

          {product.promotion !== "0.00" && (
            <p className="product-detail-promo">
              Promo : -{product.promotion}%
            </p>
          )}

          <p className="product-detail-stock">
            Stock disponible : {product.stock}
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-actions">
            <label className="product-detail-qty-label">
              Quantité :
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="product-detail-qty-input"
              />
            </label>

            <button
              className="product-detail-btn-add-cart"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
