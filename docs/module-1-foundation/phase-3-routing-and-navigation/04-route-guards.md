# Module 4: Route Guards

Route guards are functions that act as checkpoints to control whether a user can navigate to or leave a specific route. The most common use case is an authentication guard that prevents logged-out users from accessing protected pages.

## Your Task: Protect the "Create Issue" Route

Let's protect your "Create Issue" component and route so that only authorized users can access it.

### 1. Create the Placeholder Component
Create `src/app/issues/issue-create/issue-create.component.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-issue-create',
  standalone: true,
  template: `<h2>Create Issue (Form coming in Phase 5!)</h2>`
})
export class IssueCreateComponent {}
```

### 2. Create the Route Guard
Route guards act as checkpoints to manage whether a user can access specific routes. You can generate a guard using the Angular CLI:

```bash
ng generate guard auth
```

When you run this command, the CLI will interactively ask you which type of guard you want to create:

```text
? Which type of guard would you like to create? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) CanActivate
 ( ) CanActivateChild
 ( ) CanDeactivate
 ( ) CanMatch
```

Once you select `CanActivate`, it will generate the `auth.guard.ts` boilerplate function for you and a corresponding spec file for testing!

Replace the generated code in `src/app/auth.guard.ts` with this:

```typescript
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = false; // Hardcoded to false to test the block
  
  if (isLoggedIn) {
    return true;
  } else {
    alert('Access Denied: You must be logged in to create an issue.');
    return false; // Blocks the navigation
  }
};
```

### 3. Protect the Route
Update `src/app/app.routes.ts` to include the route and apply the guard:

```typescript
import { Routes } from '@angular/router';
import { IssueListComponent } from './issues/issue-list/issue-list.component';
import { IssueDetailComponent } from './issues/issue-detail/issue-detail.component';
import { IssueCreateComponent } from './issues/issue-create/issue-create.component';
import { authGuard } from './auth.guard'; 

export const routes: Routes = [
  { path: '', redirectTo: 'issues', pathMatch: 'full' },
  // The guard is applied here:
  { path: 'issues/new', component: IssueCreateComponent, canActivate: [authGuard] }, 
  { path: 'issues/:id', component: IssueDetailComponent },
  { path: 'issues', component: IssueListComponent }
];
```

*(You may also want to ensure your `<a routerLink="/issues/new">Create Issue</a>` link is added to your `app.component.html` sidebar!)*

Save these files and try clicking the link. The router will block you and show the alert.

## Advanced Routing Concepts

The code provided above is just a basic placeholder. In a production application, your guard would typically check an authentication service for a valid session or secure token (like a JWT) verified by your backend server. 

> [!WARNING]
> Importantly, you should never rely solely on client-side guards for security, as browser code can be modified; always enforce authorization on your server.

Authentication is just one common use case. Angular provides different types of guards for various scenarios:

- **`CanActivate`**: Determines if a user can access a specific route. You use this primarily for authentication and authorization, just like our placeholder code does.
- **`CanActivateChild`**: Determines if a user can access the child routes of a particular parent route. This lets you protect an entire section of nested routes at once without applying a guard to every single child.
- **`CanDeactivate`**: Determines if a user is allowed to leave the current route. The most common scenario is warning users before they accidentally navigate away from a page with unsaved form changes.
- **`CanMatch`**: Determines whether a route configuration should be matched to the URL at all. If this guard returns false, Angular simply ignores the route and tries to find other matching routes instead of blocking the navigation completely. This is highly useful for feature toggling, conditional route loading, or A/B testing.
