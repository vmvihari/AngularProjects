# Phase 7, Lesson 2: CRUD Operations and State

Now that we know `HttpClient` works in our root component, it's time to properly architect it. In enterprise applications, we **never** make HTTP calls directly from UI components. We abstract them into our State Management layer!

## Your Task: Refactor IssueStore

Let's refactor our `IssueStore` to fetch real data from our ASP.NET Core API instead of using the hardcoded array!

### 1. Inject HttpClient into the Store
Open `libs/issues/data-access/src/lib/issue.store.ts`.

To use services inside the methods of a SignalStore, we can inject them right into the `withMethods` factory function signature! Update your `withMethods` block to inject the `HttpClient`:

```typescript
import { HttpClient } from '@angular/common/http'; // <-- Import this!
import { switchMap } from 'rxjs'; // <-- Import switchMap!

// ...

  withMethods((store, http = inject(HttpClient)) => ({ // <-- Inject HttpClient here!
```

### 2. Refactor `loadIssues` (READ)
Currently, `loadIssues` is an `rxMethod` that simulates a network call using RxJS `delay()` and then patches in a hardcoded array.

Let's replace the `delay()` and hardcoded `patchState` with a real HTTP `GET` request using RxJS `switchMap()`:

```typescript
    // Asynchronous operations using RxJS Interop!
    loadIssues: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        
        // Use switchMap to switch from the trigger stream to the HTTP request stream!
        switchMap(() => http.get<Issue[]>('http://localhost:5000/api/issues').pipe(
          tap((issues) => {
            patchState(store, { issues, isLoading: false });
          })
        ))
      )
    )
```

### 3. Refactor Mutations (UPDATE)
Let's modify `resolveIssue` to fire off a background `PUT` request to our API. 

We will use a pattern called **Optimistic UI Updates**. We will immediately update the local state using `patchState` (so the UI feels lightning fast to the user), and then fire the HTTP request into the background to synchronize with the server!

```typescript
    resolveIssue(id: number) {
      // 1. Optimistic Update (Immediate UI response!)
      patchState(store, (state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, status: 'Closed' } : issue
        )
      }));
      
      // 2. Background Sync
      http.put(`http://localhost:5000/api/issues/${id}`, { status: 'Closed' }).subscribe();
    },
```

*(You can apply this exact same pattern to `updateTitle`!)*

### 4. Check Your Work!

That's it! Because your Smart Component (`FeatureManage`) is strictly bound to `issueStore.filteredIssues()`, **you don't need to change anything in your components at all!** The UI is completely decoupled from *how* the data is fetched.

Save your files. If your .NET API is still running in the background, your application should now elegantly pull its data directly from the ASP.NET backend!

*(You can now safely delete the temporary `apiResponse` test code from `app.ts` and `app.html`!).*
