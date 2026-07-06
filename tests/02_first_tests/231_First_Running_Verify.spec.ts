import { test, expect } from '@playwright/test';


test('Verify our first TC', async ({ page }) => {


    await page.goto('https://app.vwo.com');
    await expect(page).toHaveTitle('Login - Wingify');
    const logo_img = page.locator('#vow-login-logo');
    // id = 'vow-login-logo'
    await expect(logo_img).toBeVisible();

});