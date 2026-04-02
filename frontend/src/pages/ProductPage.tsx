import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Shield, Package, RotateCcw, ShoppingBag, Info, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { fetchProducts } from '../services/api';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth / 2;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        const found = data.find((p: any) => p.id === Number(id));
        if (found) {
          setProduct(found);
          setSelectedSize(found.sizes?.[0] || '');
          setSelectedColor(found.colors?.[0] || '');
          setMainImage(found.image);
        }
      }
      setLoading(false);
    };
    getProduct();
  }, [id]);

  const handleAddToCart = () => {
    if(product) addToCart(product, selectedSize, selectedColor, quantity);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-premium-50">Carregando detalhes do produto...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-premium-50"><p className="font-serif text-xl text-premium-900 mb-4">Produto não encontrado.</p><Link to="/" className="text-accent underline">Voltar para a Home</Link></div>;
  }

  return (
    <div className="bg-premium-50 min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs md:text-sm text-premium-500 mb-8 flex items-center space-x-2 tracking-wide"
        >
           <Link to="/" className="hover:text-accent-dark transition-colors">Home</Link>
           <span>/</span>
           <span className="hover:text-accent-dark transition-colors cursor-pointer">{product.category}</span>
           <span>/</span>
           <span className="text-premium-900 font-medium truncate">{product.name}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
           
           {/* Image Gallery */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut" }}
             className="space-y-4"
           >
              <div className="aspect-[4/5] md:aspect-square rounded-sm overflow-hidden bg-white shadow-sm">
                 <motion.img 
                   key={mainImage}
                   initial={{ opacity: 0.5 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.3 }}
                   src={mainImage} 
                   alt={product.name} 
                   className="w-full h-full object-cover object-center" 
                 />
              </div>
              <div className="relative group flex items-center">
                 {product.images?.length > 3 && (
                   <button 
                     onClick={() => scrollThumbnails('left')}
                     className="absolute -left-3 z-10 bg-white shadow-md border border-premium-200 rounded-full p-1.5 text-premium-600 hover:text-premium-900 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <ChevronLeft size={20} />
                   </button>
                 )}
                 <div 
                   ref={scrollRef}
                   className="flex flex-nowrap gap-4 overflow-x-auto pb-2 scroll-smooth w-full"
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                 >
                    {product.images.map((img: string, i: number) => (
                      <button 
                        key={i} 
                        onClick={() => setMainImage(img)}
                        className={`aspect-square w-20 md:w-24 shrink-0 rounded-sm border-2 overflow-hidden transition-all ${mainImage === img ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                         <img src={img} alt={`Miniatura ${i+1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                 </div>
                 {product.images?.length > 3 && (
                   <button 
                     onClick={() => scrollThumbnails('right')}
                     className="absolute -right-3 z-10 bg-white shadow-md border border-premium-200 rounded-full p-1.5 text-premium-600 hover:text-premium-900 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <ChevronRight size={20} />
                   </button>
                 )}
              </div>
           </motion.div>

           {/* Info Area */}
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
             className="flex flex-col pt-2"
           >
              <div className="mb-6">
                 {/* Back Button now placed exactly above the product description details */}
                 <button 
                   onClick={() => navigate(-1)}
                   className="flex items-center text-sm font-medium text-premium-600 hover:text-premium-900 transition-colors mb-6"
                 >
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Voltar
                 </button>

                 <div className="flex items-center space-x-2 text-accent-dark mb-4">
                    <div className="flex">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-current" : "opacity-30"} />
                       ))}
                    </div>
                    <span className="text-xs font-medium text-premium-600">({product.reviews} avaliações)</span>
                 </div>
                 
                 <h1 className="text-3xl md:text-4xl font-serif text-premium-900 mb-4">{product.name}</h1>
                 
                 <div className="flex items-baseline space-x-4 mb-6">
                    <span className="text-3xl font-semibold text-premium-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-premium-400 line-through">
                        R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                 </div>
                 
                 <p className="text-premium-600 font-light leading-relaxed mb-8">
                   {product.description}
                 </p>
              </div>

              {/* Variations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="space-y-8 mb-10 border-t border-b border-premium-200 py-8"
              >
                 
                 {/* Colors */}
                 {product.colors && product.colors.length > 0 && (
                 <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-medium text-premium-800 uppercase tracking-widest">Cor selecionada</h3>
                      <span className="text-xs text-premium-600">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {product.colors.map((color: string) => (
                         <button
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={`px-6 py-2.5 border text-xs font-medium uppercase tracking-wider transition-all rounded-sm ${
                             selectedColor === color 
                             ? 'border-premium-900 bg-premium-900 text-white' 
                             : 'border-premium-200 text-premium-600 hover:border-premium-400'
                           }`}
                         >
                            {color}
                         </button>
                       ))}
                    </div>
                 </div>
                 )}

                 {/* Sizes */}
                 {product.sizes && product.sizes.length > 0 && (
                 <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-medium text-premium-800 uppercase tracking-widest">Tamanho</h3>
                      <button className="text-xs text-accent hover:underline flex items-center gap-1">
                        <Info size={14}/> Guia de Medidas
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {product.sizes.map((size: string) => (
                         <button
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`h-12 w-16 border flex items-center justify-center font-medium transition-all rounded-sm ${
                             selectedSize === size 
                             ? 'border-premium-900 bg-premium-900 text-white' 
                             : 'border-premium-200 text-premium-600 hover:border-premium-400'
                           }`}
                         >
                            {size}
                         </button>
                       ))}
                    </div>
                 </div>
                 )}

                 {/* Quantity */}
                 <div>
                    <h3 className="text-xs font-medium text-premium-800 uppercase tracking-widest mb-3">Quantidade</h3>
                    <div className="flex items-center border border-premium-200 rounded-sm w-max h-12 bg-white">
                       <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-5 text-premium-600 hover:text-premium-900 h-full transition-colors">-</button>
                       <span className="w-10 text-center font-medium text-premium-900">{quantity}</span>
                       <button onClick={() => setQuantity(q => q+1)} className="px-5 text-premium-600 hover:text-premium-900 h-full transition-colors">+</button>
                    </div>
                 </div>
              </motion.div>

              {/* Buy Button */}
              <button 
                onClick={handleAddToCart}
                className="w-full bg-premium-900 text-white py-5 font-medium tracking-widest uppercase text-sm hover:bg-premium-800 transition-all flex items-center justify-center space-x-3 mb-8 shadow-xl active:scale-[0.98]"
              >
                 <ShoppingBag size={20} />
                 <span>Adicionar à Sacola</span>
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-sm border border-premium-100">
                 <div className="flex flex-col items-center text-center space-y-2">
                    <Package className="text-accent" size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-premium-900">Embalagem Segura</span>
                 </div>
                 <div className="flex flex-col items-center text-center space-y-2 border-l border-r border-premium-100 px-2">
                    <RotateCcw className="text-accent" size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-premium-900">Reembolso em até 7 dias</span>
                 </div>
                 <div className="flex flex-col items-center text-center space-y-2">
                    <Shield className="text-accent" size={24} strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-premium-900">Compra Segura</span>
                 </div>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
