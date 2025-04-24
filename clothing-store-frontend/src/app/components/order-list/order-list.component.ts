import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  
  /**
   * Load user's orders
   */
  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getMyOrders().subscribe(
      response => {
        this.orders = response.orders.sort((a, b) => {
          // Sort by created_at in descending order (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.loading = false;
      },
      error => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load your orders. Please try again later.';
        this.loading = false;
      }
    );
  }
  
  /**
   * View order details
   * @param orderId Order ID
   */
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }
  
  /**
   * Cancel an order
   * @param order Order to cancel
   * @param event Click event
   */
  cancelOrder(order: Order, event: Event): void {
    event.stopPropagation(); // Prevent navigation to order details
    
    if (order.status === 'cancelled') {
      return;
    }
    
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(order._id).subscribe(
        response => {
          // Update order status locally
          order.status = 'cancelled';
        },
        error => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. ' + (error.error?.message || 'Please try again.'));
        }
      );
    }
  }
  
  /**
   * Get appropriate status badge class
   * @param status Order status
   * @returns CSS class for status badge
   */
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-primary';
      case 'shipped':
        return 'badge-info';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
  
  /**
   * Format date for display
   * @param dateString Date string
   * @returns Formatted date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Navigate user to shopping page
   */
  continueShopping(): void {
    this.router.navigate(['/stores']);
  }
} 