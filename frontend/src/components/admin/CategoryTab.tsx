import { useState, useEffect } from 'react';
import { List, Search, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { fetchCategories, saveCategory } from '../../services/api';

interface Category {
  id: number;
  name: string;
  slug?: string;
  count?: number;
}

interface CategoryTabProps {
  onShowSuccess: (msg: string) => void;
  onDeleteRequest: (type: string, id: number, name: string) => void;
  refreshCategories: () => void;
  refreshTrigger: number;
}

export default function CategoryTab({ onShowSuccess, onDeleteRequest, refreshCategories, refreshTrigger }: CategoryTabProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCategory({ id: editingId, name }, editingId ? 'PUT' : 'POST');
      onShowSuccess(editingId ? 'Categoria atualizada no WordPress!' : 'Categoria criada no WordPress!');
      setShowForm(false);
      setName('');
      setEditingId(null);
      loadData();
      refreshCategories(); // Atualiza a lista global do Dashboard (usada no seletor de produtos)
    } catch (err) {
      alert("Erro ao salvar categoria.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setShowForm(true);
  };

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center p-12 text-premium-900"><Loader2 className="w-8 h-8 text-accent animate-spin mb-4"/><p className="font-serif text-lg">Buscando categorias no WooCommerce...</p></div>;
  }

  return (
    <div className="flex flex-col h-full text-premium-900">
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-premium-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-md p-8 rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-premium-100">
              <h2 className="text-xl font-serif">{editingId ? 'Editar' : 'Nova'} Categoria</h2>
              <button onClick={() => setShowForm(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6 text-premium-900">
              <div><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase tracking-widest">Nome da Categoria</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent outline-none bg-white text-premium-900" /></div>
              <div className="pt-6 border-t border-premium-100 flex gap-4 justify-end text-premium-900"><button type="button" onClick={() => setShowForm(false)} className="bg-white border border-premium-200 text-premium-700 px-8 py-2 text-xs font-bold uppercase rounded-sm">Cancelar</button><button type="submit" disabled={saving} className="bg-premium-900 text-white px-8 py-2 text-xs font-bold uppercase rounded-sm shadow-md flex items-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin"/> : null} Salvar no WordPress</button></div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-premium-100 flex justify-between items-center shrink-0">
        <div className="relative w-96 text-premium-900"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-400" /><input type="text" placeholder="Buscar no WordPress..." className="w-full pl-10 pr-4 py-2 border border-premium-200 text-sm rounded-sm bg-premium-50 outline-none" /></div>
        <div className="flex gap-4">
          <button onClick={loadData} className="p-2 bg-white border border-premium-200 rounded-sm hover:bg-premium-50 transition-colors"><Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => { setEditingId(null); setName(''); setShowForm(true); }} className="bg-premium-900 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase rounded-sm shadow-md">Nova Categoria</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {categories.length === 0 ? (<div className="h-full flex flex-col items-center justify-center p-12 text-center text-premium-900"><List size={40}/><h3 className="mt-4 font-serif text-lg">Sem categorias no WooCommerce</h3></div>) : (
          <table className="w-full text-left text-sm text-premium-900">
            <thead className="text-[10px] text-premium-500 uppercase bg-premium-50 border-b border-premium-100 sticky top-0 z-10 font-bold tracking-widest uppercase"><tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Nome</th><th className="px-6 py-4">Qtd Produtos</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-premium-50 hover:bg-premium-50/50 group text-premium-900">
                  <td className="px-6 py-4 font-mono text-xs text-premium-400">#{c.id}</td>
                  <td className="px-6 py-4 font-bold">{c.name}</td>
                  <td className="px-6 py-4"><span className="bg-premium-100 text-premium-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{c.count || 0} produtos</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-2 bg-premium-50 text-premium-600 hover:bg-premium-900 hover:text-white transition-all rounded-sm border border-premium-100" title="Editar">
                        <Edit size={16}/>
                      </button>
                      <button onClick={() => onDeleteRequest('category', c.id, c.name)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm border border-red-100" title="Excluir">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
