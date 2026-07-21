# The Page Object Model (POM)

Writing E2E tests directly against the DOM is easy, but it quickly becomes a maintenance nightmare in an enterprise application. 

Imagine you have 50 tests that all click the `#login-submit-btn`. If the frontend team changes that ID to `.auth-btn-primary`, all 50 tests will instantly break. You would have to manually update 50 different files.

## What is a Page Object?

The **Page Object Model (POM)** is an architectural pattern that solves this problem by encapsulating the structure of a web page into a single Class.

Instead of writing DOM selectors in your tests, your tests interact with the Page Object. If the UI changes, you only have to update the selectors in **one place**: the Page Object.

## Implementing POM in Playwright

Here is an example of a Page Object for our Login page:

```typescript
// src/page-objects/login.po.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Define all selectors here
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole('button', { name: 'Log in' });
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.submitButton.click();
  }
}
```

## Using the Page Object

Now, our actual test file remains completely ignorant of the underlying DOM structure. It reads like plain English:

```typescript
// src/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/login.po';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('admin@company.com', 'password123');

  // Assert that we navigated away from the login page!
  await expect(page).toHaveURL(/\/dashboard/);
});
```

By decoupling the *intent* of the test from the *mechanics* of the DOM, our test suite becomes incredibly resilient to change.
