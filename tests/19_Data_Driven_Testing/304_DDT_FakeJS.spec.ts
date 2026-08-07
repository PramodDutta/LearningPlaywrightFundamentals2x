import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const totalUserCount = 5;
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'tta.dev', 'icloud.com'];

for(let i=1;i<=totalUserCount;i++){
        test(`Register user# ${i} (${emailDomains[i - 1]})`, async ({ page }) => {

            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomains[i - 1]}`;
            const password = faker.internet.password({ length: 20, memorable: true, pattern: /[A-Z]/, prefix: 'Auto ' });

            await page.goto('https://app.thetestingacademy.com/playwright/tables/practice.html');
            await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
            await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
            await page.getByRole('textbox', { name: 'Email' }).fill(email);
            await page.getByRole('textbox', { name: 'Password' }).first().fill(password);
            await page.getByRole('button', { name: 'Save profile' }).click();
            await expect(page.locator('#submission-output')).toContainText(email);





        });
}