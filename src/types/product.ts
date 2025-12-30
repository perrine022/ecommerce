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
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}



