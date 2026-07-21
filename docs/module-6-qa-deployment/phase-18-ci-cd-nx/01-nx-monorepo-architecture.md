# Nx Monorepo Architecture

As applications scale in an enterprise, you often find yourself managing multiple applications that share the same design system, the same authentication logic, or the same data models. 

Historically, companies managed this by publishing internal NPM packages (a "polyrepo" approach). However, this creates a versioning nightmare: if you update the `ui-button` package, you have to manually bump the version in 5 different applications to see the changes.

## Enter the Monorepo

A **Monorepo** is a single git repository that contains multiple distinct projects, with well-defined relationships between them.

Nx is a powerful build system that provides first-class monorepo support. In an Nx workspace, you can have:
- `apps/issue-tracker` (The main web app)
- `apps/admin-dashboard` (A secondary web app)
- `apps/api` (A Node.js backend)
- `libs/ui` (Shared UI components)

If you modify `libs/ui`, Nx knows that *both* web apps depend on it, and can rebuild them simultaneously!

## Computation Caching

One of the most powerful features of Nx is **Computation Caching**. 

Whenever you run a task (like `npx nx test feature-manage`), Nx computes a hash based on:
1. The source code of `feature-manage`
2. The source code of all libraries that `feature-manage` depends on
3. Your global configuration files (`nx.json`, `package.json`, etc.)

It then runs the tests and saves the output to a local cache folder (`.nx/cache`).

If you run `npx nx test feature-manage` again *without* changing any of those files, Nx will completely skip the test execution and instantly replay the cached output from the terminal. This can save hours of wait time in large CI pipelines!

## Project Graph

Nx understands your workspace by analyzing your `import` statements and building a **Project Graph**. You can visualize this graph at any time by running:

```bash
npx nx graph
```

This will open an interactive visualization in your browser, showing exactly how your apps and libraries depend on one another.
