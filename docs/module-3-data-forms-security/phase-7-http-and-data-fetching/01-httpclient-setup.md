# Phase 7, Lesson 1: Modern HttpClient Setup

To communicate with our new .NET backend, Angular provides the `HttpClient` service. In modern standalone Angular, this service is provided at the application level via the `provideHttpClient` function.

## Your Task: Configure & Test HttpClient

### 1. Update Application Config
Open `apps/issue-tracker/src/app/app.config.ts`. Add `provideHttpClient()` with the `withFetch()` feature to enable the native browser fetch API.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // <-- Import these!

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()) // <-- Add this!
  ]
};
```

### 2. Add HttpClient to your root component
Open `apps/issue-tracker/src/app/app.ts`. We will inject the `HttpClient` and make a test API call!

```typescript
import { Component, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PreferencesStore, StorageService } from '@enterprise-workspace/data-access';
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient
import { toSignal } from '@angular/core/rxjs-interop'; // <-- Import toSignal
import { JsonPipe } from '@angular/common'; // <-- Import JsonPipe

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, JsonPipe], // <-- Add JsonPipe here!
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { 
  public preferences = inject(PreferencesStore);
  private storage = inject(StorageService);
  
  // Inject the HttpClient
  private http = inject(HttpClient);
  
  // We use Angular's RxJS interop to seamlessly convert the HTTP Observable into a Signal!
  apiResponse = toSignal(this.http.get('http://localhost:5000/api/issues'));

  constructor() {
    effect(() => {
      /* existing effect code... */
    });
  }
}
```

### 3. Dump the API response to the screen
Open `apps/issue-tracker/src/app/app.html`.

Right above the `<div class="router-wrapper">`, add this temporary JSON dump so we can physically see the response from the .NET API!

```html
    <header class="topbar">
      <!-- ... -->
    </header>
    
    <!-- TEMPORARY TEST: Dump the API response to the screen -->
    <div style="background: black; color: lime; padding: 10px; margin-bottom: 20px;">
      API TEST: {{ apiResponse() | json }}
    </div>
    
    <div class="router-wrapper">
      <router-outlet></router-outlet>
    </div>
```

Save your files. If your .NET API is running, you should instantly see the raw JSON data rendered in a black box at the top of your screen! You've successfully made your first Angular HTTP request!
