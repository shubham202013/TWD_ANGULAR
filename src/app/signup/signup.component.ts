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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log(this.signupForm.valid);
    
    if (this.signupForm.valid) {
      console.log('Signup Successful', this.signupForm.value);
      this.authService.register(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password).subscribe(
        (response) => {
          if (response.success == false) {
            alert(response.message);
          } else {
            alert('Signup Successful');
            this.router.navigate(['/login']); // Redirect to login after signup
          }
        }
      )
      // this.router.navigate(['/login']); // Redirect to login after signup
    }
  }
}
