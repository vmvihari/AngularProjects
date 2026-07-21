# Phase 13, Lesson 4: Enterprise Architecture & DDD

As applications grow to hundreds of components, organizing everything inside a single `src/app` directory becomes completely unmanageable. Enterprise Angular applications use **Domain-Driven Design (DDD)** combined with standalone route-level lazy loading.

Because you have been using an **Nx Monorepo Workspace** from the very beginning, you have actually been building an Enterprise Architecture without even realizing it!

## 1. Domain-Driven Design (DDD)

In DDD, you organize your code by feature domain, not by file type.
Instead of having:
- `components/`
- `services/`
- `models/`

You organize by Business Domain. Look at your `libs/` folder:
- `libs/issues/` (Everything related to issues)
  - `feature-manage/` (Smart components)
  - `ui-issue-card/` (Dumb components)
  - `data-access/` (State, Stores, APIs)
- `libs/shared/`
  - `ui-button/`
  - `ui-toast/`
  - `util-auth/`

By enforcing strict boundaries between these libraries, you prevent "Spaghetti Code". A UI component in the `shared` folder can never accidentally import the `IssueStore` from `issues/data-access` because Nx linting rules will literally block it!

## 2. Route-Level Lazy Loading

If a user logs in and only goes to the "Settings" page, they shouldn't download the JavaScript for the "Issues" page. We solve this with Route Lazy Loading.

With Standalone Components, we lazy load routes using `loadComponent`.

### Observe Your Masterpiece!
Open `apps/issue-tracker/src/app/app.routes.ts`.

```typescript
export const appRoutes: Route[] = [
  {
    path: 'issues',
    canActivate: [authGuard],
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
     path: 'issues/create',
     canActivate: [authGuard, roleGuard(['Admin', 'Manager', 'Developer'])],
     loadComponent: () => import('@enterprise-workspace/feature-issue-create').then(m => m.FeatureIssueCreate)
  },
  // ...
```

Notice how every single route uses `loadComponent: () => import(...)`. 
This means that when the user visits the application, Angular **only** downloads the code for the specific page they are looking at. The rest of the application stays on the server until they navigate to it!

---

# Module 5 Completed! 🎉

Congratulations! You have completed **Module 5: Enterprise Architecture**. 

Take a moment to appreciate what you have built:
1. **Server-Side Rendered & Hydrated**: Your app loads instantly and is perfectly indexable by search engines.
2. **Deferrable Views**: Heavy UI components (`@defer`) only load when they scroll into view.
3. **Zoneless & Signal Reactive**: You deleted `zone.js` and achieved the absolute peak of modern Angular performance.
4. **Nx Monorepo DDD**: Your code is perfectly isolated into domain libraries.
5. **Route Lazy Loaded**: The browser only downloads exactly the code it needs for the current page.

Next up, we will move to the final module: **Module 6: QA & Deployment**!
