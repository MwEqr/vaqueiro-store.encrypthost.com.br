import { useState, useEffect } from 'react';
import { Package, List, Ticket, LogOut, LayoutDashboard, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ProductTab from '../../components/admin/ProductTab';
import CategoryTab from '../../components/admin/CategoryTab';
import CouponTab from '../../components/admin/CouponTab';
import { fetchCategories } from '../../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('produtos');
  const navigate = useNavigate();

  // Categories shared state
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState<{type: string, id: number, name: string} | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const handleDeleteRequest = (type: string, id: number, name: string) => {
    setDeleteModal({ type, id, name });
  };

  const TABS = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'categorias', label: 'Categorias', icon: List },
    { id: 'cupons', label: 'Cupons', icon: Ticket },
  ];

  return (
    <div className="h-screen overflow-hidden bg-premium-50 flex flex-col md:flex-row font-sans text-premium-900">
      {showSuccessPopup && (
        <div className="fixed top-6 right-6 bg-green-50 border border-green-200 px-6 py-4 rounded-sm shadow-2xl flex items-center z-[100] animate-in slide-in-from-top-5 fade-in duration-300">
          <CheckCircle className="w-5 h-5 mr-3 text-green-500 shrink-0" />
          <p className="text-xs font-medium text-green-700">{successMessage}</p>
          <button onClick={() => setShowSuccessPopup(false)} className="ml-6 text-green-600"><X className="w-4 h-4" /></button>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-premium-900/60 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
          <div className="relative bg-white w-full max-w-sm p-6 rounded-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-500" /></div>
            <h2 className="text-xl font-serif mb-2">Excluir?</h2>
            <p className="text-sm text-premium-600 mb-6">Deseja excluir <strong>{deleteModal.name}</strong> no WordPress?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteModal(null)} className="px-6 py-2.5 border text-sm font-medium rounded-sm">Cancelar</button>
              <button onClick={() => { setDeleteModal(null); showSuccess('Item excluído!'); }} className="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-sm">Excluir</button>
            </div>
          </div>
        </div>
      )}

      <aside className="w-full md:w-64 bg-premium-900 text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6 flex items-center justify-center border-b border-premium-800 shrink-0 h-16"><img src="/logo.jpeg" alt="Vaqueiro Store" className="h-10 w-auto object-contain" /></div>
        <div className="p-4 overflow-y-auto flex-1 text-white">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-premium-400 hover:bg-premium-800 hover:text-white'}`}>
                <tab.icon className="w-5 h-5" /><span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-premium-800 shrink-0">
          <button 
            onClick={() => navigate('/admin')} 
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/20 transition-all rounded-sm text-sm font-bold uppercase tracking-widest border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-premium-100 h-16 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center text-premium-800 font-serif text-lg font-medium"><LayoutDashboard className="w-5 h-5 mr-3 text-accent" />{TABS.find(t => t.id === activeTab)?.label}</div>
          <div className="w-8 h-8 bg-premium-900 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-lg">AD</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
          <div className="bg-white rounded-sm shadow-sm border border-premium-100 flex-1 flex flex-col overflow-hidden relative text-premium-900">
            {activeTab === 'produtos' && <ProductTab categories={categories} onShowSuccess={showSuccess} onDeleteRequest={handleDeleteRequest} />}
            {activeTab === 'categorias' && <CategoryTab onShowSuccess={showSuccess} onDeleteRequest={handleDeleteRequest} refreshCategories={loadCategories} />}
            {activeTab === 'cupons' && <CouponTab onShowSuccess={showSuccess} onDeleteRequest={handleDeleteRequest} />}
          </div>
        </div>
      </main>
    </div>
  );
}
