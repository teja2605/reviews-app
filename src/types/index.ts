
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    name: string | null;
    email: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
