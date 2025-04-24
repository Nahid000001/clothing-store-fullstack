// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { OAuthCallbackComponent } from './components/oauth-callback/oauth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreDetailComponent } from './components/store-detail/store-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home - Clothing Store' },
  { path: 'login', component: LoginComponent, title: 'Login - Clothing Store' },
  { path: 'register', component: RegisterComponent, title: 'Register - Clothing Store' },
  { path: 'stores', component: StoreListComponent, title: 'Stores - Clothing Store' },
  { path: 'stores/:id', component: StoreDetailComponent, title: 'Store Details - Clothing Store' },
  { path: 'products/:id', component: ProductDetailComponent, title: 'Product Details - Clothing Store' },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'My Profile - Clothing Store',
    children: [
      {
        path: '',
        component: UserProfileComponent
      }
    ]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
    title: 'Shopping Cart - Clothing Store'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
    title: 'Checkout - Clothing Store'
  },
  {
    path: 'orders/my',
    component: OrderListComponent,
    canActivate: [authGuard],
    title: 'My Orders - Clothing Store'
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'orders',
        component: AdminOrdersComponent,
        title: 'Admin: Orders Management - Clothing Store'
      }
    ]
  },
  { 
    path: 'auth/callback',
    component: OAuthCallbackComponent
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'health-check',
    loadComponent: () => import('./components/health-check/health-check.component').then(m => m.HealthCheckComponent)
  },
  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  // Store form (add/edit)
  {
    path: 'admin/stores/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin/store-form/store-form.component').then(m => m.StoreFormComponent)
  },
  {
    path: 'admin/stores/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin/store-form/store-form.component').then(m => m.StoreFormComponent)
  },
  // Product form (add/edit)
  {
    path: 'admin/products/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'admin/products/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./components/admin/product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  // Error pages
  {
    path: 'error/server-error',
    loadComponent: () => import('./components/error-pages/server-error/server-error.component').then(m => m.ServerErrorComponent)
  },
  {
    path: 'error/access-denied',
    loadComponent: () => import('./components/error-pages/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./components/error-pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { path: '**', redirectTo: '' }
];