import { test, expect} from '@playwright/test';

test('Test Calender and date picker', async ({ page }) => {

    await page.goto('https://app.thetestingacademy.com/playwright/widgets/calendar');

    // Booking Dates, this can come from a config file or a data file, or can be generated dynamically
    let departureDate = '2026-09-19';
    let returnDate = '2027-01-17';

    // Select Round Trip
    await page.getByTestId('trip-roundtrip').click();
    
     // 1. Open departure date picker
    await page.getByTestId('trigger-depart').click();

    // 2. Select Departure Date
    await selectDate(page, departureDate);

    // 3. Select Return Date
    await page.getByTestId('trigger-return').click();

    // Click Next Month button and select a date in the next month
    await page.getByTestId('next-month').click();
    await selectDate(page, returnDate);

    // 4. Click Search Flights
    await page.getByTestId('search-flights').click();

    // 5. Assertion
    await expect(page.getByTestId('search-output'))
        .toContainText(departureDate);
    await expect(page.getByTestId('search-output'))
        .toContainText(returnDate);

});

async function selectDate(page, date) {
    // 1. Wait for the date picker to be visible
    let picker = page.getByTestId('date-picker');
    await expect(picker).toBeVisible();

    // 2. Locator for the target day cell (e.g. day-2026-09-19)
    const day = picker.getByTestId('day-' + date);

    // 3. Keep clicking "Next month" until the target day appears in the DOM
    // capped at 24 clicks ~ 2 years, so a bad/unreachable date fails instead of looping forever)
    for (let i = 0; i < 24; i++) {
        if (await day.count() > 0) break;
        await picker.getByTestId('next-month').click();
    }

    // 4. Click the target date
    await day.click();
}