import { useState, useEffect } from 'react';
import { Ticket, Search, Plus, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { fetchCoupons, saveCoupon } from '../../services/api';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: string;
  active: boolean;
  date_expires: string;
  minimum_amount: number;
  usage_limit: number | null;
}

export default function CouponTab({ onShowSuccess, onDeleteRequest }: any) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [type, setType] = useState('percent');
  const [dateExpires, setDateExpires] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchCoupons();
    setCoupons(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      id: editingId,
      code: name,
      discount: parseFloat(discount),
      type: type,
      date_expires: dateExpires,
      minimum_amount: parseFloat(minAmount) || 0,
      usage_limit: parseInt(usageLimit) || null
    };

    try {
      await saveCoupon(payload, editingId ? 'PUT' : 'POST');
      onShowSuccess(editingId ? 'Cupom atualizado no WooCommerce!' : 'Cupom criado no WooCommerce!');
      setShowForm(false);
      resetForm();
      loadData();
    } catch (err) {
      alert("Erro ao salvar cupom. Verifique a conexão com o WooCommerce.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setDiscount(''); setType('percent');
    setDateExpires(''); setMinAmount(''); setUsageLimit('');
  };

  const openEdit = (c: Coupon) => {
    setEditingId(c.id); 
    setName(c.code); 
    setDiscount(c.discount.toString()); 
    setType(c.type);
    setDateExpires(c.date_expires ? c.date_expires.substring(0, 10) : '');
    setMinAmount(c.minimum_amount ? c.minimum_amount.toString() : '');
    setUsageLimit(c.usage_limit ? c.usage_limit.toString() : '');
    setShowForm(true);
  };

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center p-12 text-premium-900"><Loader2 className="w-8 h-8 text-accent animate-spin mb-4"/><p className="font-serif text-lg">Buscando cupons no WooCommerce...</p></div>;
  }

  return (
    <div className="flex flex-col h-full text-premium-900">
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-premium-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-3xl my-8 p-8 rounded-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-premium-900">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-premium-100">
              <h2 className="text-xl font-serif">{editingId ? 'Editar' : 'Novo'} Cupom</h2>
              <button onClick={() => setShowForm(false)} className="text-premium-400 hover:text-premium-900"><X size={24}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="grid grid-cols-2 gap-6 bg-premium-50/50 p-6 border border-premium-100 rounded-sm">
                <h3 className="col-span-2 text-xs font-bold uppercase tracking-wider text-premium-600 mb-2">Dados Básicos</h3>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Código do Cupom</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent uppercase outline-none bg-white" placeholder="EX: NATAL10" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Tipo de Desconto</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-premium-200 px-4 py-2.5 text-sm outline-none bg-white">
                    <option value="percent">Porcentagem (%)</option>
                    <option value="fixed_cart">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Valor do Desconto</label>
                  <input type="number" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)} required className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent outline-none bg-white" placeholder={type === 'percent' ? 'Ex: 10' : 'Ex: 50.00'} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-premium-50/50 p-6 border border-premium-100 rounded-sm">
                <h3 className="col-span-2 text-xs font-bold uppercase tracking-wider text-premium-600 mb-2">Regras de Uso</h3>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Data de Vencimento</label>
                  <input type="date" value={dateExpires} onChange={e => setDateExpires(e.target.value)} className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent outline-none bg-white" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Gasto Mínimo (R$)</label>
                  <input type="number" step="0.01" value={minAmount} onChange={e => setMinAmount(e.target.value)} className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent outline-none bg-white" placeholder="Ex: 100.00" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold text-premium-500 mb-1 uppercase">Máximo de Usos</label>
                  <input type="number" value={usageLimit} onChange={e => setUsageLimit(e.target.value)} className="w-full border border-premium-200 px-4 py-2.5 text-sm focus:border-accent outline-none bg-white" placeholder="Deixe em branco para ilimitado" />
                </div>
              </div>

              <div className="pt-6 border-t border-premium-100 flex gap-4 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="bg-white border border-premium-200 text-premium-700 px-8 py-2 text-xs font-bold uppercase rounded-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="bg-premium-900 text-white px-8 py-2 text-xs font-bold uppercase rounded-sm shadow-md flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Salvar no WordPress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-premium-100 flex justify-between items-center shrink-0">
        <div className="relative w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-400" /><input type="text" placeholder="Buscar cupons no WordPress..." className="w-full pl-10 pr-4 py-2 border border-premium-200 text-sm rounded-sm bg-premium-50 outline-none" /></div>
        <div className="flex gap-4">
          <button onClick={loadData} className="p-2 bg-white border border-premium-200 rounded-sm hover:bg-premium-50 transition-colors"><Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-premium-900 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-bold uppercase rounded-sm shadow-md"><Plus size={16} /> Novo Cupom</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {coupons.length === 0 ? (<div className="h-full flex flex-col items-center justify-center p-12 text-center text-premium-900"><Ticket size={40} className="text-premium-200"/><h3 className="mt-4 font-serif text-lg">Sem cupons no WooCommerce</h3></div>) : (
          <table className="w-full text-left text-sm text-premium-900">
            <thead className="text-[10px] text-premium-500 uppercase bg-premium-50 border-b border-premium-100 sticky top-0 z-10 font-bold tracking-widest uppercase"><tr><th className="px-6 py-4">Código</th><th className="px-6 py-4">Desconto</th><th className="px-6 py-4">Tipo</th><th className="px-6 py-4">Vencimento</th><th className="px-6 py-4 text-right">Ações</th></tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-b border-premium-50 hover:bg-premium-50/50 group transition-colors">
                  <td className="px-6 py-4 font-bold tracking-widest uppercase">{c.code}</td>
                  <td className="px-6 py-4 text-accent font-bold">{c.discount}{c.type === 'percent' ? '%' : ' FIXO'}</td>
                  <td className="px-6 py-4 text-premium-500 uppercase text-[10px]">{c.type === 'percent' ? 'Percentual' : 'Valor Fixo'}</td>
                  <td className="px-6 py-4 text-premium-500 text-[10px]">{c.date_expires ? new Date(c.date_expires).toLocaleDateString('pt-BR') : 'Sem validade'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-2 bg-premium-50 text-premium-600 hover:bg-premium-900 hover:text-white transition-all rounded-sm border border-premium-100" title="Editar">
                        <Edit size={16}/>
                      </button>
                      <button onClick={() => onDeleteRequest('coupon', c.id, c.code)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-sm border border-red-100" title="Excluir">
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