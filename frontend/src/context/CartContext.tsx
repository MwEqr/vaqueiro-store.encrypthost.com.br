import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'user';
  user?: {
    name: string;
    avatar: string;
  };
}

interface CartContextData {
  items: CartItem[];
  addToCart: (product: any, size: string, color: string, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  totalItems: number;
  cartTotal: number;
  showNotification: (message: string, type?: 'success' | 'error' | 'user', user?: { name: string; avatar: string }) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('@vaqueiro/cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem('@vaqueiro/cart', JSON.stringify(items));
  }, [items]);

  const showNotification = (message: string, type: 'success' | 'error' | 'user' = 'success', user?: { name: string; avatar: string }) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, user }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const addToCart = (product: any, size: string, color: string, quantity: number) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...currentItems, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        color,
        quantity
      }];
    });
    showNotification(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
    if (item) {
      showNotification(`${item.name} removido do carrinho.`, 'error');
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(currentItems => 
      currentItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, totalItems, cartTotal, showNotification }}>
      {children}
      
      {/* Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none text-left">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl animate-in slide-in-from-right-5 fade-in duration-300 min-w-[300px] border-l-4 ${
              n.type === 'success' ? 'bg-white border-green-500 text-premium-900' : 
              n.type === 'user' ? 'bg-premium-900 border-accent text-white' :
              'bg-white border-red-500 text-premium-900'
            }`}
          >
            {n.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
            {n.type === 'error' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
            
            {n.type === 'user' && n.user && (
              <div className="w-10 h-10 rounded-full bg-premium-800 border border-premium-700 overflow-hidden shrink-0 flex items-center justify-center">
                {n.user.avatar ? (
                  <img src={n.user.avatar} alt={n.user.name} className="w-full h-full object-cover" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-accent" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {n.type === 'user' && n.user && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5">Olá, {n.user.name}</p>
              )}
              <p className={`text-sm font-medium ${n.type === 'user' ? 'text-premium-100' : 'text-premium-900'}`}>{n.message}</p>
            </div>

            <button 
              onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
              className={`transition-colors ml-2 ${n.type === 'user' ? 'text-premium-400 hover:text-white' : 'text-premium-400 hover:text-premium-900'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
