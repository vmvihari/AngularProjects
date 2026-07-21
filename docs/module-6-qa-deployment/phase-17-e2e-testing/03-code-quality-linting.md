# Code Quality & Linting

In an enterprise environment, multiple developers are committing code simultaneously. Without strict guidelines, the codebase will quickly devolve into a chaotic mix of formatting styles, inconsistent architectural patterns, and hidden bugs.

We solve this through **Automated Code Quality** tools.

## ESLint

**ESLint** is a static code analysis tool that scans your TypeScript and JavaScript code for problematic patterns or code that doesn't adhere to specific style guidelines.

In an Nx workspace, ESLint is pre-configured and heavily customized to support monorepo architectures.

### Nx Boundary Rules

One of the most powerful features of Nx ESLint is the `@nx/enforce-module-boundaries` rule. This rule prevents developers from making architectural mistakes, such as:
1. Importing a `feature` library into a `ui` library (which would create a circular dependency).
2. Importing an Angular component directly into an Express backend app.
3. Bypassing a library's `index.ts` public API by deep importing internal files.

### Running ESLint

You can run linting across your entire workspace using Nx:

```bash
npx nx run-many -t lint
```

## Prettier

While ESLint focuses on *code quality* (e.g., "don't use `any`"), **Prettier** focuses exclusively on *code formatting* (e.g., "always use single quotes", "indent with 2 spaces").

Prettier takes your code, completely strips away all formatting, and re-prints it from scratch according to a single, uncompromising set of rules. This completely eliminates debates over formatting in Pull Requests.

You can format your entire workspace with:

```bash
npx nx format:write
```

## CI/CD Integration

In an enterprise CI/CD pipeline, these tools act as gatekeepers. A standard pipeline will execute:

1. `npx nx format:check` (Fails if any files are improperly formatted)
2. `npx nx affected -t lint` (Fails if any modified files violate ESLint rules)
3. `npx nx affected -t test` (Fails if unit tests break)
4. `npx nx affected -t e2e` (Fails if E2E tests break)

Only if all of these automated checks pass is a Pull Request allowed to be merged!
