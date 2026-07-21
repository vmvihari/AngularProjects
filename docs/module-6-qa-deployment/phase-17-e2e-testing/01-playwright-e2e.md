# End-to-End Testing with Playwright

Unit tests are fantastic for isolating individual pieces of logic, but they don't guarantee that those pieces work together correctly in a real browser. That's where **End-to-End (E2E) Testing** comes in.

In an E2E test, an automated browser navigates through your application exactly as a real user would—clicking buttons, filling out forms, and asserting that the final UI looks correct.

## Playwright in Nx

Historically, Angular applications used Protractor or Cypress for E2E testing. However, **Playwright** (developed by Microsoft) has become the modern standard due to its raw speed, multi-browser support, and excellent debugging tools.

When we scaffolded our Nx workspace, Nx automatically created an E2E testing application for us: `apps/issue-tracker-e2e`.

This application contains a `playwright.config.ts` file configured to serve our Angular application and run Playwright tests against it.

## Writing a Basic Test

Playwright tests use a familiar `test()` and `expect()` syntax. Playwright provides a `page` object that represents the browser tab.

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  // 1. Navigate to the page
  await page.goto('/');

  // 2. Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Issue Tracker/);
});
```

## Selectors and Locators

Instead of querying the DOM with `document.querySelector`, Playwright uses **Locators**. Locators represent a way to find element(s) on the page at any moment. They are strictly evaluated at the exact moment an action is performed, making them highly resilient to dynamic DOM changes.

```typescript
// Find by Role (Best Practice for Accessibility)
await page.getByRole('button', { name: 'Submit' }).click();

// Find by Text
await page.getByText('Welcome back, User').toBeVisible();

// Find by Test ID (Good for brittle layouts)
await page.getByTestId('login-form').fill('...');
```

## Running Tests

To run the E2E tests in your workspace, use the Nx command:

```bash
npx nx e2e issue-tracker-e2e
```

Playwright will start the Angular development server automatically, run the tests in headless browsers, and shut down the server when complete. If a test fails, Playwright can generate a trace file that allows you to step through the test execution visually!
