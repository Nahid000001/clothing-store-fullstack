// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Get current user profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/profile`)
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }

  // Get user by ID
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${userId}`)
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }
    
    console.error('User service error:', error);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }
  
  /**
   * Update user profile
   * @param profileData Profile data to update
   */
  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/update`, profileData)
      .pipe(
        timeout(10000),
        retry(2),
        catchError(this.handleError)
      );
  }
  
  /**
   * Delete user account
   */
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile/delete`);
  }
} 