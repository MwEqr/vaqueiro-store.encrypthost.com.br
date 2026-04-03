import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Ticket, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder, fetchCoupons } from '../services/api';

const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let sum = 0, rest;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

export default function CheckoutPage() {
  const { items, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Leitura síncrona do usuário no momento que a página abre
  const getUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const currentUser = getUserData();
  const nameParts = currentUser?.name ? currentUser.name.trim().split(' ') : [];

  // Form states com auto-preenchimento nativo
  const [email, setEmail] = useState(currentUser?.email || '');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');
  
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cepError, setCepError] = useState('');
  
  const [freight, setFreight] = useState(0);
  const [freightLoading, setFreightLoading] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    setValidatingCoupon(true);
    try {
      const coupons = await fetchCoupons();
      const codeToApply = couponCode.trim().toUpperCase();
      const foundCoupon = coupons.find((c: any) => c.code.toUpperCase() === codeToApply);

      if (!foundCoupon) {
        showToast('Cupom inválido ou não encontrado.', 'error');
        setDiscount(0);
        return;
      }

      if (foundCoupon.date_expires) {
        const today = new Date();
        const expirationDate = new Date(foundCoupon.date_expires);
        if (today > expirationDate) {
          showToast('Este cupom já expirou.', 'error');
          setDiscount(0);
          return;
        }
      }

      if (foundCoupon.minimum_amount > 0 && cartTotal < foundCoupon.minimum_amount) {
        showToast(`Este cupom exige um gasto mínimo de R$ ${foundCoupon.minimum_amount.toFixed(2).replace('.', ',')}.`, 'error');
        setDiscount(0);
        return;
      }

      if (foundCoupon.type === 'percent') {
        setDiscount(cartTotal * (foundCoupon.discount / 100));
      } else {
        setDiscount(Math.min(cartTotal, foundCoupon.discount)); 
      }
      
      showToast('Cupom aplicado com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao validar cupom. Tente novamente.', 'error');
      setDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (!cpf || cpfError !== '' || !validateCPF(cpf)) {
      showToast('Por favor, preencha um CPF válido antes de pagar.', 'error');
      return;
    }
    if (!cep || cepError !== '' || freight === 0) {
      showToast('Por favor, preencha o CEP para calcularmos o valor do frete.', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Sua sacola está vazia.', 'error');
      return;
    }
    
    setLoadingCheckout(true);

    const payload = {
      items,
      freight,
      coupon: discount > 0 ? couponCode : null,
      customer: {
        firstName: firstName || 'Cliente',
        lastName: lastName || 'Vaqueiro',
        email: email || 'cliente@vaqueirostore.com',
        phone: phone || '11999999999',
        cpf: cpf,
        cep: cep,
        address: rua,
        numero: numero,
        complement: complemento,
        city: cidade,
        state: estado
      }
    };

    try {
      const data = await createOrder(payload);
      
      if (data.status === 'success' && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        showToast('Erro ao gerar o link de pagamento. Verifique as configurações do Mercado Pago no WordPress.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro de conexão ao processar o pagamento.', 'error');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleCpfBlur = () => {
    if (cpf && !validateCPF(cpf)) {
      setCpfError('CPF inválido');
    } else {
      setCpfError('');
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
    if (cpfError) setCpfError('');
  };

  const fetchAddress = async (cleanCEP: string) => {
    setFreightLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setRua(data.logradouro);
        setCidade(data.localidade);
        setEstado(data.uf);
        
        let freightValue = 45.90; 
        if (data.uf === 'SP') freightValue = 18.90; 
        else if (['MG', 'RJ', 'ES', 'PR', 'SC', 'RS', 'GO', 'DF', 'MS'].includes(data.uf)) freightValue = 28.90; 
        
        setFreight(freightValue);
        setCepError('');
      } else {
        setCepError('CEP não encontrado');
        setFreight(0);
      }
    } catch (err) {
      setCepError('Erro ao buscar CEP');
    } finally {
      setFreightLoading(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    setCep(value);
    if (cepError) setCepError('');
    
    const cleanCEP = value.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      fetchAddress(cleanCEP);
    }
  };

  const finalTotal = cartTotal - discount + freight;

  return (
    <div className="bg-premium-50 min-h-screen py-12 overflow-hidden relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-[100] flex items-center px-6 py-4 rounded-sm shadow-2xl border ${
              toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-3 text-green-500 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3 text-red-500 shrink-0" />
            )}
            <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </p>
            <button onClick={() => setToast(null)} className={`ml-6 ${toast.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-7 xl:col-span-8 space-y-8"
          >
            
            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-premium-100">
              <h2 className="text-lg font-medium text-premium-900 mb-6 uppercase tracking-wider text-sm border-b border-premium-100 pb-4">
                1. Identificação
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-premium-700 mb-1">E-mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="seu@email.com" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Nome</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Sobrenome</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">CPF <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={cpf}
                      onChange={handleCpfChange}
                      onBlur={handleCpfBlur}
                      className={`w-full border px-4 py-3 focus:outline-none focus:ring-1 text-sm transition-all ${cpfError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-premium-200 focus:border-accent-dark focus:ring-accent-dark'}`} 
                      placeholder="000.000.000-00" 
                    />
                    {cpfError && <span className="text-xs text-red-500 mt-1 block">{cpfError}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Telefone / WhatsApp</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm border border-premium-100">
              <h2 className="text-lg font-medium text-premium-900 mb-6 uppercase tracking-wider text-sm border-b border-premium-100 pb-4">
                2. Entrega (Enviado de Franca-SP)
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-premium-700 mb-1">CEP</label>
                  <input 
                    type="text" 
                    value={cep}
                    onChange={handleCepChange}
                    className={`w-full sm:w-1/3 border px-4 py-3 focus:outline-none focus:ring-1 text-sm transition-all ${cepError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-premium-200 focus:border-accent-dark focus:ring-accent-dark'}`} 
                    placeholder="00000-000" 
                  />
                  {freightLoading && <Loader2 className="absolute right-auto left-32 top-[34px] sm:left-40 w-4 h-4 animate-spin text-premium-400" />}
                  {cepError && <span className="text-xs text-red-500 mt-1 block">{cepError}</span>}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-3">
                    <label className="block text-xs font-medium text-premium-700 mb-1">Rua / Avenida</label>
                    <input type="text" value={rua} onChange={e => setRua(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all bg-premium-50" readOnly={rua !== ''} />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-premium-700 mb-1">Número</label>
                    <input type="text" value={numero} onChange={e => setNumero(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-premium-700 mb-1">Complemento (Opcional)</label>
                  <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all" placeholder="Apto, Bloco, etc" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Cidade</label>
                    <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all bg-premium-50" readOnly={cidade !== ''} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-premium-700 mb-1">Estado</label>
                    <input type="text" value={estado} onChange={e => setEstado(e.target.value)} className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all bg-premium-50" placeholder="Ex: SP" readOnly={estado !== ''} />
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

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
                  <button type="submit" disabled={validatingCoupon} className="bg-premium-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-premium-800 transition-colors flex items-center gap-2">
                    {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Aplicar
                  </button>
                </form>
              </div>

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
                <div className="flex justify-between text-premium-600 items-center">
                  <span>Frete</span>
                  {freightLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-premium-400" />
                  ) : (
                    <span className={freight === 0 ? "text-premium-400 text-xs italic" : "text-premium-900 font-medium"}>
                      {freight > 0 ? `R$ ${freight.toFixed(2).replace('.', ',')}` : 'A calcular'}
                    </span>
                  )}
                </div>
                <div className="flex justify-between font-serif font-semibold text-lg text-premium-900 pt-4 border-t border-premium-100 mt-2">
                  <span>Total</span>
                  <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={loadingCheckout}
                className="w-full bg-accent text-white py-4 mt-8 font-medium tracking-widest uppercase text-sm hover:bg-accent-dark transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingCheckout ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loadingCheckout ? 'Processando Pedido...' : 'Pagamento Seguro'}
              </button>
              
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}