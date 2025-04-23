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

import { UserService } from '../../../services/user.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
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
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'role', 'created_at', 'actions'];
  loading = true;
  error: string | null = null;
  
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // This component is a placeholder; in a real implementation, 
    // we would fetch users from the API
    this.loading = false;
    this.users = [];
  }
  
  getUserRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'manager':
        return 'role-manager';
      default:
        return 'role-customer';
    }
  }
} 