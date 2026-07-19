# Phase 3, Lesson 3: Route Parameters & Programmatic Navigation

So far, our routes have been static (`/dashboard`, `/issues`). But in enterprise applications, we often need dynamic routes like `/issues/1` to view the details of a specific entity. These dynamic segments are called **Route Parameters**.

In modern Angular, reading route parameters is incredibly easy. By enabling a feature called `withComponentInputBinding()`, Angular will automatically take the `:id` from the URL `/issues/:id` and inject it directly into an `@Input()` property on your component!

Finally, while `<a routerLink>` is great for HTML navigation, sometimes you need to navigate in your TypeScript code (e.g., after successfully submitting a form). We do this using **Programmatic Navigation** by injecting the `Router` service.

---

## 🎯 Bootcamp Task: Issue Details Page

Let's build a dedicated page to view the details of a specific issue.

### Step 1: Enable Component Input Binding
Open your main app configuration file: `apps/issue-tracker/src/app/app.config.ts`.

Import `withComponentInputBinding` from `@angular/router` and add it to the `provideRouter` function:
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router'; // <-- Add the import
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withComponentInputBinding()), // <-- Enable it here!
  ],
};
```

### Step 2: Add a new Method to your Service
To view a specific issue, we need a way to fetch it! Open `libs/issues/data-access/src/lib/issue.service.ts` and add this method:
```typescript
  getIssueById(id: number) {
    return this.issues.find(i => i.id === id);
  }
```

### Step 3: Generate the Issue Detail Feature
Generate a new Nx library for the details page:
```bash
npx nx g @nx/angular:library --directory=libs/issues/feature-issue-detail
```
*(Remember to restart your `npx nx serve` process!)*

### Step 4: Build the Issue Detail Component
Open your newly generated component at `libs/issues/feature-issue-detail/src/lib/feature-issue-detail/feature-issue-detail.ts`.

We are going to inject the `IssueService`, and declare an `@Input() id` to automatically catch the URL parameter!
```typescript
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // <-- Import RouterLink!
import { IssueService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-issue-detail',
  imports: [CommonModule, RouterLink], // <-- Add it to the imports array!
  templateUrl: './feature-issue-detail.html',
  styleUrl: './feature-issue-detail.css',
})
export class FeatureIssueDetail {
  private issueService = inject(IssueService);
  
  // Angular will automatically populate this from the URL (e.g. /issues/1)
  // Note: URL parameters are always strings, so we must define it as a string!
  @Input() id!: string; 

  get issue() {
    // Convert the string ID back to a number to query our service
    return this.issueService.getIssueById(Number(this.id));
  }
}
```

### Step 5: Detail UI
Open `feature-issue-detail.html`:
```html
<div class="detail-container">
  @if (issue) {
    <h2>Issue #{{ issue.id }}: {{ issue.title }}</h2>
    <p>Status: <strong>{{ issue.status }}</strong></p>
    <a routerLink="/issues" class="back-link">← Back to Issues</a>
  } @else {
    <p>Issue not found!</p>
  }
</div>
```

### Step 6: Map the Route
Open `apps/issue-tracker/src/app/app.routes.ts` and map your new component. **Order matters!** Put the `:id` route *after* the static `issues` route.

```typescript
  {
    path: 'issues',
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
    path: 'issues/:id', // <-- Notice the dynamic :id parameter!
    loadComponent: () => import('@enterprise-workspace/feature-issue-detail').then(m => m.FeatureIssueDetail)
  },
```

### Step 7: Programmatic Navigation
We need a way to get to this new page! The "View Details" button should live inside our Dumb component (`UiIssueCard`), and emit an event to our Smart component (`FeatureManage`).

Open `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.ts` and add a new `@Output`:
```typescript
  @Output() view = new EventEmitter<void>();

  onView() {
    this.view.emit();
  }
```

Next, open `ui-issue-card.html` and add the button next to your resolve button (or below it) inside the `card-footer` slot:
```html
  <!-- Inside the footer slot -->
  <div card-footer style="display: flex; gap: 8px;">
    <button class="view-btn" (click)="onView()">View Details</button>
    
    @if (issue.status === 'Open') {
      <button class="resolve-btn" (click)="onResolve()">
        Mark Resolved
      </button>
    }
  </div>
```

Now, hook it up in your Smart Component! Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.html` and bind to the new event:
```html
    <lib-ui-issue-card 
      [issue]="issue" 
      (resolve)="resolveIssue($event)"
      (view)="viewIssue(issue.id)">
    </lib-ui-issue-card>
```

Finally, open `feature-manage.ts`. Inject the router and implement the `viewIssue` method:
```typescript
  // Import Router from '@angular/router'
  private router = inject(Router);

  viewIssue(issueId: number) {
    // Programmatically navigate to /issues/1
    this.router.navigate(['/issues', issueId]);
  }
```

Try it out! Click "View Details" on your Issues page and watch the router pass the ID seamlessly to your new Detail feature!
