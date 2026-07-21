# Phase 7, Lesson 3: Environment Configurations

Hardcoding `http://localhost:5000/api/issues` directly into a store or component is a bad practice. When deploying to production, your API URL will naturally change (e.g., `https://api.enterprise.com`).

Angular provides Environment variables to handle this swapping automatically during the build process.

## Your Task: Configure Environments

### 1. Create Environment Files
In modern Angular CLI / Nx workspaces, we just create the environment files manually!

1. Create a new folder at `apps/issue-tracker/src/environments/`.
2. Inside that folder, create a file named `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```
*(In a real app, you would also create `environment.prod.ts` and configure your `project.json` to swap them on build, but we only need local dev for now!)*

### 2. Consume the Environment Variable in your Store
Return to your `IssueStore` (`libs/issues/data-access/src/lib/issue.store.ts`) and update it to use the environment file instead of hardcoding `http://localhost:5000/api`.

**Warning**: Because the `IssueStore` is in a completely separate library (`libs/issues/data-access`), importing an environment file from the `apps/` directory is technically an architectural violation (libraries shouldn't depend on apps!). However, for the sake of simplicity in this exercise, we will bend the rules slightly. We will address this properly in **Module 5: Enterprise Architecture** by creating a global Injection Token!

Update your API calls in `IssueStore` to use the environment variable:

```typescript
// Add this import at the top!
import { environment } from '../../../../../apps/issue-tracker/src/environments/environment';

// ... inside IssueStore withMethods:

    loadIssues: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => http.get<Issue[]>(`${environment.apiUrl}/issues`).pipe( // <-- Use the environment!
          tap((issues) => {
            patchState(store, { issues, isLoading: false });
          })
        ))
      )
    )

    // ... don't forget to update the PUT request in resolveIssue and updateTitle too!
```

Try resolving an issue in your UI one last time to make sure nothing broke. 
If it still works perfectly, you are ready to move on!
