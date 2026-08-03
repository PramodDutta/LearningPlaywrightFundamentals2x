import { test, expect } from '@playwright/test';
const URL = 'https://app.thetestingacademy.com/playwright/multiple_element_filter.html';

test('title test',async ({ page, browserName})=>{
    test.skip(browserName === 'firefox', 'Feature not yet supported on Firefox');
    await page.goto(URL);
    await expect(page).toHaveTitle(/Multiple Element Filter/, { timeout: 15000 });
});

test('email is visible (slow on firefox)', async ({ page, browserName }) => {
    test.slow(browserName === 'firefox', 'firefox is slow on this layout');
    await page.goto(URL);
    await expect(page.getByRole('textbox', { name: 'Email Address' })).toBeVisible();
});

test.fixme('password is visible — broken in Safari, fix me', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
});

test('expected to fail until backend ships', async ({ page }) => {
    test.fail();
    await page.goto(URL);
    await expect(page.getByText('New customer area', { exact: true })).toBeVisible();
});

