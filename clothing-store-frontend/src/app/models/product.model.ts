export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  store_id: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
} 