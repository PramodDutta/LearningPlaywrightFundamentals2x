import { chromium } from "playwright";

async function multiTabTest() {

    let browser = await chromium.launch({ headless: false });
    let context = await browser.newContext();

    // Tab 1
    let page1 = await context.newPage();
    await page1.goto("https://app.vwo.com/#login");
    console.log("Tab 1: Dashboard");

    // Tab 2 — same context, shares cookies with Tab 1
    let page2 = await context.newPage();
    await page2.goto("https://app.vwo.com/#dashboard");
    console.log("Tab 2: Settings");


}

multiTabTest();