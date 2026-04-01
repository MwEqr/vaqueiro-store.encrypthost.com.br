import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'VAQUEIRO10') {
      setDiscount(cartTotal * 0.1);
    } else {
      alert('Cupom inválido ou expirado.');
      setDiscount(0);
    }
  };

  const finalTotal = cartTotal - discount;

  return (
    <div className="bg-premium-50 min-h-screen py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl font-serif text-premium-900 mb-8 text-center sm:text-left"
        >
          Finalizar Compra
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Formulário de Dados */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7 xl:col-span-8 space-y-8"
          >
            
            {/* Contato */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-premium-100">
              <h2 className="text-lg font-medium text-premium-900 mb-6 uppercase tracking-wider text-sm border-b border-premium-100 pb-4">
                1. Identificação
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-premium-700 mb-1">E-mail</label>
                  <input type="email" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="seu@email.com" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Nome</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Sobrenome</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">CPF</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Telefone / WhatsApp</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>
            </div>

            {/* Entrega */}
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-premium-100">
              <h2 className="text-lg font-medium text-premium-900 mb-6 uppercase tracking-wider text-sm border-b border-premium-100 pb-4">
                2. Entrega (Embalagem Segura)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-premium-700 mb-1">CEP</label>
                  <input type="text" className="w-full sm:w-1/3 border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="00000-000" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-xs font-medium text-premium-700 mb-1">Rua / Avenida</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-premium-700 mb-1">Número</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-700 mb-1">Complemento (Opcional)</label>
                  <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="Apto, Bloco, etc" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Cidade</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Estado</label>
                    <input type="text" className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="Ex: SP" />
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Resumo do Pedido */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="bg-white p-6 rounded-sm shadow-sm border border-premium-100 sticky top-28">
              <h2 className="font-medium text-premium-900 mb-6 uppercase tracking-wider text-sm border-b border-premium-100 pb-4">
                Resumo do Pedido
              </h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-premium-50 rounded-sm overflow-hidden flex-shrink-0 border border-premium-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-sm font-medium text-premium-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-premium-500 mt-1">Tam: {item.size} | Cor: {item.color}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-premium-600">Qtd: {item.quantity}</span>
                        <span className="text-sm font-medium text-premium-900">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Seção de Cupom */}
              <div className="mb-6 pt-6 border-t border-premium-100">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-400" />
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código do cupom" 
                      className="w-full border border-premium-200 pl-9 pr-4 py-2.5 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm uppercase transition-all"
                    />
                  </div>
                  <button type="submit" className="bg-premium-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-premium-800 transition-colors">
                    Aplicar
                  </button>
                </form>
              </div>

              {/* Totais */}
              <div className="space-y-3 pt-6 border-t border-premium-100 text-sm">
                <div className="flex justify-between text-premium-600">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-accent font-medium">
                    <span>Desconto (Cupom)</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-premium-600">
                  <span>Frete</span>
                  <span className="text-accent font-medium">Grátis</span>
                </div>
                <div className="flex justify-between font-serif font-semibold text-lg text-premium-900 pt-4 border-t border-premium-100 mt-2">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button className="w-full bg-accent text-white py-4 mt-8 font-medium tracking-widest uppercase text-sm hover:bg-accent-dark transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]">
                <ShieldCheck className="w-5 h-5" />
                Pagamento Seguro
              </button>
              
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
