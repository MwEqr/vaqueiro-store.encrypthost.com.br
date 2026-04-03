import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative bg-premium-900 min-h-[75vh] flex items-center overflow-hidden">
      {/* Background Image placed beautifully */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://imgs.search.brave.com/2aLzV2cD-PcO4b5DfWovIHMmU3mHRHiBqydZ8XaHvQo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YXRhcmRlLmNvbS5i/ci9pbWcvQXJ0aWdv/LURlc3RhcXVlLzEz/NzAwMDAvMTIwMHg3/MjAvRXN0YXMtcGVj/YXMtZGUtY291cm8t/c2FsdmFtLXZhcXVl/aXJvcy10b2Rvcy1v/cy1kaWEwMTM3MDY4/NzAwMjAyNTEyMDEx/NTM0LVNjYWxlRG93/blByb3BvcnRpb25h/bC53ZWJwP2ZhbGxi/YWNrPWh0dHBzOi8v/Y2RuLmF0YXJkZS5j/b20uYnIvaW1nL0Fy/dGlnby1EZXN0YXF1/ZS8xMzcwMDAwL0Vz/dGFzLXBlY2FzLWRl/LWNvdXJvLXNhbHZh/bS12YXF1ZWlyb3Mt/dG9kb3Mtb3MtZGlh/MDEzNzA2ODcwMDIw/MjUxMjAxMTUzNC5q/cGc_eGlkPTY5MDc0/ODQmcmVzaXplPTEw/MDAlMkM1MDAmdD0x/NzczOTgwOTE2Jnhp/ZD02OTA3NDg0"
          alt="Vaqueiro Store - Estilo e Tradição"
          className="w-full h-full object-cover object-center opacity-70"
        />
        {/* Stronger gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      </div>

      {/* Content Aligned to Left */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl text-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-12 bg-accent"></span>
            <span className="text-accent-light font-medium tracking-widest uppercase text-xs md:text-sm">
              Coleção Tradição 2026
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight">
            Força e Estilo no <br />
            <span className="italic font-light text-accent-light">Coração do Campo</span>
          </h1>
          
          <p className="text-lg text-premium-200 mb-10 font-light leading-relaxed max-w-lg">
            Explore nossa seleção exclusiva de artigos para o verdadeiro vaqueiro. 
            Produtos em couro legítimo que combinam durabilidade bruta e design rústico.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/colecao" className="bg-accent text-white px-8 py-4 hover:bg-accent-dark transition-colors font-medium tracking-wide text-sm shadow-lg shadow-accent/20 text-center">
              Explorar Coleção
            </Link>
            <Link to="/promocoes" className="bg-transparent text-white px-8 py-4 border border-premium-200 hover:border-accent hover:text-accent transition-all font-medium tracking-wide text-sm backdrop-blur-sm text-center">
              Ver Ofertas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
