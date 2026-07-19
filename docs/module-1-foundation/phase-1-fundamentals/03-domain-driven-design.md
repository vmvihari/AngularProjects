# Phase 1, Lesson 3: Domain-Driven Design (DDD)

In the previous lesson, you scaffolded an Nx Workspace and explored the `apps/` directory. By the end of this lesson, we will generate the second—and most important—pillar of our architecture: the `libs/` directory. 

This separation is the cornerstone of **Domain-Driven Design (DDD)** in modern Enterprise Angular development.

## Apps vs. Libs

In a standard Angular CLI project, all of your code lives in `src/app`. As the application scales to hundreds of components, this becomes a "Big Ball of Mud". Components from the *Billing* domain might accidentally import services from the *Dashboard* domain, creating tightly coupled, untestable spaghetti code.

Nx solves this by physically separating the architecture:
*   **Apps (`apps/`)**: These are empty shells. They contain *no business logic*. Their only job is to provide the root `index.html`, global configuration, and routing that ties the libraries together.
*   **Libs (`libs/`)**: This is where **95%** of your application code lives. A library is an isolated package of code with a strict public API (`index.ts`). If a component isn't exported from the `index.ts` file, no other library or app can use it!

## Structuring the Libs folder (The LIFT Principle)

When building our enterprise applications, we follow the **LIFT** principle:
1.  **L**ocate code quickly.
2.  **I**dentify the code at a glance.
3.  **F**lat structure as long as possible.
4.  **T**ry to be DRY (Don't Repeat Yourself).

To achieve this, we organize our `libs/` folder by **Domain** (e.g., `issues`, `users`, `billing`). Inside each domain, we separate the code by its **type**:
*   `feature-*`: Smart components that manage state and routable views.
*   `ui-*`: Dumb, presentational components (like buttons or cards).
*   `data-access`: Services, state management (NgRx), and API models.
*   `util`: Helper functions and pure logic.

---

## 🎯 Bootcamp Task: Generate the Issues Domain

Let's put this into practice! Our app is an Issue Tracker, so our primary domain is `issues`. 

We need to create our very first library: a feature library that will eventually house the main "Manage Issues" page.

### Step 1: Use the Nx Generator
Nx provides powerful generators that do the heavy lifting for us. Run this command in your terminal at the root of the `enterprise-workspace`:

```bash
npx nx g @nx/angular:library --directory=libs/issues/feature-manage
```

### Step 2: Understand the Command
*   `@nx/angular:library`: Tells Nx we want to generate an Angular library.
*   `--directory=libs/issues/feature-manage`: In modern Nx, the folder path determines the library's location and derived name. This places the library under the `issues` domain folder.
*   *Note: In modern Nx versions (v17+), standalone components are the default so we don't need a `--standalone` flag!*

### Step 3: Explore the Library
Take a look at your folder structure now. You should see `libs/issues/feature-manage`.
Inside, look for the `src/index.ts` file. This is the **Public API** of the library. Only the files exported here are accessible to the rest of the application!
