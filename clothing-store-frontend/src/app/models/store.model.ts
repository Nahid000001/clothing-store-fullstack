// src/app/models/store.model.ts

export interface Store {
  _id: string;
  company_name: string;
  title: string;
  description: string;
  location: string;
  owner: string;
  work_type: string;
  is_remote: boolean;
  average_rating?: number;
  review_count?: number;
  views?: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
  products?: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
  store_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image_url?: string;
}

export interface StoreListResponse {
  stores: Store[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface StoreCreateResponse {
  store: Store;
  message: string;
}

export interface StoreUpdateResponse {
  store: Store;
  message: string;
}

export interface StoreDeleteResponse {
  message: string;
} 