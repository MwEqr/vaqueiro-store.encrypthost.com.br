import { useState, useEffect } from 'react';
import { Package, Search, Plus, X, Edit, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { fetchProducts, saveProduct } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  sale_price: number | null;
  category: string;
  categoryId: number;
  description: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  active: boolean;
}

export default function ProductTab({ categories, onShowSuccess, onDeleteRequest, refreshTrigger }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [salePrice, setSalePrice] = useState('');
  
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [sizesStr, setSizesStr] = useState('');
  const [colorsStr, setColorsStr] = useState('');

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  // Automatically calculate Sale Price when Discount % or Price changes
  useEffect(() => {
    if (discountPercent && price) {
      const p = parseFloat(price);
      const d = parseFloat(discountPercent);
      if (!isNaN(p) && !isNaN(d) && d > 0 && d <= 100) {
        setSalePrice((p - (p * d / 100)).toFixed(2));
      }
    } else if (!discountPercent) {
      setSalePrice('');
    }
  }, [discountPercent, price]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== '') {
      setImagesList([...imagesList, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImagesList(imagesList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Parse strings back to arrays
    const sizesArray = sizesStr.split(',').map(s => s.trim()).filter(s => s);
    const colorsArray = colorsStr.split(',').map(c => c.trim()).filter(c => c);

    const payload = {
      id: editingId,
      name,
      price,
      sale_price: salePrice,
      categoryId,
      description,
      images: imagesList,
      sizes: sizesArray,
      colors: colorsArray
    };

    try {
      await saveProduct(payload, editingId ? 'PUT' : 'POST');
      onShowSuccess(editingId ? 'Produto atualizado no WooCommerce!' : 'Produto criado no WooCommerce!');
      setShowForm(false);
      resetForm();
      loadProducts();
    } catch (err) {
      alert("Erro ao salvar produto. Verifique a conexão.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null); 
    setName(''); 
    setPrice(''); 
    setDiscountPercent('');
    setSalePrice('');
    setCategoryId(categories[0]?.id?.toString() || ''); 
    setDescription(''); 
    setImagesList([]);
    setNewImageUrl('');
    setSizesStr('');
    setColorsStr('');
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.oldPrice ? p.oldPrice.toString() : p.price.toString()); // If it has oldPrice, regular price is oldPrice
    setSalePrice(p.sale_price ? p.sale_price.toString() : '');
    
    // Reverse calculate discount percent if there's a sale price
    if (p.oldPrice && p.sale_price) {
      const discount = ((p.oldPrice - p.sale_price) / p.oldPrice) * 100;
      setDiscountPercent(discount.toFixed(0));
    } else {
      setDiscountPercent('');
    }

    setCategoryId(p.categoryId ? p.categoryId.toString() : categories[0]?.id?.toString());
    setDescription(p.description);
    setImagesList(p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []));
    setSizesStr(p.sizes ? p.sizes.join(', ') : '');
    setColorsStr(p.colors ? p.colors.join(', ') : '');
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
              <form id="prodForm" onSubmit={handleSave} className="space-y-8">
                
                <div className="bg-premium-50/50 p-6 rounded-sm border border-premium-100">
                  <h3 className="text-sm font-medium mb-6 uppercase tracking-wider">1. Dados Básicos e Preço (WordPress)</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3"><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Nome do Produto</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" /></div>
                    
                    <div className="col-span-3 md:col-span-1"><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Categoria</label><select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm outline-none bg-white">{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    
                    <div className="col-span-3 md:col-span-2 grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Preço Original</label>
                        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" placeholder="Ex: 100.00" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-accent mb-1 uppercase">Aplicar Desconto (%)</label>
                        <input type="number" step="1" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-full border border-accent px-4 py-2 text-sm focus:ring-1 focus:ring-accent bg-white outline-none" placeholder="Ex: 10" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-green-600 mb-1 uppercase">Preço Final (Venda)</label>
                        <input type="number" step="0.01" value={salePrice} readOnly className="w-full border border-green-200 px-4 py-2 text-sm bg-green-50 outline-none text-green-800 font-bold" placeholder="Automático" />
                      </div>
                    </div>
                    
                    <div className="col-span-3"><label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Descrição Curta</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-premium-200 px-4 py-2 text-sm outline-none focus:border-accent bg-white resize-none" placeholder="Aparece no site..."></textarea></div>
                  </div>
                </div>

                <div className="bg-premium-50/50 p-6 rounded-sm border border-premium-100">
                  <h3 className="text-sm font-medium mb-6 uppercase tracking-wider">2. Variações (Grade do Produto)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Tamanhos Disponíveis</label>
                       <input type="text" value={sizesStr} onChange={e => setSizesStr(e.target.value)} className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" placeholder="P, M, G, GG, 40, 42..." />
                       <span className="text-[10px] text-premium-400 mt-1 block">Separe as opções por vírgula.</span>
                    </div>
                    <div>
                       <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Cores Disponíveis</label>
                       <input type="text" value={colorsStr} onChange={e => setColorsStr(e.target.value)} className="w-full border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" placeholder="Preto, Marrom, Natural..." />
                       <span className="text-[10px] text-premium-400 mt-1 block">Separe as opções por vírgula.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-premium-50/50 p-6 rounded-sm border border-premium-100">
                  <h3 className="text-sm font-medium mb-6 uppercase tracking-wider">3. Gerenciador de Imagens (Galeria)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Adicionar Nova Imagem (URL)</label>
                      <div className="flex gap-2">
                        <input type="text" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="flex-1 border border-premium-200 px-4 py-2 text-sm focus:border-accent bg-white outline-none" placeholder="https://unsplash.com/..." />
                        <button type="button" onClick={handleAddImage} className="bg-premium-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase hover:bg-premium-800">Adicionar</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-6">
                      {imagesList.map((imgUrl, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-sm overflow-hidden border-2 border-premium-200 hover:border-accent transition-colors bg-white">
                          <img src={imgUrl} className="w-full h-full object-cover" alt="Produto" />
                          <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {imagesList.length === 0 && (
                        <div className="col-span-4 text-xs text-premium-400 py-4 flex items-center gap-2"><ImageIcon size={16} /> Nenhuma imagem adicionada na galeria.</div>
                      )}
                    </div>
                  </div>
                </div>

              </form>
            </div>
            <div className="p-6 border-t bg-premium-50 flex justify-end gap-4 shrink-0">
              <button onClick={() => setShowForm(false)} className="text-xs font-bold uppercase px-6 py-2 border rounded-sm bg-white">Cancelar</button>
              <button type="submit" form="prodForm" disabled={saving} className="bg-accent text-white text-xs font-bold uppercase px-8 py-2 shadow-md rounded-sm flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Salvar no WordPress
              </button>
            </div>
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
                  <td className="px-6 py-4 flex items-center gap-4">
                    <span className="text-[10px] font-mono text-premium-400">#{p.id}</span>
                    <div className="w-10 h-12 bg-premium-50 rounded-sm border border-premium-100 shrink-0 overflow-hidden relative">
                      {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="flex h-full items-center justify-center"><ImageIcon size={14} className="text-premium-300"/></div>}
                      {p.images && p.images.length > 1 && <span className="absolute bottom-0 right-0 bg-premium-900 text-white text-[8px] px-1">{p.images.length}</span>}
                    </div>
                    <div>
                      <p className="font-bold">{p.name}</p>
                      {p.sizes && <p className="text-[9px] text-premium-400">Tam: {p.sizes.join(', ')}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase text-[10px] font-bold text-premium-400"><span className="bg-premium-50 px-2 py-1 border border-premium-100 rounded-sm">{p.category}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-accent-dark">R$ {p.sale_price ? p.sale_price.toFixed(2) : p.price.toFixed(2)}</span>
                      {p.sale_price && <span className="text-[10px] line-through text-premium-400">R$ {p.price.toFixed(2)}</span>}
                    </div>
                  </td>
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