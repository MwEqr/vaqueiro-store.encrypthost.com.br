import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import PromoCarousel from '../components/PromoCarousel';
import FeatureSection from '../components/FeatureSection';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <main className="flex-grow bg-premium-50 pb-16">
      <Hero />
      <CategoryGrid />
      <PromoCarousel />
      <FeatureSection />
      
      <section id="lancamentos" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-premium-900 mb-4 uppercase tracking-widest">Lançamentos</h2>
          <div className="h-0.5 w-12 bg-accent mx-auto mb-6"></div>
        </div>
        <ProductGrid />
      </section>
    </main>
  );
}
