import { test, expect, Locator } from '@playwright/test';

const URL = 'https://www.flipkart.com/search'

test.describe('Flipkart Seach via the SVG', () => {

    test.beforeEach(async ({ page }) => {
        console.log("Before running any Testcase!")
        await page.goto(URL);
    })

    test('TC#1 @smoke @regression', async ({ page }) => {

        await page.locator('input[name="q"]').fill("macmini");
        //await page.getByTitle('Search for products, brands and more').fill('macmini');

        const svgElements: Locator = page.locator('svg');
        await svgElements.first().click();


        // const svgElementsAll: Locator[] = await page.locator('svg').all();
        // for(let svgElement in svgElementsAll){
        //     // find and click()
        // }

        // //div[contains(@data-id,'CPU') or contains(@data-id,'ACC') or contains(@data-id,'COM') or contains(@data-id,'MP')]/div/a[2]
        const titleResults: Locator = page.locator("//div[contains(@data-id,'CPU') or contains(@data-id,'ACC') or contains(@data-id,'COM') or contains(@data-id,'MP')]/div/a[2]");

        const count: number = await titleResults.count();
        for (let i = 0; i < count; i++) {
            const title: string | null = await titleResults.nth(i).textContent();
            console.log(title);
        }

        await page.pause();








    });


});