# Module 3: Routing

Let's configure routing. In Angular, routing manages which component is displayed based on the URL, operating entirely in the client's browser. It requires mapping URL paths to components and using a `<router-outlet>` element as a placeholder for the framework to render the active view.

Because routed components are loaded dynamically by the router, they cannot easily receive data from a parent component via an Input property. Instead, routed components typically inject services directly to fetch their own data.

## Your Task: Route Configuration

Let's make `IssueListComponent` a "smart" routed component by having it inject the `IssueService`, and then we will define our application routes.

### 1. Update the List Component

Open `src/app/issues/issue-list/issue-list.component.ts` and update it to inject the service directly:

```typescript
import { Component, inject } from '@angular/core';
import { IssueCardComponent } from '../issue-card/issue-card.component';
import { IssueService } from '../issue.service';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [IssueCardComponent],
  template: `
    <h2>Current Issues</h2>
    @for (issue of issueService.issuesResource.value(); track issue.id) {
      <app-issue-card>
        <strong>{{ issue.title }}</strong> 
        <span style="margin-left: 10px;">[{{ issue.status }}]</span>
        
        @if (issue.status === 'Open') {
          <button actions (click)="issueService.resolveIssue(issue.id)">Resolve</button>
        }
      </app-issue-card>
    } @empty {
      <p>No issues found.</p>
    }
  `
})
export class IssueListComponent {
  issueService = inject(IssueService);
}
```

### 2. Define the Routes

Open the `src/app/app.routes.ts` file (which the Angular CLI generated for you). We will map the `/issues` path to your component and set up a redirect so the application defaults to that page.

```typescript
import { Routes } from '@angular/router';
import { IssueListComponent } from './issues/issue-list/issue-list.component';

export const routes: Routes = [
  // Redirect the root URL to /issues
  { path: '', redirectTo: 'issues', pathMatch: 'full' },
  // Render IssueListComponent when the URL is /issues
  { path: 'issues', component: IssueListComponent }
];
```

### 3. Update the App Component

To make the router work, we need to use `<router-outlet>`, which acts as a placeholder where Angular will dynamically insert our routed components. We also need to use the `RouterLink` directive instead of a standard `href` attribute so that navigation happens entirely on the client side without reloading the page.

Update your `src/app/app.component.ts` to replace the hardcoded issue list with the router outlet and add the navigation link. We can still keep the `IssueService` injected here to show the total open issues at the top:

```typescript
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { IssueService } from './issues/issue.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink], // Import the routing directives
  template: `
    <div class="layout">
      <aside class="sidebar">
        <h2>Issue Tracker</h2>
        <nav>
          <!-- Use routerLink instead of href -->
          <a routerLink="/issues" style="color: white; text-decoration: none;">Issues</a>
        </nav>
      </aside>
      <main class="content">
        <h3 style="margin-top: 0;">Open Issues: {{ openIssuesCount() }}</h3>
        
        <!-- The router will dynamically load the IssueListComponent here -->
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [\`
    .layout { display: flex; height: 100vh; font-family: sans-serif; margin: -8px; }
    .sidebar { width: 220px; background: #2c3e50; color: white; padding: 20px; }
    .content { flex: 1; padding: 20px; background: #ecf0f1; }
  \\`]
})
export class AppComponent {
  issueService = inject(IssueService);

  openIssuesCount = computed(() => 
    (this.issueService.issuesResource.value() ?? []).filter(issue => issue.status === 'Open').length
  );

  // You can leave the remaining code unchanged...
}
```

Save this, and your application is now officially using Angular routing!
