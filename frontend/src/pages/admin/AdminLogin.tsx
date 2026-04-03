import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais atualizadas para Vaqueiro Store
    if (email === 'admin@vaqueirostore.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-premium-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border border-premium-100">
        <div className="flex flex-col items-center mb-8">
          {/* Logo da Vaqueiro Store no Login Admin */}
          <div className="mb-6">
            <img src="/logo.jpeg" alt="Vaqueiro Store" className="h-16 w-auto object-contain" />
          </div>
          <div className="w-12 h-12 bg-premium-900 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif text-premium-900">Acesso Restrito</h2>
          <p className="text-sm text-premium-500 mt-1">Painel Administrativo Vaqueiro Store</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-premium-700 mb-1 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-premium-200 px-4 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all bg-premium-50"
              placeholder="admin@vaqueirostore.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-premium-700 mb-1 uppercase tracking-wider">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-premium-200 pl-4 pr-10 py-3 focus:outline-none focus:border-accent-dark focus:ring-1 focus:ring-accent-dark text-sm transition-all bg-premium-50"
                placeholder="••••••••"
                required
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
          
          <button 
            type="submit" 
            className="w-full bg-premium-900 text-white py-3.5 mt-4 font-medium tracking-widest uppercase text-sm hover:bg-premium-800 transition-colors shadow-lg active:scale-[0.98]"
          >
            Entrar no Painel
          </button>
        </form>

        <div className="mt-8 text-center border-t border-premium-100 pt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-xs text-premium-500 hover:text-premium-900 transition-colors"
          >
            &larr; Voltar para a loja
          </button>
        </div>
      </div>
    </div>
  );
}
