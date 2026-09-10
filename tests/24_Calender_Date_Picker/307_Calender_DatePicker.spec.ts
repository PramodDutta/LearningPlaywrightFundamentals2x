import { test, expect, FrameLocator, Locator } from '@playwright/test';

test('Test Calender and date picker', async ({ page }) => {

    await page.goto('https://app.thetestingacademy.com/playwright/widgets/calendar');

     // Select Round Trip
    await page.getByTestId('trip-roundtrip').click();
    
     // 1. Open departure date picker
    await page.getByTestId('trigger-depart').click();

    let picker = page.getByTestId('date-picker');
    await expect(picker).toBeVisible();

    // 2. Select Departure Date
    await picker.getByTestId('day-2026-09-17').click();

    // 3. Select Return Date
    await page.getByTestId('trigger-return').click();
    picker = page.getByTestId('date-picker');
    await expect(picker).toBeVisible();

    // Click Next Month button and select a date in the next month
    await picker.getByTestId('next-month').click();
    await picker.getByTestId('day-2026-10-20').click();

    // 4. Click Search Flights
    await page.getByTestId('search-flights').click();

    // 5. Assertion
    await expect(page.getByTestId('search-output'))
        .toContainText('2026-09-17');
    await expect(page.getByTestId('search-output'))
        .toContainText('2026-10-20');

});