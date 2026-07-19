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
        // We use 'as Theme' because TypeScript occasionally broadens ternary string literals to 'string'
        theme: (state.theme === 'light' ? 'dark' : 'light') as Theme
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