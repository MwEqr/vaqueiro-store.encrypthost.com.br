import { ShoppingBag, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenLogin: () => void;
}

export default function Header({ onOpenCart, onOpenLogin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const scrollToSection = (sectionId: string) => {
    // If not on home page, we would typically navigate home first. 
    // Assuming simple hash navigation for this layout:
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-premium-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-premium-200 hover:text-accent transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo (Now on the Left) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpeg" alt="Vaqueiro Store" className="h-16 w-auto object-contain" />
            </Link>
          </div>

          {/* Navigation - Desktop (Now in the Center) */}
          <nav className="hidden lg:flex flex-grow justify-center space-x-8">
            <button onClick={() => scrollToSection('categorias')} className="text-premium-200 hover:text-white font-medium transition-colors text-sm uppercase tracking-wider">Categorias</button>
            <button onClick={() => scrollToSection('ofertas')} className="text-accent hover:text-accent-light font-bold transition-colors text-sm uppercase tracking-wider">Ofertas Especiais</button>
            <button onClick={() => scrollToSection('experiencia')} className="text-premium-200 hover:text-white font-medium transition-colors text-sm uppercase tracking-wider">Nossa Essência</button>
            <button onClick={() => scrollToSection('lancamentos')} className="text-premium-200 hover:text-white font-medium transition-colors text-sm uppercase tracking-wider">Lançamentos</button>
          </nav>

          {/* Actions (Remains on the Right) */}
          <div className="flex items-center justify-end space-x-4 sm:space-x-6">
            <button onClick={onOpenLogin} className="text-premium-200 hover:text-white transition-colors flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="hidden lg:block text-sm font-medium">Entrar</span>
            </button>
            <button onClick={onOpenCart} className="text-premium-200 hover:text-white transition-colors relative flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-premium-900 border-t border-premium-800 px-4 pt-2 pb-4 space-y-1 shadow-2xl">
          <button onClick={() => { scrollToSection('categorias'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-medium text-premium-200 hover:text-white hover:bg-premium-800 rounded-md">Categorias</button>
          <button onClick={() => { scrollToSection('ofertas'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-semibold text-accent hover:text-accent-light hover:bg-premium-800 rounded-md">Ofertas Especiais</button>
          <button onClick={() => { scrollToSection('experiencia'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-medium text-premium-200 hover:text-white hover:bg-premium-800 rounded-md">Nossa Essência</button>
          <button onClick={() => { scrollToSection('lancamentos'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-base font-medium text-premium-200 hover:text-white hover:bg-premium-800 rounded-md">Lançamentos</button>
        </div>
      )}
    </header>
  );
}
