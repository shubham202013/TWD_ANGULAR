import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { HistoricaldataComponent } from './historicaldata/historicaldata.component';
import { PricingComponent } from './pricing/pricing.component';
import { BacktestComponent } from './backtest/backtest.component';
import { LegManagerComponent } from './leg-manager/leg-manager.component';
import { TradingViewComponent } from './trading-view/trading-view.component';

export const routes: Routes = [

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'data', component: HistoricaldataComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'backtest', component: LegManagerComponent },
  { path: 'trading-view', component: TradingViewComponent },
  { path: '**', redirectTo: 'dashboard' } 

];
