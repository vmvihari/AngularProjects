# Phase 4, Lesson 1: Introduction to Signals

Welcome to Module 2! It's time to learn about Angular's biggest architectural shift in years: **Signals**.

For the past decade, Angular developers have relied heavily on RxJS (`BehaviorSubject`, `Observable`) to manage state. While incredibly powerful, RxJS has a steep learning curve and isn't strictly necessary for synchronous state. 

Enter **Signals**. A signal is a lightweight wrapper around a value that automatically tracks where it is used, and precisely triggers UI updates only when that value changes. 

There are two primary types of signals you need to master today:
1. **Writable Signals (`signal`)**: State that you can directly modify using `.set()` or `.update()`.
2. **Computed Signals (`computed`)**: Read-only state that derives its value from other signals. It is lazily evaluated and heavily memoized for massive performance gains.

---

## 🎯 Bootcamp Task: Refactoring to Signals

Right now, our `IssueService` uses a standard JavaScript array. This works fine for simple data, but it relies on Angular's default "Zone.js" change detection (which checks the entire component tree for changes). Let's upgrade our Service to use high-performance Signals!

### Step 1: Upgrade the Service
Open `libs/issues/data-access/src/lib/issue.service.ts`. 

We are going to wrap our array in a `signal()`, create some `computed()` metrics, and update our mutation method to use the immutable `.update()` pattern.

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  
  // 1. Wrap your state in a Writable Signal!
  // Note: We use .asReadonly() so components can't randomly mutate the state from the outside!
  private state = signal([
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ]);
  
  issues = this.state.asReadonly();

  // 2. Create Computed Signals for our Dashboard!
  // These will ONLY recalculate when the 'state' signal actually changes.
  totalIssuesCount = computed(() => this.state().length);
  openIssuesCount = computed(() => this.state().filter(i => i.status === 'Open').length);

  // Read a single issue (using standard array lookup)
  getIssueById(id: number) {
    return this.state().find(i => i.id === id);
  }

  // 3. Mutate the state using .update()
  resolveIssue(issueId: number) {
    this.state.update(currentIssues => 
      currentIssues.map(issue => 
        issue.id === issueId ? { ...issue, status: 'Closed' } : issue
      )
    );
  }
}
```

### Step 2: Update the Dashboard
Now that the Service uses Signals, we need to update our components to read them! 

Open `libs/issues/feature-dashboard/src/lib/feature-dashboard/feature-dashboard.ts`. 
Delete those expensive `get` functions and replace them with our perfectly memoized `computed` signals:

```typescript
export class FeatureDashboard {
  // We can make the service public to use it directly in the HTML template!
  public issueService = inject(IssueService);
}
```

Then in `feature-dashboard.html`, read the signals by calling them with parentheses `()`:
```html
    <div class="metric-card">
      <h3>Total Issues</h3>
      <!-- Call the signal like a function to read its value! -->
      <div class="value">{{ issueService.totalIssuesCount() }}</div>
    </div>
    
    <div class="metric-card alert">
      <h3>Needs Attention</h3>
      <div class="value">{{ issueService.openIssuesCount() }}</div>
    </div>
```

### Step 3: Update the List & Details
You'll need to do the same for your `FeatureManage` component!
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`. 

```typescript
export class FeatureManage {
  public issueService = inject(IssueService);
  private router = inject(Router);

  // We deleted the 'get issues()' function!

  resolveIssue(issueId: number) {
    this.issueService.resolveIssue(issueId);
  }

  viewIssue(issueId: number) {
    this.router.navigate(['/issues', issueId]);
  }
}
```

And in `feature-manage.html`, update your `@for` loop to read the signal:
```html
<!-- Add parentheses to read the signal! -->
@for (issue of issueService.issues(); track issue.id) {
```

### Step 4: Test it!
Run your server and verify everything still works! You shouldn't notice any difference in the UI, but underneath the hood, your application is now powered by modern, highly-optimized Reactivity!
