// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { OAuthCallbackComponent } from './components/oauth-callback/oauth-callback.component';

export const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'auth/callback',
    component: OAuthCallbackComponent
  },
  { 
    path: 'stores',
    loadComponent: () => import('./components/store-list/store-list.component').then(m => m.StoreListComponent)
  },
  { 
    path: 'stores/:id',
    loadComponent: () => import('./components/store-detail/store-detail.component').then(m => m.StoreDetailComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  { 
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
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
  { 
    path: '**', 
    redirectTo: '/404'
  }
];