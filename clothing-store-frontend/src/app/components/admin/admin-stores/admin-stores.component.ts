import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StoreService } from '../../../services/store.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { Store } from '../../../interfaces/store.interface';

@Component({
  selector: 'app-admin-stores',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-stores.component.html',
  styleUrls: ['./admin-stores.component.scss']
})
export class AdminStoresComponent implements OnInit {
  stores: Store[] = [];
  displayedColumns: string[] = ['company_name', 'location', 'average_rating', 'created_at', 'actions'];
  totalStores = 0;
  loading = true;
  error: string | null = null;
  currentPage = 0;
  pageSize = 10;
  
  constructor(
    private storeService: StoreService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.loading = true;
    
    this.storeService.getAllStores(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        this.stores = response.stores;
        this.totalStores = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.error = 'Failed to load stores: ' + (err.message || 'Unknown error');
        this.loading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStores();
  }

  handleSort(sort: Sort): void {
    // Implementation for sorting would go here
    this.loadStores();
  }

  navigateToAddStore(): void {
    // Navigate to add store form
  }

  editStore(storeId: string): void {
    // Navigate to edit store form
  }

  viewStore(storeId: string): void {
    // Navigate to view store details
  }

  deleteStore(store: Store): void {
    if (confirm(`Are you sure you want to delete "${store.company_name}"?`)) {
      this.storeService.deleteStore(store._id).subscribe({
        next: () => {
          this.snackBar.open('Store deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.loadStores();
        },
        error: (err) => {
          console.error('Error deleting store:', err);
          this.snackBar.open('Failed to delete store: ' + (err.message || 'Unknown error'), 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }
} 