import { test, expect } from '@playwright/test';
import { isDbConfigured, readLoginDataFromDB } from './util/dbReader';
import type { LoginRow } from './util/yamlReader';

/**
 * DDT from MySQL.
 *
 * Setup once:  mysql -u root -p < tests/19_Data_Driven_Testing/test-data/login-data.sql
 * Then set in .env:
 *   MYSQL_HOST=localhost
 *   MYSQL_PORT=3306
 *   MYSQL_USER=root
 *   MYSQL_PASSWORD=your_password
 *   MYSQL_DATABASE=playwright_ddt
 *
 * Note: a DB read is async, and Playwright collects tests synchronously,
 * so we cannot build one test() per row directly like the CSV/JSON/YAML specs.
 * Rows are fetched in beforeAll and each row runs as its own test.step
 * (steps show up individually in the HTML report).
 * Alternative for real per-row tests: dump the table to JSON in globalSetup,
 * then import that JSON in the spec.
 */
test.describe('DDT MySQL', () => {

    let loginData: LoginRow[] = [];

    test.beforeAll(async () => {
        test.skip(!isDbConfigured(), 'MYSQL_HOST not set, skipping MySQL DDT');
        loginData = await readLoginDataFromDB();
        console.log(`Loaded ${loginData.length} rows from MySQL`);
    });

    test('Login with data from MySQL login_data table', async ({ page }) => {
        expect(loginData.length, 'no rows returned from login_data').toBeGreaterThan(0);

        for (const data of loginData) {
            await test.step(`Login with : ${data.description}`, async () => {
                await page.goto('https://app.thetestingacademy.com/playwright/multiple_element_filter');

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

                // if (data.shouldPass) {
                //     await expect(page).not.toHaveURL(/multiple_element_filter/);
                // } else {
                //     await expect(page.getByText(data.expectedError)).toBeVisible();
                // }
            });
        }
    });

});
