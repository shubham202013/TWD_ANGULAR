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
  errorMessage:string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.email == '' || this.password == '') {
      alert('Please fill in all fields');
    } else {

      console.log('Email:', this.email);
      console.log('Password:', this.password);
      this.loading = true;
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          this.loading = false;
          // debugger
          if (response.success == false) {
            this.errorMessage = response.message;
          
            console.log('Error:', this.errorMessage)
          }else{
            // debugger
            localStorage.setItem('authToken', response.data.token.token);
            const redirect = this.authService.getRedirectUrl() || '/dashboard'; // Redirect to stored URL or dashboard
            this.authService.setRedirectUrl(null) // Clear stored URL
            this.router.navigate([redirect]);
          }
          // console.log('Response:', response);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
          
          console.log('Error:', error)
        }
      );
    }

  }
}
