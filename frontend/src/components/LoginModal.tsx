import { X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { login, register } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
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
          onClose();
          window.location.reload(); // Simple way to refresh UI with user state
        } else {
          setError(result.message || 'Erro ao entrar');
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password);
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
      
      <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
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
          <p className="text-premium-500 text-sm">
            {isLogin 
              ? 'Acesse sua conta para uma experiência personalizada.' 
              : 'Junte-se a nós para ofertas e novidades exclusivas.'}
          </p>
        </div>

        {error && (
          <div className={`mb-4 p-3 text-xs text-center rounded-sm ${error.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-premium-800 mb-1 uppercase tracking-wider">Nome Completo</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-premium-800 mb-1 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-premium-800 mb-1 uppercase tracking-wider">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-premium-200 pl-4 pr-10 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark transition-all text-sm"
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
            className="w-full bg-premium-900 text-white py-3.5 hover:bg-premium-800 transition-colors font-medium text-sm tracking-wide mt-2 disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-premium-600 border-t border-premium-100 pt-6">
          {isLogin ? "Ainda não tem conta? " : "Já tem uma conta? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-dark font-medium hover:text-premium-900 transition-colors"
          >
            {isLogin ? 'Criar agora' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
