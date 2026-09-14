import { test, expect} from '@playwright/test';

test('Test Calender and date picker', async ({ page }) => {

    await page.goto('https://app.thetestingacademy.com/playwright/widgets/calendar');

    // Select One way Trip
    await page.getByTestId('trip-oneway').click();
    
     // 1. Open departure date picker
    await page.getByTestId('trigger-depart').click();

    let picker = page.getByTestId('date-picker');
    await expect(picker).toBeVisible();

    // 2. Select Departure Date
    await picker.getByTestId('day-2026-09-19').click();

    // 3. Click Search Flights
    await page.getByTestId('search-flights').click();

    // 5. Assertion
    await expect(page.getByTestId('search-output')).toContainText('2026-09-19');
});