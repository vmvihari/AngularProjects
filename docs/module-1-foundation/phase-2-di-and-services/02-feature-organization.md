# Phase 2, Lesson 2: Feature Organization & Library Boundaries

You now have a fully functioning `issues` domain! However, as your enterprise application scales to hundreds of libraries and developers, how do you prevent developers from turning your beautiful architecture into a tangled web of spaghetti code?

What happens if a junior developer accidentally injects the `IssueService` (data access) directly into the `UiIssueCard` (UI)? Suddenly, your Dumb component is incredibly smart, tightly coupled, and impossible to reuse.

In a standard Angular CLI project, this requires immense discipline and code reviews. 
In an Nx Monorepo, **we automate the discipline.**

## Nx Module Boundaries

Nx allows you to apply `tags` to your libraries (e.g., `type:feature`, `type:ui`, `type:data-access`). 

Once your libraries are tagged, you can configure ESLint to actively enforce architectural rules. For example, you can tell the linter:
* `type:feature` can depend on `type:ui` and `type:data-access`.
* `type:ui` can **ONLY** depend on other `type:ui` libraries.
* `domain:issues` cannot depend on `domain:auth` (unless explicitly allowed).

If a developer breaks these rules (like importing `IssueService` into `UiIssueCard`), their code editor will immediately throw a linting error and the CI/CD pipeline will fail their Pull Request!

---

## 🎯 Bootcamp Task: Tag your Architecture

Let's set up the foundation for enforcing module boundaries by tagging the libraries we've built so far.

### Step 1: Tag the Data Access Library
Open `libs/issues/data-access/project.json`.

Find the `"tags": []` array (usually near the top) and update it to define the library's domain and type:
```json
{
  "name": "data-access",
  "$schema": "../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/issues/data-access/src",
  "projectType": "library",
  "tags": ["domain:issues", "type:data-access"],
  // ...
}
```

### Step 2: Tag the Feature Library
Open `libs/issues/feature-manage/project.json`.

Update its tags array:
```json
  "tags": ["domain:issues", "type:feature"],
```

### Step 3: Tag the UI Libraries
We have two UI libraries in the issues domain.
Open `libs/issues/ui-issue-card/project.json` and `libs/issues/ui-issue-filters/project.json`.

Update both of their tags arrays:
```json
  "tags": ["domain:issues", "type:ui"],
```

### Step 4: Tag the Shared UI Library
Remember the generic wrapper we built in Lesson 9? It lives in the `shared` domain!
Open `libs/shared/ui-card/project.json` and update its tags:
```json
  "tags": ["domain:shared", "type:ui"],
```

### Step 5: Test the Architecture
Now that your architecture is fully tagged, you can run a linting pass across your entire workspace to ensure everything is structurally sound.

Run this command in your terminal:
```bash
npx nx run-many -t lint
```

If it says "Successfully ran target lint for X projects", your Enterprise Architecture is pristine!

*(Note: Actually configuring the ESLint rules array to block specific imports is a bit advanced for Phase 2, but simply tagging the libraries establishes the exact mental model you need for enterprise scale!)*
