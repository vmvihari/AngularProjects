# Module 1 Assignment: The Profile Settings Feature

Congratulations on completing Module 1! To lock in your new knowledge, it is time to build a brand new feature from scratch without any hand-holding. 

Your goal is to build a lazy-loaded Profile Settings page that displays the current user's profile card, utilizing Nx libraries, Smart/Dumb architecture, Dependency Injection, and Route Guards.

## Requirements

### 1. Data Access
- Inside your `data-access` library, create a new `UserService`.
- It should have a `getCurrentUser()` method that returns a hardcoded user object (e.g., `{ name: 'Jane Doe', role: 'System Administrator', email: 'jane@enterprise.com' }`).
- Ensure the service is exported in the `data-access` `index.ts` file!

### 2. Dumb Component (UI)
- Generate a new Nx Angular library: `ui-user-profile` in the `libs/shared` directory.
- Build a Dumb Component that accepts the `user` object via `@Input()`.
- The template should display the user's name, role, and email.
- **Challenge**: Use `<ng-content>` to allow the consumer to project a custom avatar image into the profile card!

### 3. Smart Component (Feature)
- Generate a new Nx Angular library: `feature-settings` in the `libs/issues` directory.
- Build a Smart Component that injects the `UserService`.
- Inside the HTML template, use the `UiUserProfile` dumb component to display the data, and project an avatar image into it.

### 4. Routing & Lazy Loading
- Open `apps/issue-tracker/src/app/app.routes.ts`.
- Map the `/settings` path to lazy load your new `feature-settings` library using `loadComponent`.
- Protect the `/settings` route using the `authGuard` you built in Lesson 4!

### 5. Navigation
- Open your shell template (`apps/issue-tracker/src/app/app.html`).
- Find the "Settings" link in the sidebar and update its `href="#"` to `routerLink="/settings" routerLinkActive="active"`.

---

## Validation
When you are finished:
1. Ensure your `npx nx serve` server is running (you may need to restart it since you added new Nx libraries!).
2. Ensure `isLoggedIn = true` in your `auth.guard.ts`.
3. Click "Settings" in your sidebar. The URL should update, the lazy-loaded chunk should fetch, and your beautiful Profile Card should render!
4. Change `isLoggedIn = false`. Click "Settings" again. You should be instantly rejected and bounced back to the Dashboard!

**Good luck! Let me know when you have completed this assignment, and we will move on to Module 2!**
