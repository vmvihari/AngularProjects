# Module 3 Assignment: Edit Issue Feature

Congratulations on completing Module 3! You have successfully mastered HttpClient, HttpInterceptors, Route Guards, Role-Based Authorization, and Reactive Forms!

To solidify your understanding of these concepts, your assignment is to build a brand new real-world feature entirely from scratch.

---

## 🎯 Assignment Brief
You will implement the **Edit Issue** feature. 

Currently, users can create new issues and view them on the dashboard, but they have no way to edit them! This assignment requires you to combine everything you have learned across Phase 7, Phase 8, and Phase 9 to fetch existing data, secure the route, and build a reactive form that pre-fills with the existing issue data.

### Requirements

#### 1. Data Access (Store)
Update your `IssueStore` (`libs/issues/data-access/src/lib/issue.store.ts`):
- Add a new `updateIssue(id: number, issue: Partial<Issue>)` method.
- The method must perform an optimistic UI update by updating the issue in the local state array.
- The method must send a `PUT` request to your backend via `HttpClient` (e.g., `PUT ${environment.apiUrl}/issues/${id}`) with the updated data.

#### 2. Feature Component & Form
- Generate a new Nx Angular library: `feature-issue-edit` in the `libs/issues` directory.
- Build a Smart Component that injects the `IssueStore` and `FormBuilder`.
- Re-create the exact same `issueForm` configuration you built in the Create Issue lesson (including sync validators, async validators, and cross-field validators).
- Inject the `ActivatedRoute` to read the `:id` parameter from the URL.
- Fetch the issue data for that ID (either from your `IssueStore` or via a fresh HTTP request).
- **Challenge**: Use `this.issueForm.patchValue(...)` to dynamically pre-fill your Reactive Form with the fetched issue data before the user sees it!

#### 3. Routing & Security
- Open `apps/issue-tracker/src/app/app.routes.ts`.
- Map the `/issues/:id/edit` path to lazy load your new `feature-issue-edit` library using `loadComponent`.
- Protect the route with the `authGuard`.
- Protect the route with the `roleGuard` configured to **only** allow users with the `Admin` or `Manager` roles.

#### 4. Navigation & Submission
- On your Dashboard or Manage Issues screen, add an "Edit" button next to each issue that navigates the user to `/issues/:id/edit`.
- When the user submits the Edit form, call your new `updateIssue` method on the store and navigate them back to the `/issues` dashboard!

---

## 💡 Validation
When you are finished:
1. Log in as a user with the `User` role. Click an "Edit" button. You should be instantly rejected by the `roleGuard` and sent back to the dashboard!
2. Log in as an `Admin`. Click the "Edit" button for an issue.
3. You should arrive at `/issues/:id/edit` and see the form instantly pre-filled with that issue's title, description, and tags!
4. Change the title, ensure validation still works, and click Submit.
5. You should be navigated back to the dashboard, and you should immediately see your updated title on the screen!

Good luck! Once you have finished building the Edit Issue feature, you are ready to move on to Module 4!
