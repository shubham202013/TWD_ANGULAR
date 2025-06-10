import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WebhookRequest {
  webhook_name: string;
  api_key: string;
  api_secret: string;
}

export interface OtpVerificationRequest {
  email_code: string;
  tfa_code: string;
  webhook_id: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  data?: {
    webhook_url?: string;
    id?: string;
    webhook_name?: string;
    api_key?: string;
    api_secret?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TradingViewService {
  private apiUrl = `${environment.apiUrl}/user/v1/webhook`; // Adjust the URL based on your API endpoint

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
  }

  getWebhook(): Observable<WebhookResponse> {
    return this.http.get<WebhookResponse>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getWebhookDetails(): Observable<WebhookResponse> {
    return this.http.get<WebhookResponse>(`${this.apiUrl}/details`, { headers: this.getHeaders() });
  }

  createWebhook(data: WebhookRequest): Observable<WebhookResponse> {
    return this.http.post<WebhookResponse>(`${this.apiUrl}`, data, { headers: this.getHeaders() });
  }

  updateWebhook(webhookId: string, data: WebhookRequest): Observable<WebhookResponse> {
    return this.http.patch<WebhookResponse>(`${this.apiUrl}/${webhookId}`, data, { headers: this.getHeaders() });
  }

  verifyOtp(data: OtpVerificationRequest): Observable<WebhookResponse> {
    return this.http.post<WebhookResponse>(`${this.apiUrl}/verify-otp`, data, { headers: this.getHeaders() });
  }
} 