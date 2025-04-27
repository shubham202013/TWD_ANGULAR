import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { TradingViewService } from '../services/trading-view.service';

@Component({
  selector: 'app-trading-view',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './trading-view.component.html',
  styleUrl: './trading-view.component.scss'
})
export class TradingViewComponent {
  webhookName: string = '';
  apiKey: string = '';
  apiSecret: string = '';
  isRiskAcknowledged: boolean = false;
  showOtpPopup: boolean = false;
  showSuccessPopup: boolean = false;
  showCopiedMessage: boolean = false;
  showCodeCopiedMessage: boolean = false;
  emailCode: string = '';
  tfaCode: string = '';
  timeLeft: number = 52;
  webhookUrl: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isVerifying: boolean = false;
  webhookId: string = '';
  tradingViewMessage: string = `{
    "symbol":{{ticker}},
    "side":{{strategy.order.action}},
    "qty":{{strategy.order.contracts}},
    "price":{{close}}
  }`;

  accounts = ['Main', 'Account 2', 'Account 3'];
  sources = ['Tradingview'];

  constructor(private tradingViewService: TradingViewService) {}

  createWebhook() {
    if (!this.isRiskAcknowledged || !this.webhookName.trim()) {
      return;
    }

    this.isLoading = true;
    const webhookData = {
      webhook_name: this.webhookName.trim(),
      api_key: this.apiKey.trim(),
      api_secret: this.apiSecret.trim()
    };

    this.tradingViewService.createWebhook(webhookData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          if (response.data?.id) {
            this.webhookId = response.data.id;
          }
          this.showOtpPopup = true;
          this.startTimer();
        } else {
          this.errorMessage = response.message || 'Failed to create webhook';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while creating the webhook';
      }
    });
  }

  verifyOtp() {
    if (this.emailCode.length !== 6 || this.tfaCode.length !== 6 || !this.webhookId) {
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    const verificationData = {
      email_code: this.emailCode,
      tfa_code: this.tfaCode,
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

  copyWebhookUrl() {
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
}
