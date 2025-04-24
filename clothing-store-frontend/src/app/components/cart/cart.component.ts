import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

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
      },
      error => {
        console.error('Error loading cart:', error);
        this.error = 'Failed to load your cart. Please try again later.';
        this.loading = false;
      }
    );
  }
  
  /**
   * Update quantity of cart item
   * @param item Cart item
   * @param quantity New quantity
   */
  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity === item.quantity) return;
    
    this.cartService.updateItemQuantity(item._id, quantity).subscribe(
      response => {
        this.loadCart();
      },
      error => {
        console.error('Error updating quantity:', error);
        this.error = 'Failed to update quantity. Please try again.';
      }
    );
  }
  
  /**
   * Remove item from cart
   * @param item Cart item
   */
  removeItem(item: CartItem): void {
    this.cartService.removeItem(item._id).subscribe(
      response => {
        this.loadCart();
      },
      error => {
        console.error('Error removing item:', error);
        this.error = 'Failed to remove item. Please try again.';
      }
    );
  }
  
  /**
   * Proceed to checkout
   */
  checkout(): void {
    this.router.navigate(['/checkout']);
  }
  
  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/stores']);
  }
} 