# Module 1: Signals

Angular uses Signals for state management. A signal is a lightweight wrapper around a value that notifies interested consumers when that value changes.

There are two main types to start with:

* **Writable Signals (`signal`)**: You can directly change their value using the `.set()` or `.update()` methods.
* **Computed Signals (`computed`)**: These are read-only signals that derive their value from other signals. They are lazily evaluated and memoized for performance.

### Signals vs. Output Emitters

Think of an output emitter like a C# event—it is specifically used to pass messages or data from a child component up to its parent. A signal is entirely different; it is Angular's internal state management tool.

You do use outputs to notify a parent component that a value has changed. However, once the parent receives that event, it needs a place to store the new data and automatically trigger the HTML template to re-render. That reactive storage mechanism is the signal.

**In short:** Outputs move data across component boundaries, while signals store data and drive the UI updates.

Your Task: Let's refactor your AppComponent to manage its state with signals. We will wrap your issuesList in a signal() and add a computed() signal to track the number of open issues.

Update your src/app/app.component.ts to include the signal and computed imports, and update the component logic:

```typescript
import { Component, signal, computed } from '@angular/core';
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
        <!-- Read the computed signal by calling it like a function -->
        <h3 style="margin-top: 0;">Open Issues: {{ openIssuesCount() }}</h3>
        
        <!-- Pass the unwrapped signal value to the child -->
        <app-issue-list 
          [issues]="issuesList()" 
          (resolveIssue)="onResolve($event)">
        </app-issue-list>
      </main>
    </div>
  `,
  styles: [ /* ... keep your existing styles ... */ ]
})
export class AppComponent {
  // 1. Create a Writable Signal
  issuesList = signal([
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ]);

  // 2. Create a Computed Signal
  openIssuesCount = computed(() => 
    this.issuesList().filter(issue => issue.status === 'Open').length
  );

  onResolve(issueId: number) {
    // 3. Update the signal using an immutable pattern
    this.issuesList.update(issues => 
      issues.map(issue => 
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    );
  }
}
```

Notice how we use .update() to pass in a function that returns a brand new array.

This immutable approach ensures Angular's change detection catches the update immediately.