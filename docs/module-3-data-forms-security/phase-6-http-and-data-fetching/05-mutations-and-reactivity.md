# Module 5: Mutations and Component Decoupling

We've mastered fetching data (GET) and setting up global Interceptors. But what about mutating data (POST/PUT/DELETE)? 

When you mutate data on the server, you need your UI to reactively update to reflect the new state. In older architectures, components would have to manually subscribe to the HTTP POST, wait for the response, and then tell another service to reload everything from the server.

In modern Enterprise Angular, we decouple this!

## Your Task: Create an Issue

### 1. Check your Component
Open `src/app/issues/issue-create/issue-create.component.ts` and look at your `onSubmit` method:

```typescript
  onSubmit() {
    if (this.issueForm.valid) {
      const { title, description } = this.issueForm.getRawValue();
      
      // We just call the service method. No subscriptions here!
      this.issueService.addIssue(title, description);

      // We immediately navigate back to the list!
      this.router.navigate(['/issues']);
    }
  }
```

Notice how clean this is? The component is completely unaware that we even have a `.NET` backend. It doesn't know what `HttpClient` is, and it doesn't have to deal with RxJS subscriptions. It just tells the Service: "Hey, add this issue!" and then navigates away.

### 2. Check Your Work! (The Magic of Optimistic Updates)
1. Run your Angular app and ensure your ASP.NET API is running.
2. Navigate to the "Create Issue" page.
3. Fill out the title and description, and hit submit. 

You will immediately be routed back to the Issue List, and the new issue will instantly appear at the bottom! 
This works because in **Module 2**, we wrote our `addIssue` method to perform an **Optimistic UI Update**:

```typescript
  // From issue.service.ts
  addIssue(title: string, description: string) {
    this.http.post<any>(this.apiUrl, { title, description }).subscribe((newIssue) => {
      // Once the API responds, we update the local cache!
      this.issuesResource.value.update(issues => [...(issues ?? []), newIssue]);
    });
  }
```

Because `issuesResource` is an Angular Signal, the second that `.update()` method runs, Angular automatically detects the change and elegantly re-renders the `IssueListComponent` with the new data. No full page reloads, no messy component subscriptions!

---

**Congratulations!** Give yourself a massive pat on the back. You have successfully built a full-stack, enterprise-grade Angular application utilizing Signals, rxResources, Reactive Forms, and HttpClient!
