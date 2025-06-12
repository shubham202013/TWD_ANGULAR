import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TradingViewService, WebhookRequest, WebhookResponse } from '../services/trading-view.service';
import { AuthService } from '../services/auth.service';
import { filter, Subscription, combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-trading-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './trading-view.component.html',
  styleUrl: './trading-view.component.scss'
})
export class TradingViewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  webhookName: string = '';
  apiKey: string = '';
  apiSecret: string = '';
  isRiskAcknowledged: boolean = false;
  showOtpPopup: boolean = false;
  showSuccessPopup: boolean = false;
  showCopiedMessage: boolean = false;
  showCodeCopiedMessage: boolean = false;
  showWebhookUrlPopup: boolean = false;
  emailCode: string = '';
  tfaCode: string = '';
  timeLeft: number = 52;
  webhookUrl: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isVerifying: boolean = false;
  webhookId: string = '';
  tradingViewMessage: string = `{{strategy.order.alert_message}}`;
  hasExistingWebhook: boolean = false;
  showPineScriptPopup: boolean = false;
  showCustomJsonPopup: boolean = false;
  
  // Form controls for custom JSON
  orderType: string = 'BUY';
  quantity: number = 100;
  leverage: number = 10;
  
  // Available options
  orderTypes: string[] = ['BUY', 'SELL', 'SHORT', 'COVER'];
  
  // JSON templates
  customJsonTemplate = {
    Close: "{{close}}",
    Ticker: "{{ticker}}",
    OrderType: "BUY",
    ProductType: "market_order",
    Quantity: 100,
    leverage: 10,
    Strategy: "PRO1"
  };

  accounts = ['Main', 'Account 2', 'Account 3'];
  sources = ['Tradingview'];

  constructor(
    private tradingViewService: TradingViewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to both auth state and navigation events
    const subscription = combineLatest([
      this.authService.authState$,
      this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    ]).subscribe(([isAuthenticated, _]) => {
      if (!isAuthenticated) {
        this.authService.setRedirectUrl('/trading-view');
        this.router.navigate(['/login']);
        return;
      }
      
      // Only fetch webhook if we're authenticated
      if (isAuthenticated) {
        this.fetchExistingWebhook();
      }
    });

    this.subscriptions.push(subscription);

    // Initial check for authentication
    if (this.authService.isLoggedIn()) {
      this.fetchExistingWebhook();
    } else {
      this.authService.setRedirectUrl('/trading-view');
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchExistingWebhook() {
    if (this.isLoading) return; // Prevent multiple simultaneous calls
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const subscription = this.tradingViewService.getWebhookDetails()
      .pipe(take(1)) // Automatically unsubscribe after first emission
      .subscribe({
        next: (response: WebhookResponse) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.hasExistingWebhook = true;
            this.webhookId = response.data.id || '';
            this.webhookName = response.data.webhook_name || '';
            this.apiKey = response.data.api_key || '';
            this.apiSecret = response.data.api_secret || '';
            this.webhookUrl = response.data.webhook_url || '';
          } else {
            this.hasExistingWebhook = false;
            this.resetWebhookData();
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.hasExistingWebhook = false;
          this.resetWebhookData();
          // Only show error if it's not a 404 (no webhook exists yet)
          if (error.status !== 404) {
            this.errorMessage = error.error?.message || 'Failed to fetch webhook details';
          }
        }
      });

    this.subscriptions.push(subscription);
  }

  private resetWebhookData() {
    this.webhookId = '';
    this.webhookName = '';
    this.apiKey = '';
    this.apiSecret = '';
    this.webhookUrl = '';
  }

  createOrUpdateWebhook() {
    if (!this.isRiskAcknowledged || !this.webhookName.trim()) {
      return;
    }

    this.isLoading = true;
    const webhookData: WebhookRequest = {
      webhook_name: this.webhookName.trim(),
      api_key: this.apiKey.trim(),
      api_secret: this.apiSecret.trim()
    };

    if (this.hasExistingWebhook) {
      this.updateWebhook(webhookData);
    } else {
      this.createWebhook(webhookData);
    }
  }

  private updateWebhook(webhookData: WebhookRequest) {
    this.tradingViewService.createWebhook(webhookData).subscribe({
      next: (response: WebhookResponse) => {
        this.isLoading = false;
        if (response.success) {
          if (response.data) {
            // Update form data with response
            this.webhookId = response.data.id || this.webhookId;
            this.webhookName = response.data.webhook_name || this.webhookName;
            this.apiKey = response.data.api_key || this.apiKey;
            this.apiSecret = response.data.api_secret || this.apiSecret;
            this.webhookUrl = response.data.webhook_url || this.webhookUrl;
            this.errorMessage = '';
            // Show success message
            this.showSuccessPopup = true;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update webhook';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while updating the webhook';
      }
    });
  }

  private createWebhook(webhookData: WebhookRequest) {
    this.tradingViewService.createWebhook(webhookData).subscribe({
      next: (response: WebhookResponse) => {
        this.isLoading = false;
        if (response.success) {
          if (response.data?.id) {
            this.webhookId = response.data.id;
          }
          // Only show OTP popup for new webhook creation
          this.showOtpPopup = true;
          this.startTimer();
        } else {
          this.errorMessage = response.message || 'Failed to create webhook';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while creating the webhook';
      }
    });
  }

  verifyOtp() {
    if (this.emailCode.length !== 6 || !this.webhookId) {
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    const verificationData = {
      email_code: this.emailCode,
      tfa_code: '',
      webhook_id: this.webhookId
    };

    this.tradingViewService.verifyOtp(verificationData).subscribe({
      next: (response) => {
        this.isVerifying = false;
        if (response.success) {
          if (response.data?.webhook_url) {
            this.webhookUrl = response.data.webhook_url;
            this.showOtpPopup = false;
            this.showSuccessPopup = true;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'Webhook URL not received';
          }
        } else {
          this.errorMessage = response.message || 'Failed to verify OTP';
        }
      },
      error: (error) => {
        this.isVerifying = false;
        this.errorMessage = error.error?.message || 'An error occurred while verifying OTP';
      }
    });
  }

  closeOtpPopup() {
    this.showOtpPopup = false;
    this.emailCode = '';
    this.tfaCode = '';
    this.errorMessage = '';
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  isFormValid(): boolean {
    return this.webhookName.trim().length > 0 && this.isRiskAcknowledged;
  }

  onCodeInput(event: any, type: 'email' | 'tfa') {
    const input = event.target.value;
    // Only allow numbers and limit to 6 digits
    const cleanInput = input.replace(/\D/g, '').substring(0, 6);
    if (type === 'email') {
      this.emailCode = cleanInput;
    } else {
      this.tfaCode = cleanInput;
    }
    this.errorMessage = '';
  }

  resendCode() {
    // TODO: Implement resend logic
    console.log('Resending verification code');
    this.timeLeft = 52;
    this.startTimer();
  }

  private startTimer() {
    const timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  openWebhookUrlPopup() {
    this.showWebhookUrlPopup = true;
  }

  closeWebhookUrlPopup() {
    this.showWebhookUrlPopup = false;
    this.showCopiedMessage = false;
  }

  copyWebhookUrl() {
    navigator.clipboard.writeText(this.webhookUrl);
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 1500);
  }

  copyCode() {
    this.showCodeCopiedMessage = true;
    setTimeout(() => {
      this.showCodeCopiedMessage = false;
    }, 1500);
  }

  openPineScriptPopup() {
    this.showPineScriptPopup = true;
  }

  closePineScriptPopup() {
    this.showPineScriptPopup = false;
    this.showCopiedMessage = false;
  }

  openCustomJsonPopup() {
    this.showCustomJsonPopup = true;
  }

  closeCustomJsonPopup() {
    this.showCustomJsonPopup = false;
    this.showCopiedMessage = false;
  }

  copyPineScript() {
    navigator.clipboard.writeText(this.tradingViewMessage);
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 1500);
  }

  getCustomJson(): string {
    const customJson = {
      ...this.customJsonTemplate,
      OrderType: this.orderType,
      Quantity: this.quantity,
      leverage: this.leverage
    };
    return JSON.stringify([customJson], null, 2);
  }

  copyCustomJson() {
    navigator.clipboard.writeText(this.getCustomJson());
    this.showCopiedMessage = true;
    setTimeout(() => {
      this.showCopiedMessage = false;
    }, 1500);
  }
}
