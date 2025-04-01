import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BinanceService } from '../services/binance.service';

@Component({
  selector: 'app-historicaldata',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FormsModule, CommonModule],
  templateUrl: './historicaldata.component.html',
  styleUrl: './historicaldata.component.scss'
})
export class HistoricaldataComponent {
  // symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "BNBUSDT"]

  symbol: string = 'BTCUSDT';
  timeframe: string = '5m';
  startDate: string = '';

  constructor(private binanceService: BinanceService) {}

  fetchDataAndDownload() {
    if (!this.startDate) {
      alert('Please select a valid start date.');
      return;
    }

    console.log('Fetching data for:', this.symbol, 'from:', this.startDate, "timefrme:",this.timeframe);

    this.binanceService.getHistoricalData(this.symbol, this.timeframe, this.startDate).subscribe(
      (data) => {
        const csvContent = this.binanceService.convertToCSV(data);
        this.binanceService.downloadCSV(csvContent, `${this.symbol}_data_${new Date().toISOString()}.csv`);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


}
