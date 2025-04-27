import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ensureLightTheme() {
    // Only manipulate DOM when in browser environment
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }
} 