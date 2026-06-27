# Resource API for Asynchronous Data

Let's tackle asynchronous data fetching using Angular's `resource` API.

In .NET, you might await a Task to fetch data and manually update a UI-bound property. In Angular, the `resource` function handles this automatically. It accepts an asynchronous loader (like a Promise) and returns an object containing signals for the data (`value`), the loading state (`isLoading`), and the exact `status`.

Crucially, the `.value` signal returned by a resource is writable. This means you can fetch data from an API, and then update it locally in the UI before sending a save request back to the server.

### Your Task: Fetch Issues with `resource`

Let's refactor `AppComponent` to simulate fetching our issues from a backend API using a `resource`, and display a loading message while it fetches.

Update `src/app/app.component.ts` to this:

```typescript
import { Component, signal, computed, linkedSignal, resource } from '@angular/core';
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
        
        <!-- Check the loading state signal -->
        @if (issuesResource.isLoading()) {
          <p>Loading issues from server...</p>
        } @else {
          <!-- Pass the resolved value (or an empty array if undefined) -->
          <app-issue-list 
            [issues]="issuesResource.value() ?? []" 
            (resolveIssue)="onResolve($event)"
            (editIssue)="onEdit($event)">
          </app-issue-list>
        }

        @if (selectedIssue()) {
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px;">
            <h3>Editing: {{ selectedIssue()?.title }}</h3>
            <input 
              [value]="draftTitle()" 
              (input)="draftTitle.set($any($event.target).value)" 
              style="padding: 5px; width: 250px;" />
            <button (click)="onSaveEdit()" style="margin-left: 10px;">Save</button>
            <button (click)="selectedIssue.set(null)" style="margin-left: 5px;">Cancel</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [ /* ... keep existing styles ... */ ]
})
export class AppComponent {
  // 1. Replace issuesList signal with a resource
  issuesResource = resource({
    loader: async () => {
      // Simulate a 1-second network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Fix login validation', status: 'Open' },
        { id: 2, title: 'Update routing module', status: 'Closed' },
        { id: 3, title: 'Build issue list component', status: 'Open' }
      ];
    }
  });

  // 2. Update computed to safely read from issuesResource.value()
  openIssuesCount = computed(() => 
    (this.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '');

  // 3. Update the local resource value using .value.update()
  onResolve(issueId: number) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => issue.id === issueId ? { ...issue, status: 'Closed' } : issue)
    );
  }

  onEdit(issueId: number) {
    const issue = (this.issuesResource.value() ?? []).find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  onSaveEdit() {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => 
        issue.id === this.selectedIssue()?.id ? { ...issue, title: this.draftTitle() } : issue
      )
    );
    this.selectedIssue.set(null);
  }
}
```

When you save this and check your browser, you should see "Loading issues from server..." for one second before the list appears.
