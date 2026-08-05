import { test, expect } from '@playwright/test';
import path from 'path';
import { readYAML, LoginRow } from './util/yamlReader';

// YAML is read synchronously, so rows exist before Playwright collects tests.
// That lets us generate one test() per row (same as 297_DDT_CSV / 298_JSON_DDT).
const loginData = readYAML<LoginRow>(path.join(__dirname, 'test-data/login-data.yml'));

test.describe('DDT YAML', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://app.thetestingacademy.com/playwright/multiple_element_filter');
    });

    test.afterEach(async ({ }, testInfo) => {
        console.log(`afterEach: ${testInfo.title} -> status: ${testInfo.status}`);
    });

    for (const data of loginData) {

        test(`Login with : ${data.description}`, async ({ page }) => {

            const textboxEmailAddress = page.getByRole("textbox", { name: "Email Address" });
            const textboxPassword = page.getByRole("textbox", { name: "Password" })
                .or(page.locator("#password"))
                .or(page.locator("[name=\"password\"]"));
            const buttonLogin = page.getByRole("button", { name: "Login to Practice Account" })
                .or(page.getByTestId("login-button"))
                .or(page.getByText("Login to Practice Account"));

            await textboxEmailAddress.fill(data.username);
            await textboxPassword.fill(data.password);
            await buttonLogin.click();

            // YAML keeps real booleans, so no "true" string compare needed.
            // if (data.shouldPass) {
            //     await expect(page).not.toHaveURL(/multiple_element_filter/);
            // } else {
            //     await expect(page.getByText(data.expectedError)).toBeVisible();
            // }
        });

    }

});
