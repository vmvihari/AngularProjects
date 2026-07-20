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