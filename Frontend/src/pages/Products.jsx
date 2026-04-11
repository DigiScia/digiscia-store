import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import "../styles/Product.css";
import { useCart } from "/src/context/CartContext.jsx";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Récupère searchQuery fourni par Layout via <Outlet context={{ searchQuery }} />
  const { searchQuery } = useOutletContext() || { searchQuery: "" };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/");
        setProducts(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError("Impossible de charger les produits. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  // Filtrage des produits selon le texte de recherche
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-container">
        {searchQuery ? (
          <p>Aucun produit ne correspond à « {searchQuery} ».</p>
        ) : (
          <p>Aucun produit disponible pour le moment.</p>
        )}
      </div>
    );
  }

  return (
    <div className="product-page">
      <h1 className="product-title">Catalogue Produits</h1>

      {searchQuery && (
        <p className="product-search-info">
          Résultats pour « {searchQuery} »
        </p>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => {
          const hasPromo =
            product.promotion && Number(product.promotion) > 0;

          const displayedDiscounted =
            product.discounted_price != null
              ? parseFloat(product.discounted_price)
              : null;

          return (
            <div key={product.id} className="product-card">
              {/* Badge promo */}
              {hasPromo && (
                <div className="product-badge-promo">
                  -{product.promotion}%
                </div>
              )}

              {/* Toute la carte est cliquable vers le détail */}
              <Link
                to={`/product/${product.id}`}
                className="product-card-link"
              >
                <img
                  src={product.image || "/placeholder-image.jpg"}
                  alt={product.name}
                  className="product-image"
                />

                <div className="product-info">
                  <h2 className="product-name">{product.name}</h2>

                  {/* Prix avec promo / sans promo */}
                  {hasPromo && displayedDiscounted !== null ? (
                    <>
                      <p className="product-price-discounted">
                        {displayedDiscounted.toLocaleString()} FCFA
                      </p>
                      <p className="product-price-old">
                        <span className="line-through">
                          {parseFloat(
                            product.current_price
                          ).toLocaleString()}{" "}
                          FCFA
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="product-price">
                      {parseFloat(
                        product.current_price
                      ).toLocaleString()}{" "}
                      FCFA
                    </p>
                  )}

                  <p className="product-description">
                    {product.description}
                  </p>
                </div>
              </Link>

              {/* Bouton Ajouter au panier séparé, non inclus dans le lien */}
              <button
                type="button"
                className="product-button add-to-cart-button"
                onClick={() => addToCart(product, 1)}
              >
                Ajouter au panier
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Product;
