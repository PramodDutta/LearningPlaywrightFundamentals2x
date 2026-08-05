import { test, expect } from "@playwright/test";
import loginData from "./test-data/login.json";

test.describe("Login - data driven", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://app.thetestingacademy.com/playwright/multiple_element_filter");
  });

  test("login with valid user", async ({ page }) => {
    await page.locator("#email").fill(loginData.validUser.email);
    await page.locator("#password").fill(loginData.validUser.password);
    await page.getByTestId("login-button").click();
  });

  test("login with invalid user", async ({ page }) => {
    await page.locator("#email").fill(loginData.invalidUser.email);
    await page.locator("#password").fill(loginData.invalidUser.password);
    await page.getByTestId("login-button").click();
  });
});