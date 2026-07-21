import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PreferencesStore, SignalRService, StorageService } from '@enterprise-workspace/data-access';
import { DOCUMENT } from '@angular/common';
import { AuthStore } from '@enterprise-workspace/shared-util-auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { 
  public preferences = inject(PreferencesStore);
  private storage = inject(StorageService);
  private document = inject(DOCUMENT);
  private authStore = inject(AuthStore);
  private signalRService = inject(SignalRService);

  constructor() {
    // This effect runs automatically whenever 'theme()' changes!
    effect(() => {
      const currentTheme = this.preferences.theme();
      
      // 1. Save to local storage
      this.storage.setItem('app-theme', currentTheme);
      
      // 2. Update the DOM to apply the theme
      if (currentTheme === 'dark') {
        this.document.body.classList.add('dark-theme');
      } else {
        this.document.body.classList.remove('dark-theme');
      }

      if (this.authStore.isAuthenticated()) {
        this.signalRService.startConnection();
      } else {
        this.signalRService.stopConnection();
      }
    });
  }
}