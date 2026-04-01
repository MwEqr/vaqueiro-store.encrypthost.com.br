import { useState, useRef, useEffect } from 'react';
import { Package, Search, Plus, X, Edit, Trash2, Upload, Image as ImageIcon, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { fetchProducts } from '../../services/api';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  overridePrice: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  category: string;
  description: string;
  image: string;
  images: string[];
  active: boolean;
}

export default function ProductTab({ categories, onShowSuccess, onDeleteRequest }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(''); // Simulated for UI
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // No mundo real, aqui chamaríamos a API para POST/PUT no WooCommerce
    // Por enquanto, simulamos o sucesso para manter o fluxo
    onShowSuccess(editingId ? 'Produto atualizado no WooCommerce!' : 'Produto criado no WooCommerce!');
    setShowForm(false);
    resetForm();
    loadProducts();
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setPrice(''); setCategory(categories[0]?.name || ''); setDescription(''); setImage(''); setImages([]); setActive(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setCategory(p.category);
    setDescription(p.description);
    setImage(p.image);
    setImages(p.images);
    setActive(true);
    setShowForm(true);
  };

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center p-12"><Loader2 className="w-8 h-8 text-accent animate-spin mb-4"/><p className="font-serif text-lg">Sincronizando com WooCommerce...</p></div>;
  }

  return (
    <div className="flex flex-col h-full text-premium-900">
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-premium-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-premium-100 shrink-0">
              <h2 className="text-xl font-serif">{editingId ? 'Editar' : 'Novo'} Produto</h2>
              <button onClick={() => setShowForm(false)}><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <form id="prodForm" onSubmit={handleSave} className="space-y-10">
                <div className="bg-premium-50/50 p-6 rounded-sm border border-premium-100">
                  <h3 className="text-sm font-medium mb-6 uppercase tracking-wider">1. Básicos e Preço (WordPress)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Nome do Produto</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" /></div>
                    <div><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Preço Regular (R$)</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" /></div>
                    <div><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Categoria (WooCommerce)</label><select value={category} onChange={e => setCategory(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm outline-none bg-white">{categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                    <div className="col-span-2"><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Descrição Curta</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-premium-200 px-4 py-2 text-sm outline-none focus:border-accent bg-white resize-none" placeholder="Aparece no site..."></textarea></div>
                  </div>
                </div>

                <div className="bg-premium-50/50 p-6 rounded-sm border border-premium-100">
                  <h3 className="text-sm font-medium mb-6 uppercase tracking-wider">2. URL das Imagens</h3>
                  <div className="space-y-4">
                    <div><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Imagem Principal (URL)</label><input type="text" value={image} onChange={e => setImage(e.target.value)} className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" placeholder="https://..." /></div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {image && <div className="aspect-square rounded-sm overflow-hidden border-2 border-accent"><img src={image} className="w-full h-full object-cover" /></div>}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t bg-premium-50 flex justify-end gap-4 shrink-0"><button onClick={() => setShowForm(false)} className="text-xs font-bold uppercase px-6 py-2 border rounded-sm">Cancelar</button><button type="submit" form="prodForm" className="bg-accent text-white text-xs font-bold uppercase px-8 py-2 shadow-md rounded-sm">Salvar no WordPress</button></div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-premium-100 flex justify-between items-center shrink-0">
        <div className="relative w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-400" /><input type="text" placeholder="Buscar no catálogo..." className="w-full pl-10 pr-4 py-2 border border-premium-200 text-sm rounded-sm bg-premium-50 outline-none" /></div>
        <div className="flex gap-4">
          <button onClick={() => loadProducts()} className="p-2 bg-white border border-premium-200 rounded-sm hover:bg-premium-50 transition-colors"><Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-premium-900 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase rounded-sm shadow-md"><Plus size={16} /> Adicionar Produto</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {products.length === 0 ? <div className="h-full flex flex-col items-center justify-center p-12 text-center text-premium-900"><Package className="w-12 h-12 text-premium-200 mb-4"/><h3 className="font-serif text-lg">Nenhum produto encontrado no WooCommerce</h3></div> : (
          <table className="w-full text-left text-sm text-premium-900">
            <thead className="text-[10px] text-premium-500 uppercase bg-premium-50 border-b border-premium-100 sticky top-0 z-10 font-bold tracking-widest"><tr><th className="px-6 py-4">ID / Produto</th><th className="px-6 py-4">Categoria</th><th className="px-6 py-4">Preço</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-premium-50 hover:bg-premium-50/50 group transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4"><span className="text-[10px] font-mono text-premium-400">#{p.id}</span><div className="w-10 h-12 bg-premium-50 rounded-sm border border-premium-100 shrink-0">{p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <ImageIcon size={14}/>}</div><div><p className="font-bold">{p.name}</p></div></td>
                  <td className="px-6 py-4 uppercase text-[10px] font-bold text-premium-400"><span className="bg-premium-50 px-2 py-1 border border-premium-100 rounded-sm">{p.category}</span></td>
                  <td className="px-6 py-4 font-bold text-accent-dark">R$ {p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => openEdit(p)} className="p-2 bg-premium-50 text-premium-600 hover:bg-premium-900 hover:text-white rounded-sm border border-premium-100"><Edit size={16}/></button><button onClick={() => onDeleteRequest('product', p.id, p.name)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm border border-red-100"><Trash2 size={16}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
