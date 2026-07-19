# Phase 5, Lesson 1: Enterprise State with NgRx SignalStore

Welcome to Phase 5! As your application grows, managing state in simple Services can become chaotic. While Signals make local state easy, Enterprise applications require structured, predictable, and scalable state management architectures.

Enter **NgRx SignalStore**. 

SignalStore is the modern, lightweight, and highly reactive state management solution built specifically for the Signals era of Angular. It replaces traditional boilerplate-heavy Redux-style NgRx with a clean, functional approach while maintaining full type safety and enterprise scalability.

## 🎯 Bootcamp Task: Refactor to NgRx SignalStore

Your task is to replace our custom `IssueService` with a dedicated NgRx SignalStore.

### Step 1: Install the Package
First, install the NgRx Signals package in your terminal:
```bash
npm install @ngrx/signals --legacy-peer-deps
```

### Step 2: Create the Issue Store
Open `libs/issues/data-access/src/lib/issue.store.ts` (you should rename this from `issue.service.ts`!). We are going to completely rewrite this into a Signal Store. 

In NgRx SignalStore, you define a store using the `signalStore()` function, combined with features like `withState()`, `withComputed()`, and `withMethods()`.

Replace the contents of `issue.store.ts` with the following:

```typescript
import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, delay, tap } from 'rxjs';

// 1. Define the state shape
export interface Issue {
  id: number;
  title: string;
  status: string;
}

interface IssueState {
  issues: Issue[];
  isLoading: boolean;
  filter: 'All' | 'Open' | 'Closed';
}

const initialState: IssueState = {
  issues: [],
  isLoading: false,
  filter: 'All'
};

// 2. Define the Store!
// Notice how we chain features together: State -> Computed -> Methods
export const IssueStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Derived state automatically recalculates!
    filteredIssues: computed(() => {
      const issues = store.issues();
      const filter = store.filter();
      if (filter === 'All') return issues;
      return issues.filter(i => i.status === filter);
    }),
    totalCount: computed(() => store.issues().length),
    openCount: computed(() => store.issues().filter(i => i.status === 'Open').length),
  })),
  withMethods((store) => ({
    // Synchronous state updates
    updateFilter(filter: 'All' | 'Open' | 'Closed') {
      patchState(store, { filter });
    },
    resolveIssue(id: number) {
      patchState(store, (state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, status: 'Closed' } : issue
        )
      }));
    },
    // Asynchronous operations using RxJS Interop!
    loadIssues: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        delay(1000), // Simulate network
        tap(() => {
          patchState(store, {
            issues: [
              { id: 1, title: 'Fix login validation', status: 'Open' },
              { id: 2, title: 'Update routing module', status: 'Closed' },
              { id: 3, title: 'Build issue list component', status: 'Open' }
            ],
            isLoading: false
          });
        })
      )
    )
  }))
);
```

### Step 3: Update Feature Manage
Since we renamed `IssueService` to `IssueStore`, we need to update our components!

Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`:
1. Change `import { IssueService }` to `import { IssueStore }`.
2. Change `public issueService = inject(IssueService);` to `public issueStore = inject(IssueStore);`.
3. In `ngOnInit()`, tell the store to load the data!
   ```typescript
   import { Component, inject, OnInit } from '@angular/core';
   // ...
   export class FeatureManage implements OnInit {
     public issueStore = inject(IssueStore);
     
     ngOnInit() {
       // Only trigger the load if we don't have data yet!
       // This prevents wiping out our state when navigating back to the screen,
       // while keeping loadIssues() reusable for a future "Refresh" button!
       if (this.issueStore.issues().length === 0) {
         this.issueStore.loadIssues();
       }
     }
     
     resolveIssue(issueId: number) {
       this.issueStore.resolveIssue(issueId);
     }
     
     filterIssues(status: string) {
       // Using type assertion to match our strict types
       this.issueStore.updateFilter(status as any);
     }
     // ...
   }
   ```

### Step 4: Update the Template
Open `feature-manage.html`.
Find and replace all instances of `issueService` with `issueStore`.

```html
  @if (issueStore.isLoading()) {
    ...
  } @else {
    <ul class="issue-list">
      @for (issue of issueStore.filteredIssues(); track issue.id) {
```

### Step 5: Try it out!
Save your files. NgRx SignalStore automatically provides `issues`, `isLoading`, and `filteredIssues` as deep Signals directly on the injected store object! Your application should function exactly as it did before, but now powered by an enterprise-grade state management architecture!
