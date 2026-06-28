# Module 2: Custom Structural Directives

Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements. You know them well: `@if` (formerly `*ngIf`) and `@for` (formerly `*ngFor`).

## Your Task: Build a Skeleton Loader Directive

When fetching data from the API, we currently just show a blank screen or a boring "Loading..." text. Let's build a structural directive `*appSkeletonLoader` that automatically renders a shimmering skeleton placeholder while data is loading.

### 1. Generate a Skeleton Component
Before we build the directive, we need an actual component to render when data is loading!
```bash
ng generate component shared/components/skeleton-card
```

Open `src/app/shared/components/skeleton-card/skeleton-card.component.html` and add some simple skeleton UI:
```html
<div style="padding: 20px; border: 1px solid #ccc; margin-bottom: 10px; opacity: 0.5;">
  <div style="height: 20px; background: #ddd; width: 50%; margin-bottom: 10px;"></div>
  <div style="height: 15px; background: #ddd; width: 80%;"></div>
</div>
```

### 2. Generate the Directive
```bash
ng generate directive shared/directives/skeleton-loader
```

### 3. Implement the Logic
Open `src/app/shared/directives/skeleton-loader.directive.ts`. 

To manipulate the DOM structure, we don't inject `ElementRef` like we did in Attribute directives. Instead, we inject `TemplateRef` (what to render) and `ViewContainerRef` (where to render it).

```typescript
import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { SkeletonCardComponent } from '../components/skeleton-card/skeleton-card.component';

@Directive({
  selector: '[appSkeletonLoader]'
})
export class SkeletonLoaderDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  // When this input changes, Angular calls this setter
  @Input() set appSkeletonLoader(isLoading: boolean) {
    this.viewContainer.clear(); // Clear whatever is currently rendered

    if (isLoading) {
      // Dynamically instantiate our Skeleton Component 3 times!
      this.viewContainer.createComponent(SkeletonCardComponent);
      this.viewContainer.createComponent(SkeletonCardComponent);
      this.viewContainer.createComponent(SkeletonCardComponent);
    } else {
      // If NOT loading, render the actual template the directive is attached to!
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
```

### 3. Use It In the UI!
Open `src/app/issues/issue-list/issue-list.component.ts`. 
1. Import `SkeletonLoaderDirective` into the `imports: []` array.
2. We will wrap our `@for` loop in an `ng-container` and apply our new structural directive, passing it the `isLoading()` signal from our `issuesResource`.

```html
<!-- If isLoading is true, this renders 3 skeleton boxes. 
     If false, it renders the content inside! -->
<ng-container *appSkeletonLoader="issueService.issuesResource.isLoading()">
  
  @for (issue of issueService.filteredIssues(); track issue.id) {
    <app-issue-card [appStatusHighlight]="issue.status">
      <!-- ... your existing projected content ... -->
    </app-issue-card>
  }

</ng-container>
```

Refresh your Angular app! You will now see the beautiful skeleton loader render for 1 second, and then elegantly swap out for the real data!
