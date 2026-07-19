# Phase 6, Lesson 2: Theme Preferences

The most common real-world use case for `localStorage` in modern web applications is persisting user UI preferences, such as Light or Dark mode.

In this lesson, we will build a `PreferencesStore` using NgRx SignalStore, and synchronize it with the browser's storage using Angular's `effect()`!

## 🎯 Bootcamp Task: Dark Mode Toggle

Your task is to build a Theme Switcher that remembers the user's choice even when they refresh the page.

### Step 1: Create the Preferences Store
Create a new file: `libs/issues/data-access/src/lib/preferences.store.ts`.

In this store, we will track the current theme. We will also inject the `StorageService` we built in the last lesson to load the initial theme on startup!

```typescript
import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { StorageService } from './storage.service';

type Theme = 'light' | 'dark';

interface PreferencesState {
  theme: Theme;
}

const initialState: PreferencesState = {
  theme: 'light' // Default fallback
};

export const PreferencesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    toggleTheme() {
      patchState(store, (state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      }));
    }
  })),
  // The withHooks feature runs when the store is initialized!
  withHooks({
    onInit(store) {
      const storage = inject(StorageService);
      
      // Load saved theme from storage on boot!
      const savedTheme = storage.getItem('app-theme') as Theme;
      if (savedTheme) {
        patchState(store, { theme: savedTheme });
      }
    }
  })
);
```

### Step 2: Export it!
Open your barrel file (`libs/issues/data-access/src/index.ts`) and export your new store:
```typescript
export * from './lib/preferences.store';
```

### Step 3: Wire up the Effect in the UI!
Open `apps/issue-tracker/src/app/app.ts`.

We need to inject our `PreferencesStore` and our `StorageService`. We will use an Angular `effect()` to listen to changes on `theme()`. Every time it changes, the effect will automatically fire, save the new theme to `localStorage`, and update the `<body>` class!

```typescript
import { Component, inject, effect } from '@angular/core';
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
```

### Step 4: Add the Toggle Button
Open `apps/issue-tracker/src/app/app.html`.

Let's add a button to the `.topbar` container to toggle the theme! Insert this right before the `.user-profile` image:

```html
      <div style="margin-right: 20px;">
        <button 
          (click)="preferences.toggleTheme()"
          style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; transition: transform 0.2s;"
        >
          {{ preferences.theme() === 'dark' ? '☀️' : '🌙' }}
        </button>
      </div>
```

### Step 5: Try it out!
Save your files and test out your app in the browser.
Click the moon icon in the top right. You should see the icon change to a sun! If you open your browser's Developer Tools -> Application -> Local Storage, you will see `app-theme` saved as `dark`.

If you refresh the page, it will remember your selection!

*(Note: We haven't actually written the CSS for `.dark-theme` yet, but the state management persistence is fully functional!)*
