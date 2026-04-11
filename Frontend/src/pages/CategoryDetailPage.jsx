// src/pages/CategoryDetailPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/"; // adapte si besoin

export default function CategoryDetailPage() {
  const { categoryId } = useParams(); // /categories/:categoryId
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1) Détail de la catégorie
        const catRes = await axios.get(
          `${API_BASE_URL}/categories/${categoryId}/`
        );
        setCategory(catRes.data);

        // 2) Produits filtrés par catégorie (?category=<id>)
        const prodRes = await axios.get(`${API_BASE_URL}/products/`, {
          params: { category: categoryId },
        });
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Erreur chargement catégorie / produits :", err);
        setError("Impossible de charger cette catégorie.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return <p className="loading-text">Chargement de la catégorie...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!category) {
    return <p className="error-text">Catégorie introuvable.</p>;
  }

  return (
    <div className="category-detail-page">
      <header className="category-header">
        <h1 className="category-title">{category.name}</h1>
        {category.description && (
          <p className="category-description">{category.description}</p>
        )}
      </header>

      <section className="category-products">
        {products.length === 0 ? (
          <p>Aucun produit dans cette catégorie pour le moment.</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.image} alt={p.name} className="product-image" />
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">
                  {parseFloat(p.current_price).toLocaleString()} FCFA
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
