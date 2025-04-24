import { Product } from './product.model';

export interface CartItem {
  _id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  updated_at: string;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  item_id?: string;
} 