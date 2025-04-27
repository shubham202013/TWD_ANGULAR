import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {}

  ensureLightTheme() {
    // Set HTML root element to light mode class
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
} 