# RxJS Interoperability

Let's wrap up Phase 2 with RxJS Interoperability.

In enterprise Angular applications, you will frequently encounter RxJS Observables—especially when integrating with older codebases or doing complex asynchronous event handling. To seamlessly bridge the gap between reactive streams and Signals, Angular provides `toSignal` and `toObservable`.

- `toObservable`: Creates an RxJS Observable that tracks the value of a Signal.
- `toSignal`: Creates a Signal that tracks the value of an RxJS Observable, subscribing immediately and cleaning itself up automatically when the component is destroyed.

## Your Task: Search Box with RxJS Debounce

Let's add a search box to filter our issues. We want to avoid filtering on every single keystroke, so we will convert our search term Signal into an Observable to apply an RxJS `debounceTime` operator, and then convert it back to a Signal for our template to read.

Update `src/app/app.component.ts` to include the RxJS imports and the new search logic:

```typescript
import { Component, signal, computed, linkedSignal, resource } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { IssueListComponent } from './issue-list/issue-list.component';

@Component({
  selector: 'app-root',
  imports: [IssueListComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Issue Tracker</h2>
        <nav>Issues</nav>
      </aside>
      <main class="content">
        <h3 style="margin-top: 0;">Open Issues: {{ openIssuesCount() }}</h3>
        
        <!-- Search Input -->
        <input 
          placeholder="Search issues..." 
          (input)="searchTerm.set($any($event.target).value)" 
          style="padding: 5px; margin-bottom: 15px; width: 250px;" 
        />
        
        @if (issuesResource.isLoading()) {
          <p>Loading issues from server...</p>
        } @else {
          <!-- Bind to our new filteredIssues computed signal -->
          <app-issue-list 
            [issues]="filteredIssues()" 
            (resolveIssue)="onResolve($event)"
            (editIssue)="onEdit($event)">
          </app-issue-list>
        }

        <!-- Edit Form Omitted for Brevity (Keep your existing edit form here) -->
      </main>
    </div>
  `,
  styles: [ /* ... keep existing styles ... */ ]
})
export class AppComponent {
  // Existing resource...
  issuesResource = resource({
    loader: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Fix login validation', status: 'Open' },
        { id: 2, title: 'Update routing module', status: 'Closed' },
        { id: 3, title: 'Build issue list component', status: 'Open' }
      ];
    }
  });

  openIssuesCount = computed(() => 
    (this.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

  // --- NEW RXJS INTEROP LOGIC ---
  searchTerm = signal('');

  // 1. Convert Signal to Observable to use RxJS operators
  searchTerm$ = toObservable(this.searchTerm).pipe(debounceTime(300));

  // 2. Convert Observable back to Signal (requires an initial value)
  debouncedSearch = toSignal(this.searchTerm$, { initialValue: '' });

  // 3. Computed signal to filter the issues list
  filteredIssues = computed(() => {
    const issues = this.issuesResource.value() ?? [];
    const term = this.debouncedSearch().toLowerCase();
    return issues.filter(i => i.title.toLowerCase().includes(term));
  });
  // ------------------------------

  // Keep your existing selectedIssue, draftTitle, onResolve, onEdit, and onSaveEdit...
}
```

Try typing into the search box. You will notice a slight 300ms delay before the list filters, preventing unnecessary recalculations while the user is actively typing.
