import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { ShippingAddress } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = true;
  submitting: boolean = false;
  error: string | null = null;
  success: string | null = null;
  
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  
  paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];
  
  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.shippingForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['USA', Validators.required]
    });
    
    this.paymentForm = this.fb.group({
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCart();
  }
  
  /**
   * Load cart data
   */
  loadCart(): void {
    this.loading = true;
    this.error = null;
    
    this.cartService.getCart().subscribe(
      cart => {
        this.cart = cart;
        this.loading = false;
        
        // Redirect to cart if empty
        if (!cart.items.length) {
          this.router.navigate(['/cart']);
        }
      },
      error => {
        console.error('Error loading cart:', error);
        this.error = 'Failed to load your cart. Please try again later.';
        this.loading = false;
      }
    );
  }
  
  /**
   * Submit order
   */
  placeOrder(): void {
    if (this.shippingForm.invalid || this.paymentForm.invalid) {
      this.markFormsAsTouched();
      return;
    }
    
    this.submitting = true;
    this.error = null;
    this.success = null;
    
    const shippingAddress: ShippingAddress = this.shippingForm.value;
    const paymentMethod = this.paymentForm.get('paymentMethod')?.value;
    
    this.cartService.checkout(shippingAddress, paymentMethod).subscribe(
      response => {
        this.success = 'Order placed successfully!';
        this.submitting = false;
        
        // Redirect to order confirmation after a short delay
        setTimeout(() => {
          this.router.navigate(['/orders/my']);
        }, 2000);
      },
      error => {
        console.error('Error placing order:', error);
        this.error = 'Failed to place your order. Please try again.';
        this.submitting = false;
      }
    );
  }
  
  /**
   * Mark all form fields as touched to trigger validation
   */
  markFormsAsTouched(): void {
    Object.keys(this.shippingForm.controls).forEach(key => {
      this.shippingForm.get(key)?.markAsTouched();
    });
    
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsTouched();
    });
  }
  
  /**
   * Return to cart
   */
  backToCart(): void {
    this.router.navigate(['/cart']);
  }
} 