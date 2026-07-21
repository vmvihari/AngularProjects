import { computed, inject, effect } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, delay, tap, switchMap } from 'rxjs';
import { SignalRService, StorageService } from '@enterprise-workspace/data-access'
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../apps/issue-tracker/src/environments/environment';

// 1. Define the state shape
export interface Issue {
  id: number;
  title: string;
  status: string;
  description?: string;
  tags?: string[];
  createdAt: string; // ISO 8601 string from the API
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
  withMethods((store, http = inject(HttpClient)) => ({
    // Synchronous state updates
    updateFilter(filter: 'All' | 'Open' | 'Closed') {
      patchState(store, { filter });
    },
    addIssue(title: string, description: string, tags: string[] = []) {
      // 1. Optimistic UI Update
      const tempId = Date.now(); 
      patchState(store, (state) => ({
        issues: [...state.issues, { id: tempId, title, description, status: 'Open', tags, createdAt: new Date().toISOString() }]
      }));

      // 2. Background Sync
      http.post(`${environment.apiUrl}/issues`, { title, description, status: 'Open', tags }).subscribe();
    },
    updateIssue(id: number, updatedFields: Partial<Issue>) {
      patchState(store, (state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, ...updatedFields } : issue
        )
      }));

      http.put(`${environment.apiUrl}/issues/${id}`, updatedFields).subscribe();
    },
    resolveIssue(id: number) {
      patchState(store, (state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, status: 'Closed' } : issue
        )
      }));

      // 2. Background Sync
      http.put(`${environment.apiUrl}/issues/${id}`, { status: 'Closed' }).subscribe();
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

      // 2. Background Sync
      http.put(`${environment.apiUrl}/issues/${id}`, { title: newTitle }).subscribe();
    },
    // Asynchronous operations using RxJS Interop!
    loadIssues: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => http.get<Issue[]>(`${environment.apiUrl}/issues`).pipe(
          tap((issues) => {
          patchState(store, { issues, isLoading: false });
          })
        ))
      )
    )
  })), // <--- FIXED: Added the second closing parenthesis here!
  withHooks({
    onInit(store) {
      // Fetch initial data!
      store.loadIssues();

      // 1. Inject the SignalR service
      const signalR = inject(SignalRService);

      // 2. We use an effect to ensure the connection exists before subscribing!
      effect(() => {
        const connection = signalR.connection;
        
        if (connection && connection.state === 'Connected') {
          console.log('🎧 Registering Hub Listeners...');

          // Listen for updates from the server
          connection.on('IssueUpdated', (updatedIssue: Issue) => {
            console.log('⚡ Real-time update received:', updatedIssue);
            
            // Instantly patch the store!
            patchState(store, (state) => ({
              issues: state.issues.map(issue => 
                issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue
              )
            }));
          });

          // Listen for new issues being created
          connection.on('IssueCreated', (newIssue: Issue) => {
            patchState(store, (state) => ({
              // Add the new issue to the top of the array
              issues: [newIssue, ...state.issues]
            }));
          });
          
          // Listen for deleted issues
          connection.on('IssueDeleted', (deletedId: number) => {
            patchState(store, (state) => ({
              issues: state.issues.filter(issue => issue.id !== deletedId)
            }));
          });
        }
      });
    }
  })
);