import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import CollectionPage from './pages/CollectionPage';
import PromotionsPage from './pages/PromotionsPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import { CartProvider } from './context/CartContext';

// Componente para rolar a página para o topo ao mudar de rota
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      
      {!isAdminPage && (
        <Header 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenLogin={() => setIsLoginOpen(true)} 
        />
      )}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isAdminPage && <Footer />}

      {!isAdminPage && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      {!isAdminPage && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colecao" element={<CollectionPage />} />
            <Route path="/promocoes" element={<PromotionsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}
