# Phase 8, Lesson 5: Granular UI Authorization

While Route Guards protect entire pages from unauthorized access, we often need more granular control on the page itself. 

For example, our `Developer` and `Viewer` roles are both allowed to view the Issue Manager. But only an `Admin` or a `Manager` should actually be allowed to see and click the "Mark Resolved" button on an issue!

In this lesson, we will use our `AuthStore`'s `hasAnyRole` signal to selectively show or hide the resolve button!

## Your Task: Lock Down the UI

### 1. Identify the Target Component
We want to hide the "Mark Resolved" button on the Issue Cards for non-admins.
Open the `UiIssueCard` component: `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.ts`.

### 2. Inject the AuthStore
Because our `AuthStore` is heavily decoupled inside a shared library, we can easily inject it directly into our dumb UI components!

```typescript
import { Component, Input, Output, EventEmitter, inject } from '@angular/core'; // <-- Add inject!
import { UiCard } from '@enterprise-workspace/ui-card';
import { AuthStore } from '@enterprise-workspace/shared-util-auth'; // <-- Import the Store!

@Component({
  selector: 'lib-ui-issue-card',
  imports: [UiCard],
  templateUrl: './ui-issue-card.html',
  styleUrl: './ui-issue-card.css',
})
export class UiIssueCard {
  // Inject the Store!
  public authStore = inject(AuthStore);

  @Input({ required: true }) issue!: any;
  @Output() resolve = new EventEmitter<number>();
  @Output() view = new EventEmitter<void>();

  onResolve() {
    this.resolve.emit(this.issue.id);
  }

  onView() {
    this.view.emit();
  }
}
```

### 3. Apply the Structural Directive
Now, open the template file: `libs/issues/ui-issue-card/src/lib/ui-issue-card/ui-issue-card.html`.

Find the `<button>` that triggers the `onResolve()`. You will see it already has an `@if (issue.status === 'Open')` check. Let's wrap it in our role check!

```html
<!-- ... -->
  <!-- Inside the footer slot -->
  <div card-footer style="display: flex; gap: 8px;">
    <button class="view-btn" (click)="onView()">View Details</button>
    
    <!-- Only render this button if the user is an Admin OR a Manager! -->
    @if (authStore.hasAnyRole(['Admin', 'Manager'])) {
      @if (issue.status === 'Open') {
        <button class="resolve-btn" (click)="onResolve()">
          Mark Resolved
        </button>
      }
    }
  </div>
</lib-ui-card>
```

### 4. Check Your Work
1. Look at your UI. Try logging in as a **Viewer** or a **Developer**. Because you don't have the proper role, the "Mark Resolved" button is completely missing from every issue!
2. Log out, and log back in as an **Admin** or a **Manager**.
3. The Resolve buttons will instantly appear!

You have successfully implemented an Enterprise-grade Authentication and Authorization workflow using Signals!
