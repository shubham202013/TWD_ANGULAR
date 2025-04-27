import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backtest',
  imports: [NavbarComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './backtest.component.html',
  styleUrl: './backtest.component.scss'
})
export class BacktestComponent {

  isConnectView = false;
  isCredentialsView = false;

  showConnectView() {
    this.isConnectView = true;
    this.isCredentialsView = false;
  }
  
  showCredentialsView() {
    this.isConnectView = false;
    this.isCredentialsView = true;
  }

  goBack() {
    this.isConnectView = false;
    this.isCredentialsView = false;
  }



}
