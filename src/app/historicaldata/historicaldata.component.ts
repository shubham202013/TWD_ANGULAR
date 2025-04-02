import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BinanceService } from '../services/binance.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-historicaldata',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './historicaldata.component.html',
  styleUrl: './historicaldata.component.scss'
})
export class HistoricaldataComponent {
  // symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "XRPUSDT", "BNBUSDT"]

  queryForm!: FormGroup
  symbol: string = 'BTCUSDT';
  timeframe: string = '5m';
  startDate: string = '';
  localStorageToken: string | null = localStorage.getItem('authToken');
  showQueryForm: boolean = false;
  isSubmit: boolean = false;

  qsymbol: string = 'BTCUSDT';
  qtimeframe: string = '5m';
  qstartDate: string = '';
  qendDate: string = '';
  qemail: string = '';

  constructor(private binanceService: BinanceService, private router: Router, private authService: AuthService, private formBuilder: FormBuilder) { }
  
  ngOnInit() {
    if(localStorage.getItem('form') != null){
      let obj = JSON.parse(localStorage.getItem('form') || '{}');
      this.symbol = obj.symbol;
      this.timeframe = obj.timeframe;
      this.startDate = obj.startDate;
      this.fetchDataAndDownload()
      localStorage.removeItem('form');
    }

    this.queryForm = this.formBuilder.group({
      qsymbol: [this.qsymbol, Validators.required],
      qtimeframe: [this.qtimeframe, Validators.required],
      qstartDate: [this.qstartDate, Validators.required],
      qendDate: [this.qendDate, Validators.required],
      qemail: [this.qemail, Validators.required]
    });

  }


  fetchDataAndDownload() {
    if (!this.startDate) {
      alert('Please select a valid start date.');
      return;
    }


    if (this.localStorageToken == null){
      let obj:any = {
        symbol: this.symbol, 
        timeframe:this.timeframe, 
        startDate:this.startDate
      }
      localStorage.setItem('form',JSON.stringify(obj));
      this.authService.setRedirectUrl('/data');
      this.router.navigate(['/login']);
    }else{

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

  fetchDataAndSubmitForm(formData: any) {
    this.isSubmit = true;
    if (this.queryForm.valid){
      console.log(this.queryForm.value);
    }

  }


}
