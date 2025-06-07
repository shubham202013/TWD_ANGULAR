import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('Email:', this.email);
    console.log('Password:', this.password);
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success === false) {
          this.errorMessage = response.message;
          console.log('Error:', this.errorMessage);
        } else {
          localStorage.setItem('authToken', response.data.token.token);
          const redirect = this.authService.getRedirectUrl() || '/dashboard';
          this.authService.setRedirectUrl(null); // Clear stored URL
          this.router.navigate([redirect]);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
        console.log('Error:', error);
      }
    });
  }
}
