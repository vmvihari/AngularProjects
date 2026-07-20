# Phase 8, Lesson 4: Dynamic Interceptors

In Phase 7, we built a functional interceptor (`auth.interceptor.ts`) inside our `shared/util-auth` library. However, we hardcoded the JWT token (`const token = 'my-secret-jwt-token-123';`).

Now that we have a centralized `AuthStore` managing our user's real token, we need our interceptor to read from it!

## Your Task: Connect the Interceptor to the Store

### 1. Refactor the Interceptor
Open `libs/shared/util-auth/src/lib/interceptors/auth.interceptor.ts`.

Because functional interceptors run inside the Angular Injection Context, we can literally just use the `inject()` function to grab our `AuthStore`!

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth.store'; // Import the store!

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inject the store dynamically!
  const authStore = inject(AuthStore);
  
  // 2. Read the current token from the signal
  const token = authStore.token();

  // 3. If a token exists, clone and attach it. Otherwise, send the original request.
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(modifiedReq);
  }

  // No token? Proceed without modifying headers.
  return next(req);
};
```

### 2. Check Your Work
Because we are using Angular Server-Side Rendering (SSR), your initial data fetch on page load happens on the Node.js server. Angular smartly caches this request and sends it down in the HTML so your browser doesn't duplicate the `GET` request! Therefore, you will **never** see the initial page load API call in your browser's Network tab.

To test our interceptor in the browser DevTools, we need to trigger a *client-side mutation* (like a PUT request).

1. Go to your new `/login` page and log in as an `Admin` or `Manager`.
2. Navigate to the **Issues** tab.
3. Open your browser's Developer Tools (F12) to the **Network** tab.
4. Click the "Resolve" button on any issue.
5. Look at the `PUT` request that fires in the Network tab. Click on it and examine the **Request Headers**.
6. You will see `Authorization: Bearer my-secret-jwt-token-123-Admin` dynamically attached by your new Interceptor based on your login session!

Perfect! In the final lesson, we will use our new Roles to dynamically hide that "Resolve" button for users who aren't authorized to click it!
