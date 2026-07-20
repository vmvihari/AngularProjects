# Phase 8, Lesson 1: The Authentication Service (AuthStore)

Security is paramount in an enterprise application. To properly secure our application, we must first establish a reliable source of truth for the user's authentication state. 

In older Angular applications, this was done using an `AuthService` powered by RxJS `BehaviorSubject`s. Today, we will build a modern, signal-driven `AuthStore` using the **NgRx SignalStore**!

Since Authentication is a cross-cutting concern, we will place this store inside our newly created `shared/util-auth` library!

## Your Task: Build the AuthStore

### 1. Create the AuthStore
Create a new file at `libs/shared/util-auth/src/lib/auth.store.ts`.

Copy the following code into the file to build out our Authentication state management with advanced Enterprise Roles:

```typescript
import { inject, computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { StorageService } from '@enterprise-workspace/data-access'; 

// 1. Define the State Shape with Enterprise Roles!
export type Role = 'Admin' | 'Manager' | 'Developer' | 'Viewer';

export interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null
};

// 2. Build the Store
export const AuthStore = signalStore(
  { providedIn: 'root' }, // Singleton provided at the root
  withState(initialState),
  withComputed((store) => ({
    // Derived signals that automatically recalculate!
  withComputed((store) => ({
    // Derived signals that automatically recalculate!
    isAuthenticated: computed(() => !!store.token())
  })),
  withMethods((store, storage = inject(StorageService)) => ({
    // A robust method for checking if a user has ANY of the provided roles
    hasAnyRole(allowedRoles: string[]): boolean {
      const currentUser = store.user();
      if (!currentUser) return false;
      return allowedRoles.includes(currentUser.role);
    },
    // A dummy login method to simulate a successful API call
    login(username: string, role: Role) {
      const dummyToken = `my-secret-jwt-token-123-${role}`;
      const dummyUser: User = { 
        id: 'u1', 
        name: username, 
        role: role 
      };

      patchState(store, { user: dummyUser, token: dummyToken });
      
      // Persist the token to localStorage so we survive page reloads!
      storage.setItem('auth-token', dummyToken);
      storage.setItem('auth-role', role); // Also save the dummy role for the demo
    },
    
    logout() {
      patchState(store, { user: null, token: null });
      storage.removeItem('auth-token');
      storage.removeItem('auth-role');
    }
  })),
  // 3. Auto-Reload on App Boot!
  withHooks({
    onInit(store) {
      const storage = inject(StorageService);
      const savedToken = storage.getItem('auth-token');
      const savedRole = storage.getItem('auth-role') as Role;
      
      if (savedToken && savedRole) {
        // If they had a token, restore their session!
        patchState(store, { 
          token: savedToken, 
          user: { id: 'u1', name: savedRole, role: savedRole } 
        });
      }
    }
  })
);
```

### 2. Export the Store
Remember the **Strict Encapsulation** rule! For our application to use the `AuthStore`, we must expose it. 
Open `libs/shared/util-auth/src/index.ts` and export your new store:

```typescript
export * from './lib/interceptors/auth.interceptor';
export * from './lib/auth.store'; // <-- Add this!
```

### 3. Check Your Work
You have just built a completely decoupled, highly-reusable Authentication Store that can be injected into any component, service, or interceptor in your workspace! 

Notice the powerful `hasAnyRole` computed signal! In the coming lessons, we will use this exact method to lock down routes and UI elements based on an array of allowed roles.

Next up, we will build a real Login Page so users can actually sign in!
