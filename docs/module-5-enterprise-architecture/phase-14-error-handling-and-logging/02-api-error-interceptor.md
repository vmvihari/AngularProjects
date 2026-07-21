# Phase 14, Lesson 2: Global API Error Handling

In the previous lesson, we built a `GlobalErrorHandler` that catches catastrophic JavaScript exceptions. However, Angular's `HttpClient` has a unique behavior: when an HTTP request fails (e.g. returning a 404 or 500 status code), it throws an `HttpErrorResponse` object.

While our `GlobalErrorHandler` *will* technically catch this, it's not the ideal place to handle it. API errors often require specific logic (e.g. logging the user out on a 401 Unauthorized, or retrying a request on a 503 Service Unavailable).

The enterprise best practice for intercepting and handling HTTP errors is to use an **HttpInterceptor**.

## 1. The Power of Interceptors

An `HttpInterceptor` is a special function that sits between your Angular application and the browser's `XMLHttpRequest`/`fetch` API. 
Every single HTTP request sent by your application passes through the interceptor. Every single response returned by the server passes through the interceptor.

This makes it the absolute perfect place to implement:
- Adding Authentication Tokens to headers (which we already did!)
- Global Loading Spinners
- Global API Error Catching

### Your Task: Create the API Error Interceptor

We will create a new interceptor that catches any `HttpErrorResponse`, extracts the backend's error message, and uses our `ToastService` to show it to the user.

1. Create a new file `api-error.interceptor.ts` inside `apps/issue-tracker/src/app/core/`.

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '@enterprise-workspace/ui-toast';
import { catchError, throwError } from 'rxjs';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown API error occurred!';

      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred.
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        if (error.status === 401 || error.status === 403) {
           errorMessage = 'You are not authorized to perform this action.';
        } else if (error.error && error.error.message) {
           errorMessage = error.error.message;
        } else {
           errorMessage = `Server Error (${error.status}): ${error.message}`;
        }
      }

      // Show the error toast!
      toastService.show(errorMessage);

      // Re-throw the error so the local component can still catch it if it wants to
      return throwError(() => error);
    })
  );
};
```

## 2. Register the Interceptor

Open `apps/issue-tracker/src/app/app.config.ts`.

Find the `provideHttpClient` call in your `providers` array. You should see that we already have `authInterceptor` registered. We just need to add our new `apiErrorInterceptor` to the list!

```typescript
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@enterprise-workspace/shared-util-auth';
import { GlobalErrorHandler } from './core/error-handler';
import { apiErrorInterceptor } from './core/api-error.interceptor'; // <-- Import it!

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, apiErrorInterceptor]) // <-- Add it to the array!
    )
  ]
};
```

## 3. Test the Interceptor

With this interceptor in place, you can safely delete any manual `.catch()` or `catchError()` blocks in your components that are just showing generic toast messages! The interceptor will handle it globally.

To test this, you could intentionally break an API URL in the `IssueStore`, or try to delete an issue that doesn't exist, and you will see the interceptor catch the 404/500 and pop up a beautiful Toast message automatically!
