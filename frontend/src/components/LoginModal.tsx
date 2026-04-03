import { X, Eye, EyeOff, CheckCircle, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register } from '../services/api';
import { useCart } from '../context/CartContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { showNotification } = useCart();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleSoon, setShowGoogleSoon] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.status === 'success') {
          localStorage.setItem('user', JSON.stringify(result.user));
          showNotification('Login realizado com sucesso.', 'user', { 
            name: result.user.firstName, 
            avatar: result.user.avatar 
          });
          onClose();
          setTimeout(() => {
            window.location.reload(); 
          }, 1500);
        } else {
          setError(result.message || 'E-mail ou senha incorretos');
        }
      } else {
        const result = await register(formData.firstName, formData.lastName, formData.email, formData.password);
        if (result.status === 'success') {
          setIsLogin(true);
          setError('Conta criada com sucesso! Faça login.');
        } else {
          setError(result.message || 'Erro ao cadastrar');
        }
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-premium-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative overflow-hidden bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {showGoogleSoon && (
          <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
               <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            </div>
            <h3 className="text-2xl font-serif text-premium-900 mb-2">Em breve!</h3>
            <p className="text-sm text-premium-600 mb-8 leading-relaxed">O login automático com o Google estará disponível nas próximas atualizações da loja.</p>
            <button onClick={() => setShowGoogleSoon(false)} className="w-full py-3.5 bg-premium-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-premium-800 transition-colors shadow-md">Entendi</button>
          </div>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-premium-400 hover:text-premium-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-premium-900 mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
          </h2>
          <p className="text-premium-500 text-sm italic">
            {isLogin 
              ? 'Acesse sua conta para uma experiência personalizada.' 
              : 'Preencha os dados abaixo para se tornar um membro.'}
          </p>
        </div>

        {error && (
          <div className={`mb-4 p-3 text-xs text-center rounded-sm ${error.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-premium-800 mb-1 uppercase tracking-widest">Nome</label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm bg-premium-50/30"
                  placeholder="Ex: João"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-premium-800 mb-1 uppercase tracking-widest">Sobrenome</label>
                <input 
                  type="text" 
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm bg-premium-50/30"
                  placeholder="Ex: Silva"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-bold text-premium-800 mb-1 uppercase tracking-widest">E-mail</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm bg-premium-50/30"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-premium-800 mb-1 uppercase tracking-widest">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-premium-200 pl-4 pr-10 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm bg-premium-50/30"
                placeholder="********"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-premium-400 hover:text-premium-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-accent-dark hover:text-premium-900 transition-colors font-medium">
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-premium-900 text-white py-3.5 hover:bg-premium-800 transition-colors font-bold text-xs uppercase tracking-widest mt-2 disabled:opacity-50 shadow-md"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar na Conta' : 'Cadastrar agora')}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-premium-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="px-2 bg-white text-premium-400">Ou continue com</span></div>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowGoogleSoon(true)}
            className="w-full bg-white border border-premium-200 text-premium-900 py-3.5 hover:bg-premium-50 transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Entrar com o Google
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-premium-600 border-t border-premium-100 pt-6">
          {isLogin ? "Ainda não tem conta? " : "Já tem uma conta? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-dark font-bold uppercase tracking-widest hover:text-premium-900 transition-colors"
          >
            {isLogin ? 'Criar agora' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
