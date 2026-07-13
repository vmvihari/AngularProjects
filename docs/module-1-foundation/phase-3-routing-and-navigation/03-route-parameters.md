# Module 3: Route Parameters & Programmatic Navigation

We will start by covering Route Parameters and Programmatic Navigation. Route parameters allow you to pass dynamic data in the URL, such as an issue ID (e.g., `/issues/1`). Modern Angular allows you to map these URL parameters directly to component signals using `withComponentInputBinding`. Programmatic navigation allows you to change routes dynamically in your TypeScript code using the `Router` service.

## Your Task: Add an "Issue Details" Page

Let's add an "Issue Details" page to your application.

### 1. Enable Component Input Binding
Open `src/app/app.config.ts` and update your router provider to automatically pass route data to your component inputs:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  // Add withComponentInputBinding() here
  providers: [provideRouter(routes, withComponentInputBinding())]
};
```

### 2. Create the Detail Component
Create `src/app/issues/issue-detail/issue-detail.component.ts`. Notice how the `id` input automatically receives the `:id` value from the URL:

```typescript
import { Component, input, computed, inject } from '@angular/core';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  template: `
    <h2>Issue Details</h2>
    @if (issue()) {
      <h3>{{ issue()?.title }}</h3>
      <p>Status: {{ issue()?.status }}</p>
    } @else {
      <p>Issue not found.</p>
    }
  `
})
export class IssueDetailComponent {
  id = input.required<string>(); // This automatically binds to the route parameter
  issueService = inject(IssueService);

  issue = computed(() =>
    (this.issueService.issuesResource.value() ?? []).find(i => i.id === Number(this.id()))
  );
}
```

### 3. Define the Dynamic Route
Open `src/app/app.routes.ts` and add the new route using the `:id` syntax. Place it after `issues/new` so the router doesn't accidentally think "new" is an ID:

```typescript
import { Routes } from '@angular/router';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { IssueCreateComponent } from './issues/issue-create/issue-create.component';
import { IssueDetailComponent } from './issues/issue-detail/issue-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'issues', pathMatch: 'full' },
  { path: 'issues/new', component: IssueCreateComponent },
  { path: 'issues/:id', component: IssueDetailComponent }, // Dynamic route parameter
  { path: 'issues', component: IssueListComponent }
];
```

### 4. Use Programmatic Navigation
Open `src/app/issues/issue-list/issue-list.component.ts`. Inject the `Router` and add a button to navigate to the details page:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { IssueCardComponent } from '../issue-card/issue-card.component';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [IssueCardComponent],
  template: `
    <!-- ... keep existing search input ... -->
    
    <h2>Current Issues</h2>

    <!-- Read the computed signal by calling it like a function -->
    <h3 class="open-issues-count">
      Open Issues: {{ issueService.openIssuesCount() }}
    </h3>

    <input 
      placeholder="Search issues..." 
      (input)="issueService.searchTerm.set($any($event.target).value)" 
      class="search-input" 
    />
    
    @if (issueService.issuesResource.isLoading()) {
      <p>Loading issues from server...</p>
    } @else {
      @for (issue of issueService.filteredIssues(); track issue.id) {
        <app-issue-card>
          <strong>{{ issue.title }}</strong> 
          <span style="margin-left: 10px;">[{{ issue.status }}]</span>
          
          <button actions (click)="viewDetails(issue.id)">View</button> <!-- New Button -->
          
          @if (issue.status === 'Open') {
            <button actions (click)="issueService.resolveIssue(issue.id)">Resolve</button>
          }
          <button actions (click)="issueService.editIssue(issue.id)" style="margin-left: 5px;">Edit</button>
        </app-issue-card>
      } @empty {
        <p>No issues found matching your search.</p>
      }
    }

    <!-- ... keep existing edit form ... -->
  `
})
export class IssueListComponent {
  issueService = inject(IssueService);
  router = inject(Router); // Inject the router

  viewDetails(id: number) {
    this.router.navigate(['/issues', id]); // Programmatic navigation
  }

  onSaveEdit() { /* ... existing code ... */ }
}
```
