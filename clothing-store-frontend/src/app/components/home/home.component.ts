// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { Store } from '../../interfaces/store.interface';
import { Product } from '../../models/store.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredStores: any[] = [];
  loading = false;
  error = '';
  
  // Product related properties
  featuredProducts: Product[] = [];
  loadingProducts = false;
  errorProducts = '';
  
  colorPalette = [
    '#1a237e', // Primary dark
    '#534bae', // Primary light
    '#f50057', // Secondary
    '#4caf50', // Success
    '#ff9800', // Warning
    '#607d8b'  // Neutral
  ];
  
  // Store image placeholders - updated with higher quality images
  storeImages = [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Clothing rack with bright colors
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Modern clothing store
    'https://images.unsplash.com/photo-1567401893414-91b2a97e5b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Person browsing clothes
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1654&q=80', // Retail display
    'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80', // Fashion store luxury
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Boutique interior
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Modern clothing on racks
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80'  // High end clothing display
  ];
  
  // Product image placeholders
  productImages = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Clothing items
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Shoes
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Accessories
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Dresses
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Jackets
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', // Pants
  ];

  constructor(
    private storeService: StoreService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    // Set loading state first
    this.loading = true;
    this.loadingProducts = true;
    
    // Load stores and products 
    this.loadFeaturedStores();
    this.loadFeaturedProducts();
    
    // Add a backup in case something goes wrong with stores
    setTimeout(() => {
      // If still loading or showing error after 2 seconds, force load dummy data
      if (this.loading || this.error) {
        console.log('Fallback: Loading dummy store data');
        this.featuredStores = this.getDummyStores();
        this.loading = false;
        this.error = '';
      }
    }, 2000);
    
    // Add a backup in case something goes wrong with products
    setTimeout(() => {
      if (this.loadingProducts || this.errorProducts) {
        console.log('Fallback: Loading dummy product data');
        this.featuredProducts = this.getDummyProducts();
        this.loadingProducts = false;
        this.errorProducts = '';
      }
    }, 2000);
  }

  // Add method to provide dummy store data when no stores are available in the database
  getDummyStores(): Store[] {
    return [
      {
        _id: 'dummy1',
        company_name: 'Fashion Elite',
        title: 'Premium Fashion Outlet',
        description: 'Designer clothing and accessories for fashion enthusiasts. We offer the latest trends in high-end fashion.',
        location: 'New York',
        work_type: 'retail',
        is_remote: false,
        owner: 'admin',
        average_rating: 4.7,
        review_count: 42,
        views: 250,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        _id: 'dummy2',
        company_name: 'Urban Threads',
        title: 'Contemporary Urban Wear',
        description: 'Streetwear and casual fashion for the modern lifestyle. Featuring urban designs and comfortable everyday wear.',
        location: 'Los Angeles',
        work_type: 'retail',
        is_remote: false,
        owner: 'admin',
        average_rating: 4.3,
        review_count: 28,
        views: 185,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        _id: 'dummy3',
        company_name: 'Eco Apparel',
        title: 'Sustainable Fashion',
        description: 'Eco-friendly clothing made from sustainable materials. Making a positive impact on the planet with ethical fashion.',
        location: 'Portland',
        work_type: 'manufacturing',
        is_remote: false,
        owner: 'admin',
        average_rating: 4.9,
        review_count: 17,
        views: 120,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        _id: 'dummy4',
        company_name: 'Vintage Revival',
        title: 'Classic Fashion Reimagined',
        description: 'Vintage-inspired clothing with a modern twist. Rediscover timeless fashion trends updated for today.',
        location: 'Chicago',
        work_type: 'retail',
        is_remote: false,
        owner: 'admin',
        average_rating: 4.5,
        review_count: 35,
        views: 210,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
  
  // Method to provide dummy product data
  getDummyProducts(): Product[] {
    return this.productService.getDummyProducts(4);
  }

  loadFeaturedStores() {
    this.loading = true;
    this.error = '';
    console.log('Attempting to load featured stores...');
    
    this.storeService.getAllStores(1, 4)
      .subscribe({
        next: data => {
          console.log('Received store data:', data);
          this.loading = false;
          
          if (data && data.stores && data.stores.length > 0) {
            this.featuredStores = data.stores;
            this.error = '';
            console.log('Featured stores set:', this.featuredStores);
          } else {
            console.log('No stores returned or empty array');
            // Fall back to dummy data if no stores are returned
            this.featuredStores = this.getDummyStores();
            this.error = '';
          }
        },
        error: error => {
          console.error('Error loading featured stores:', error);
          this.loading = false;
          // Fall back to dummy data on error
          this.featuredStores = this.getDummyStores();
          this.error = '';
        }
      });
  }
  
  loadFeaturedProducts() {
    this.loadingProducts = true;
    this.errorProducts = '';
    console.log('Attempting to load featured products...');
    
    // Try to get products from API
    this.productService.getAllProducts(1, 4)
      .subscribe({
        next: data => {
          console.log('Received product data:', data);
          this.loadingProducts = false;
          
          if (data && data.products && data.products.length > 0) {
            this.featuredProducts = data.products;
            this.errorProducts = '';
            console.log('Featured products set:', this.featuredProducts);
          } else {
            console.log('No products returned or empty array');
            // Fall back to dummy data if no products are returned
            this.featuredProducts = this.getDummyProducts();
            this.errorProducts = '';
          }
        },
        error: error => {
          console.error('Error loading featured products:', error);
          this.loadingProducts = false;
          // Fall back to dummy data on error
          this.featuredProducts = this.getDummyProducts();
          this.errorProducts = '';
        }
      });
  }

  retryLoading(): void {
    this.loadFeaturedStores();
  }
  
  // Get image URL for product
  getProductImage(product: Product): string {
    // Map product categories to specific image categories 
    const categoryToImageIndex: Record<string, number> = {
      'Shirts': 0,
      'Pants': 5,
      'Dresses': 3,
      'Accessories': 2,
      'Shoes': 1,
      'Jackets': 4
    };
    
    // Use product category to determine image if available, otherwise use ID
    let index = 0;
    if (product.category && categoryToImageIndex[product.category] !== undefined) {
      index = categoryToImageIndex[product.category];
    } else if (product._id) {
      // Get a consistent image based on product ID
      index = Math.abs(this.hashString(product._id)) % this.productImages.length;
    }
    
    return this.productImages[index] || this.productImages[0];
  }

  // Helper methods for the template
  getStoreImage(store: any): string {
    // Map store types to specific image categories 
    const typeToImageIndex: Record<string, number> = {
      'RETAIL': 0,
      'BOUTIQUE': 1,
      'DESIGNER': 2,
      'CASUAL': 3,
      'LUXURY': 4,
      'SUSTAINABLE': 5
    };
    
    // Use store type to determine image if available, otherwise use ID
    let index = 0;
    if (store.work_type && typeof store.work_type === 'string' && typeToImageIndex[store.work_type] !== undefined) {
      index = typeToImageIndex[store.work_type];
    } else if (store._id) {
      // Get a consistent image based on store ID
      index = Math.abs(this.hashString(store._id)) % this.storeImages.length;
    }
    
    return this.storeImages[index] || this.storeImages[0];
  }
  
  getRandomRating(): string {
    return (4 + Math.random()).toFixed(1);
  }
  
  getRandomColor(): string {
    return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Add a hashString method similar to the one in store-list component
  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
  
  // Add badge class method for store types
  getTypeBadgeClass(type: string): string {
    if (!type) return 'badge-retail'; // Default
    
    const normalizedType = type.toUpperCase();
    
    switch (normalizedType) {
      case 'RETAIL':
        return 'badge-retail';
      case 'BOUTIQUE':
        return 'badge-boutique';
      case 'DESIGNER':
        return 'badge-designer';
      case 'CASUAL':
        return 'badge-casual';
      case 'LUXURY':
        return 'badge-luxury';
      case 'SUSTAINABLE':
        return 'badge-sustainable';
      default:
        return 'badge-retail';
    }
  }
}