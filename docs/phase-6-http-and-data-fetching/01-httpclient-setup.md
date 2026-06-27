# Module 1: Modern HttpClient Setup

To communicate with our new .NET backend, Angular provides the `HttpClient` service. In modern standalone Angular, this service is provided at the application level via the `provideHttpClient` function.

## Your Task: Configure & Test HttpClient

### 1. Update Application Config
Open `src/app/app.config.ts`. Add `provideHttpClient()` with the `withFetch()` feature to enable the native browser fetch API.

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

### 2. Your Task: Let's swap out your hardcoded data for a real HTTP request.
Open `src/app/app.component.ts`. We will inject the `HttpClient` and dump the raw JSON response directly onto the screen.

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common'; // <-- Import JsonPipe!
import { HttpClient } from '@angular/common/http'; // <-- Import HttpClient
import { toSignal } from '@angular/core/rxjs-interop'; // <-- Import toSignal

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, JsonPipe], // <-- Add JsonPipe here!
  template: `
    <div class="layout">
      <!-- ... your existing sidebar ... -->
      <main class="content">
      
        <!-- TEMPORARY TEST: Dump the API response to the screen -->
        <div style="background: black; color: lime; padding: 10px; margin-bottom: 20px;">
          API TEST: {{ apiResponse() | json }}
        </div>
        
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  private http = inject(HttpClient);
  
  // We use Angular's RxJS interop to seamlessly convert the HTTP Observable into a Signal!
  apiResponse = toSignal(this.http.get('http://localhost:5000/api/issues'));
}
```

Save the file. If your .NET API is running, you should instantly see the raw JSON data rendered in a black box at the top of your screen! You've successfully made your first Angular HTTP request!
