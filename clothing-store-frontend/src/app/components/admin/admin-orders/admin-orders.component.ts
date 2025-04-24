import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // Filters
  statusFilter: string = 'all';
  searchTerm: string = '';
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  
  /**
   * Load all orders
   */
  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getAllOrders().subscribe(
      response => {
        this.orders = response.orders.sort((a, b) => {
          // Sort by created_at in descending order (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        this.filteredOrders = [...this.orders];
        this.loading = false;
      },
      error => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
      }
    );
  }
  
  /**
   * Apply filters to orders
   */
  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      // Apply status filter
      if (this.statusFilter !== 'all' && order.status !== this.statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesId = order._id.toLowerCase().includes(searchLower);
        const matchesEmail = order.user_email.toLowerCase().includes(searchLower);
        const matchesName = order.user_name.toLowerCase().includes(searchLower);
        
        return matchesId || matchesEmail || matchesName;
      }
      
      return true;
    });
  }
  
  /**
   * Filter by status
   * @param status Status to filter by
   */
  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  /**
   * Search orders
   */
  onSearch(): void {
    this.applyFilters();
  }
  
  /**
   * View order details
   * @param orderId Order ID
   */
  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/orders', orderId]);
  }
  
  /**
   * Update order status
   * @param order Order to update
   * @param status New status
   */
  updateOrderStatus(order: Order, status: string): void {
    if (order.status === status) return;
    
    this.orderService.updateOrderStatus(order._id, status).subscribe(
      response => {
        // Update order status locally
        order.status = status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      },
      error => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. ' + (error.error?.message || 'Please try again.'));
      }
    );
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
} 