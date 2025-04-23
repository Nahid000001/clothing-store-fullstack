import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, timeout, retry, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from './error.service';
import { Product } from '../models/store.model';

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ProductResponse {
  product: Product;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [];
  
  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) {
    // Initialize mock products
    this.mockProducts = this.getDummyProducts(30);
  }

  getAllProducts(page: number = 1, limit: number = 10, storeId?: string): Observable<ProductListResponse> {
    console.log(`Fetching mock products (page ${page}, limit ${limit})`);
    
    let filteredProducts = [...this.mockProducts];
    
    // Filter by store if needed
    if (storeId) {
      filteredProducts = filteredProducts.filter(p => p.store_id === storeId);
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredProducts.length / limit);
    
    const response: ProductListResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page: page,
      limit: limit,
      total_pages: totalPages
    };
    
    // Return as observable
    return of(response);
  }

  getProductById(id: string): Observable<Product> {
    console.log(`Fetching mock product with ID: ${id}`);
    
    const product = this.mockProducts.find(p => p._id === id);
    
    if (product) {
      return of(product);
    } else {
      return throwError(() => ({ 
        status: 404, 
        message: 'Product not found'
      }));
    }
  }

  getProductsByStoreId(storeId: string, page: number = 1, limit: number = 10): Observable<ProductListResponse> {
    console.log(`Fetching mock products for store ID: ${storeId}`);
    
    // Filter products by store ID
    const storeProducts = this.mockProducts.filter(p => p.store_id === storeId);
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = storeProducts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(storeProducts.length / limit);
    
    const response: ProductListResponse = {
      products: paginatedProducts,
      total: storeProducts.length,
      page: page,
      limit: limit,
      total_pages: totalPages
    };
    
    return of(response);
  }

  createProduct(productData: Partial<Product>): Observable<ProductResponse> {
    console.log('Creating new mock product:', productData);
    
    // Generate an ID and add timestamps
    const newProduct: Product = {
      _id: 'product_' + Date.now(),
      name: productData.name || 'Unnamed Product',
      description: productData.description || 'No description',
      price: productData.price || 0,
      category: productData.category || 'Uncategorized',
      image_url: productData.image_url || 'https://source.unsplash.com/300x300/?clothing',
      stock: productData.stock || 0,
      sizes: productData.sizes || [],
      colors: productData.colors || [],
      store_id: productData.store_id || 'store1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to mock products
    this.mockProducts.unshift(newProduct);
    
    return of({
      product: newProduct,
      message: 'Product created successfully'
    });
  }

  updateProduct(id: string, productData: Partial<Product>): Observable<ProductResponse> {
    console.log(`Updating mock product ${id}:`, productData);
    
    const index = this.mockProducts.findIndex(p => p._id === id);
    
    if (index === -1) {
      return throwError(() => ({ 
        status: 404, 
        message: 'Product not found'
      }));
    }
    
    // Update the product
    this.mockProducts[index] = {
      ...this.mockProducts[index],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    return of({
      product: this.mockProducts[index],
      message: 'Product updated successfully'
    });
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    console.log(`Deleting mock product ${id}`);
    
    const index = this.mockProducts.findIndex(p => p._id === id);
    
    if (index === -1) {
      return throwError(() => ({ 
        status: 404, 
        message: 'Product not found'
      }));
    }
    
    // Remove the product
    this.mockProducts.splice(index, 1);
    
    return of({
      message: 'Product deleted successfully'
    });
  }

  // Helper method for getting dummy products
  getDummyProducts(count: number = 8, storeId: string = 'dummy1'): Product[] {
    const categories = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes', 'Jackets'];
    const names = [
      'Classic Cotton T-Shirt', 'Slim Fit Jeans', 'Summer Floral Dress', 
      'Leather Belt', 'Running Sneakers', 'Denim Jacket',
      'V-Neck Sweater', 'Casual Chinos', 'Maxi Skirt', 
      'Silver Necklace', 'Leather Boots', 'Wool Peacoat',
      'Button-Down Shirt', 'Cargo Shorts', 'Evening Gown',
      'Woven Bracelet', 'Canvas Shoes', 'Bomber Jacket'
    ];
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange'];
    
    const products: Product[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomPrice = (10 + Math.random() * 90).toFixed(2);
      const randomStock = Math.floor(Math.random() * 100);
      
      const productSizes = sizes.slice(0, 3 + Math.floor(Math.random() * 4));
      const productColors = colors.slice(0, 2 + Math.floor(Math.random() * 4));
      
      products.push({
        _id: `product${i}`,
        name: randomName,
        description: `High-quality ${randomName.toLowerCase()} perfect for any occasion. Made with premium materials for comfort and durability.`,
        price: parseFloat(randomPrice),
        category: randomCategory,
        image_url: `https://source.unsplash.com/300x300/?${randomCategory.toLowerCase()},clothing`,
        stock: randomStock,
        sizes: productSizes,
        colors: productColors,
        store_id: storeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return products;
  }
} 