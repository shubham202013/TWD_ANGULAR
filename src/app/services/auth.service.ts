import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURl = `${environment.apiUrl}/user/v1`
  constructor(private http: HttpClient) { }

  login(email: string, password: string):Observable<any> {
    const body = { email, password, "device_type":"I" };
    return this.http.post(`${this.apiURl}/login`, body);
  }
}
