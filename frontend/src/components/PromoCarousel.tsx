import { useState, useEffect } from 'react';
import { Clock, Loader2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';

export default function PromoCarousel() {
  const [promoProducts, setPromoProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromos = async () => {
      setLoading(true);
      const data = await fetchProducts();
      if (data && data.length > 0) {
        // Filtra apenas produtos que têm preço antigo (promoção)
        const filtered = data.filter((p: any) => p.oldPrice).map((p: any) => ({
          ...p,
          tag: `-${Math.round((1 - p.price / p.oldPrice!) * 100)}%`
        }));
        setPromoProducts(filtered);
      }
      setLoading(false);
    };
    loadPromos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
        <p className="text-premium-500 font-serif">Buscando ofertas...</p>
      </div>
    );
  }

  if (promoProducts.length === 0) {
    return (
      <section id="ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <div className="flex items-center justify-between mb-10 border-b border-premium-200 pb-4">
          <div className="flex items-center space-x-3">
            <Clock className="text-premium-400" size={28} />
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-premium-900 uppercase tracking-widest">
              Ofertas <span className="italic font-light text-premium-400">Especiais</span>
            </h2>
          </div>
        </div>
        <div className="bg-white border border-premium-100 rounded-sm p-12 text-center shadow-sm">
          <Tag className="w-12 h-12 text-premium-200 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-premium-900 mb-2">Nenhuma oferta no momento</h3>
          <p className="text-premium-500">Fique de olho! Em breve teremos novos produtos com descontos especiais para você.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <div className="flex items-center justify-between mb-10 border-b border-premium-200 pb-4">
        <div className="flex items-center space-x-3">
          <Clock className="text-accent animate-pulse" size={28} />
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-premium-900 uppercase tracking-widest">
            Ofertas <span className="italic font-light text-accent-dark">Especiais</span>
          </h2>
        </div>
        <Link to="/promocoes" className="text-premium-800 font-medium hover:text-accent-dark hover:underline transition-colors text-sm uppercase tracking-wider">
          Ver todas
        </Link>
      </div>
      
      {/* Swiper Carousel for Infinite Autoplay & Manual Swiping */}
      <div className="-mx-4 sm:mx-0 px-4 sm:px-0">
        <Swiper
          modules={[Autoplay, FreeMode]}
          spaceBetween={24}
          slidesPerView={'auto'}
          freeMode={true}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="pb-8 promo-swiper"
        >
          {promoProducts.map((product) => (
            <SwiperSlide key={product.id} className="!w-[260px] md:!w-[280px]">
              <Link 
                to={`/product/${product.id}`} 
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-[320px] md:h-[360px] w-full overflow-hidden bg-premium-100 mb-4 rounded-sm flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-accent text-white shadow-md">
                      {product.tag}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="text-base font-medium text-premium-900 group-hover:text-accent-dark transition-colors truncate">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-accent-dark font-bold">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.oldPrice && (
                      <span className="text-premium-400 line-through text-sm">
                        R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
