export interface Product {
  id: string;
  name: string;
  category: 'hogar' | 'tecnologia';
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isOffer?: boolean;
  sold: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export type Page =
  | 'home'
  | 'catalog'
  | 'product'
  | 'checkout'
  | 'account'
  | 'about'
  | 'contact'
  | 'admin';
