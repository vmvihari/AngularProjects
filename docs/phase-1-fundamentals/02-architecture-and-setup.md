# Module 2: Architecture and Setup

Before we dive into writing code, we need to set up our development environment and scaffold the **Enterprise Issue Tracker** project workspace.

## Prerequisites

First, ensure that you have Node.js installed on your machine.
*   **Required version:** Node.js v20.19.0 or newer.

You can verify your installation by running `node -v` in your terminal.

## Scaffolding the Project

We will use the Angular CLI (Command Line Interface) to generate our new project. The CLI is the standard tool for creating, building, and serving Angular applications.

Run the following commands in your terminal:

```bash
# First, create a directory to hold all our course projects
mkdir apps
cd apps

# Generate the main Angular project (you can accept the default prompts)
ng new enterprise-issue-tracker

# Navigate into the newly created project directory
cd enterprise-issue-tracker

# Start the local development server
ng serve
```

Running these commands will:
1. Generate the foundational project structure.
2. Install all necessary npm dependencies.
3. Start your local development server, which you can view at `http://localhost:4200`.
