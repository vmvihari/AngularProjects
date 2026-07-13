# Module 5: Accessibility (a11y) and the Angular CDK

In a true enterprise application, compliance with WCAG (Web Content Accessibility Guidelines) is often a legal requirement. Angular makes this drastically easier through the **Component Dev Kit (CDK)**.

## Your Task: Add Screen Reader Announcements

When our issues are fetched asynchronously, a sighted user sees the Skeleton Loader disappear and the issues appear. A visually impaired user using a screen reader sees nothing change. We need to explicitly announce this background state change!

### 1. Install the Angular CDK
The Angular CDK is a set of behavior primitives for building UI components.
Run the following command in your terminal:
```bash
npm install @angular/cdk
```

### 2. Implement the Live Announcer
Open `src/app/issues/issue-list/issue-list.component.ts`. 

We will inject the `LiveAnnouncer` service from the CDK. We will use an Angular `effect()` to reactively watch our `issuesResource` state. When the issues successfully load, we will announce it to the screen reader!

```typescript
import { Component, inject, effect } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { IssueService } from '../issue.service';

@Component({
  // ...
})
export class IssueListComponent {
  issueService = inject(IssueService);
  private announcer = inject(LiveAnnouncer);

  constructor() {
    effect(() => {
      const isLoading = this.issueService.issuesResource.isLoading();
      const issues = this.issueService.issuesResource.value();

      if (!isLoading && issues && issues.length > 0) {
        // This will silently read "Successfully loaded X issues" to a screen reader!
        // 'polite' means it waits for the user to finish their current screen reader sentence.
        this.announcer.announce(`Successfully loaded ${issues.length} issues`, 'polite');
      }
    });
  }
}
```

### 3. Add ARIA Roles to Dynamic UI
Open `src/app/shared/components/toast/toast.component.ts` (the dynamic Toast component we built in Module 4). 

Because a Toast pops up dynamically on the screen, we need to tell screen readers that it's an important alert that needs their immediate attention. We can do this using the `@Component` decorator's `host` property to apply ARIA roles to the root element:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `<div class="toast-container">{{ message() }}</div>`,
  styleUrl: './toast.component.css',
  
  // Enterprise Pattern: Add ARIA attributes directly to the host element!
  host: {
    'role': 'alert',
    'aria-live': 'assertive' // 'assertive' means interrupt the screen reader immediately
  }
})
export class ToastComponent {
  message = input.required<string>();
}
```

By adding these simple features, you ensure your enterprise application is robust, highly inclusive, and legally compliant!
