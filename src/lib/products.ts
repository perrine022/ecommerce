import { Product, Category } from '@/types/product';

export const categories: Category[] = [
  { id: '1', name: 'Fruits Exotiques', slug: 'fruits-exotiques', description: 'Découvrez nos fruits rares et savoureux' },
  { id: '2', name: 'Épices & Condiments', slug: 'epices-condiments', description: 'Épices du monde entier' },
  { id: '3', name: 'Thés & Infusions', slug: 'thes-infusions', description: 'Thés rares et infusions exotiques' },
  { id: '4', name: 'Chocolats & Confiseries', slug: 'chocolats-confiseries', description: 'Gourmandises exotiques' },
  { id: '5', name: 'Huiles & Vinaigres', slug: 'huiles-vinaigres', description: 'Huiles et vinaigres d\'exception' },
  { id: '6', name: 'Cafés & Boissons', slug: 'cafes-boissons', description: 'Cafés rares et boissons exotiques' },
];

export const products: Product[] = [
  {
    id: '1',
    title: 'Mangue Ataulfo Premium',
    description: 'Mangues Ataulfo du Mexique, douces et crémeuses avec une saveur tropicale exceptionnelle. Récoltées à maturité pour une qualité optimale.',
    price: 24.90,
    originalPrice: 29.90,
    image: 'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
    ],
    category: 'fruits-exotiques',
    inStock: true,
    stock: 15,
    rating: 4.8,
    reviews: 127,
    featured: true,
    origin: 'Mexique',
    weight: '1 kg (4-5 pièces)',
    details: [
      { label: 'Origine', value: 'Mexique' },
      { label: 'Poids', value: '1 kg (4-5 pièces)' },
      { label: 'Conservation', value: 'À température ambiante puis au réfrigérateur' },
      { label: 'Goût', value: 'Doux, crémeux, légèrement sucré' },
    ],
  },
  {
    id: '2',
    title: 'Curry de Madras Authentique',
    description: 'Mélange d\'épices traditionnel du sud de l\'Inde, parfaitement équilibré pour vos plats. Intensité moyenne avec des notes chaudes et aromatiques.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop&q=80',
    ],
    category: 'epices-condiments',
    inStock: true,
    stock: 45,
    rating: 4.9,
    reviews: 89,
    origin: 'Inde',
    weight: '100g',
    details: [
      { label: 'Origine', value: 'Madras, Inde' },
      { label: 'Poids', value: '100g' },
      { label: 'Intensité', value: 'Moyenne' },
      { label: 'Utilisation', value: 'Currys, plats mijotés, légumes' },
    ],
  },
  {
    id: '3',
    title: 'Thé Oolong Formose Premium',
    description: 'Thé oolong de haute qualité de Taïwan, aux notes florales et fruitées. Infusion délicate et parfumée.',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop&q=80',
    ],
    category: 'thes-infusions',
    inStock: true,
    stock: 30,
    rating: 4.7,
    reviews: 156,
    origin: 'Taïwan',
    weight: '100g',
    details: [
      { label: 'Origine', value: 'Taïwan' },
      { label: 'Poids', value: '100g' },
      { label: 'Type', value: 'Oolong semi-fermenté' },
      { label: 'Infusion', value: '3-5 minutes à 85°C' },
    ],
  },
  {
    id: '4',
    title: 'Chocolat Noir 85% Cacao Pérou',
    description: 'Chocolat noir d\'exception avec 85% de cacao du Pérou. Notes de fruits rouges et de noisette.',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4bc98b75?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606312619070-d48b4bc98b75?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606312619070-d48b4bc98b75?w=800&h=600&fit=crop&q=80',
    ],
    category: 'chocolats-confiseries',
    inStock: true,
    stock: 25,
    rating: 4.9,
    reviews: 203,
    origin: 'Pérou',
    weight: '100g',
    details: [
      { label: 'Origine', value: 'Pérou' },
      { label: 'Cacao', value: '85%' },
      { label: 'Poids', value: '100g' },
      { label: 'Goût', value: 'Fruits rouges, noisette' },
    ],
  },
  {
    id: '5',
    title: 'Huile d\'Argan Bio',
    description: 'Huile d\'argan vierge extra, pressée à froid. Idéale pour la cuisine et les soins cosmétiques.',
    price: 22.50,
    image: 'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1605027990121-c0a4233e1e4a?w=800&h=600&fit=crop&q=80',
    ],
    category: 'huiles-vinaigres',
    inStock: true,
    stock: 20,
    rating: 4.8,
    reviews: 94,
    origin: 'Maroc',
    weight: '250ml',
    details: [
      { label: 'Origine', value: 'Maroc' },
      { label: 'Volume', value: '250ml' },
      { label: 'Qualité', value: 'Vierge extra, pressée à froid' },
      { label: 'Usage', value: 'Cuisine et cosmétique' },
    ],
  },
  {
    id: '6',
    title: 'Café Blue Mountain de Jamaïque',
    description: 'Café rare et prestigieux des montagnes bleues de Jamaïque. Saveur douce et équilibrée, sans amertume.',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80',
    ],
    category: 'cafes-boissons',
    inStock: true,
    stock: 12,
    rating: 5.0,
    reviews: 67,
    featured: true,
    origin: 'Jamaïque',
    weight: '250g',
    details: [
      { label: 'Origine', value: 'Blue Mountains, Jamaïque' },
      { label: 'Poids', value: '250g' },
      { label: 'Torréfaction', value: 'Moyenne' },
      { label: 'Goût', value: 'Doux, équilibré, sans amertume' },
    ],
  },
  {
    id: '7',
    title: 'Fruit du Dragon Rouge',
    description: 'Pitaya rouge frais, fruit exotique aux saveurs subtiles entre kiwi et poire. Riche en antioxydants.',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop&q=80',
    ],
    category: 'fruits-exotiques',
    inStock: true,
    stock: 18,
    rating: 4.6,
    reviews: 78,
    origin: 'Vietnam',
    weight: '1 kg (3-4 pièces)',
    details: [
      { label: 'Origine', value: 'Vietnam' },
      { label: 'Poids', value: '1 kg (3-4 pièces)' },
      { label: 'Conservation', value: 'Au réfrigérateur' },
      { label: 'Goût', value: 'Subtil, entre kiwi et poire' },
    ],
  },
  {
    id: '8',
    title: 'Safran d\'Iran Premium',
    description: 'Safran de première qualité, pistils entiers. Le meilleur safran au monde pour vos plats.',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1615485925502-b0f0f8aad8c0?w=800&h=600&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615485925502-b0f0f8aad8c0?w=800&h=600&fit=crop&q=80',
    ],
    category: 'epices-condiments',
    inStock: true,
    stock: 8,
    rating: 5.0,
    reviews: 45,
    origin: 'Iran',
    weight: '1g',
    details: [
      { label: 'Origine', value: 'Iran' },
      { label: 'Poids', value: '1g' },
      { label: 'Qualité', value: 'Premium, pistils entiers' },
      { label: 'Utilisation', value: 'Risottos, plats mijotés, desserts' },
    ],
  },
];

export const getFeaturedProduct = (): Product | undefined => {
  return products.find(p => p.featured) || products[0];
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter(p => p.category === categorySlug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

