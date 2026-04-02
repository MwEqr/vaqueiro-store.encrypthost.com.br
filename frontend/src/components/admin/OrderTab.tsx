import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Loader2, RefreshCw } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../../services/api';

interface Order {
  id: number;
  status: string;
  total: string;
  date_created: string;
  customer_name: string;
  customer_email: string;
  payment_method: string;
  items: { name: string; quantity: number; total: string }[];
}

export default function OrderTab({ onShowSuccess, refreshTrigger }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      onShowSuccess('Status do pedido atualizado!');
      loadData();
    } catch (err) {
      alert("Erro ao atualizar status. Verifique a conexão.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-premium-100 text-premium-800 border-premium-200';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'Entregue / Concluído';
      case 'processing': return 'Pago / Preparando';
      case 'pending': return 'Pendente (Aguardando Pgto)';
      case 'cancelled': return 'Cancelado';
      case 'refunded': return 'Reembolsado';
      case 'on-hold': return 'Em Espera';
      default: return status;
    }
  };

  if (loading) {
    return <div className="h-full flex flex-col items-center justify-center p-12 text-premium-900"><Loader2 className="w-8 h-8 text-accent animate-spin mb-4"/><p className="font-serif text-lg">Buscando pedidos no WooCommerce...</p></div>;
  }

  return (
    <div className="flex flex-col h-full text-premium-900">
      <div className="p-6 border-b border-premium-100 flex justify-between items-center shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-premium-400" />
          <input type="text" placeholder="Buscar pedidos..." className="w-full pl-10 pr-4 py-2 border border-premium-200 text-sm rounded-sm bg-premium-50 outline-none" />
        </div>
        <div className="flex gap-4">
          <button onClick={loadData} className="p-2 bg-white border border-premium-200 rounded-sm hover:bg-premium-50 transition-colors" title="Atualizar Pedidos">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center text-premium-900">
            <ShoppingBag size={40} className="text-premium-200"/>
            <h3 className="mt-4 font-serif text-lg">Nenhum pedido encontrado.</h3>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-premium-900">
            <thead className="text-[10px] text-premium-500 uppercase bg-premium-50 border-b border-premium-100 sticky top-0 z-10 font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Pedido / Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total / Pagamento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-premium-50 hover:bg-premium-50/50 group transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-accent">#{o.id}</p>
                    <p className="text-[10px] text-premium-500 uppercase mt-1">{new Date(o.date_created).toLocaleDateString('pt-BR')} {new Date(o.date_created).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">{o.customer_name}</p>
                    <p className="text-[10px] text-premium-500">{o.customer_email}</p>
                    <div className="mt-2 text-[10px] text-premium-600 line-clamp-1 max-w-[200px]">
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">R$ {parseFloat(o.total).toFixed(2).replace('.', ',')}</p>
                    <p className="text-[10px] text-premium-500 uppercase mt-1">{o.payment_method || 'Não escolhido'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-sm ${getStatusColor(o.status)}`}>
                      {translateStatus(o.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <select 
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        disabled={updatingId === o.id}
                        className="text-[10px] font-bold uppercase bg-white border border-premium-200 px-2 py-1 outline-none rounded-sm"
                      >
                        <option value="pending">Pendente</option>
                        <option value="processing">Pago/Preparando</option>
                        <option value="completed">Entregue</option>
                        <option value="refunded">Reembolsado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      {updatingId === o.id && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
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