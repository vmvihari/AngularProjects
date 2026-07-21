# GitHub Actions CI/CD

Continuous Integration (CI) is the practice of automatically building and testing your code every time a developer pushes changes to version control. This prevents broken code from ever being merged into the `main` branch.

**GitHub Actions** is a popular CI/CD platform that allows you to define these automated workflows using simple YAML files.

## Anatomy of a Workflow

Workflows are stored in the `.github/workflows/` directory. A standard workflow consists of:
1. **Triggers**: When should this run? (e.g., `on: pull_request`)
2. **Jobs**: What environments should we use? (e.g., `runs-on: ubuntu-latest`)
3. **Steps**: What specific commands should we execute?

## Enterprise Nx Pipeline

In an Nx workspace, an enterprise CI pipeline typically follows these steps:

1. **Checkout Code**: Clone the repository.
2. **Setup Node**: Install Node.js and dependencies.
3. **Format Check**: Ensure Prettier formatting rules are strictly followed.
4. **Lint Affected**: Run ESLint on affected projects to enforce code quality.
5. **Test Affected**: Run unit tests on affected projects.
6. **E2E Affected**: Run Playwright end-to-end tests on affected apps.
7. **Build Affected**: Ensure all affected apps can be successfully compiled for production.

If *any* of these steps fail, GitHub will block the Pull Request from being merged.

## Nx Cloud (Distributed Task Execution)

While `nx affected` drastically reduces CI time, some PRs (like updating a core utility library) might affect the entire workspace.

In advanced enterprise environments, teams use **Nx Cloud** to enable Distributed Task Execution (DTE). DTE takes the affected graph and distributes the tests across 10 or 20 different virtual machines simultaneously, guaranteeing that even a full workspace test completes in just a few minutes.
