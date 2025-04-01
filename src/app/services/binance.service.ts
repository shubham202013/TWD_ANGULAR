import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class BinanceService {
  private BASE_URL = 'https://api.binance.com/api/v3/klines';

  constructor(private http: HttpClient) {}

  getHistoricalData(symbol: string, interval: string, startDate: string): Observable<any> {
    const params = new HttpParams()
      .set('symbol', symbol)
      .set('interval', interval)
      .set('startTime', new Date(startDate).getTime().toString())
      .set('limit', '1000'); // Adjust limit as needed

    return this.http.get(this.BASE_URL, { params });
  }

  convertToCSV(data: any[]): string {
    const csvData = data.map((row) => ({
      open_time: new Date(row[0]).toISOString(),
      open: row[1],
      high: row[2],
      low: row[3],
      close: row[4],
      volume: row[5],
      close_time: new Date(row[6]).toISOString(),
      number_of_trades: row[8],
    }));

    return Papa.unparse(csvData);
  }

  downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
}
