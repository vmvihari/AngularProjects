# Phase 14, Lesson 1: Global Error Handling

In an Enterprise application, errors *will* happen. APIs will fail, networks will disconnect, and JavaScript might throw an exception. 

If you don't catch these errors, they will fail silently in the browser console, leaving the user staring at a broken screen with no idea what went wrong.

We solve this using **Global Error Handling**.

## 1. The Global ErrorHandler

By default, Angular provides a basic `ErrorHandler` that just logs errors to the browser console. We want to override this so that ANY unhandled error anywhere in our application is caught by us, so we can display a friendly message to the user!

### Your Task: Create a Custom Error Handler

We will create a global error handler that catches exceptions and uses our existing `ToastService` to show a beautiful red error toast to the user!

1. Create a new file `global-error-handler.ts` inside `libs/shared/util-auth/src/lib/` (or anywhere in your shared/core libs, let's put it in `libs/shared/util-error-handling/src/lib/`... wait, let's just put it in your `apps/issue-tracker/src/app/core/` for now to keep things simple).
Actually, let's create it in `apps/issue-tracker/src/app/core/error-handler.ts`.

```typescript
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '@enterprise-workspace/shared-ui-toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);

  handleError(error: any): void {
    // 1. Log the full error to the console for developers
    console.error('GLOBAL ERROR HANDLER CAUGHT AN ERROR:', error);

    // 2. Extract a user-friendly message
    const message = error.message ? error.message : 'An unexpected error occurred!';

    // 3. Show a Toast notification to the user!
    // Since this runs completely outside of standard Angular change detection (especially if it was a catastrophic error),
    // we just call our toast service directly.
    this.toastService.show(message);
  }
}
```

## 2. Register the Global ErrorHandler

Now we need to tell Angular to stop using its default error handler, and use our custom one instead!

Open `apps/issue-tracker/src/app/app.config.ts`.

Add it to the `providers` array using the `provideErrorHandler` function (or just providing the class directly). Since we use modern APIs, we can just map the `ErrorHandler` token to our class!

```typescript
import { ApplicationConfig, ErrorHandler, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { GlobalErrorHandler } from './core/error-handler';
// ...

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }, // <-- Add this line!
    // ...
  ]
};
```

## 3. Test the Error Handler

Let's deliberately throw an error to see if it works!

Open `libs/issues/feature-manage/src/lib/feature-manage/feature-manage.ts`.

Inside your `ngOnInit` (or just anywhere in your component, like a button click), throw an error:

```typescript
throw new Error('This is a simulated catastrophic failure!');
```

Refresh your browser. You should instantly see a red Toast notification pop up at the bottom of the screen saying "This is a simulated catastrophic failure!", and the full stack trace will be printed cleanly in the console!

*(Don't forget to delete the `throw new Error` statement after you verify it works!)*
