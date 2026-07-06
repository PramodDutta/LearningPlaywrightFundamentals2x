import { chromium, Browser, BrowserContext, Page } from "playwright";

async function run() {

    // LEVEL 1: Launch browser — heaviest operation, do it once
    let browser: Browser = await chromium.launch({ headless: false });
    console.log("Browser Launched", browser);

    // LEVEL 2: Create context — fresh session, isolated cookies
    let context1: BrowserContext = await browser.newContext();
    console.log("Context created", context1);

    let context2: BrowserContext = await browser.newContext();
    console.log("Context created", context2);


    // LEVEL 3: Open page — a tab inside the context
    let page: Page = await context1.newPage();
    console.log("Page opened");


    await page.goto("https://app.vwo.com");
    console.log("Title:", await page.title());

    // Cleanup - reverse oder
    await page.close();
    await context1.close();
    await context2.close();
    await browser.close();





}

// Browser launched
// Context created
// Page opened
// Title: Example Domain
run();