import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing',
  imports: [NavbarComponent, RouterModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  openGoogleForm(): void {
    debugger
    window.open('https://forms.gle/Ss9P8iTw2Sv21SLV7', '_blank');
  }
  

}
