import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Heart, Menu, X, Zap, User, Shield, Truck, Star } from "lucide-react";
import "../styles/index.css";
import { useCart } from "/src/context/CartContext.jsx";
import Cart from "/src/components/Cart/Cart.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClick = () => {
      if (location.pathname !== "/products") {
        setSearchOpen(true);
        navigate("/products");
      } else {
        setSearchOpen((prev) => !prev);
      }
    };


  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const accessToken = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="ecommerce-container">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>
      <div className="bg-orb bg-orb-4"></div>
      <div className="bg-orb bg-orb-5"></div>
      <div className="bg-orb bg-orb-6"></div>

      {/* NAVBAR */}
      <nav className={`navbar glass ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-content" style={{ padding: isScrolled ? '0.5rem 2rem' : '1.5rem 2rem', transition: 'padding 0.4s var(--ease-expo)' }}>
          <div className="navbar-inner" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {/* Logo */}
            <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="logo-icon glass" style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 1, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)' }}>
                <Zap size={22} fill="currentColor" />
              </div>
              <span className="logo-text text-gradient" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Digiscia</span>
            </Link>

            {/* Desktop Menu */}
            <div className="nav-menu" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
              <Link to="/" className="nav-link" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: location.pathname === '/' ? 1 : 0.5 }}>Accueil</Link>
              <Link to="/products" className="nav-link" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: location.pathname === '/products' ? 1 : 0.5 }}>Boutique</Link>
            </div>

            {/* Actions */}
            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="search-bar-integrated glass" style={{ padding: '8px 16px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Search size={16} style={{ opacity: 0.5 }} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', outline: 'none', width: '100px' }} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="nav-icon-btn glass" onClick={toggleCart} style={{ position: 'relative', width: '42px', height: '42px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <ShoppingCart size={18} />
                   {cartCount > 0 && <span className="cart-badge" style={{ top: '-4px', right: '-4px', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>{cartCount}</span>}
                </button>
                
                {accessToken ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to="/profile" className="glass" style={{ width: '42px', height: '42px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </Link>
                    <button onClick={handleLogout} className="glass" style={{ width: '42px', height: '42px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="nav-icon-btn glass" style={{ width: '42px', height: '42px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} />
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-menu-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {menuOpen && (
          <div className="mobile-menu glass animate-fade-in">
            <div className="mobile-menu-content">
              <Link to="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Accueil</Link>
              <Link to="/products" className="mobile-link" onClick={() => setMenuOpen(false)}>Boutique</Link>
              
              {!accessToken ? (
                <Link to="/login" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: 'center' }}>
                  Se connecter
                </Link>
              ) : (
                <div className="mobile-auth">
                  <Link to="/profile" className="mobile-link" onClick={() => setMenuOpen(false)}>{username}</Link>
                  <button className="btn-secondary" onClick={() => { handleLogout(); setMenuOpen(false); }}>Déconnexion</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>


      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="search-overlay glass animate-fade-in" style={{ padding: '10rem 2rem', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000 }}>
          <div className="search-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
              <Search size={32} className="text-accent" />
              <input
                autoFocus
                type="text"
                className="search-input-big"
                placeholder="Examinez notre inventaire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '2.5rem', fontWeight: 300, outline: 'none', width: '100%' }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={32} />
              </button>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <span style={{ opacity: 0.4 }}>Suggestions:</span>
              <button className="glass" style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>MacBook Pro</button>
              <button className="glass" style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem' }}>iPhone 15</button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <main className="page-content">
        <Outlet context={{ searchQuery }} />
      </main>

      {/* CART OVERLAY */}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />

      {/* FOOTER */}
      <footer className="footer glass" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12rem 0 4rem', background: 'rgba(5, 8, 15, 0.9)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        
        <div className="footer-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1.5fr', gap: '8rem' }}>
            <div className="footer-column">
              <div className="logo" style={{ marginBottom: '2.5rem', gap: '14px', display: 'flex', alignItems: 'center' }}>
                <div className="logo-icon glass" style={{ width: '42px', height: '42px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)' }}>
                  <Zap size={22} fill="currentColor" />
                </div>
                <span className="logo-text text-gradient" style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-0.06em' }}>Digiscia</span>
              </div>
              <p className="footer-text" style={{ fontSize: '1.05rem', lineHeight: 1.9, opacity: 0.4, maxWidth: '340px', marginBottom: '3rem' }}>
                L'épicentre de l'innovation technologique. Nous sélectionnons l'excellence pour ceux qui exigent la perfection.
              </p>
              
              {/* Social Links */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['Instagram', 'Twitter', 'Linkedin'].map((social) => (
                  <a key={social} href="#" className="glass" style={{ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s var(--ease-expo)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading" style={{ marginBottom: '2rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>Univers</h4>
              <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <Link to="/" className="footer-link-premium" style={{ opacity: 0.3, textDecoration: 'none', color: 'white', transition: 'opacity 0.3s' }}>Nouveautés</Link>
                <Link to="/products" className="footer-link-premium" style={{ opacity: 0.3, textDecoration: 'none', color: 'white', transition: 'opacity 0.3s' }}>Boutique</Link>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading" style={{ marginBottom: '2rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>Support</h4>
              <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <a href="#" className="footer-link-premium" style={{ opacity: 0.3, textDecoration: 'none', color: 'white' }}>Expédition</a>
                <a href="#" className="footer-link-premium" style={{ opacity: 0.3, textDecoration: 'none', color: 'white' }}>Conciergerie</a>
                <a href="#" className="footer-link-premium" style={{ opacity: 0.3, textDecoration: 'none', color: 'white' }}>Index Juridique</a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading" style={{ marginBottom: '2rem', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>Club Privé</h4>
              <p className="footer-text-small" style={{ opacity: 0.4, marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>Inscrivez-vous pour recevoir nos sorties confidentielles.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="newsletter-input glass"
                  style={{ flex: 1, padding: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                />
                <button className="btn-primary" style={{ padding: '0 2rem', borderRadius: '16px' }}>
                   OK
                </button>
              </div>
              
              {/* Trust Badges */}
              <div style={{ display: 'flex', gap: '2rem', opacity: 0.2 }}>
                 <Shield size={20} />
                 <Truck size={20} />
                 <Star size={20} />
              </div>
            </div>
          </div>

          <div className="footer-bottom" style={{ marginTop: '10rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <p style={{ fontSize: '0.8rem', opacity: 0.3, margin: 0 }}>© 2025 DigiScia Architectural Hub. All Rights Reserved.</p>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.86rem', opacity: 0.25 }}>
                 <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Confidentialité</a>
                 <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Conditions</a>
              </div>
            </div>
            
            <div style={{ opacity: 0.3, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 900 }}>
               Excellence Digitale
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

