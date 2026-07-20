# Phase 7, Lesson 4: Functional HTTP Interceptors

Interceptors act as global middleware for all incoming and outgoing HTTP requests. They are essential for enterprise features like attaching Authorization tokens or globally catching API errors (like 401 Unauthorized).

Because Authentication is a cross-cutting concern that might be shared across multiple applications in our monorepo, we will build this interceptor in a **Shared Utility Library** rather than tightly coupling it to our main application!

## Your Task: Build an Enterprise Auth Interceptor

### 1. Generate the Auth Library
Open a new terminal at the root of your workspace (`enterprise-workspace`) and use Nx to generate a new library:

```bash
npx nx g @nx/angular:library --name=shared-util-auth --directory=libs/shared/util-auth --standalone
```

*(Note: Nx automatically generates a default component or file like `shared-util-auth.ts` inside the new library. You can safely delete the `src/lib/shared-util-auth/` folder as we won't need it!)*

### 2. Create the Interceptor Function
Create a new folder and file at `libs/shared/util-auth/src/lib/interceptors/auth.interceptor.ts`. 

This interceptor will intercept every outgoing request, clone it, and attach a dummy JWT token to the `Authorization` header.

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = 'my-secret-jwt-token-123';

  // The request object is immutable! We must clone it to modify it.
  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Pass the cloned request to the next handler in the chain
  return next(modifiedReq);
};
```

### 3. Expose the Interceptor
For the main application to be able to use this interceptor, we must expose it through the library's public API. 
Open `libs/shared/util-auth/src/index.ts` and add this export:

```typescript
export * from './lib/interceptors/auth.interceptor';
```

### 4. Register the Interceptor in the App
Interceptors must be registered in your application config. Open your main application config (`apps/issue-tracker/src/app/app.config.ts`) and add `withInterceptors`. 

Notice how we can now cleanly import the interceptor using the `@enterprise-workspace` alias!

```typescript
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@enterprise-workspace/shared/util-auth'; // <-- Clean enterprise import!

// ...

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // <-- Register here!
    )
  ]
};
```

### 5. Check Your Work!
Open your browser's Developer Tools (F12) and go to the **Network** tab. 
Refresh your Angular app. Click on the `issues` network request and look at the **Request Headers**. You will see `Authorization: Bearer my-secret-jwt-token-123` attached to the request! Every future request your application makes will now securely carry this token.
