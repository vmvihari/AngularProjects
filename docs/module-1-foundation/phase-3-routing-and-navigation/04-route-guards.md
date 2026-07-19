# Phase 3, Lesson 4: Route Guards

Route guards are functions that act as checkpoints. They execute *before* a route is loaded to determine if the user is allowed to navigate there. The most common use case is an Authentication Guard that prevents logged-out users from accessing protected pages.

In older versions of Angular, guards were classes that implemented interfaces like `CanActivate`. In modern Angular, guards are simply **functions** that return a boolean (or a redirect).

## 🎯 Bootcamp Task: Protect the Issues Page

Let's protect your `/issues` route so that unauthorized users are immediately bounced back to the Dashboard!

### Step 1: Create the Guard
Since guards control access to our data/features, we will store this guard in our `data-access` library. 

Sometimes the Nx generator can be finicky about requiring specific project flags for guards. Since functional guards are incredibly simple, it's actually much faster to just create the file manually!

Create a new file at `libs/issues/data-access/src/lib/auth.guard.ts`. 

We haven't built a real authentication system yet (that's in Module 3!), so we are going to hardcode a fake login state. We will also inject the `Router` so we can redirect unauthorized users back to the Dashboard.

Add this code to your new file:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Fake authentication state!
  const isLoggedIn = false; 

  if (isLoggedIn) {
    return true; // Let them through!
  }

  // Unauthorized! Redirect them to the Dashboard
  console.warn('Unauthorized access! Redirecting...');
  return router.createUrlTree(['/dashboard']);
};
```

### Step 3: Export the Guard
As always with Nx libraries, we must expose our new guard so the router can use it.
Open `libs/issues/data-access/src/index.ts` and export the guard file:

```typescript
export * from './lib/issue.service';
export * from './lib/auth.guard'; // <-- Add this!
```

### Step 4: Protect the Route!
Now we attach the guard to the route. Open `apps/issue-tracker/src/app/app.routes.ts`.

Find the `issues` route and add the `canActivate` array to it:

```typescript
import { Route } from '@angular/router';
import { authGuard } from '@enterprise-workspace/data-access'; // <-- Import the guard!

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () => import('@enterprise-workspace/feature-dashboard').then(m => m.FeatureDashboard)
  },
  {
    path: 'issues',
    canActivate: [authGuard], // <-- Protect this route!
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
    path: 'issues/:id',
    loadComponent: () => import('@enterprise-workspace/feature-issue-detail').then(m => m.FeatureIssueDetail)
  },
  {
    path: '', 
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
```

### Step 5: Test the Checkpoint
Open your browser and try to click the "Issues" link in your sidebar. 

**You shouldn't be able to get in!** Because `isLoggedIn` is false, the guard intercepts the navigation and bounces you straight back to the Dashboard. You can also check your browser's Developer Tools Console to see the warning message.

Once you have verified the block works, go back into `auth.guard.ts`, change `isLoggedIn = true`, and verify you can access the Issues page again!
