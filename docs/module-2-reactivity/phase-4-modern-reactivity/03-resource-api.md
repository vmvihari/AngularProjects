# Phase 4, Lesson 3: Resource API for Asynchronous Data

Let's tackle asynchronous data fetching using Angular's brand new `resource` API.

In .NET, you might `await` a `Task` to fetch data and manually update a UI-bound property. In older Angular versions, you'd use complex RxJS chains. In modern Angular, the `resource` function handles this automatically! 

It accepts an asynchronous `loader` (like a Promise) and returns an object containing signals for the data (`value`), the loading state (`isLoading`), and the exact `status` (Idle, Loading, Resolved, Error).

Crucially, the `.value` signal returned by a resource is writable. This means you can fetch data from an API, and then instantly update it locally in the UI before sending a save request back to the server (optimistic updates!).

---

## 🎯 Bootcamp Task: Fetching Issues with `resource`

Let's refactor our `IssueService` to simulate fetching our issues from a slow backend API using a `resource`, and update our Dashboard and Manage views to handle the loading state!

### Step 1: Refactor the Service
Open `libs/issues/data-access/src/lib/issue.service.ts`.

Replace your Writable `signal` with a `resource`:

```typescript
import { Injectable, computed, resource } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  
  // 1. Replace 'signal' with 'resource'
  private issuesResource = resource({
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

  // 2. Expose the data and loading state
  // Notice the fallback to `?? []` since resource.value() is undefined while loading!
  issues = computed(() => this.issuesResource.value() ?? []);
  isLoading = this.issuesResource.isLoading;

  // 3. Keep the existing computed signals!
  totalIssuesCount = computed(() => this.issues().length);
  openIssuesCount = computed(() => this.issues().filter(i => i.status === 'Open').length);

  getIssueById(id: number) {
    return this.issues().find(i => i.id === id);
  }

  // 4. Mutate the resource value directly!
  resolveIssue(issueId: number) {
    this.issuesResource.value.update(currentIssues => 
      (currentIssues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    );
  }

  updateTitle(issueId: number, newTitle: string) {
    this.issuesResource.value.update(currentIssues => 
      (currentIssues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, title: newTitle } : issue
      )
    );
  }
}
```

### Step 2: Handle Loading States in the UI
Because we exposed `isLoading`, our UI components can instantly respond!

Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.html`. Wrap your issue list in an `@if` block to handle the new loading state:

```html
<!-- Inside the feature-container -->
  <div class="header-section">
    <h2>Manage Issues</h2>
  </div>

  @if (issueService.isLoading()) {
    <div style="padding: 40px; text-align: center; color: #64748b;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <p>Fetching issues from server...</p>
    </div>
  } @else {
    <ul class="issue-list">
      @for (issue of issueService.issues(); track issue.id) {
        <lib-ui-issue-card [issue]="issue" (resolve)="resolveIssue($event)" (view)="viewIssue(issue.id)"></lib-ui-issue-card>
      }
    </ul>
  }
```

*(Tip: Add a simple CSS animation for the spin class in your CSS file!)*
```css
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }
```

### Step 3: Test your new Asynchronous Pipeline!
Refresh your application. When you navigate to the Issues page or the Dashboard, you should see the loading states correctly resolve after 1 second. You've officially wired up asynchronous reactive state using the brand new Angular Resource API!
