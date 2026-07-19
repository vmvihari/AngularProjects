# Phase 4, Lesson 4: RxJS Interoperability

Let's wrap up Phase 4 by bridging the gap between Signals and RxJS!

In enterprise Angular applications, you will frequently encounter RxJS Observables—especially when integrating with older codebases, working with `ReactiveFormsModule`, or doing complex asynchronous event handling (like debouncing). 

To seamlessly bridge the gap between reactive streams and Signals, Angular provides `toSignal` and `toObservable`.

- `toObservable`: Creates an RxJS Observable that tracks the value of a Signal.
- `toSignal`: Creates a Signal that tracks the value of an RxJS Observable. It subscribes immediately and cleans itself up automatically when the component is destroyed!

---

## 🎯 Bootcamp Task: Search Box with RxJS Debounce

Let's add a search box to `FeatureManage` to filter our issues. We want to avoid filtering on every single keystroke, so we will use a `FormControl` to get an Observable of the user's keystrokes. We'll apply an RxJS `debounceTime` operator to wait for them to stop typing, and then convert that stream back into a Signal so our template can easily read it!

### Step 1: Update the TypeScript
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`.

Add the `ReactiveFormsModule` to your imports array so we can use form controls. Then, implement the reactive search pipeline!

```typescript
import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';
import { IssueService } from '@enterprise-workspace/data-access';

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters, ReactiveFormsModule],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {
  public issueService = inject(IssueService);
  private router = inject(Router);

  // 1. Create a FormControl for our search input
  searchControl = new FormControl('');

  // 2. Build an RxJS Pipeline with a 300ms debounce
  private search$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  // 3. Convert the Observable to a Signal!
  // We provide an initial value since Observables are asynchronous
  searchTerm = toSignal(this.search$, { initialValue: '' });

  // 4. Create a computed signal that combines the issues from the service with our local search term!
  filteredIssues = computed(() => {
    const term = this.searchTerm()?.toLowerCase() || '';
    const allIssues = this.issueService.issues();
    
    if (!term) return allIssues;
    
    return allIssues.filter(issue => 
      issue.title.toLowerCase().includes(term)
    );
  });

  resolveIssue(issueId: number) {
    this.issueService.resolveIssue(issueId);
  }

  filterIssues(status: string) {
    console.log('Filtering by:', status);
  }

  viewIssue(issueId: number) {
    this.router.navigate(['/issues', issueId]);
  }
}
```

### Step 2: Update the Template
Open `feature-manage.html`.

First, add the search input just below the `<h2>` tag:
```html
<div class="header-section">
  <h2>Manage Issues</h2>
  <div style="display: flex; gap: 16px; align-items: center;">
    <input 
      type="text" 
      [formControl]="searchControl" 
      placeholder="Search issues..." 
      class="search-input"
    />
    <lib-ui-issue-filters (filterChange)="filterIssues($event)"></lib-ui-issue-filters>
  </div>
</div>
```

Then, update your `@for` loop to use your new `filteredIssues` computed signal instead of `issueService.issues()`:
```html
  @else {
    <ul class="issue-list">
      <!-- Read from your local computed signal! -->
      @for (issue of filteredIssues(); track issue.id) {
        <lib-ui-issue-card [issue]="issue" (resolve)="resolveIssue($event)" (view)="viewIssue(issue.id)">
        </lib-ui-issue-card>
      } @empty {
         <!-- ... -->
```

### Step 3: Test your Interop!
Add a `.search-input { padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; }` class to your CSS.

Save your files and navigate to the Manage Issues page. Try typing in the search box. You will notice that the filtering doesn't happen instantly—it waits 300ms after you stop typing (thanks to the RxJS debounce!) before the Signal updates and triggers change detection!

You have successfully combined the asynchronous stream processing power of RxJS with the synchronous UI rendering power of Signals!
