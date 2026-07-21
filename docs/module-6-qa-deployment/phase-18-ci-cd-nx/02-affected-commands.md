# Nx Affected Commands

In a large monorepo with 50 apps and 500 libraries, running `npx nx run-many -t test` on every single Pull Request would take hours.

This is where Nx's true power shines: **The `affected` command**.

## How it works

When you open a Pull Request, Nx looks at your Git history to determine what files you changed compared to the `main` branch. 

It then cross-references those changed files against the **Project Graph**. If you modified `libs/shared/ui-button`, Nx traces the graph upwards to find every app or library that depends on `ui-button`.

Instead of testing all 50 apps, Nx only tests the 3 apps that were actually *affected* by your change!

## Common Affected Commands

You can run any target (test, lint, build, e2e) through the `affected` command:

```bash
# Lint only the affected projects
npx nx affected -t lint

# Test only the affected projects
npx nx affected -t test

# Build only the affected projects
npx nx affected -t build
```

## Base and Head

Under the hood, `nx affected` needs to know what to compare your changes against. By default in a CI environment, it looks at:
- `--base`: The target branch (usually `origin/main`)
- `--head`: Your current branch (usually `HEAD`)

If you want to manually test what was affected by your uncommitted local changes, you can run:

```bash
npx nx affected -t test --base=HEAD~1
```

This allows CI pipelines to remain incredibly fast, scaling infinitely no matter how large the enterprise repository becomes.
