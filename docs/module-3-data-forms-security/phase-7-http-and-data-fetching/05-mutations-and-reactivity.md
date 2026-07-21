# Phase 7, Lesson 5: Recap on Mutations & Reactivity

We've mastered fetching data (GET) using `rxMethod` and setting up global Auth Interceptors using Nx shared libraries. But what about mutating data (POST/PUT/DELETE)? 

When you mutate data on the server, you need your UI to reactively update to reflect the new state. In older architectures, components would have to manually subscribe to the HTTP POST, wait for the response, and then tell another service to reload everything from the server.

In modern Enterprise Angular, we decouple this entirely using **Optimistic UI Updates** and the **NgRx SignalStore**.

## The Magic of Optimistic Updates

Let's take a look at the `resolveIssue` method you wrote inside your `IssueStore` during Lesson 2:

```typescript
    resolveIssue(id: number) {
      // 1. Optimistic Update
      patchState(store, (state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, status: 'Closed' } : issue
        )
      }));
      
      // 2. Background Sync
      http.put(`${environment.apiUrl}/issues/${id}`, { status: 'Closed' }).subscribe();
    },
```

Notice how clean this is? The UI component (`feature-manage.ts`) is completely unaware that we even have a `.NET` backend. It doesn't know what `HttpClient` is, and it doesn't have to deal with RxJS subscriptions. It just tells the Store: "Hey, resolve this issue!"

When you click "Resolve" in the UI:
1. `patchState` immediately updates the SignalStore.
2. Because your UI components are bound to `issueStore.filteredIssues()`, the Angular Signals instantly re-render the exact DOM nodes that changed. The user gets a lightning-fast UI experience (0ms latency).
3. In the background, the HTTP `PUT` request is silently fired to the server to synchronize the data.

This works for `POST` (create) and `DELETE` requests too! 

---

**Congratulations!** Give yourself a massive pat on the back. You have successfully built a full-stack, enterprise-grade Angular application utilizing NgRx SignalStore, Nx Monorepos, Environment Tokens, Interceptors, and HttpClient!
