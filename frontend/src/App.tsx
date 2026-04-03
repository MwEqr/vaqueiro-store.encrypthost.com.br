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
import ProfilePage from './pages/ProfilePage';
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

interface LayoutProps {
  children: React.ReactNode;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isCartOpen, setIsCartOpen, isLoginOpen, setIsLoginOpen }) => {
  const location = useLocation();
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

      {!isAdminPage && (
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      )}
      {!isAdminPage && <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <Layout 
          isCartOpen={isCartOpen} 
          setIsCartOpen={setIsCartOpen} 
          isLoginOpen={isLoginOpen} 
          setIsLoginOpen={setIsLoginOpen}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colecao" element={<CollectionPage />} />
            <Route path="/promocoes" element={<PromotionsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage onOpenLogin={() => setIsLoginOpen(true)} />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
}
