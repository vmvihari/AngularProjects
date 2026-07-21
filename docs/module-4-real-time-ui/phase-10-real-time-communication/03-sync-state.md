# Phase 10, Lesson 3: Syncing State

The true power of real-time communication is keeping multiple clients perfectly synchronized. When User A updates an issue, User B should instantly see that change on their screen without needing to hit "Refresh".

## 1. Registering Hub Listeners

In our `.NET` backend, our `IssuesHub` broadcasts an `IssueUpdated` event containing the updated issue data whenever a `PUT` request is successfully processed:
```csharp
await Clients.All.SendAsync("IssueUpdated", updatedIssue);
```

We need to listen for that exact string (`"IssueUpdated"`) in our Angular app.

Open `libs/issues/data-access/src/lib/issue.store.ts`. We will use the `onInit` lifecycle hook inside `withHooks` to register our SignalR listeners.

```typescript
import { inject, effect } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withHooks } from '@ngrx/signals';
import { SignalRService } from './signalr.service'; // Import our new service!

export const IssueStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    // ... existing methods (addIssue, updateIssue)
  })),
  withHooks({
    onInit(store) {
      // Load initial issues!
      store.loadIssues();

      // 1. Inject the SignalR service
      const signalR = inject(SignalRService);

      // 2. We use an effect to ensure the connection exists before subscribing!
      effect(() => {
        const connection = signalR.connection;
        
        if (connection && connection.state === 'Connected') {
          console.log('🎧 Registering Hub Listeners...');

          // Listen for updates from the server
          connection.on('IssueUpdated', (updatedIssue: Issue) => {
            console.log('⚡ Real-time update received:', updatedIssue);
            
            // Instantly patch the store!
            patchState(store, (state) => ({
              issues: state.issues.map(issue => 
                issue.id === updatedIssue.id ? { ...issue, ...updatedIssue } : issue
              )
            }));
          });

          // Listen for new issues being created
          connection.on('IssueCreated', (newIssue: Issue) => {
            patchState(store, (state) => ({
              // Add the new issue to the top of the array
              issues: [newIssue, ...state.issues]
            }));
          });
          
          // Listen for deleted issues
          connection.on('IssueDeleted', (deletedId: number) => {
            patchState(store, (state) => ({
              issues: state.issues.filter(issue => issue.id !== deletedId)
            }));
          });
        }
      });
    }
  })
);
```

## 2. How It Works

1. User A is on the Dashboard.
2. User B edits an issue and saves it via a standard `HttpClient.put()` request.
3. The .NET API processes the `PUT` request, updates the SQL database, and tells the SignalR Hub to broadcast `"IssueUpdated"` to all connected clients.
4. User A's SignalR connection receives `"IssueUpdated"`.
5. The listener inside `IssueStore.onInit` triggers.
6. `patchState` updates the local signal.
7. Angular's reactivity engine instantly updates User A's UI!

## 3. Resolving the "Double Update" Problem

If User A edits an issue, they send an HTTP `PUT`. Our `updateIssue` store method *already* does an Optimistic UI update (using `patchState`). 

But then, the server broadcasts `"IssueUpdated"` to *everyone*, including User A! User A receives the broadcast and runs `patchState` *again* for the exact same data.

While patching the state twice with identical data isn't breaking anything, it is slightly inefficient. In Enterprise applications, the standard fix is for the server to exclude the caller when broadcasting:
```csharp
// In the .NET Hub or API:
await _hubContext.Clients.AllExcept(connectionId).SendAsync("IssueUpdated", issue);
```
Or, you can simply allow the double-patch since Signals won't trigger re-renders if the data hasn't structurally changed.

Congratulations! You have fully integrated robust, real-time WebSocket communication into an Angular Enterprise application using Signals and RxJS!
