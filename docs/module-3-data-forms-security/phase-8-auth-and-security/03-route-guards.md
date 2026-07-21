# Phase 8, Lesson 3: Route Guards & Role Factories

Now that we have a real Login workflow and an `AuthStore` packed with Roles, it's time to secure our application routes!

If an unauthenticated user tries to navigate to `/issues`, they should be intercepted and redirected to `/login`. Furthermore, if a `Viewer` tries to navigate to the `/settings` page, they should be intercepted because only `Admin` and `Manager` roles are allowed!

## Your Task: Build Advanced Guards

### 1. Build the Guards
Create a new file at `apps/issue-tracker/src/app/core/guards/auth.guard.ts`.

In modern Angular, we use highly testable **Functional Guards** (simple arrow functions) instead of heavy Classes. Copy the following code into your file. Notice how we export *two* guards from this single file!

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, Role } from '@enterprise-workspace/shared-util-auth';

// 1. The Basic Auth Guard
// Redirects anyone without a token to the login page.
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true; 
  }

  return router.parseUrl('/login'); // Intercepted!
};

// 2. The Advanced Role Guard Factory
// This is a function that RETURNS a guard based on the roles you provide!
export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    // Call our powerful store method!
    if (authStore.hasAnyRole(allowedRoles)) {
      return true;
    }
    
    // They are logged in, but their role is rejected!
    console.warn(`Access Denied! Requires one of: ${allowedRoles.join(', ')}`);
    return router.parseUrl('/dashboard'); 
  };
};
```

### 2. Protect the Routes
Open `apps/issue-tracker/src/app/app.routes.ts`.

Let's apply our `authGuard` to the `issues` route, and let's apply BOTH guards to the `settings` route!

```typescript
import { Route } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard'; // <-- Import BOTH guards!

export const appRoutes: Route[] = [
  // ...
  {
    path: 'issues',
    canActivate: [authGuard], // Must be logged in!
    loadChildren: () =>
      import('@enterprise-workspace/issues/feature-manage').then(r => r.issuesRoutes)
  },
  {
    path: 'settings',
    // Must be logged in AND must be either an Admin or a Manager!
    canActivate: [authGuard, roleGuard(['Admin', 'Manager'])], 
    loadComponent: () =>
      import('@enterprise-workspace/feature-settings').then(c => c.FeatureSettings)
  }
  // ...
];
```

> [!WARNING]
> **Watch your auto-imports!** Back in Phase 3, you built a dummy `authGuard` inside your `data-access` library. Your IDE might try to automatically import that old one!
> 
> **Action Required:** Go delete `libs/issues/data-access/src/lib/auth.guard.ts` entirely, and remove it from `libs/issues/data-access/src/index.ts` so it never conflicts again!

### 3. Check Your Work!
1. Save your files. 
2. Log out (or clear your LocalStorage), and click the "Issues" link in the sidebar. **You should be instantly redirected to `/login`!**
3. Log in as a `Developer` or `Viewer`.
4. Click the "Settings" link in the sidebar. **You should be instantly redirected to `/dashboard`** and see the `Access Denied` warning in your DevTools console!
5. Log in as an `Admin` or `Manager`. You can now access the Settings page!
