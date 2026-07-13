# Module 2: Advanced Signals

Let's move on to Advanced Signals, starting with `linkedSignal`.

While a `computed` signal is entirely read-only, a `linkedSignal` lets you create a writable signal whose value is intrinsically linked to some other state. You pass it a computation function (just like `computed`), but you can still manually update its value using `.set()` or `.update()`.

If the underlying dependent state changes, the `linkedSignal` automatically resets itself to the new computed result.

## Your Task: Add an "Edit Issue" Feature

Let's add an "Edit Issue" feature. When you select an issue, we want a `draftTitle` signal to automatically populate with that issue's current title. Because it's a `linkedSignal`, we can let the user type to overwrite the draft, and it will automatically reset if they select a different issue.

### 1. Update `src/app/issue-list/issue-list.component.ts`

Add an output event so we can select an issue to edit:

```typescript
import { Component, input, output } from '@angular/core';
import { IssueCardComponent } from '../issue-card/issue-card.component';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [IssueCardComponent],
  template: `
    <h2>Current Issues</h2>
    @for (issue of issues(); track issue.id) {
      <app-issue-card>
        <strong>{{ issue.title }}</strong> 
        <span style="margin-left: 10px;">[{{ issue.status }}]</span>
        
        @if (issue.status === 'Open') {
          <button actions (click)="resolveIssue.emit(issue.id)">Resolve</button>
        }
        <!-- Add an edit button -->
        <button actions (click)="editIssue.emit(issue.id)" style="margin-left: 5px;">Edit</button>
      </app-issue-card>
    } @empty {
      <p>No issues found.</p>
    }
  `
})
export class IssueListComponent {
  issues = input<{id: number, title: string, status: string}[]>([]);
  resolveIssue = output<number>();
  editIssue = output<number>(); // New output
}
```

### 2. Update `src/app/app.component.ts`

Add the `linkedSignal` to hold the draft state, and a simple edit form in the template:

```typescript
import { Component, signal, computed, linkedSignal } from '@angular/core';
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
        
        <app-issue-list 
          [issues]="issuesList()" 
          (resolveIssue)="onResolve($event)"
          (editIssue)="onEdit($event)">
        </app-issue-list>

        <!-- Our inline editor using the linkedSignal -->
        @if (selectedIssue()) {
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px;">
            <h3>Editing: {{ selectedIssue()?.title }}</h3>
            <!-- Bind the input to the draftTitle linkedSignal -->
            <input 
              [value]="draftTitle()" 
              (input)="draftTitle.set($any($event.target).value)" 
              style="padding: 5px; width: 250px;" />
            <button (click)="onSaveEdit()" style="margin-left: 10px;">Save Changes</button>
            <button (click)="selectedIssue.set(null)" style="margin-left: 5px;">Cancel</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [ /* ... keep existing styles ... */ ]
})
export class AppComponent {
  issuesList = signal([
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ]);

  openIssuesCount = computed(() => 
    this.issuesList().filter(issue => issue.status === 'Open').length
  );

  // Track the issue currently being edited
  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);

  // linkedSignal: defaults to the selected issue's title, but updates freely when typed in!
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '');

  onResolve(issueId: number) {
    this.issuesList.update(issues => 
      issues.map(issue => issue.id === issueId ? { ...issue, status: 'Closed' } : issue)
    );
  }

  onEdit(issueId: number) {
    const issue = this.issuesList().find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  onSaveEdit() {
    this.issuesList.update(issues => 
      issues.map(issue => 
        issue.id === this.selectedIssue()?.id ? { ...issue, title: this.draftTitle() } : issue
      )
    );
    this.selectedIssue.set(null); // Close the editor
  }
}
```

Try clicking "Edit" on different issues. Notice how `draftTitle` instantly resets to match the newly selected issue, but you can still type into the input box to overwrite it.

