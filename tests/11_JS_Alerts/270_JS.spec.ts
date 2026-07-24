import { test, expect } from '@playwright/test';

test.describe('Javascript Alerts', () => {
    // Group the testcases toghter

    test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    });

    test('JS Alert accept 1', async ({ page }) => {

        // Register the dialog handler BEFORE triggering the alert

        page.once('dialog', async dialog => {
            console.log('Alert type:', dialog.type());
            console.log('Alert message:', dialog.message());
            expect(dialog.message()).toBe('I am a JS Alert');
            await dialog.accept();
        });


        await page.getByRole('button', { name: "Click for JS Alert" }).click();
        // await page.getByText('Click for JS Alert').click();
        // await page.locator('//button[text()="Click for JS Alert"]').click();
        // await page.locator('button', { hasText: 'Click for JS Alert' }).click();

        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');


    });
    test('JS Confirm accept 2', async ({ page }) => {

        page.once('dialog', async dialog => {
            console.log('Alert type:', dialog.type());
            expect(dialog.type()).toBe('confirm');
            console.log('Alert message:', dialog.message());
            expect(dialog.message()).toBe('I am a JS Confirm');
            await dialog.accept();
            //await dialog.dismiss();
        });

        await page.locator('button', { hasText: 'Click for JS Confirm' }).click();
        await expect(page.locator('#result')).toHaveText('You clicked: Ok');




    });
    test('JS Prompt accept 3', async ({ page }) => {

        const inputText = 'Hello from The Testing Academy';

        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.defaultValue()).toBe('');
            await dialog.accept(inputText);
            //await dialog.dismiss();
        });

        await page.locator('button', { hasText: 'Click for JS Prompt' }).click();
        await expect(page.locator('#result')).toHaveText(`You entered: ${inputText}`);

    });






});