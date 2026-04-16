import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Laptop, Smartphone, Headphones, Watch, ShieldCheck, Truck, HeadphonesIcon, ShoppingBag, Zap } from "lucide-react";
import heroImg from "../assets/images/hero.png";

const API_BASE_URL = "http://127.0.0.1:8000/";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}categories/`),
          axios.get(`${API_BASE_URL}products/`)
        ]);
        setCategories(catRes.data.slice(0, 4)); // Show top 4 categories
        setProducts(prodRes.data.slice(0, 3)); // Show top 3 featured products
      } catch (err) {
        console.error("Erreur chargement données :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* 1. ULTRA-PREMIUM HERO SECTION */}
      <section className="modern-hero animate-fade-in" style={{ textAlign: 'center', padding: '10rem 0 6rem' }}>
        <div className="hero-content" style={{ gridTemplateColumns: '1fr', maxWidth: '900px', margin: '0 auto' }}>
          <div className="hero-text-zone" style={{ alignItems: 'center' }}>
            <span className="hero-tag glass animate-slide-up" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Future of Technology • 2025
            </span>
            <h1 className="hero-big-title animate-slide-up" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, margin: '1.5rem 0' }}>
              L'Elite de la <br />
              <span className="text-accent">Connectivité</span>
            </h1>
            <p className="hero-subtitle animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.25rem', opacity: 0.8 }}>
              Une curation exclusive des plus grandes innovations. Performance brute, esthétique pure, expérience sans compromis.
            </p>
            
            <div className="hero-actions animate-slide-up" style={{ justifyContent: 'center' }}>
              <Link to="/products" className="btn-primary" style={{ padding: '1.2rem 2.5rem', borderRadius: '100px' }}>
                Explorer le Catalogue <ArrowRight size={18} style={{ marginLeft: '12px' }} />
              </Link>
              <Link to="/signup" className="btn-secondary glass" style={{ padding: '1.2rem 2.5rem', borderRadius: '100px' }}>
                Devenir Membre Privé
              </Link>
            </div>
          </div>
          
          <div className="hero-visual-zone animate-fade-in" style={{ marginTop: '4rem' }}>
            <div className="hero-img-wrapper glass" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', padding: '2rem', overflow: 'hidden' }}>
              <img src={heroImg} alt="Elite Tech" className="hero-main-img" style={{ maxWidth: '100%', transform: 'scale(1.05)' }} />
              
              {/* Floating Stat Cards */}
              <div className="hero-floating-card glass animate-float" style={{ top: '10%', right: '-5%', padding: '1.5rem', borderRadius: '24px' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }} className="text-accent">15k+</div>
                 <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.6 }}>Clients Satisfaits</div>
              </div>
              <div className="hero-floating-card glass animate-float" style={{ bottom: '15%', left: '-5%', padding: '1.5rem', borderRadius: '24px', animationDelay: '1s' }}>
                 <ShieldCheck size={24} className="text-secondary" style={{ marginBottom: '8px' }} />
                 <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Certifié Authentique</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST REVEAL TICKER */}
      <section className="benefits-bar glass" style={{ borderLeft: 'none', borderRight: 'none', borderRadius: 0, padding: '2.5rem 0' }}>
        <div className="benefit-item">
          <Truck className="text-accent" size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expédition Prioritaire Mondiale</span>
        </div>
        <div className="benefit-item">
          <ShieldCheck className="text-accent" size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Garantie Constructeur 2 Ans</span>
        </div>
        <div className="benefit-item">
          <HeadphonesIcon className="text-accent" size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conciergerie Tech 24/7</span>
        </div>
      </section>

      {/* 3. CATEGORIES ARCHITECTURE */}
      <section className="categories-grid-section" style={{ padding: '8rem 2rem' }}>
        <div className="section-header" style={{ textAlign: 'center', display: 'block' }}>
          <h2 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Sartorial <span className="text-accent">Collections</span></h2>
          <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto 4rem' }}>Optimisez chaque aspect de votre vie numérique avec notre sélection par univers.</p>
        </div>
        <div className="categories-grid">
          {loading ? (
            [1,2,3,4].map(i => <div key={i} className="cat-card-skeleton glass"></div>)
          ) : (
            categories.map((cat, idx) => (
              <Link key={cat.id} to={`/categories/${cat.id}`} className="category-card glass-card" style={{ padding: '3rem 2rem' }}>
                <div className="cat-card-icon" style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '20px', marginBottom: '2rem' }}>
                  {idx === 0 && <Laptop size={32} className="text-accent" />}
                  {idx === 1 && <Smartphone size={32} className="text-accent" />}
                  {idx === 2 && <Headphones size={32} className="text-accent" />}
                  {idx >= 3 && <Watch size={32} className="text-accent" />}
                </div>
                <div className="cat-card-info" style={{ textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{cat.name}</h3>
                  <span style={{ opacity: 0.5 }}>{Math.floor(Math.random() * 50) + 10} Articles</span>
                </div>
                <div className="cat-card-arrow glass" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>


      {/* 4. FEATURED COLLECTIONS */}
      <section className="featured-section" style={{ padding: '8rem 2rem', position: 'relative' }}>
        <div className="glass-blob" style={{ width: '600px', height: '600px', top: '-10%', left: '-10%', opacity: 0.1 }}></div>
        <div className="section-header" style={{ textAlign: 'center', display: 'block' }}>
          <h2 className="section-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Premium <span className="text-accent">Selection</span></h2>
          <p style={{ opacity: 0.6, maxWidth: '500px', margin: '0 auto 4rem' }}>Une excellence sans compromis. Découvrez nos pièces maîtresses.</p>
        </div>
        
        <div className="featured-grid" style={{ gap: '3rem' }}>
           {loading ? (
             [1,2,3].map(i => <div key={i} className="prod-skeleton glass" style={{ height: '500px' }}></div>)
           ) : (
             products.map((prod, idx) => (
               <div key={prod.id} className="featured-item glass-card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s`, padding: '1rem', borderRadius: '32px' }}>
                 <div className="featured-img-box" style={{ borderRadius: '24px', overflow: 'hidden', height: '350px', background: 'rgba(255,255,255,0.02)' }}>
                    <img src={prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"} alt={prod.name} style={{ transition: 'transform 0.6s var(--ease-expo)' }} />
                 </div>
                 <div className="featured-info" style={{ padding: '2rem 1.5rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="prod-tag glass" style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', padding: '4px 12px' }}>Édition Limitée</span>
                    <span className="prod-price" style={{ fontSize: '1.25rem', fontWeight: 900 }}>{prod.price}€</span>
                   </div>
                   <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{prod.name}</h3>
                   <Link to={`/product/${prod.id}`} className="btn-buy-now" style={{ width: '100%', textAlign: 'center', background: 'white', color: 'black', fontWeight: 700, borderRadius: '16px', padding: '1rem' }}>
                     Détails de l'Article
                   </Link>
                 </div>
               </div>
             ))
           )}
        </div>
      </section>

      {/* 5. ELITE CLUB CTA */}
      <section style={{ padding: '6rem 2rem 10rem' }}>
        <div className="cta-banner glass animate-fade-in" style={{ padding: '6rem 4rem', borderRadius: '48px', position: 'relative', overflow: 'hidden', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', zIndex: -1 }}></div>
          <div className="cta-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>Rejoignez l'Avant-Garde <br /> de la <span className="text-accent">Technologie</span></h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '2.5rem' }}>Inscrivez-vous à notre newsletter exclusive pour être le premier informé des lancements limités et des privilèges membres.</p>
            <div className="cta-buttons" style={{ justifyContent: 'center', gap: '1.5rem' }}>
               <Link to="/signup" className="btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '100px' }}>Commencer l'Expérience</Link>
               <button className="btn-secondary glass" style={{ padding: '1.2rem 3rem', borderRadius: '100px' }}>En Savoir Plus</button>
            </div>
          </div>
          <ShoppingBag size={200} className="cta-icon-bg" style={{ opacity: 0.03, right: '-5%', bottom: '-5%', top: 'auto', transform: 'rotate(-15deg)' }} />
        </div>
      </section>
    </div>
  );
}

