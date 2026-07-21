# Phase 13, Lesson 1: Server-Side Rendering (SSR), SSG, and Hydration

In this module, we transition our application from standard Client-Side Rendering (CSR) to a hybrid rendering architecture.

## The Rendering Spectrum

1. **Client-Side Rendering (CSR):**
   - **How it works:** The browser downloads an empty `index.html` and a massive `main.js` bundle. Angular boots up in the browser, makes API calls, and eventually paints the UI.
   - **Pros:** Great for highly interactive dashboards behind a login screen.
   - **Cons:** Terrible SEO (search engines see a blank page). Slow First Contentful Paint (FCP) on slow devices.

2. **Server-Side Rendering (SSR):**
   - **How it works:** When a user requests a URL, a Node.js server dynamically executes your Angular app, fetches data, and returns fully populated HTML to the browser.
   - **Pros:** Perfect SEO. Fast FCP.
   - **Cons:** Requires a Node.js server to run continuously. Can be slower if your backend APIs are slow (Time to First Byte is delayed).

3. **Static Site Generation (SSG / Prerendering):**
   - **How it works:** During `ng build`, Angular visits all your routes, renders the HTML, and saves them as static `.html` files. 
   - **Pros:** The fastest possible FCP. Can be hosted on cheap static storage (S3, GitHub Pages). No Node.js server required at runtime.
   - **Cons:** Cannot dynamically render user-specific data at request time. Best for blogs and marketing pages.

---

## Your Task: Explore SSR and Hydration

Angular 17+ introduced a revolutionary SSR pipeline and non-destructive hydration. In modern Nx workspaces, **SSR is often enabled by default**, which means your application has actually been running with Server-Side Rendering this entire time without you even realizing it!

### 1. Observe the Configuration
You don't need to install anything! Instead, let's look at how SSR is already configured in your app:

Open `apps/issue-tracker/src/app/app.config.ts` and notice the following provider:
```typescript
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // <-- This enables Non-Destructive Hydration!
    ...
  ]
};
```

You can also look in your `apps/issue-tracker/src` folder and you will find a `server.ts` file, which is the Node Express server that Angular uses to dynamically render your HTML on the backend!

### 2. What is Hydration?
Before Angular 16, SSR was "destructive". The server sent HTML, the user saw the page, and then when Angular finally booted up, it *deleted the entire DOM* and completely rebuilt it from scratch! This caused a horrible visual flicker.

**Non-Destructive Hydration** (which `provideClientHydration()` enables) means Angular re-uses the existing DOM elements sent by the server. It simply "wakes them up" (hydrates them) by attaching event listeners. 

### 3. Start the SSR Server
Run your app using:
```bash
npm run start
```
*Notice that `ng serve` now secretly builds both the browser bundle AND the server bundle!*

### 4. Verify SSR is Working
1. Open your browser to `http://localhost:4200/issues`.
2. Right-click the page and select **"View Page Source"**.
3. **Instead of seeing an empty `<app-root></app-root>`, you will see the fully rendered HTML of your issue cards!** 
4. Your application is now perfectly indexable by Google!

*Note: You may notice that the `TimeAgoPipe` or API delays might behave slightly differently on the server vs the client. This is normal, and we handle this using `afterRender` or `isPlatformBrowser` checks if necessary!*
