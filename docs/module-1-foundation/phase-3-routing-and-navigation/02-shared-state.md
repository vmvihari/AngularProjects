# Module 2: Shared State in Services

While it works in `AppComponent`, the ideal place for derived state like `openIssuesCount` is inside the `IssueService`.

Moving it to the service makes the count reusable across any component in your application and keeps your component classes strictly focused on the UI.

Here is how to refactor it:

### 1. Move the logic to IssueService
Open `src/app/issues/issue.service.ts` and add the computed signal:

```typescript
import { Injectable, resource, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  issuesResource = resource({
    // ... existing loader ...
  });

  // Move the derived state here!
  openIssuesCount = computed(() => 
    (this.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

  // ... existing methods ...
}
```

### 2. Clean up AppComponent
Open `src/app/app.component.ts`. Delete the `openIssuesCount` property from the class, and move your HTML template to issue-list component and read it directly from the injected service:

```html
<h3 style="margin-top: 0;">Open Issues: {{ issueService.openIssuesCount() }}</h3>
```

Once you have that cleaned up, are you ready to restore the "Edit Issue" functionality using the service so it works with our new routing setup?

Because our components are now decoupled by the router, all of that shared state (the search term, the edit draft) and the RxJS logic needs to move into the `IssueService` so both components can access it.

## Your Task: Centralize State in the Service

Let's migrate all of that logic into `src/app/issues/issue.service.ts`. Update your service to look like this:

```typescript
import { Injectable, resource, computed, signal, linkedSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IssueService {
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

  // --- Search Logic ---
  searchTerm = signal('');
  private searchTerm$ = toObservable(this.searchTerm).pipe(debounceTime(300));
  private debouncedSearch = toSignal(this.searchTerm$, { initialValue: '' });

  filteredIssues = computed(() => {
    const issues = this.issuesResource.value() ?? [];
    const term = this.debouncedSearch().toLowerCase();
    return issues.filter(i => i.title.toLowerCase().includes(term));
  });

  // --- Edit Logic ---
  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '');

  editIssue(issueId: number) {
    const issue = (this.issuesResource.value() ?? []).find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  resolveIssue(issueId: number) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => issue.id === issueId ? { ...issue, status: 'Closed' } : issue)
    );
  }

  updateIssueTitle(issueId: number, newTitle: string) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => issue.id === issueId ? { ...issue, title: newTitle } : issue)
    );
    this.selectedIssue.set(null); // Close the editor after saving
  }
}
```

### 3. Update the Components

Because `AppComponent` now acts as a routing shell, the search box and the edit form both need to move into `IssueListComponent` where the issues are actually being displayed. By injecting our shared `IssueService`, the `IssueListComponent` can directly read and update the state without relying on its parent.

#### Update `src/app/app.component.ts`

This becomes our clean layout shell. It only needs the `IssueService` to display the total open issues at the top:

```typescript
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { IssueService } from './issues/issue.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Issue Tracker</h2>
        <nav>
          <a routerLink="/issues" style="color: white; text-decoration: none;">Issues</a>
        </nav>
      </aside>
      <main class="content">
        <!-- Service holds the derived state -->
        <h3 style="margin-top: 0;">Open Issues: {{ issueService.openIssuesCount() }}</h3>
        
        <!-- The router dynamically loads IssueListComponent here -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [\`
    .layout { display: flex; height: 100vh; font-family: sans-serif; margin: -8px; }
    .sidebar { width: 220px; background: #2c3e50; color: white; padding: 20px; }
    .content { flex: 1; padding: 20px; background: #ecf0f1; }
  \\`]
})
export class AppComponent { }
```

#### Update `src/app/issues/issue-list/issue-list.component.ts`

Move the search box, the loading check, and the edit form here. Notice how every piece of data and action is now delegated directly to `issueService`:

```typescript
import { Component, inject } from '@angular/core';
import { IssueCardComponent } from '../issue-card/issue-card.component';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [IssueCardComponent],
  template: `
    <h2>Current Issues</h2>

    <!-- Read the computed signal by calling it like a function -->
    <h3 style="margin-top: 0;">
      Open Issues: {{ issueService.openIssuesCount() }}
    </h3>

    <input 
      placeholder="Search issues..." 
      (input)="issueService.searchTerm.set($any($event.target).value)" 
      style="padding: 5px; margin-bottom: 15px; width: 250px;" 
    />
    
    @if (issueService.issuesResource.isLoading()) {
      <p>Loading issues from server...</p>
    } @else {
      @for (issue of issueService.filteredIssues(); track issue.id) {
        <app-issue-card>
          <strong>{{ issue.title }}</strong> 
          <span style="margin-left: 10px;">[{{ issue.status }}]</span>
          
          @if (issue.status === 'Open') {
            <button actions (click)="issueService.resolveIssue(issue.id)">Resolve</button>
          }
          <!-- The edit button now calls the service directly -->
          <button actions (click)="issueService.editIssue(issue.id)" style="margin-left: 5px;">Edit</button>
        </app-issue-card>
      } @empty {
        <p>No issues found matching your search.</p>
      }
    }

    <!-- The Edit Form -->
    @if (issueService.selectedIssue()) {
      <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px;">
        <h3>Editing: {{ issueService.selectedIssue()?.title }}</h3>
        <input 
          [value]="issueService.draftTitle()" 
          (input)="issueService.draftTitle.set($any($event.target).value)" 
          style="padding: 5px; width: 250px;" />
        <button (click)="onSaveEdit()" style="margin-left: 10px;">Save</button>
        <button (click)="issueService.selectedIssue.set(null)" style="margin-left: 5px;">Cancel</button>
      </div>
    }
  `
})
export class IssueListComponent {
  issueService = inject(IssueService);

  onSaveEdit() {
    const selected = this.issueService.selectedIssue();
    if (selected) {
      this.issueService.updateIssueTitle(selected.id, this.issueService.draftTitle());
      this.issueService.selectedIssue.set(null); // <-- Add this line to hide the form!
    }
  }
}
```

Save both files, and your fully routed, service-driven Issue Tracker should be working perfectly!
