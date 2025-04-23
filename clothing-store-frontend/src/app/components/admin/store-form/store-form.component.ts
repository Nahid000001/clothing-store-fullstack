import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StoreService } from '../../../services/store.service';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { Store } from '../../../interfaces/store.interface';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  storeForm!: FormGroup;
  isEditMode = false;
  storeId: string | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;
  workTypeOptions = [
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'online', label: 'Online Store' }
  ];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.createForm();
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      this.storeId = params.get('id');
      
      if (this.storeId) {
        this.isEditMode = true;
        this.loadStoreData(this.storeId);
      }
    });
  }

  createForm(): void {
    this.storeForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      work_type: ['retail', Validators.required],
      is_remote: [false]
    });
  }

  loadStoreData(storeId: string): void {
    this.loading = true;
    this.storeService.getStoreById(storeId).subscribe({
      next: (store) => {
        this.storeForm.patchValue({
          company_name: store.company_name,
          title: store.title,
          description: store.description,
          location: store.location,
          work_type: store.work_type,
          is_remote: store.is_remote
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = `Failed to load store data: ${err.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.storeForm.get(controlName);
    
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'This field is required';
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

  onSubmit(): void {
    if (this.storeForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.storeForm.controls).forEach(key => {
        const control = this.storeForm.get(key);
        control?.markAsTouched();
      });
      
      this.snackBar.open('Please correct the errors in the form before submitting', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      
      return;
    }
    
    const storeData = this.storeForm.value;
    this.submitting = true;
    
    if (this.isEditMode && this.storeId) {
      // Update existing store
      this.storeService.updateStore(this.storeId, storeData).subscribe({
        next: (response) => {
          this.snackBar.open('Store updated successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.submitting = false;
          this.router.navigate(['/admin/stores']);
        },
        error: (err) => {
          this.error = `Failed to update store: ${err.message || 'Unknown error'}`;
          this.submitting = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    } else {
      // Create new store
      this.storeService.createStore(storeData).subscribe({
        next: (response) => {
          this.snackBar.open('Store created successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.submitting = false;
          this.router.navigate(['/admin/stores']);
        },
        error: (err) => {
          this.error = `Failed to create store: ${err.message || 'Unknown error'}`;
          this.submitting = false;
          this.snackBar.open(this.error, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/stores']);
  }
} 