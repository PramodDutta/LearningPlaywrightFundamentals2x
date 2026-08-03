import { test, expect } from '@playwright/test';

test('TC01 - Login should work', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

test('TC02 - Dashboard should open', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});


test.describe.configure({ mode: 'serial' });

test('Priority 1 - Login test', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

test('Priority 2 - Dashboard test', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

test('Priority 3 - Logout test', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});


test('Login test @p1 @smoke', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

test('Profile test @p2', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

test('Settings test @p3', async ({ page }) => {
  await page.goto('https://app.vwo.com');
});

// npx playwright test --grep @p1