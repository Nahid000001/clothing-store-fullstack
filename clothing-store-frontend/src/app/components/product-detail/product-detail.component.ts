import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/store.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;
  loading: boolean = true;
  error: string = '';
  
  relatedProducts: Product[] = [];
  
  // Product selection options
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  
  // Image gallery
  images: string[] = [];
  selectedImageIndex: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProductDetails();
      } else {
        this.error = 'Product ID is missing';
        this.loading = false;
      }
    });
  }

  loadProductDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProductById(this.productId)
      .subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
          
          // Set initial selected options
          if (product.sizes && product.sizes.length > 0) {
            this.selectedSize = product.sizes[0];
          }
          
          if (product.colors && product.colors.length > 0) {
            this.selectedColor = product.colors[0];
          }
          
          // Generate gallery images
          this.generateGalleryImages();
          
          // Load related products
          this.loadRelatedProducts();
        },
        error: (error) => {
          console.error('Error loading product details:', error);
          this.loading = false;
          
          if (error.status === 404) {
            this.error = 'Product not found. It may have been removed.';
          } else {
            this.error = 'Failed to load product details. Please try again.';
            
            // Fall back to dummy product for testing
            this.useDummyProduct();
          }
        }
      });
  }
  
  useDummyProduct(): void {
    // Create a dummy product for testing when API fails
    const dummyProduct = this.productService.getDummyProducts(1)[0];
    dummyProduct._id = this.productId;
    this.product = dummyProduct;
    
    // Set initial selected options
    if (dummyProduct.sizes && dummyProduct.sizes.length > 0) {
      this.selectedSize = dummyProduct.sizes[0];
    }
    
    if (dummyProduct.colors && dummyProduct.colors.length > 0) {
      this.selectedColor = dummyProduct.colors[0];
    }
    
    // Generate gallery images
    this.generateGalleryImages();
    
    // Load related products
    this.loadRelatedProducts();
  }
  
  generateGalleryImages(): void {
    if (!this.product) return;
    
    // Main product image
    const categoryName = this.product.category ? this.product.category.toLowerCase() : 'clothing';
    this.images = [this.product.image_url || `https://source.unsplash.com/500x600/?${categoryName},clothing`];
    
    // Add additional images based on product category
    for (let i = 1; i <= 4; i++) {
      this.images.push(`https://source.unsplash.com/500x600/?${categoryName},clothing,model${i}`);
    }
  }
  
  loadRelatedProducts(): void {
    if (!this.product) return;
    
    // Load related products from same category
    const storeId = this.product.store_id || 'dummy1';
    const category = this.product.category || '';
    
    this.relatedProducts = this.productService.getDummyProducts(4, storeId)
      .filter(p => p.category === category && p._id !== this.product?._id);
    
    // If we don't have enough related products, add some more
    if (this.relatedProducts.length < 4) {
      const additionalProducts = this.productService.getDummyProducts(4 - this.relatedProducts.length, storeId)
        .filter(p => p._id !== this.product?._id);
      
      this.relatedProducts = [...this.relatedProducts, ...additionalProducts];
    }
  }
  
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  
  incrementQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }
  
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(): void {
    // To be implemented when connecting to backend
    console.log('Adding to cart:', {
      product: this.product,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor
    });
    
    // Show success message or navigate to cart
    alert('Product added to cart!');
  }
  
  goBack(): void {
    this.router.navigate(['/products']);
  }
} 