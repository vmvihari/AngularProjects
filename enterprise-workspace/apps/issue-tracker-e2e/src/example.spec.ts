import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/login.po';

test('should login successfully as Admin and navigate to issues', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await expect(page.getByRole('heading', { name: 'Enterprise Login' })).toBeVisible();

  await loginPage.login('Admin');

  // The application should route us to the dashboard page upon successful login
  await expect(page).toHaveURL(/.*dashboard/);
});
