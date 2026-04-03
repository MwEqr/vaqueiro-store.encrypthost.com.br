import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function CollectionPage() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('categoria');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      let filtered = data || [];
      
      // Aplica o filtro caso exista a categoria na URL (ex: ?categoria=Botas)
      if (categoryFilter) {
        filtered = filtered.filter((p: any) => p.category.toLowerCase() === categoryFilter.toLowerCase());
      }
      
      setProducts(filtered);
      setLoading(false);
    };
    getProducts();
  }, [categoryFilter]);

  return (
    <div className="bg-premium-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-serif text-premium-900 mb-4 text-accent-dark capitalize">
            {categoryFilter ? `Coleção: ${categoryFilter}` : 'Coleção Completa'}
          </h1>
          <div className="h-0.5 w-12 bg-accent mx-auto mb-6"></div>
          <p className="text-premium-600 max-w-2xl mx-auto">
            {categoryFilter 
              ? `Explorando nossa seleção especial de ${categoryFilter.toLowerCase()}.` 
              : 'Explore nossa seleção exclusiva de artigos para o verdadeiro vaqueiro. Tradição e resistência em cada detalhe.'
            }
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-premium-500">Sincronizando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-premium-500 text-lg">Nenhum produto encontrado no catálogo.</p>
          </div>
        ) : (
          /* Grid de Produtos */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <motion.div variants={itemVariants} key={product.id} className="group flex flex-col relative">
                
                {/* Tags */}
                {product.tag && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 shadow-sm ${
                      product.tag === 'Promoção' || product.tag.includes('%') ? 'bg-accent text-white' : 'bg-premium-900 text-white'
                    }`}>
                      {product.tag}
                    </span>
                  </div>
                )}

                {/* Image Container */}
                <Link to={`/product/${product.id}`} className="relative h-[360px] w-full overflow-hidden bg-premium-100 mb-4 rounded-sm block flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-premium-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Natural', 1);
                      }} 
                      className="bg-white p-3.5 rounded-full text-premium-900 hover:bg-accent hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                      title="Adicionar à Sacola"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <div className="flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-base font-medium text-premium-900 hover:text-accent-dark transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-premium-900 font-semibold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.oldPrice && (
                      <span className="text-premium-400 line-through text-sm">
                        R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
