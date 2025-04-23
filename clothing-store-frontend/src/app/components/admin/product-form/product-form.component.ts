import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/store.model';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  productId: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  // Predefined categories and sizes for dropdown selections
  categories: string[] = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes', 'Jackets'];
  availableSizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  availableColors: string[] = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = id;
        this.loadProductDetails();
      }
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      image_url: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      sizes: this.fb.array([]),
      colors: this.fb.array([]),
      store_id: ['', Validators.required]
    });
  }

  loadProductDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductById(this.productId)
      .subscribe({
        next: (product) => {
          this.patchFormWithProductData(product);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading = false;
          this.error = 'Failed to load product. Please try again.';
          
          // Create dummy product for testing
          if (error.status === 404) {
            const dummyProduct = this.productService.getDummyProducts(1)[0];
            dummyProduct._id = this.productId;
            this.patchFormWithProductData(dummyProduct);
          }
        }
      });
  }

  patchFormWithProductData(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url || '',
      stock: product.stock || 0,
      store_id: product.store_id
    });
    
    // Clear existing form arrays
    this.sizesFormArray.clear();
    this.colorsFormArray.clear();
    
    // Add product sizes
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach(size => {
        this.addSize(size);
      });
    }
    
    // Add product colors
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach(color => {
        this.addColor(color);
      });
    }
  }

  get sizesFormArray(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }
  
  get colorsFormArray(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }
  
  addSize(size: string = ''): void {
    this.sizesFormArray.push(this.fb.control(size));
  }
  
  removeSize(index: number): void {
    this.sizesFormArray.removeAt(index);
  }
  
  addColor(color: string = ''): void {
    this.colorsFormArray.push(this.fb.control(color));
  }
  
  removeColor(index: number): void {
    this.colorsFormArray.removeAt(index);
  }
  
  handleSizeChange(event: Event, size: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.addSize(size);
    } else {
      const index = this.sizesFormArray.value.indexOf(size);
      if (index !== -1) {
        this.removeSize(index);
      }
    }
  }
  
  handleColorChange(event: Event, color: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.addColor(color);
    } else {
      const index = this.colorsFormArray.value.indexOf(color);
      if (index !== -1) {
        this.removeColor(index);
      }
    }
  }
  
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const productData = this.productForm.value;
    
    if (this.isEditMode) {
      this.productService.updateProduct(this.productId, productData)
        .subscribe({
          next: (response) => {
            this.handleSuccess(response.message || 'Product updated successfully');
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    } else {
      this.productService.createProduct(productData)
        .subscribe({
          next: (response) => {
            this.handleSuccess(response.message || 'Product created successfully');
            this.productForm.reset();
            // Redirect to the new product page
            this.router.navigate(['/products', response.product._id]);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
    }
  }
  
  handleSuccess(message: string): void {
    this.loading = false;
    this.success = message;
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.success = '';
    }, 3000);
  }
  
  handleError(error: any): void {
    this.loading = false;
    console.error('Product form error:', error);
    
    if (typeof error === 'string') {
      this.error = error;
    } else if (error.message) {
      this.error = error.message;
    } else {
      this.error = 'An error occurred while saving the product. Please try again.';
    }
  }
  
  // Helper to mark all controls as touched for validation display
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Check if a control has a specific error
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return (control?.touched || control?.dirty) && control?.hasError(errorName) || false;
  }
  
  // Cancel form and navigate back
  cancel(): void {
    this.router.navigate(['/admin']);
  }
} 