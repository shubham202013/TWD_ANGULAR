import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user/v1`
  private redirectUrl: string | null = null;
  private authStateSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize auth state
    this.authStateSubject.next(this.hasValidToken());
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password, "device_type": "I" };
    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          this.authStateSubject.next(true);
        }
      })
    );
  }

  register(name: string, email: string, password: string, dial_code: string, phone_number: string): Observable<any> {
    const body = {
      full_name: name,
      email: email,
      password: password,
      dial_code: dial_code,
      phone_number: phone_number
    };
    return this.http.post(`${this.apiUrl}/user`, body);
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  logout() {
    localStorage.removeItem('authToken');
    this.authStateSubject.next(false);
  }

  getRedirectUrl(): string | null {
    return this.redirectUrl;
  }

  setRedirectUrl(url: string | null) {
    this.redirectUrl = url;
  }
}
