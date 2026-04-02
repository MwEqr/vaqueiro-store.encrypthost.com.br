import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-premium-900 text-premium-100 py-16 border-t border-premium-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-serif text-white mb-4">
              <img src="/logo.jpeg" alt="Vaqueiro Store" className="h-12 w-auto object-contain" />
            </h3>
            <p className="text-premium-400 text-sm leading-relaxed mb-6">
              Tradição e qualidade em artigos sertanejos. Do campo para você, oferecemos o melhor da moda country com a resistência que você precisa.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-premium-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-wider text-sm mb-4">Loja</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Botas</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Chapéus</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Acessórios</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Vestuário</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-wider text-sm mb-4">Ajuda</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Atendimento</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="#" className="text-premium-400 hover:text-white transition-colors text-sm">Dúvidas Frequentes</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-wider text-sm mb-4">Newsletter</h4>
            <p className="text-premium-400 text-sm mb-4">Receba novidades e promoções exclusivas.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="bg-premium-800 text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-accent-dark text-sm placeholder:text-premium-500"
              />
              <button type="submit" className="bg-accent-dark hover:bg-accent text-white px-4 py-2 text-sm font-medium transition-colors">
                Assinar
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-premium-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-premium-500">
          <p>© 2026 Vaqueiro Store. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0">Tradição em cada detalhe.</p>
        </div>
      </div>
    </footer>
  );
}
