import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HomeCarousel from "../components/Carrousel/HomeCarousel.jsx";
import { useTypewriter } from "../hooks/useTypewriter"; // adapte le chemin
const API_BASE_URL = "http://127.0.0.1:8000/"; // adapte si besoin

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const typedText = useTypewriter("Qu'est-ce que vous cherchez ?");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories/`);
        setCategories(res.data); // adapte si ta réponse est paginée (ex: res.data.results)
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      } finally {
        setCatLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
      <>
    <HomeCarousel />
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-card">
          <h1 className="hero-title">
            <span className="hero-badge">Digiscia</span>
            <span className="hero-title-gradient">Store</span>
          </h1>

          <p className="hero-description">
            Découvrez nos produits technologiques premium avec un design moderne et élégant.
          </p>

          <div className="hero-buttons">
            <Link to="/products">
              <button className="btn-primary">Découvrir maintenant</button>
            </Link>

            <Link to="/products">
              <button className="btn-secondary">Voir les offres</button>
            </Link>
          </div>
        </div>
      </section>

        {/* Categories Section dynamique */}
        <section className="categories-section">
            <div className="categories-container">
                <div className="categories-title-box">
                  <span className="categories-title">
                    {typedText}
                    <span className="typing-cursor">|</span>
                  </span>
                </div>
            <Link to="/products" className="category-btn">
              Tous
            </Link>

            {catLoading ? (
              <span className="category-loading">Chargement...</span>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="category-btn"
                >
                  {cat.name}
                </Link>
              ))
            )}
          </div>
        </section>
    </div>
    </>
  );
}
