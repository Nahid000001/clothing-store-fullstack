import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  errorMessage: string = 'An unexpected server error occurred';
  
  constructor(private errorService: ErrorService) {}
  
  ngOnInit(): void {
    this.errorService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error;
      }
    });
  }
  
  clearError(): void {
    this.errorService.clearError();
  }
  
  // Make window available to the template
  get window(): Window {
    return window;
  }
} 