export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address?: ShippingAddress;
  payment_method: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequest {
  shipping_address?: ShippingAddress;
  payment_method?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order_id?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
} 