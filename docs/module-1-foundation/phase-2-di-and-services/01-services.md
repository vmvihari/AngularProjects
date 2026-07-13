# Module 1: Services & Dependency Injection

In Angular, services are reusable classes used to handle data fetching and business logic, which keeps your components clean and focused purely on the UI.

Coming from .NET, you are likely used to registering services in your `Program.cs` and injecting them via constructors. In modern Angular, we simply decorate the class with `@Injectable({providedIn: 'root'})` (or the new `@Service()` decorator) to automatically register it as a singleton across the entire app. We then pull it into our components using the built-in `inject()` function.

## Your Task: Create an Issue Service

Let's move our mock data and update logic out of the `AppComponent` and into a dedicated service.

Run this command in your terminal to generate the service: 
```bash
ng generate service issue
```

Replace the code in `src/app/issue.service.ts` with this:

```typescript
import { Injectable, resource } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IssueService {
  // We moved the resource here from the AppComponent
  issuesResource = resource({
    loader: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { id: 1, title: 'Fix login validation', status: 'Open' },
        { id: 2, title: 'Update routing module', status: 'Closed' },
        { id: 3, title: 'Build issue list component', status: 'Open' }
      ];
    }
  });

  resolveIssue(issueId: number) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => issue.id === issueId ? { ...issue, status: 'Closed' } : issue)
    );
  }

  updateIssueTitle(issueId: number, newTitle: string) {
    this.issuesResource.value.update(issues => 
      (issues ?? []).map(issue => 
        issue.id === issueId ? { ...issue, title: newTitle } : issue
      )
    );
  }
}
```

We definitely need to inject that service into our `AppComponent` to clean up the code.

In modern Angular, you don't need to use constructor injection like you typically do in C#. Instead, you use the built-in `inject()` function from `@angular/core`.

### Your Task: Inject the Service

Update your `src/app/app.component.ts` to inject the `IssueService` and remove the hardcoded resource logic. Here is the updated code (keeping the RxJS search feature we built earlier):

```typescript
import { Component, signal, computed, linkedSignal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { IssueService } from './issues/issue.service';

@Component({
  selector: 'app-root',
  imports: [IssueListComponent],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Issue Tracker</h2>
        <nav>Issues</nav>
      </aside>
      <main class="content">
        <h3 style="margin-top: 0;">Open Issues: {{ openIssuesCount() }}</h3>
        
        <input 
          placeholder="Search issues..." 
          (input)="searchTerm.set($any($event.target).value)" 
          style="padding: 5px; margin-bottom: 15px; width: 250px;" 
        />
        
        @if (issueService.issuesResource.isLoading()) {
          <p>Loading issues from server...</p>
        } @else {
          <app-issue-list 
            [issues]="filteredIssues()" 
            (resolveIssue)="issueService.resolveIssue($event)"
            (editIssue)="onEdit($event)">
          </app-issue-list>
        }

        @if (selectedIssue()) {
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px;">
            <h3>Editing: {{ selectedIssue()?.title }}</h3>
            <input 
              [value]="draftTitle()" 
              (input)="draftTitle.set($any($event.target).value)" 
              style="padding: 5px; width: 250px;" />
            <button (click)="onSaveEdit()" style="margin-left: 10px;">Save</button>
            <button (click)="selectedIssue.set(null)" style="margin-left: 5px;">Cancel</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [ /* ... keep existing styles ... */ ]
})
export class AppComponent {
  // 1. Inject the service
  issueService = inject(IssueService);

  // 2. Read from the injected service
  openIssuesCount = computed(() => 
    (this.issueService.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

  searchTerm = signal('');
  searchTerm$ = toObservable(this.searchTerm).pipe(debounceTime(300));
  debouncedSearch = toSignal(this.searchTerm$, { initialValue: '' });

  filteredIssues = computed(() => {
    const issues = this.issueService.issuesResource.value() ?? [];
    const term = this.debouncedSearch().toLowerCase();
    return issues.filter(i => i.title.toLowerCase().includes(term));
  });

  selectedIssue = signal<{id: number, title: string, status: string} | null>(null);
  draftTitle = linkedSignal(() => this.selectedIssue()?.title ?? '');

  onEdit(issueId: number) {
    const issue = (this.issueService.issuesResource.value() ?? []).find(i => i.id === issueId);
    this.selectedIssue.set(issue || null);
  }

  onSaveEdit() {
    if (this.selectedIssue()) {
      // 3. Call the service to update
      this.issueService.updateIssueTitle(this.selectedIssue()!.id, this.draftTitle());
    }
    this.selectedIssue.set(null);
  }
}
```

Notice how much leaner the `AppComponent` class is now that it delegates the data management directly to `IssueService`!

## Component-Scoped Services (Transient/Scoped Lifetimes)

Just like in .NET where you might use Transient or Scoped lifetimes, Angular allows you to create non-singleton services that are tied to a specific component's lifecycle.

You will need this when a service manages component-specific state (like a specific form's data), handles local caching, or when you are building reusable UI components that need their own isolated data.

To do this, you set `autoProvided: false` on the `@Service()` decorator. Then, you register the service directly in the `providers` array of the `@Component`. Angular will then create a fresh instance of the service every time that component is created.
