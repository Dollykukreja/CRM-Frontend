import { test, expect } from '@playwright/test';

test('Login works correctly', async ({ page }) => {
  // Go to your login page
 await page.goto('http://localhost:5173/login'); 

  // Fill login form
  await page.fill('input[placeholder="Username"]', 'admin');
  await page.fill('input[placeholder="Password"]', 'admin123');

  // Click login button
  await page.click('button:has-text("Login")');

  // Wait for redirect
  await page.waitForTimeout(1000);

  // Verify user is redirected to dashboard (any role)
  await expect(page).toHaveURL('http://localhost:5173/dashboard');
});
