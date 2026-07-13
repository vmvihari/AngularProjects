# Module 5: Lazy Loading Routes

Lazy loading improves your application's initial load time by only downloading a component's code when the user actually navigates to its route.

Let's lazy load your Issue Details page.

## Your Task: Update the Routes

Open `src/app/app.routes.ts`. Remove the import for `IssueDetailComponent` at the top, and update its route to use `loadComponent` instead of `component`:

```typescript
import { Routes } from '@angular/router';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { IssueCreateComponent } from './issues/issue-create/issue-create.component';
import { authGuard } from './auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'issues', pathMatch: 'full' },
  { path: 'issues/new', component: IssueCreateComponent, canActivate: [authGuard] }, 
  
  // Lazy loaded route!
  { 
    path: 'issues/:id', 
    loadComponent: () => import('./issues/issue-detail/issue-detail.component').then(m => m.IssueDetailComponent)
  },
  
  { path: 'issues', component: IssueListComponent }
];
```

By using the dynamic `import()` function, the router will compile that component into a separate JavaScript file and fetch it on demand.
