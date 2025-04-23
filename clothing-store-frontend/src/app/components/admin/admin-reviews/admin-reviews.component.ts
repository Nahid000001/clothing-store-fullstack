import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatDialogModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss']
})
export class AdminReviewsComponent implements OnInit {
  reviews: any[] = [];
  displayedColumns: string[] = ['store', 'rating', 'comment', 'user', 'created_at', 'actions'];
  loading = true;
  error: string | null = null;
  
  constructor(private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
    // This component is a placeholder; in a real implementation, 
    // we would fetch reviews from the API
    this.loading = false;
    this.reviews = [];
  }
  
  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0).map((_, i) => i + 1);
  }
} 