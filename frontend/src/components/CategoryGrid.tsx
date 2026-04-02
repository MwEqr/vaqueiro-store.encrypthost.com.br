import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footprints, Shirt, Tag, Crown, Scissors, ShoppingBag, Link as LinkIcon, Star, Loader2 } from 'lucide-react';
import { fetchCategories } from '../services/api';

const ICONS: Record<string, any> = {
  'botas': Footprints,
  'bota': Footprints,
  'chapéus': Crown,
  'chapeus': Crown,
  'chapeu': Crown,
  'boné': Crown,
  'bonés': Crown,
  'cintos': LinkIcon,
  'cinto': LinkIcon,
  'calças': Scissors,
  'calcas': Scissors,
  'calça': Scissors,
  'camisas': Shirt,
  'camisa': Shirt,
  'fivelas': Star,
  'fivela': Star,
  'acessórios': ShoppingBag,
  'acessorios': ShoppingBag,
  'ofertas': Tag,
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCats = async () => {
      setLoading(true);
      const data = await fetchCategories();
      // Filtra para remover categorias vazias ou internas do sistema (se houver) e pega as 8 primeiras para a tela inicial
      const validCats = data.filter((c: any) => c.name !== 'Sem categoria' && c.name !== 'Uncategorized').slice(0, 8);
      setCategories(validCats);
      setLoading(false);
    };
    loadCats();
  }, []);

  return (
    <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-premium-900 uppercase tracking-widest relative inline-block">
          Compre por Categoria
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent"></span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((cat, i) => {
            // Tenta achar um ícone pelo nome, se não achar usa a sacola de compras genérica
            const Icon = ICONS[cat.name.toLowerCase()] || ShoppingBag;
            return (
              <div 
                key={cat.id || i} 
                onClick={() => navigate(`/colecao?categoria=${encodeURIComponent(cat.name)}`)}
                className="w-[calc(50%-8px)] sm:w-[calc(25%-12px)] lg:w-[140px] bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-premium-100 flex flex-col items-center justify-center hover:shadow-xl hover:border-accent-light transition-all duration-300 cursor-pointer group hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-premium-50 rounded-full mb-4 group-hover:bg-accent transition-all duration-500 flex items-center justify-center group-hover:scale-110">
                  <Icon className="text-premium-400 group-hover:text-white transition-colors" strokeWidth={1.5} size={26} />
                </div>
                <span className="text-xs md:text-sm font-medium text-premium-800 uppercase tracking-wider text-center group-hover:text-accent-dark transition-colors">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}