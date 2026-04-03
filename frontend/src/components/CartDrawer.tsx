import { X, ShoppingBag, Trash2, Plus, Minus, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenLogin }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckoutClick = () => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      onClose();
      onOpenLogin();
      return;
    }

    setIsRedirecting(true);
    setTimeout(() => {
      onClose();
      navigate('/checkout');
      setIsRedirecting(false);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isRedirecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-premium-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <ShieldCheck className="w-8 h-8 text-accent absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
            </div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-serif mb-2 italic"
            >
              Quase lá...
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-premium-300 max-w-xs mx-auto text-[10px] leading-relaxed tracking-[0.2em] uppercase font-bold"
            >
              Estamos preparando seu ambiente de checkout seguro.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b border-premium-100 flex justify-between items-center bg-premium-50/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6 text-premium-900" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </div>
            <h2 className="text-xl font-serif text-premium-900">Sua Sacola</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-premium-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-premium-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-premium-400 space-y-4">
              <div className="w-20 h-20 bg-premium-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-serif italic text-lg text-premium-900">Sua sacola está vazia</p>
              <button 
                onClick={onClose}
                className="text-accent-dark font-bold text-xs uppercase tracking-widest hover:text-premium-900 transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 group">
                  <div className="w-24 h-32 bg-premium-50 overflow-hidden border border-premium-100 rounded-sm relative shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-premium-900 leading-tight pr-4 line-clamp-2 uppercase tracking-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-premium-300 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-premium-500 mb-4 font-bold tracking-widest uppercase">
                      {item.size} • {item.color}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border border-premium-200 bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-premium-50 text-premium-600 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-premium-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-premium-50 text-premium-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-premium-900">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-premium-100 bg-premium-50">
            <div className="flex justify-between mb-4 text-premium-900 font-medium">
              <span className="uppercase text-[10px] font-bold tracking-widest text-premium-500">Subtotal</span>
              <span className="font-serif text-2xl">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="text-[10px] text-premium-400 mb-6 italic leading-tight">Frete e cupons de desconto serão aplicados na próxima etapa.</p>
            <button
              onClick={handleCheckoutClick}
              disabled={isRedirecting}
              className="w-full bg-premium-900 text-white py-5 font-bold text-xs uppercase tracking-[0.2em] hover:bg-premium-800 transition-all shadow-xl shadow-premium-900/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isRedirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar Compra'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
