# Module 4 Assignment: Real-Time Alerts

Congratulations on making it to the end of Module 4! You have learned how to integrate WebSockets via SignalR, manipulate the DOM with custom structural directives, build custom data-formatting pipes, dynamically load components, and ensure your app is accessible.

## The Challenge

Currently, your application listens for the `IssueUpdated` SignalR event to instantly reflect edits made by other users. 

Your challenge is to implement a Real-Time Deletion feature, combining everything you learned in this module!

### Requirements

**Note**: The `.NET` API has already been updated for you! It now exposes a `DELETE /api/issues/{id}` endpoint. When an issue is successfully deleted, the backend automatically uses the `IssuesHub` to broadcast an `IssueDeleted` event (containing the deleted ID) to all connected clients.
   
1. **Store Integration**:
   - Update `libs/issues/data-access/src/lib/issue.store.ts`. 
   - In the `onInit` lifecycle hook, subscribe to the `IssueDeleted` SignalR event. When received, it should remove the deleted issue from the local signal state.
   
2. **Dynamic Component Toast**:
   - When the `IssueDeleted` event is received via SignalR, your Angular application must dynamically spawn the `UiToastComponent` (using your `ToastService`) to notify the user with a message like: *"An issue was just deleted by another user!"*
   
3. **Accessibility**:
   - Ensure that the dynamic Toast component has the appropriate ARIA roles (`role="alert"`) so the screen reader immediately announces the deletion to visually impaired users.

### Hints
- You do not need to build a "Delete" button in the UI for this assignment! You can simply test it by using a tool like Postman or `curl` to manually hit the `DELETE` endpoint on your running .NET API. Watch your Angular UI instantly update and spawn the Toast!
- Remember that `IssueStore` is where the `SignalRService` is injected. Since you can't easily inject the UI-layer `ToastService` into the data-layer `IssueStore` without causing architectural coupling, think about how you might trigger the Toast. (Hint: You can use an `effect()` in your Dashboard component that listens to a `lastDeletedIssueId` signal on the store!)

Good luck!
