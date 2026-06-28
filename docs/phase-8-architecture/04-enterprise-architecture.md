# Module 4: Enterprise Architecture & DDD

As applications grow to hundreds of components, organizing everything inside a single `src/app` directory becomes unmanageable. Enterprise Angular applications use **Domain-Driven Design (DDD)** combined with standalone route-level lazy loading.

## 1. Domain-Driven Design (DDD)

In DDD, you organize your code by feature domain, not by file type.
Instead of having:
- `components/`
- `services/`
- `models/`

You organize by Business Domain:
- `issues/` (Everything related to issues)
  - `features/` (Smart components like IssueList)
  - `ui/` (Dumb components like IssueCard)
  - `data-access/` (Services, Models, State)
- `users/` (Everything related to users)
- `shared/` (Truly global UI components like Buttons, Toasts)
- `core/` (Singletons, Interceptors, Guards)

*Note: Our project is already loosely following this pattern! We have an `issues` folder and a `shared` folder.*

## 2. Route-Level Lazy Loading

If a user logs in and only goes to the "Settings" page, they shouldn't download the JavaScript for the "Issues" page. We solve this with Route Lazy Loading.

With Standalone Components, we lazy load routes using `loadComponent` or `loadChildren`.

### Your Task: Lazy Load the Issues Module
Open `src/app/app.routes.ts`.

Currently, we statically import the `IssueListComponent`:
```typescript
import { IssueListComponent } from './issues/issue-list/issue-list.component';

export const routes: Routes = [
  { path: 'issues', component: IssueListComponent }
];
```
This forces the browser to download the IssueListComponent immediately when the app boots up.

**Let's fix it:**
1. Delete the `import { IssueListComponent }` at the top of the file.
2. Replace `component:` with `loadComponent:` and pass an arrow function with a dynamic `import()`.

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'issues', 
    // The browser will only download this file over the network when the user navigates to /issues!
    loadComponent: () => import('./issues/issue-list/issue-list.component').then(m => m.IssueListComponent) 
  },
  { 
    path: 'issues/create', 
    loadComponent: () => import('./issues/issue-create/issue-create.component').then(m => m.IssueCreateComponent) 
  },
  { path: '', redirectTo: '/issues', pathMatch: 'full' }
];
```

Congratulations! You have completed Phase 8 and transformed this application into a lightning-fast, lazy-loaded, zoneless, server-side rendered architectural masterpiece! 

Next up: **Phase 9: Testing**!
