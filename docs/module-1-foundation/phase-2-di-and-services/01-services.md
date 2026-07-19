# Phase 2, Lesson 1: Services & Dependency Injection

In Angular, **Services** are reusable classes used to handle data fetching, state management, and business logic. This keeps your Smart components clean and focused purely on orchestrating the UI.

Coming from .NET, you are familiar with Dependency Injection (DI) through `Program.cs` and constructor injection. In Angular, DI is built-in and incredibly powerful. 

By decorating a class with `@Injectable({ providedIn: 'root' })`, you automatically register it as a singleton across the entire application. We can then pull it into our components using the modern `inject()` function!

## Data Access in Nx
In our Enterprise Nx Architecture, services that handle data should live in a dedicated **Data Access** library (e.g., `data-access`). This ensures our state logic is highly decoupled from our feature UI, allowing multiple features to share the exact same state without duplicating code.

---

## 🎯 Bootcamp Task: Create an Issue Service

Right now, our mock data and resolving logic are hardcoded directly into the `FeatureManage` component. Let's extract that into an Enterprise Service!

### Step 1: Generate the Data Access Library
Run this Nx command to create a `data-access` library in the issues domain:

```bash
npx nx g @nx/angular:library --directory=libs/issues/data-access
```
*(Remember: restart your `npx nx serve` terminal after this so it picks up the new TSConfig path alias!)*

### Step 2: Create the Service
Delete the default component files Nx generated inside `libs/issues/data-access/src/lib/`. 

Create a new file `libs/issues/data-access/src/lib/issue.service.ts` and move our mock data and logic into it:

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  // We moved the mock data here!
  private issues = [
    { id: 1, title: 'Fix login validation', status: 'Open' },
    { id: 2, title: 'Update routing module', status: 'Closed' },
    { id: 3, title: 'Build issue list component', status: 'Open' }
  ];

  getIssues() {
    return this.issues;
  }

  resolveIssue(issueId: number) {
    const issue = this.issues.find(i => i.id === issueId);
    if (issue) {
      issue.status = 'Closed';
    }
  }
}
```

### Step 3: Export the Service
Don't forget the Nx golden rule! If another library wants to use your service, you must export it from your library's public API.

Open `libs/issues/data-access/src/index.ts`. Replace its contents with this to export your new service:
```typescript
export * from './lib/issue.service';
```

### Step 4: Inject the Service into your Feature Component
Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`. 

Now that our data lives in the service, we can delete the hardcoded array and rely purely on DI! Update your `FeatureManage` class:

```typescript
import { Component, inject } from '@angular/core';
import { UiIssueCard } from '@enterprise-workspace/ui-issue-card';
import { UiIssueFilters } from '@enterprise-workspace/ui-issue-filters';
import { IssueService } from '@enterprise-workspace/data-access'; // Import your service!

@Component({
  selector: 'lib-feature-manage',
  imports: [UiIssueCard, UiIssueFilters],
  templateUrl: './feature-manage.html',
  styleUrl: './feature-manage.css',
})
export class FeatureManage {
  // Inject the service using modern Angular DI!
  private issueService = inject(IssueService);

  // Expose the issues to the HTML template using a getter!
  get issues() {
    return this.issueService.getIssues();
  }
  
  resolveIssue(issueId: number) {
    // Tell the service to do the work!
    this.issueService.resolveIssue(issueId);
  }

  filterIssues(status: string) {
    // You can handle filtering here later using the service!
    console.log('Filtering by:', status);
  }
}
```

Because we created a `get issues()` getter in the TypeScript class, your `feature-manage.html` template doesn't need to change at all! It will continue looping over `issues` exactly as it did before, but now the data is seamlessly flowing from your injected service.
