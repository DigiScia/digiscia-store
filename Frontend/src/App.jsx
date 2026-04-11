import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des pages
import Layout from "./layouts/Layout";
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import CommandeDetail from "./pages/CommandeDetail";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import CategoryDetailPage from './pages/CategoryDetailPage';
import { CartProvider } from "./context/CartContext";
import SearchPage from "./pages/SearchPage.jsx";

const App = () => {
  return (
      <CartProvider>
        <Router>
          <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/commandes/:orderId" element={<CommandeDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
                <Route path= "/payment" element={<Payment />} />
                <Route path="/search" element={<SearchPage />} />
               </Route>
          </Routes>
        </Router>
      </CartProvider>
  );
};

export default App;
