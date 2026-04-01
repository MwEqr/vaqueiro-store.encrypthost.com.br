export const PRODUCTS = [
  {
    id: 1,
    name: 'Bota de Couro Legítimo Pantaneira',
    price: 489.00,
    oldPrice: 599.00,
    category: 'Botas',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviews: 156,
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Pinhão', 'Preto', 'Café'],
    description: 'Bota confeccionada em couro bovino de alta qualidade, solado de borracha antiderrapante e forro interno macio. Ideal para o trabalho pesado ou para o passeio no final de semana.',
    details: {
      material: '100% Couro Bovino',
      forro: 'Couro de Carneiro',
      cuidados: 'Limpar com pano úmido e hidratar o couro periodicamente',
      origem: 'Nacional'
    },
    tag: 'Mais Vendida',
  },
  {
    id: 2,
    name: 'Chapéu de Feltro Premium Pralana',
    price: 329.90,
    oldPrice: 389.90,
    category: 'Chapéus',
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 5.0,
    reviews: 92,
    sizes: ['56', '58', '60'],
    colors: ['Bege', 'Preto', 'Marrom'],
    description: 'Chapéu clássico de feltro com aba larga e acabamento impecável. Resistente à água e com design que nunca sai de moda no mundo sertanejo.',
    details: {
      material: 'Feltro 100% Lã',
      forro: 'Cetim',
      cuidados: 'Escovar com cerdas macias após o uso',
      origem: 'Nacional'
    },
    tag: 'Promoção',
  },
  {
    id: 3,
    name: 'Cinto de Couro com Fivela de Bronze',
    price: 159.90,
    oldPrice: 199.90,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviews: 45,
    sizes: ['85cm', '95cm', '105cm', '115cm'],
    colors: ['Whisky', 'Preto'],
    description: 'Cinto robusto em couro de sola com fivela intercambiável de bronze envelhecido. Detalhes entalhados à mão que conferem exclusividade à peça.',
    details: {
      material: 'Couro de Sola',
      forro: 'N/A',
      cuidados: 'Não molhar a fivela excessivamente',
      origem: 'Artesanal'
    },
    tag: 'Exclusivo',
  },
  {
    id: 4,
    name: 'Calça Jeans Rústica Masculina',
    price: 189.90,
    oldPrice: null,
    category: 'Vestuário',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.7,
    reviews: 210,
    sizes: ['38', '40', '42', '44', '46', '48'],
    colors: ['Azul Indigo', 'Stone Wash'],
    description: 'Calça jeans reforçada com costura tripla e corte reto. Desenvolvida para suportar a rotina do campo sem abrir mão do estilo.',
    details: {
      material: '98% Algodão, 2% Elastano',
      forro: 'N/A',
      cuidados: 'Lavar do avesso para preservar a cor',
      origem: 'Nacional'
    },
  },
  {
    id: 5,
    name: 'Bota Texana Feminina Bordada',
    price: 429.90,
    oldPrice: null,
    category: 'Botas',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviews: 75,
    sizes: ['34', '35', '36', '37', '38', '39'],
    colors: ['Caramelo', 'Branco Off'],
    description: 'Elegância e conforto em uma bota texana com bordados florais detalhados. Salto carrapeta clássico e bico fino.',
    details: {
      material: 'Couro Nobre',
      forro: 'Têxtil Antibacteriano',
      cuidados: 'Usar flanela seca para limpeza',
      origem: 'Nacional'
    },
    tag: 'Tendência'
  },
  {
    id: 6,
    name: 'Fivela de Rodeo Profissional',
    price: 125.90,
    oldPrice: 159.90,
    category: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614165933394-aa6056502213?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.9,
    reviews: 32,
    sizes: ['Único'],
    colors: ['Prata com Dourado'],
    description: 'Fivela comemorativa em liga de metal resistente. Detalhes em alto relevo com imagem de peão e touro, banhada a prata e ouro.',
    details: {
      material: 'Zamac Premium',
      forro: 'N/A',
      cuidados: 'Limpar apenas com pano seco',
      origem: 'Nacional'
    },
    tag: 'Promoção'
  },
  {
    id: 7,
    name: 'Jaqueta de Couro Vaqueiro',
    price: 750.00,
    oldPrice: null,
    category: 'Vestuário',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac50?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520975916090-3105956dac50?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.5,
    reviews: 18,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Marrom Rústico'],
    description: 'Jaqueta de couro legítimo com forro térmico. Alta durabilidade e proteção contra o vento e frio das madrugadas no campo.',
    details: {
      material: 'Couro Bovino 1.2mm',
      forro: 'Poliéster Acolchoado',
      cuidados: 'Guardar em local arejado, nunca em saco plástico',
      origem: 'Nacional'
    }
  },
  {
    id: 8,
    name: 'Camisa Xadrez Flanelada',
    price: 149.90,
    oldPrice: 189.90,
    category: 'Vestuário',
    image: 'https://images.unsplash.com/photo-1588850567047-1845a9ee02f6?q=80&w=2000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1588850567047-1845a9ee02f6?q=80&w=2000&auto=format&fit=crop',
    ],
    rating: 4.8,
    reviews: 110,
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    colors: ['Vermelho/Preto', 'Azul/Branco'],
    description: 'Camisa xadrez em flanela de algodão, macia e quente. Ideal para sobreposições e dias mais frescos.',
    details: {
      material: '100% Algodão',
      forro: 'N/A',
      cuidados: 'Lavar à mão para não dar bolinhas',
      origem: 'Nacional'
    },
    tag: 'Inverno'
  }
];
