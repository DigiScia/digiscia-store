import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Heart, Menu, X, Zap } from "lucide-react";
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
  const location = useLocation();
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
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-inner">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <Zap size={24} />
              </div>
              <span className="logo-text">Digiscia-Store</span>
            </div>

            {/* Desktop Menu */}
            <div className="nav-menu">
              <Link to="/" className="nav-link">Accueil</Link>
              <Link to="/products" className="nav-link">Produits</Link>
              <a href="#" className="nav-link">Contact</a>

              {/* Auth zone desktop */}
              {!accessToken ? (
                <Link to="/login" className="navbar-login-btn">
                  Se connecter
                </Link>
              ) : (
                <div className="navbar-profile">
                  <Link to="/profile" className="navbar-username">
                    {username || "Profil"}
                  </Link>
                  <button
                    type="button"
                    className="navbar-logout-btn"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>

            {/* Icons */}
           <div className="nav-icons">
                <button
                    className="icon-btn"
                    type="button"
                    onClick={handleSearchClick}
                  >
                    <Search size={20} />
                 </button>

                  <button className="icon-btn">
                    <Heart size={20} />
                  </button>

                  <button className="icon-btn cart-btn" onClick={toggleCart}>
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </button>

                  {/* Mobile Menu */}
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
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <Link
                to="/"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Produits
              </Link>
              <a href="#" className="mobile-link">Nouveautés</a>
              <a href="#" className="mobile-link">Contact</a>

              {/* Auth zone mobile */}
              {!accessToken ? (
                <Link
                  to="/login"
                  className="mobile-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Se connecter
                </Link>
              ) : (
                <div className="mobile-auth">
                  <Link
                    to="/profile"
                    className="mobile-username"
                    onClick={() => setMenuOpen(false)}
                  >
                    {username || "Profil"}
                  </Link>
                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {location.pathname === "/products" && searchOpen && (
          <div className="navbar-search-wrapper">
            <input
              type="text"
              className="navbar-search-input"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      {/* PAGE CONTENT */}
      <main className="page-content">
          <Outlet context={{ searchQuery }} />
      </main>

      {/* CART OVERLAY */}
      <Cart isOpen={isCartOpen} onClose={toggleCart} />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-title">Digiscia</h3>
              <p className="footer-text">Votre boutique tech premium</p>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Navigation</h4>
              <div className="footer-links">
                <Link to="/" className="footer-link">Accueil</Link>
                <Link to="/products" className="footer-link">Produits</Link>
                <a href="#" className="footer-link">À propos</a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Support</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Contact</a>
                <a href="#" className="footer-link">FAQ</a>
                <a href="#" className="footer-link">Livraison</a>
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Newsletter</h4>
              <p className="footer-text-small">
                Restez informés des nouveautés
              </p>
              <input
                type="email"
                placeholder="Votre email"
                className="newsletter-input"
              />
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 DIGISCIA. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
