# Module 2: CRUD Operations and State

Now that we know `HttpClient` works, it's time to properly architect it. In enterprise applications, we **never** use the `any` type, and we don't make HTTP calls directly from components. We abstract them into strongly-typed Services.

## Your Task: Update the Issue Service

Let's refactor our `IssueService` to fetch the real data instead of our hardcoded Signal array.

### 1. Refactor from `resource` to `rxResource`
Open `src/app/issues/issue.service.ts`. 
Currently, you are using the Angular 19 `resource` API with a hardcoded async loader. We are going to seamlessly upgrade this to `rxResource`, which allows us to load our resource using an RxJS Observable from the `HttpClient`!

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal, linkedSignal, inject } from '@angular/core';
import { toObservable, toSignal, rxResource } from '@angular/core/rxjs-interop'; // <-- Add rxResource!
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:5000/api/issues';

  // 1. READ: Replace your hardcoded `resource` with `rxResource` to fetch from the API!
  issuesResource = rxResource({
    loader: () => this.http.get<any[]>(this.apiUrl)
  });

  // --- KEEP ALL OF THIS THE SAME! ---
  openIssuesCount = computed(() => /* ... */);
  searchTerm = signal('');
  searchTerm$ = toObservable(this.searchTerm).pipe(debounceTime(300));
  debounceSearch = toSignal(this.searchTerm$, { initialValue: '' });
  filteredIssues = computed(() => /* ... */);
  selectedIssue = signal<any | null>(null);
  draftTitle = linkedSignal(() => /* ... */);  
  editIssue(issueId: number) { /* ... */ }
  // -----------------------------------

  // 2. UPDATE: Refactor mutations to make HTTP calls, and then optimistically update the local resource!

  onResolveIssue(issueId: number) {
    this.http.put<any>(`${this.apiUrl}/${issueId}`, { status: 'Closed' }).subscribe(() => {
      this.issuesResource.value.update(issues => 
        (issues ?? []).map(issue => issue.id === issueId ? { ...issue, status: 'Closed' } : issue)
      )
    });
  }

  updateIssueTitle(issueId: number, newTitle: string) {
    this.http.put<any>(`${this.apiUrl}/${issueId}`, { title: newTitle }).subscribe(() => {
      this.issuesResource.value.update(issues => 
        (issues ?? []).map(issue => issue.id === issueId ? { ...issue, title: newTitle } : issue)
      );
    });
  }

  // 3. CREATE: Refactor addIssue to make a POST request
  addIssue(title: string, description: string) {
    this.http.post<any>(this.apiUrl, { title, description }).subscribe((newIssue) => {
      this.issuesResource.value.update(issues => [...(issues ?? []), newIssue]);
    });
  }

  // 4. DELETE: Let's add a new delete method for full CRUD!
  deleteIssue(issueId: number) {
    this.http.delete(`${this.apiUrl}/${issueId}`).subscribe(() => {
      this.issuesResource.value.update(issues => 
        (issues ?? []).filter(issue => issue.id !== issueId)
      );
    });
  }
}
```

### Why did we make these specific changes?

Let's break down exactly what happened in this architectural shift:

1. **`rxResource` Instead of `resource`**: The standard `resource` API expects a Promise-based `loader` function. Because Angular's `HttpClient` natively returns RxJS Observables, we seamlessly swapped to `rxResource`, which allows our loader to directly return `this.http.get()`. 
2. **Optimistic UI Updates**: Look closely at our mutation methods (`addIssue`, `onResolveIssue`, etc.). We make the HTTP request (e.g. `this.http.post().subscribe()`), and inside the success callback, we use `this.issuesResource.value.update()` to modify the local data array. This is a critical enterprise pattern! Instead of forcing the app to re-fetch the entire issues list from the server every time a user makes a tiny edit, we simply sync the local cache with the server's response. This makes the UI feel instantly responsive and prevents unnecessary backend traffic.
3. **Decoupling**: Notice how we didn't touch `openIssuesCount` or `filteredIssues`? Because they are `computed` signals derived from `issuesResource.value()`, they automatically recalculate when the HTTP request finishes. This is the magic of Angular Signals!

### 2. Connect the UI (Check Your Work!)
Open `src/app/issues/issue-list/issue-list.component.ts`. 

Wait! Because we kept the name `issuesResource` and didn't change the shape of the data, **you don't need to change anything in your component at all!** The component is completely decoupled from *how* the data is fetched.

Just save your files and look at the app. Your UI should now elegantly render the issues pulled directly from the ASP.NET Core API instead of the hardcoded data! 

*(You can now safely remove the black API test box from `app.component.ts`.).*

---

### Bonus: `httpResource` (Angular 19 Preview)
If you are reading the latest Angular documentation, you might see references to `httpResource` (from `@angular/common/http`). This is a brand new feature in Angular 19 that acts as syntactic sugar over what we just built. 

For a simple GET request, instead of writing a custom `rxResource` loader, you could literally just write:
```typescript
issuesResource = httpResource<any[]>(this.apiUrl);
```

**Why aren't we using it here?**
While `httpResource` is incredibly concise, it abstracts away some of the underlying mechanics. Because our Enterprise Architecture requires explicit control over our data flow (like executing Optimistic UI Updates via `.value.update()` after complex RxJS subscriptions), using `rxResource` combined with standard `HttpClient` methods gives us the explicit control we need while still fully leveraging the power of Signals!