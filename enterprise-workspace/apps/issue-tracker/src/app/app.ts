import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PreferencesStore, StorageService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { 
  public preferences = inject(PreferencesStore);
  private storage = inject(StorageService);

  constructor() {
    // This effect runs automatically whenever 'theme()' changes!
    effect(() => {
      const currentTheme = this.preferences.theme();
      
      // 1. Save to local storage
      this.storage.setItem('app-theme', currentTheme);
      
      // 2. Update the DOM to apply the theme
      if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    });
  }
}