import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


test.describe('FakerJS data-driven template', () => {
    test('should display the expected generated user details', async ({ page }) => {
        await page.goto('https://app.thetestingacademy.com/playwright/ttacart/');

        // Dynamic Data
        const expected_firstname = faker.person.firstName();
        const expected_email = faker.internet.email();
        const expected_password = faker.internet.password();
        console.log(expected_firstname);

        const telephone = faker.phone.number({ style: 'national' });
        const password = faker.internet.password({ length: 20, memorable: true, pattern: /[A-Z]/, prefix: 'Auto ' });


        const testUser = {
            name: expected_firstname,
            email: expected_email,
            password:expected_password
        }


        await page.getByRole("textbox", { name: "Username" }).fill(testUser.name);
        await page.getByRole("textbox", { name: "Password" }).fill(testUser.name);
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page.getByRole("alert")).toContainText('Username and password do not match any user in this service');

    });
});