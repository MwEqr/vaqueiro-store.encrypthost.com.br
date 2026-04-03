import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShoppingBag, LogOut, Camera, Loader2, Package, CheckCircle } from 'lucide-react';
import { fetchOrders, uploadImage, updateProfile } from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'perfil';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Fallback para nomes antigos
      if (!parsedUser.firstName && parsedUser.name) {
        const parts = parsedUser.name.trim().split(' ');
        parsedUser.firstName = parts[0];
        parsedUser.lastName = parts.slice(1).join(' ');
      }
      setUser(parsedUser);
      loadUserOrders(parsedUser.id);
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const loadUserOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const data = await fetchOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateUser = async (field: string, value: string) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Salva no WordPress de forma persistente
    try {
      await updateProfile({ id: user.id, [field]: value });
    } catch (e) {
      console.error("Erro ao sincronizar perfil", e);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const res = await uploadImage(e.target.files[0]);
        if (res.url) {
          const updatedUser = { ...user, avatar: res.url };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Salva a foto permanentemente no banco de dados do WordPress
          await updateProfile({ id: user.id, avatar: res.url });
        }
      } catch (err) {
        alert('Erro ao salvar foto de perfil.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'Entregue / Concluído';
      case 'processing': return 'Pago / Preparando';
      case 'pending': return 'Aguardando Pagamento';
      case 'cancelled': return 'Cancelado';
      case 'refunded': return 'Reembolsado';
      case 'on-hold': return 'Em Espera';
      default: return status;
    }
  };

  if (!user) return <div className="min-h-screen bg-premium-50"></div>;

  return (
    <div className="bg-premium-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-sm shadow-sm border border-premium-100 p-6 flex flex-col items-center">
              
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-premium-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-premium-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-accent-dark transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              
              <h2 className="text-lg font-serif font-medium text-premium-900 capitalize text-center">{user.firstName} {user.lastName}</h2>
              <p className="text-xs text-premium-500 mb-6">{user.email}</p>

              <div className="w-full space-y-2 border-t border-premium-100 pt-6">
                <button 
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium ${activeTab === 'perfil' ? 'bg-premium-900 text-white' : 'text-premium-600 hover:bg-premium-50'}`}
                >
                  <User className="w-4 h-4" /> Dados Pessoais
                </button>
                <button 
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium ${activeTab === 'pedidos' ? 'bg-premium-900 text-white' : 'text-premium-600 hover:bg-premium-50'}`}
                >
                  <ShoppingBag className="w-4 h-4" /> Meus Pedidos
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors text-sm font-medium text-red-600 hover:bg-red-50 mt-4"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-sm shadow-sm border border-premium-100 p-8 min-h-[500px]">
              
              {activeTab === 'perfil' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-serif text-premium-900 mb-6">Meus Dados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-premium-500 uppercase tracking-widest mb-2">Primeiro Nome</label>
                      <input 
                        type="text" 
                        value={user.firstName || ''} 
                        onChange={(e) => handleUpdateUser('firstName', e.target.value)}
                        className="w-full border border-premium-200 bg-white px-4 py-3 text-sm text-premium-900 rounded-sm focus:border-accent outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-premium-500 uppercase tracking-widest mb-2">Sobrenome</label>
                      <input 
                        type="text" 
                        value={user.lastName || ''} 
                        onChange={(e) => handleUpdateUser('lastName', e.target.value)}
                        className="w-full border border-premium-200 bg-white px-4 py-3 text-sm text-premium-900 rounded-sm focus:border-accent outline-none" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-premium-500 uppercase tracking-widest mb-2">E-mail de Cadastro</label>
                      <input type="email" value={user.email} readOnly className="w-full border border-premium-200 bg-premium-50 px-4 py-3 text-sm text-premium-400 rounded-sm outline-none" />
                    </div>
                  </div>
                  <div className="mt-8 bg-green-50 border border-green-200 p-4 rounded-sm flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-green-900">Sincronização Ativa</h4>
                      <p className="text-xs text-green-700 mt-1">As alterações feitas aqui serão aplicadas automaticamente no seu próximo Checkout.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pedidos' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-serif text-premium-900 mb-6">Histórico de Pedidos</h2>
                  
                  {loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-20 text-premium-400">
                      <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent" />
                      <p>Carregando seus pedidos...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-premium-400 border-2 border-dashed border-premium-100 rounded-sm">
                      <Package className="w-16 h-16 mb-4 text-premium-200" />
                      <p className="text-lg font-serif text-premium-900 mb-2">Nenhum pedido encontrado</p>
                      <p className="text-sm">Você ainda não fez nenhuma compra na loja.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order: any) => (
                        <div key={order.id} className="border border-premium-200 rounded-sm p-6 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-premium-100 gap-4">
                            <div>
                              <span className="text-xs font-bold text-premium-500 uppercase tracking-widest block mb-1">Pedido #{order.id}</span>
                              <span className="text-sm text-premium-900">{new Date(order.date_created).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex flex-col sm:items-end">
                              <span className="text-sm font-medium text-premium-900 mb-1">Total: R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'cancelled' || order.status === 'refunded' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {translateStatus(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-premium-600"><span className="font-medium text-premium-900">{item.quantity}x</span> {item.name}</span>
                                <span className="text-premium-900 font-medium">R$ {parseFloat(item.total).toFixed(2).replace('.', ',')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}