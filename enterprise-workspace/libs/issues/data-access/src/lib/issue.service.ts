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
    openCount: computed(() => store.issues().filter(i => i.status === 'Open').length)
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
    getIssueById(id: number) {
      return store.issues().find(issue => issue.id === id);
    },
    updateTitle(id: number, newTitle: string) {
      patchState(store, (state) => ({
        issues: state.issues.map(issue =>
          issue.id === id ? { ...issue, title: newTitle } : issue
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