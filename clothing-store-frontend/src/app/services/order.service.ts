import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderResponse, UpdateOrderStatusRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = `${environment.apiUrl}/orders`;
  
  constructor(private http: HttpClient) { }
  
  /**
   * Get all orders (admin only)
   */
  getAllOrders(): Observable<{ orders: Order[] }> {
    return this.http.get<{ orders: Order[] }>(this.apiUrl);
  }
  
  /**
   * Get current user's orders
   */
  getMyOrders(): Observable<{ orders: Order[] }> {
    return this.http.get<{ orders: Order[] }>(`${this.apiUrl}/my`);
  }
  
  /**
   * Get a specific order by ID
   * @param orderId Order ID
   */
  getOrderById(orderId: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiUrl}/${orderId}`);
  }
  
  /**
   * Update order status (admin only)
   * @param orderId Order ID
   * @param status New status
   */
  updateOrderStatus(orderId: string, status: string): Observable<OrderResponse> {
    const request: UpdateOrderStatusRequest = { 
      status: status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' 
    };
    return this.http.put<OrderResponse>(`${this.apiUrl}/${orderId}`, request);
  }
  
  /**
   * Cancel an order
   * @param orderId Order ID
   */
  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.http.delete<OrderResponse>(`${this.apiUrl}/${orderId}`);
  }
} 