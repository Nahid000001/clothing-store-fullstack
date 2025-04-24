import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  loading = true;
  submitting = false;
  error: string | null = null;
  success: string | null = null;
  showDeleteConfirm = false;
  readonly avatarColors = ['#3F51B5', '#E91E63', '#009688', '#FF5722', '#607D8B'];
  avatarColor: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.setRandomAvatarColor();
  }

  setRandomAvatarColor(): void {
    const randomIndex = Math.floor(Math.random() * this.avatarColors.length);
    this.avatarColor = this.avatarColors[randomIndex];
  }

  getUserInitial(): string {
    if (this.user?.first_name) {
      return this.user.first_name.charAt(0).toUpperCase();
    }
    return this.user?.username?.charAt(0).toUpperCase() || 'U';
  }

  refreshProfile(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getProfile().subscribe(
      user => {
        this.user = user;
        this.profileForm.patchValue({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          address: user.address || '',
          phone: user.phone || ''
        });
        this.loading = false;
      },
      error => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load your profile. Please try again later.';
        this.loading = false;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }
    
    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `Maximum length is ${requiredLength} characters`;
    }
    
    return '';
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.markFormAsTouched();
      return;
    }
    
    this.submitting = true;
    this.error = null;
    this.success = null;
    
    const profileData = this.profileForm.value;
    
    this.userService.updateProfile(profileData).subscribe(
      response => {
        this.user = response;
        this.success = 'Profile updated successfully!';
        this.submitting = false;
        
        this.snackBar.open(this.success, 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error => {
        console.error('Error updating profile:', error);
        this.error = 'Failed to update your profile. Please try again.';
        this.submitting = false;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }

  markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach(field => {
      const control = this.profileForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  showDeleteConfirmation(): void {
    this.showDeleteConfirm = true;
    this.error = null;
    this.success = null;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    this.submitting = true;
    this.error = null;
    
    this.userService.deleteAccount().subscribe(
      response => {
        this.submitting = false;
        this.success = 'Your account has been deleted successfully. You will be logged out in a few seconds.';
        
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }, 3000);
      },
      error => {
        console.error('Error deleting account:', error);
        this.error = 'Failed to delete your account. Please try again.';
        this.submitting = false;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    );
  }
} 