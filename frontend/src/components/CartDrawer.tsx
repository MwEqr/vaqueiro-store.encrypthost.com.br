import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-premium-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-premium-100">
          <h2 className="text-xl font-serif text-premium-900">Sua Sacola</h2>
          <button onClick={onClose} className="p-2 text-premium-500 hover:text-premium-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-premium-50 rounded-full flex items-center justify-center mb-4">
                <X className="w-6 h-6 text-premium-300" />
              </div>
              <p className="text-premium-800 font-medium mb-2">Sua sacola está vazia</p>
              <p className="text-premium-500 text-sm mb-6">Explore nossa coleção e encontre seus novos favoritos.</p>
              <button onClick={onClose} className="bg-premium-900 text-white px-8 py-3 hover:bg-premium-800 transition-colors text-sm font-medium">
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-premium-50 pb-6 last:border-0 last:pb-0">
                  <div className="w-20 h-24 bg-premium-50 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-premium-900 leading-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-premium-400 hover:text-accent transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-premium-500 mb-2 space-x-2">
                      <span>Cor: {item.color}</span>
                      <span>|</span>
                      <span>Tam: {item.size}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-premium-200 rounded-sm bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-premium-600 hover:text-premium-900 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-premium-600 hover:text-premium-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-premium-900">
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
              <span>Subtotal</span>
              <span className="font-semibold text-lg">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="text-xs text-premium-500 mb-4">Frete e impostos calculados no checkout.</p>
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-premium-900 text-white py-4 font-medium text-sm hover:bg-premium-800 transition-colors shadow-lg shadow-premium-900/20 active:scale-[0.98]"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
