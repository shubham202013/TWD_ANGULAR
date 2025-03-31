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

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (this.email == '' || this.password == '') {
      alert('Please fill in all fields');
    } else {

      console.log('Email:', this.email);
      console.log('Password:', this.password);
      // this.authService.login(this.email, this.password).subscribe(
      //   (response) => {
      //     localStorage.setItem('authToken', response.data.token.token);
      //     this.router.navigate(['/dashboard']);
      //     // console.log('Response:', response);
      //   },
      //   (error) => {
      //     console.log('Error:', error)
      //   }
      // );
    }

  }
}
