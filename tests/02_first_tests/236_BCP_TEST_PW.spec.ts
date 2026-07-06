import { test, expect } from "@playwright/test";

test("two users interact", async ({ browser }) => {
    let adminContext = await browser.newContext();
    let adminPage = await adminContext.newPage();

    let guestContext = await browser.newContext();
    let guestPage = await guestContext.newPage();
    await adminPage.goto("https://app.vwo.com/#login");
    await guestPage.goto("https://app.vwo.com/#dashboard/home");
    console.log("Admin URL:", adminPage.url());
    console.log("Guest URL:", guestPage.url());
    await adminContext.close();
    await guestContext.close();

});