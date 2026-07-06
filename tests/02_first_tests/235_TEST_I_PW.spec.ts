import { test, expect } from "@playwright/test";

test("login test", async ({ page }) => {
    // 'page' is automatically created for you
    // Playwright already launched a browser, created a context, and opened this page

    await page.goto("https://app.vwo.com/#login");
    await page.fill("#username", "admin");
    await page.fill("#password", "pass123");
    await page.click("#login-btn");

    await expect(page).toHaveURL("/dashboard");
});

test("another test", async ({ page }) => {
    // This gets a FRESH page in a FRESH context
    // Zero shared state with the test above
    // Each test is completely isolated

    await page.goto("https://app.com/#signup");
    await expect(page).toHaveTitle("Sign Up");
});