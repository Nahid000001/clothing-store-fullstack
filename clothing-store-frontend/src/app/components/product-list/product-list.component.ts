import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Product } from '../../models/store.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  standalone: true
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  
  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  
  // Filtering and Sorting
  filterForm: FormGroup;
  sortOptions = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'newest', label: 'Newest First' }
  ];
  
  categories = [
    'T-shirts',
    'Shirts',
    'Pants',
    'Jeans',
    'Sweaters',
    'Jackets',
    'Dresses',
    'Skirts',
    'Activewear',
    'Accessories'
  ];
  
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  colors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Brown',
    'Gray',
    'Purple',
    'Pink'
  ];
  
  private destroy$ = new Subject<void>();
  
  // Properties used in the template
  searchTerm: string = '';
  selectedCategory: string = '';
  priceRange: { min: number, max: number } = { min: 0, max: 1000 };
  sortOption: string = 'newest';
  page: number = 1;
  totalPages: number = 1;
  
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      minPrice: [null],
      maxPrice: [null],
      sizes: [[]],
      colors: [[]],
      sort: ['newest']
    });
  }
  
  ngOnInit(): void {
    this.loadProducts();
    
    // Subscribe to query params changes
    this.activatedRoute.queryParams.subscribe(params => {
      this.updateFiltersFromParams(params);
      this.loadProducts();
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initializeFromQueryParams(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    
    if (queryParams['page']) {
      this.currentPage = parseInt(queryParams['page'], 10);
    }
    
    if (queryParams['search']) {
      this.filterForm.get('search')?.setValue(queryParams['search']);
    }
    
    if (queryParams['category']) {
      this.filterForm.get('category')?.setValue(queryParams['category']);
    }
    
    if (queryParams['minPrice']) {
      this.filterForm.get('minPrice')?.setValue(Number(queryParams['minPrice']));
    }
    
    if (queryParams['maxPrice']) {
      this.filterForm.get('maxPrice')?.setValue(Number(queryParams['maxPrice']));
    }
    
    if (queryParams['sizes']) {
      const sizes = queryParams['sizes'].split(',');
      this.filterForm.get('sizes')?.setValue(sizes);
    }
    
    if (queryParams['colors']) {
      const colors = queryParams['colors'].split(',');
      this.filterForm.get('colors')?.setValue(colors);
    }
    
    if (queryParams['sort']) {
      this.filterForm.get('sort')?.setValue(queryParams['sort']);
    }
  }
  
  private setupFormListeners(): void {
    // Apply debounce to search field
    this.filterForm.get('search')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
    
    // Listen for other filter changes
    const filterControls = ['category', 'minPrice', 'maxPrice', 'sizes', 'colors', 'sort'];
    filterControls.forEach(control => {
      this.filterForm.get(control)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.applyFilters();
        });
    });
  }
  
  /**
   * Load all products from the API
   */
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: { products: Product[]; total: number }) => {
          this.products = response.products;
          this.totalItems = response.total;
          this.applyFilters();
          this.paginateProducts();
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Failed to load products. Please try again later.';
          console.error('Error fetching products:', err);
          this.loading = false;
        }
      });
  }
  
  /**
   * Apply all filters to the products
   */
  applyFilters(): void {
    const filterValues = this.filterForm.value;
    
    this.filteredProducts = this.products.filter(product => {
      // Category filter
      if (filterValues.category && product.category !== filterValues.category) {
        return false;
      }
      
      // Color filter
      if (filterValues.colors?.length > 0 && 
          !filterValues.colors.some((color: string) => product.colors?.includes(color) || false)) {
        return false;
      }
      
      // Size filter
      if (filterValues.sizes?.length > 0 && 
          !filterValues.sizes.some((size: string) => product.sizes?.includes(size) || false)) {
        return false;
      }
      
      // Price range filter
      if (filterValues.minPrice && product.price < filterValues.minPrice) {
        return false;
      }
      if (filterValues.maxPrice && product.price > filterValues.maxPrice) {
        return false;
      }
      
      // Search term filter
      if (filterValues.search) {
        const searchTerm = filterValues.search.toLowerCase();
        return product.name.toLowerCase().includes(searchTerm) || 
               product.description.toLowerCase().includes(searchTerm);
      }
      
      return true;
    });
    
    // Apply sorting
    this.sortProducts(this.filteredProducts);
    
    // Set total items for pagination
    this.totalItems = this.filteredProducts.length;
  }
  
  /**
   * Sort the products by the selected sort option
   */
  sortProducts(products: Product[]): void {
    const sortOption = this.filterForm.get('sort')?.value;
    
    if (sortOption === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === 'name-asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      products.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    // Apply pagination
    this.totalItems = products.length;
    this.currentPage = 1; // Reset to first page when filters or sorting changes
    this.paginateProducts();
    
    // Update URL with filters and sorting
    this.updateQueryParams();
  }
  
  /**
   * Apply pagination to the filtered products
   */
  private paginateProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }
  
  /**
   * Handle page change events
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateProducts();
    this.updateQueryParams();
  }
  
  private updateQueryParams(): void {
    const filters = this.filterForm.value;
    const queryParams: any = { page: this.currentPage };
    
    if (filters.search) {
      queryParams.search = filters.search;
    }
    
    if (filters.category) {
      queryParams.category = filters.category;
    }
    
    if (filters.minPrice !== null && filters.minPrice !== '') {
      queryParams.minPrice = filters.minPrice;
    }
    
    if (filters.maxPrice !== null && filters.maxPrice !== '') {
      queryParams.maxPrice = filters.maxPrice;
    }
    
    if (filters.sizes.length > 0) {
      queryParams.sizes = filters.sizes.join(',');
    }
    
    if (filters.colors.length > 0) {
      queryParams.colors = filters.colors.join(',');
    }
    
    if (filters.sort !== 'newest') {
      queryParams.sort = filters.sort;
    }
    
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
  
  resetFilters(): void {
    this.filterForm.reset({
      search: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      sizes: [],
      colors: [],
      sort: 'newest'
    });
    this.currentPage = 1;
    this.applyFilters();
  }
  
  toggleSizeFilter(size: string): void {
    const currentSizes = [...this.filterForm.get('sizes')?.value || []];
    if (currentSizes.includes(size)) {
      this.filterForm.get('sizes')?.setValue(currentSizes.filter(s => s !== size));
    } else {
      currentSizes.push(size);
      this.filterForm.get('sizes')?.setValue(currentSizes);
    }
  }
  
  toggleColorFilter(color: string): void {
    const currentColors = [...this.filterForm.get('colors')?.value || []];
    if (currentColors.includes(color)) {
      this.filterForm.get('colors')?.setValue(currentColors.filter(c => c !== color));
    } else {
      currentColors.push(color);
      this.filterForm.get('colors')?.setValue(currentColors);
    }
  }
  
  isSizeSelected(size: string): boolean {
    return (this.filterForm.get('sizes')?.value || []).includes(size);
  }
  
  isColorSelected(color: string): boolean {
    return (this.filterForm.get('colors')?.value || []).includes(color);
  }
  
  getProductImage(product: Product): string {
    return product.image_url || '/assets/images/placeholder.jpg';
  }
  
  trackByProductId(index: number, product: Product): string {
    return product._id;
  }

  /**
   * Filter products by size
   * @param size The size to filter by
   */
  filterBySize(size: string): void {
    if (this.filterForm.get('sizes')?.value.includes(size)) {
      this.filterForm.get('sizes')?.setValue(this.filterForm.get('sizes')?.value.filter((s: string) => s !== size));
    } else {
      this.filterForm.get('sizes')?.setValue([...this.filterForm.get('sizes')?.value, size]);
    }
    this.applyFilters();
  }

  /**
   * Filter products by color
   * @param color The color to filter by
   */
  filterByColor(color: string): void {
    if (this.filterForm.get('colors')?.value.includes(color)) {
      this.filterForm.get('colors')?.setValue(this.filterForm.get('colors')?.value.filter((c: string) => c !== color));
    } else {
      this.filterForm.get('colors')?.setValue([...this.filterForm.get('colors')?.value, color]);
    }
    this.applyFilters();
  }

  /**
   * Get all available sizes from products
   */
  getAllSizes(): string[] {
    const sizes = new Set<string>();
    this.products.forEach(product => {
      product.sizes?.forEach(size => sizes.add(size));
    });
    return Array.from(sizes).sort();
  }

  /**
   * Get all available colors from products
   */
  getAllColors(): string[] {
    const colors = new Set<string>();
    this.products.forEach(product => {
      product.colors?.forEach(color => colors.add(color));
    });
    return Array.from(colors).sort();
  }

  /**
   * Navigate to product detail page
   * @param product The product to view
   */
  viewProductDetails(product: Product): void {
    this.router.navigate(['/products', product._id]);
  }

  /**
   * Update filters based on URL query parameters
   */
  updateFiltersFromParams(params: any): void {
    if (params['category']) {
      this.filterForm.get('category')?.setValue(params['category']);
    }
    
    if (params['minPrice']) {
      this.filterForm.get('minPrice')?.setValue(Number(params['minPrice']));
    }
    
    if (params['maxPrice']) {
      this.filterForm.get('maxPrice')?.setValue(Number(params['maxPrice']));
    }
    
    if (params['colors']) {
      const colors = Array.isArray(params['colors']) ? params['colors'] : [params['colors']];
      this.filterForm.get('colors')?.setValue(colors);
    }
    
    if (params['sizes']) {
      const sizes = Array.isArray(params['sizes']) ? params['sizes'] : [params['sizes']];
      this.filterForm.get('sizes')?.setValue(sizes);
    }
    
    if (params['search']) {
      this.filterForm.get('search')?.setValue(params['search']);
    }
    
    if (params['sort']) {
      this.filterForm.get('sort')?.setValue(params['sort']);
    }
    
    if (params['page']) {
      this.currentPage = Number(params['page']);
    }
  }

  /**
   * Apply sorting directly
   */
  applySorting(): void {
    this.sortProducts(this.filteredProducts);
  }
  
  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.resetFilters();
  }
  
  /**
   * Go to specific page
   */
  goToPage(pageNum: number): void {
    this.currentPage = pageNum;
    this.paginateProducts();
  }
  
  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateProducts();
    }
  }
  
  /**
   * Go to previous page
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProducts();
    }
  }
  
  /**
   * Get array of page numbers for pagination
   */
  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.pageSize);
    this.totalPages = pageCount;
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  
  /**
   * Get product image URL with fallback
   */
  getProductImageUrl(product: Product): string {
    return this.getProductImage(product);
  }
} 