import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cart, CartResponse, AddToCartRequest, UpdateCartRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/cart`;
  
  // BehaviorSubject to track cart item count
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  
  constructor(private http: HttpClient) {
    // Initialize cart item count
    this.getCart().subscribe(
      cart => this.cartItemCount.next(cart.item_count),
      error => console.error('Error loading cart:', error)
    );
  }
  
  /**
   * Get current cart
   */
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/view`)
      .pipe(
        tap(cart => this.cartItemCount.next(cart.item_count))
      );
  }
  
  /**
   * Add item to cart
   * @param productId Product ID
   * @param quantity Quantity to add
   */
  addToCart(productId: string, quantity: number = 1): Observable<CartResponse> {
    const request: AddToCartRequest = { product_id: productId, quantity };
    return this.http.post<CartResponse>(`${this.apiUrl}/add`, request)
      .pipe(
        tap(() => {
          // Update cart count after adding item
          this.refreshCartCount();
        })
      );
  }
  
  /**
   * Update cart item quantity
   * @param itemId Cart item ID
   * @param quantity New quantity
   */
  updateItemQuantity(itemId: string, quantity: number): Observable<CartResponse> {
    const request: UpdateCartRequest = { quantity };
    return this.http.put<CartResponse>(`${this.apiUrl}/update/${itemId}`, request)
      .pipe(
        tap(() => {
          // Update cart count after updating item
          this.refreshCartCount();
        })
      );
  }
  
  /**
   * Remove item from cart
   * @param itemId Cart item ID
   */
  removeItem(itemId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/remove/${itemId}`)
      .pipe(
        tap(() => {
          // Update cart count after removing item
          this.refreshCartCount();
        })
      );
  }
  
  /**
   * Checkout cart and create order
   * @param shippingAddress Optional shipping address
   * @param paymentMethod Optional payment method
   */
  checkout(shippingAddress?: any, paymentMethod: string = 'credit_card'): Observable<CartResponse> {
    const request = {
      shipping_address: shippingAddress,
      payment_method: paymentMethod
    };
    return this.http.post<CartResponse>(`${this.apiUrl}/checkout`, request)
      .pipe(
        tap(() => {
          // Reset cart count after checkout
          this.cartItemCount.next(0);
        })
      );
  }
  
  /**
   * Refresh cart item count
   */
  private refreshCartCount(): void {
    this.getCart().subscribe(
      cart => this.cartItemCount.next(cart.item_count),
      error => console.error('Error refreshing cart:', error)
    );
  }
} 