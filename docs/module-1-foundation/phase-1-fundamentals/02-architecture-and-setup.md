# Phase 1, Lesson 2: Architecture and Setup

Before we dive into writing code, we need to set up our development environment and scaffold the **Enterprise Issue Tracker** project workspace.

While the standard Angular CLI (`ng new`) is great for small apps, enterprise teams overwhelmingly use **Nx** to manage their codebases. Nx provides an advanced build system and enforces a strict Monorepo architecture out-of-the-box, physically separating our application routing shell (`apps/`) from our business domains (`libs/`).

## Prerequisites

First, ensure that you have Node.js installed on your machine.
*   **Required version:** Node.js v20.19.0 or newer.

You can verify your installation by running `node -v` in your terminal.

---

## 🎯 Bootcamp Task: Scaffold the Nx Workspace

It's time to build the foundation of our enterprise application. We will use the `create-nx-workspace` command to generate a pristine, standalone Angular monorepo.

### Step 1: Generate the Workspace
Run the following command in your terminal. This command will create a new Nx workspace containing an empty Angular application shell named `issue-tracker`.

```bash
npx create-nx-workspace@latest enterprise-workspace --preset=angular-monorepo --appName=issue-tracker --style=css --routing=true --ssr=true --bundler=esbuild --e2eTestRunner=playwright --unitTestRunner=vitest --nxCloud=skip
```

*(Note: When prompted about Nx Cloud, you can choose to skip it for this bootcamp).*

### Step 2: Explore the Structure
Once the installation finishes, navigate into your new workspace:
```bash
cd enterprise-workspace
```

Take a look at the generated folder structure in your code editor. You will notice it looks very different from a standard `ng new` project:
*   `apps/issue-tracker/`: This is the application shell. It contains the root routing, the `index.html`, and the global configuration.
*   `apps/issue-tracker-e2e/`: This contains Playwright for automated End-to-End testing.
*   `libs/`: This folder won't appear until we generate our first library in the next lesson, but it is where **95% of our application code** will live as we build out our domains!

### Step 3: Start the Development Server
Let's make sure everything compiled correctly. Run:
```bash
npx nx serve issue-tracker
```
Open your browser to `http://localhost:4200`. You should see the default Nx Angular welcome screen!
