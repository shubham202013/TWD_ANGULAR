import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading: boolean = false;
  dialCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    // Add more country codes as needed
  ];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dial_code: ['+1', Validators.required], // Default to +1
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assuming 10 digit phone numbers
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log(this.signupForm.valid);
    
    if (this.signupForm.valid) {
      this.isLoading = true;
      console.log('Signup Successful', this.signupForm.value);
      this.authService.register(
        this.signupForm.value.name, 
        this.signupForm.value.email, 
        this.signupForm.value.password,
        this.signupForm.value.dial_code,
        this.signupForm.value.phone_number
      ).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success == false) {
            alert(response.message);
          } else {
            alert('Signup Successful');
            this.router.navigate(['/login']); // Redirect to login after signup
          }
        },
        (error) => {
          this.isLoading = false;
          alert(error.error?.message || 'An error occurred during signup');
        }
      )
    }
  }
}
