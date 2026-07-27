import { test, expect, Locator } from '@playwright/test';

const URL = 'https://app.thetestingacademy.com/playwright/widgets/svg'; // replace with target page

test.describe('SVG handling', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
    });

       test('locate SVG root and assert visible', async ({ page }) => {


        const circleShape: Locator = page.locator('#circle-blue');
        await circleShape.click();

        const output = await page.locator('#shapes-output').innerText();
        expect(output).toContain('Blue circle');


        await page.getByRole('button', { name : /Q3 bar/ }).click();
        await page.getByRole('radio', { name: '4 stars' }).click();

        let allBars = await page.locator(".bar").all();
        for(const bar of allBars){

                // logic which is the hegiht, low ......click on that.

                const q = await bar.getAttribute('data-quarter');
                const h = await bar.getAttribute('height');
                console.log(q);
                console.log(h);
        }



        await page.pause();



    });



});