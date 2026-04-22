import { chromium } from 'playwright';

(async () => {
  console.log("Starting playwright...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Collect all console errors and general messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR CONSOLE:', msg.text());
    } else {
      console.log('BROWSER CONSOLE:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE UNCAUGHT EXCEPTION:', err.toString());
  });

  console.log("Navigating to local dev server...");
  await page.goto('http://localhost:5173/');
  
  // Wait for the form to be ready
  await page.waitForSelector('#btn-submit');
  
  console.log("Filling form...");
  await page.fill('#input-name', 'Test User');
  await page.fill('#input-day', '18');
  await page.fill('#input-month', '08');
  await page.fill('#input-year', '1990');
  
  console.log("Clicking submit...");
  await page.click('#btn-submit');
  
  // Wait a bit for the loading screen and result
  await page.waitForTimeout(5000);
  
  await browser.close();
  console.log("Test finished.");
})();
