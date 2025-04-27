import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'demo-project';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Ensure light theme is applied on app initialization
    this.themeService.ensureLightTheme();
  }
}
