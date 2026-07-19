# Phase 6, Lesson 1: The Enterprise Storage Service

Welcome to Phase 6! In this phase, we are going to learn how to persist state across browser reloads using the browser's Web Storage API (`localStorage`). 

However, in an enterprise Angular application (especially one using Server-Side Rendering (SSR)), you should **never** access the global `window.localStorage` object directly. 

Why? Because the `window` object doesn't exist on the server! If an SSR process tries to read `localStorage`, your application will crash. Furthermore, injecting a service makes your code infinitely easier to unit test.

## 🎯 Bootcamp Task: Build the Storage Service

Your task is to build an injectable `StorageService` that safely wraps the browser API.

### Step 1: Generate the Service
We want this service to be available application-wide. Let's create it in our `data-access` library.

Create a new file: `libs/issues/data-access/src/lib/storage.service.ts`.

### Step 2: Implement Safe Storage
In this service, we will inject Angular's `PLATFORM_ID`. This is a special token that tells us whether the code is currently running in the browser or on the server. We will use the `isPlatformBrowser` utility function to ensure we only touch `localStorage` when it's safe to do so!

Add the following implementation to your new file:

```typescript
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
```

### Step 3: Export it!
Don't forget to expose your new service to the rest of the workspace!
Open your barrel file: `libs/issues/data-access/src/index.ts`.

Add the export:
```typescript
export * from './lib/storage.service';
```

Now you have a perfectly safe, enterprise-grade wrapper around `localStorage`. In the next lesson, we will use it to implement a real-world Dark Mode toggle!
