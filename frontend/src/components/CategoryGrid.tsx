import { 
  Footprints, 
  Shirt, 
  Tag, 
  Sparkles, 
  Pocket, 
  ShoppingBag, 
  Link as LinkIcon,
  Star
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Botas', icon: Footprints },
  { name: 'Chapéus', icon: Sparkles },
  { name: 'Cintos', icon: LinkIcon },
  { name: 'Calças', icon: Pocket },
  { name: 'Camisas', icon: Shirt },
  { name: 'Fivelas', icon: Star },
  { name: 'Acessórios', icon: ShoppingBag },
  { name: 'Ofertas', icon: Tag },
];

export default function CategoryGrid() {
  return (
    <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-serif text-premium-900 uppercase tracking-widest relative inline-block">
          Compre por Categoria
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-accent"></span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
        {CATEGORIES.map((cat, i) => (
          <div 
            key={i} 
            className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-premium-100 flex flex-col items-center justify-center hover:shadow-xl hover:border-accent-light transition-all duration-300 cursor-pointer group hover:-translate-y-1.5"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-premium-50 rounded-full mb-4 group-hover:bg-accent transition-all duration-500 flex items-center justify-center group-hover:scale-110">
              <cat.icon className="text-premium-400 group-hover:text-white transition-colors" strokeWidth={1.5} size={26} />
            </div>
            <span className="text-xs md:text-sm font-medium text-premium-800 uppercase tracking-wider text-center group-hover:text-accent-dark transition-colors">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
