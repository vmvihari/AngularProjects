# Phase 11, Lesson 5: Accessibility (a11y) and the Angular CDK

In a true enterprise application, compliance with WCAG (Web Content Accessibility Guidelines) is often a legal requirement. Angular makes this drastically easier through the **Component Dev Kit (CDK)**.

## Your Task: Add Screen Reader Announcements

When our issues are fetched asynchronously, a sighted user sees the Skeleton Loader disappear and the issues appear. A visually impaired user using a screen reader sees nothing change. We need to explicitly announce this background state change!

### 1. Install the Angular CDK
The Angular CDK is a set of behavior primitives for building UI components.

*Important: Because our Enterprise workspace uses a slightly older version of `@ngrx/signals`, we must append the `--legacy-peer-deps` flag to bypass strict dependency resolution conflicts!*

Run the following command in your terminal:
```bash
npm install @angular/cdk --legacy-peer-deps
```

### 2. Implement the Live Announcer
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`. 

We will inject the `LiveAnnouncer` service from the CDK. We will use an Angular `effect()` to reactively watch our `issueStore` state. When the issues successfully load, we will announce it to the screen reader!

```typescript
import { Component, inject, computed, effect } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
// ... other imports

@Component({
  // ...
})
export class FeatureManage {
  public issueStore = inject(IssueStore);
  private announcer = inject(LiveAnnouncer);

  // ... other properties

  constructor() {
    effect(() => {
      const isLoading = this.issueStore.isLoading();
      const issues = this.issueStore.issues();

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
Open `libs/shared/ui-toast/src/lib/ui-toast/ui-toast.component.ts` (the dynamic Toast component we built in the last lesson). 

Because a Toast pops up dynamically on the screen, we need to tell screen readers that it's an important alert that needs their immediate attention. We can do this using the `@Component` decorator's `host` property to apply ARIA roles to the root element:

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-ui-toast',
  template: `<div class="toast-container">{{ message() }}</div>`,
  styleUrl: './ui-toast.component.css',
  
  // Enterprise Pattern: Add ARIA attributes directly to the host element!
  host: {
    'role': 'alert',
    'aria-live': 'assertive' // 'assertive' means interrupt the screen reader immediately
  }
})
export class UiToastComponent {
  message = input.required<string>();
}
```

By adding these simple features, you ensure your enterprise application is robust, highly inclusive, and legally compliant!
