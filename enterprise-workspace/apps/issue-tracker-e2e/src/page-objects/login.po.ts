import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roleSelect = page.locator('select');
    this.loginButton = page.locator('lib-ui-button');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(role: string) {
    await this.roleSelect.selectOption(role);
    await this.loginButton.click();
  }
}
