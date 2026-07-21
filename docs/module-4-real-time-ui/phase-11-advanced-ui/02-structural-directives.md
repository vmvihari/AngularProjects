# Phase 11, Lesson 2: Custom Structural Directives

Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements. You know them well: `@if` (formerly `*ngIf`) and `@for` (formerly `*ngFor`).

## Your Task: Build a Skeleton Loader Directive

When fetching data from the API, we currently show a generic loading spinner. Let's build a structural directive `*appSkeletonLoader` that automatically renders a shimmering skeleton placeholder while data is loading.

### 1. Generate a Skeleton UI Library
Since the skeleton component and the structural directive that renders it are tightly coupled, we will bundle them together in a dedicated Nx Library!

```bash
npx nx g @nx/angular:library --directory=libs/shared/ui-skeleton
```

### 2. Implement the Skeleton Component
Open `libs/shared/ui-skeleton/src/lib/ui-skeleton/ui-skeleton.component.html` (or whatever default component was generated in your new library) and add a simple skeleton placeholder UI:

```html
<div style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; opacity: 0.6; animation: pulse 1.5s infinite;">
  <div style="height: 20px; background: #cbd5e1; width: 40%; margin-bottom: 10px; border-radius: 4px;"></div>
  <div style="height: 15px; background: #cbd5e1; width: 70%; border-radius: 4px;"></div>
</div>
```

Open `libs/shared/ui-skeleton/src/lib/ui-skeleton/ui-skeleton.component.css` and add this animation to give the skeleton a nice shimmer effect:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### 3. Implement the Structural Directive
Inside the exact same `ui-skeleton` library, create a new file: `libs/shared/ui-skeleton/src/lib/skeleton-loader.directive.ts`. 

To manipulate the DOM structure, we don't inject `ElementRef` like we did in Attribute directives. Instead, we inject `TemplateRef` (what to render) and `ViewContainerRef` (where to render it).

```typescript
import { Directive, TemplateRef, ViewContainerRef, inject, effect, input } from '@angular/core';
// Import your generated component!
import { UiSkeleton } from './ui-skeleton/ui-skeleton';

@Directive({
  selector: '[appSkeletonLoader]',
  standalone: true
})
export class SkeletonLoaderDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  // Accept a boolean signal indicating if we are loading
  appSkeletonLoader = input.required<boolean>();

  constructor() {
    // Whenever the loading state changes, this effect runs!
    effect(() => {
      // Always clear the container first
      this.viewContainer.clear(); 

      if (this.appSkeletonLoader()) {
        // Dynamically instantiate our Skeleton Component 3 times!
        this.viewContainer.createComponent(UiSkeleton);
        this.viewContainer.createComponent(UiSkeleton);
        this.viewContainer.createComponent(UiSkeleton);
      } else {
        // If NOT loading, render the actual template the directive is attached to!
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
```

*Important: Do not forget to export your new `SkeletonLoaderDirective` from the library's `index.ts` barrel file! Unlike hostDirectives, you CAN use `export *` for this one since it's just a structural template directive!*

### 4. Use It In the UI!
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`. 
1. Import `SkeletonLoaderDirective` into the component's `imports: []` array.
2. Open `feature-manage.html`. Replace your existing `@if (issueStore.isLoading())` block. 
3. We will wrap our `@for` loop in an `ng-container` and apply our new structural directive, passing it the `isLoading()` signal from our `issueStore`.

```html
<!-- If isLoading() is true, this renders 3 skeleton boxes. 
     If false, it renders the real issue cards inside! -->
<ng-container *appSkeletonLoader="issueStore.isLoading()">
  
  <ul class="issue-list">
    @for (issue of filteredIssues(); track issue.id) {
      <lib-ui-issue-card 
        [issue]="issue" 
        [appStatusHighlight]="issue.status" 
        appTooltip="Click View for details."
        (resolve)="resolveIssue($event)" 
        (view)="viewIssue(issue.id)" 
        (edit)="editIssue(issue.id)">
      </lib-ui-issue-card>
    } @empty {
      <div class="empty-state">No issues found. Everything is great!</div>
    }
  </ul>

</ng-container>
```

Run your app! You will now see the beautiful skeleton loader render whenever the app fetches data from the .NET backend, and then elegantly swap out for the real data when the request completes!
