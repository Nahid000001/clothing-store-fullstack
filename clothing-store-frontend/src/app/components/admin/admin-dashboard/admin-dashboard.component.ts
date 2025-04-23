import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StoreService } from '../../../services/store.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { Store } from '../../../interfaces/store.interface';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stores: Store[] = [];
  totalStores = 0;
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;
  dashboardStats = {
    totalStores: 0,
    totalUsers: 0,
    recentStores: 0,
    averageRating: 0
  };

  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadDashboardData();
    this.getCurrentUser();
  }

  loadDashboardData(): void {
    this.storeService.getAllStores(1, 100).subscribe({
      next: (response) => {
        this.stores = response.stores;
        this.totalStores = response.total;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data: ' + (err.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  getCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Error fetching current user:', err);
      }
    });
  }

  calculateStats(): void {
    // Calculate dashboard statistics
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Count recent stores (created in the last month)
    const recentStores = this.stores.filter(store => {
      const storeDate = new Date(store.created_at);
      return storeDate > oneMonthAgo;
    });

    // Calculate average rating across all stores
    const totalRating = this.stores.reduce((sum, store) => {
      return sum + (store.average_rating || 0);
    }, 0);

    this.dashboardStats = {
      totalStores: this.totalStores,
      totalUsers: 0, // This would require a separate API call to get all users
      recentStores: recentStores.length,
      averageRating: this.stores.length ? Number((totalRating / this.stores.length).toFixed(1)) : 0
    };
  }

  navigateTo(route: string): void {
    this.router.navigate(['/admin/' + route]);
  }

  refresh(): void {
    this.loading = true;
    this.loadDashboardData();
  }
} 