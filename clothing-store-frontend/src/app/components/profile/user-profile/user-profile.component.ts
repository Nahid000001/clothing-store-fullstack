import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading: boolean = true;
  submitting: boolean = false;
  error: string | null = null;
  success: string | null = null;
  showDeleteConfirm: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
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
  }
  
  /**
   * Load user profile data
   */
  loadUserProfile(): void {
    this.loading = true;
    this.error = null;
    
    this.userService.getProfile().subscribe(
      user => {
        // Populate form with user data
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
      }
    );
  }
  
  /**
   * Submit profile update
   */
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
        this.success = 'Profile updated successfully!';
        this.submitting = false;
      },
      error => {
        console.error('Error updating profile:', error);
        this.error = 'Failed to update your profile. Please try again.';
        this.submitting = false;
      }
    );
  }
  
  /**
   * Show delete account confirmation
   */
  showDeleteConfirmation(): void {
    this.showDeleteConfirm = true;
    this.error = null;
    this.success = null;
  }
  
  /**
   * Cancel delete account
   */
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
  
  /**
   * Delete user account
   */
  deleteAccount(): void {
    this.submitting = true;
    this.error = null;
    
    this.userService.deleteAccount().subscribe(
      response => {
        this.submitting = false;
        this.success = 'Your account has been deleted successfully. You will be logged out in a few seconds.';
        
        // Log out after a delay
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/']);
        }, 3000);
      },
      error => {
        console.error('Error deleting account:', error);
        this.error = 'Failed to delete your account. Please try again.';
        this.submitting = false;
        this.showDeleteConfirm = false;
      }
    );
  }
  
  /**
   * Mark all form fields as touched
   */
  markFormAsTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
    });
  }
} 