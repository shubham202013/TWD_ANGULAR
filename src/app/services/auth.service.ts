import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURl = `${environment.apiUrl}/user/v1`
  private redirectUrl: string | null = null;

  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any> {
    const body = { email, password, "device_type":"I" };
    return this.http.post(`${this.apiURl}/login`, body);
  }

  register(name: string, email: string, password: string, dial_code: string, phone_number: string): Observable<any> {
    const body = { 
      full_name: name, 
      email: email, 
      password: password,
      dial_code: dial_code,
      phone_number: phone_number
    };
    return this.http.post(`${this.apiURl}/user`, body);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Check if a token exists
  }

  logout() {
    localStorage.removeItem('authToken'); // Remove the token
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  setRedirectUrl(url: string | null) {
    this.redirectUrl = url;
  }


}
