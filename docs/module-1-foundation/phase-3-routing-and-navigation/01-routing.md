# Phase 3, Lesson 1: Basic Routing

Welcome to Phase 3! So far, our application has only rendered a single view. To build a true Single Page Application (SPA), we need to swap out entire views based on the URL without ever refreshing the page. 

Angular handles this using its incredibly powerful Router.

## How it works

In modern Angular (Standalone architecture), the router is configured in your `app.config.ts` using `provideRouter(routes)`. You define an array of `Route` objects that map a specific URL path to a Component.

When a user visits a matching URL, the Router takes that Component and injects it directly into the `<router-outlet></router-outlet>` placeholder inside your shell's template.

To navigate between these views without triggering a full page reload, you must use the `routerLink` directive instead of standard `href` attributes on your `<a>` tags.

```html
<!-- Incorrect (causes a full page refresh!) -->
<a href="/dashboard">Go to Dashboard</a>

<!-- Correct (handled instantly by the Angular Router!) -->
<a routerLink="/dashboard">Go to Dashboard</a>
```

---

## 🎯 Bootcamp Task: Build the Dashboard

Let's expand our Issue Tracker by adding a second page: a Dashboard!

### Step 1: Generate a new Feature Library
Following our enterprise architecture, each "page" or "route" should be its own `feature-*` library. Run this command to generate a Dashboard feature:

```bash
npx nx g @nx/angular:library --directory=libs/issues/feature-dashboard
```
*(As always, restart your `npx nx serve` terminal after generating a library so it picks up the new `@enterprise-workspace/feature-dashboard` TSConfig path!)*

### Step 2: Configure the Routes
Open `apps/issue-tracker/src/app/app.routes.ts`. 

We are going to move our `FeatureManage` component to the `/issues` path, map our new `FeatureDashboard` to the `/dashboard` path, and set up a default redirect. 

Update your routes array to look exactly like this:

```typescript
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () => import('@enterprise-workspace/feature-dashboard').then(m => m.FeatureDashboard)
  },
  {
    path: 'issues',
    loadComponent: () => import('@enterprise-workspace/feature-manage').then(m => m.FeatureManage)
  },
  {
    path: '', // Default route
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
```

### Step 3: Add Navigation Links to the Shell
Now that we have routes, our users need a way to click between them! 

Open your main shell template (`apps/issue-tracker/src/app/app.html`). You already have a beautiful glassmorphism sidebar with `href="#"` links. Let's upgrade those to use the Angular Router!

Find the `<nav>` inside your `<aside class="glass-sidebar">` and update the Dashboard and Issues links:

```html
<nav>
  <!-- Notice we replaced href="#" with routerLink and added routerLinkActive! -->
  <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
    <span class="icon">📊</span>
    Dashboard
  </a>
  <a routerLink="/issues" routerLinkActive="active" class="nav-item">
    <span class="icon">🎯</span>
    Issues
  </a>
  <a href="#" class="nav-item">
    <span class="icon">⚙️</span>
    Settings
  </a>
</nav>
```

### Step 4: Import the Router Directives
If you click your links right now, absolutely nothing will happen! Why? 

Because we are using **Standalone Components**. In the old Angular NgModule days, `RouterModule` was imported globally, making `routerLink` available everywhere. Now, you must explicitly import exactly what you need.

Open `apps/issue-tracker/src/app/app.ts` and add `RouterLink` and `RouterLinkActive` to your component's imports array:

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // <-- Add them here!
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
```

Check your browser! You should now have a fully functioning Single Page Application. Click the links in your sidebar to watch the page instantly swap between your new Dashboard and your Issue list!
