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
  loading = false;
  submitting = false;
  error = '';
  readonly avatarColors = ['#3F51B5', '#E91E63', '#009688', '#FF5722', '#607D8B'];
  avatarColor: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
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

  loadUserProfile(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.profileForm.patchValue({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || ''
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.error = error.message || 'Failed to load user profile. Please try again later.';
        this.loading = false;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
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
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please correct the errors in the form before submitting', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      
      return;
    }

    this.submitting = true;
    this.error = '';

    const userData = this.profileForm.value;

    this.userService.updateProfile(userData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.submitting = false;
        
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.error = error.message || 'Failed to update profile. Please try again later.';
        this.submitting = false;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  refreshProfile(): void {
    this.loadUserProfile();
  }
} 