import { test, expect, Locator } from '@playwright/test';
import path from 'path';

const URL = 'https://the-internet.herokuapp.com/upload'; // replace with target page

test.describe('FileUpload handling', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
    });

    test('locate FileUpload and upload', async ({ page }) => {

        const filePath = path.join(__dirname, 'testdata.txt');
        console.log('File path:', filePath);

        await page.setInputFiles('#file-upload', filePath);
        await page.click('#file-submit');

        await expect(page.locator('h3')).toHaveText('File Uploaded!');
        await expect(page.locator('#uploaded-files')).toHaveText('testdata.txt');
        await page.pause();
        await page.waitForTimeout(15000);


    });

});
