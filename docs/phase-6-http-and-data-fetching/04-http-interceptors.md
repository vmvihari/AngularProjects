# Module 4: Functional HTTP Interceptors

Interceptors act as global middleware for all incoming and outgoing HTTP requests. They are essential for enterprise features like attaching Authorization tokens or globally catching API errors (like 401 Unauthorized).

## Your Task: Build an Auth Interceptor

### 1. Create the Interceptor Function
Create a new file `src/app/core/interceptors/auth.interceptor.ts`. 

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

### 2. Register the Interceptor
Interceptors must be registered in your application config. Open `src/app/app.config.ts` and add `withInterceptors`:

```typescript
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

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

### 3. Check Your Work!
Open your browser's Developer Tools (F12) and go to the **Network** tab. 
Refresh your Angular app. Click on the `issues` network request and look at the **Request Headers**. You will see `Authorization: Bearer my-secret-jwt-token-123` attached to the request! Every future request you make will now securely carry this token.
