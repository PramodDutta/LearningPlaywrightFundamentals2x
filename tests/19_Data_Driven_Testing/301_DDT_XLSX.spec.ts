import { test, expect } from '@playwright/test';
import path from 'path';
import { readLoginDataFromExcel } from './util/excelReader';
import type { LoginRow } from './util/yamlReader';

/**
 * DDT from an Excel (.xlsx) sheet using exceljs.
 *
 * Generate/refresh the sheet:
 *   node tests/19_Data_Driven_Testing/util/generateExcel.js
 *
 * exceljs reads asynchronously, so like the MySQL spec the rows arrive in
 * beforeAll and each row runs as its own test.step.
 */
const excelFile = path.join(__dirname, 'test-data/login-data.xlsx');

test.describe('DDT XLSX', () => {

    let loginData: LoginRow[] = [];

    test.beforeAll(async () => {
        loginData = await readLoginDataFromExcel(excelFile);
        console.log(`Loaded ${loginData.length} rows from ${path.basename(excelFile)}`);
    });

    test('Login with data from login-data.xlsx', async ({ page }) => {
        expect(loginData.length, 'no rows read from the LoginData sheet').toBeGreaterThan(0);

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
