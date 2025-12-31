export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  inStock: boolean;
  stock?: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  details?: ProductDetail[];
  origin?: string;
  weight?: string;
  dimensions?: string;
}

export interface ProductDetail {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  sellsyId?: number; // ID numérique Sellsy pour le filtrage
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number | null; // ID du parent pour la hiérarchie
}

export interface CartItem {
  product: Product;
  quantity: number;
}




