const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/study-guide/econometrics');
  await page.waitForTimeout(3000);
  
  // Find the specific text
  const loc = page.locator('text="test-of-significance approach"');
  if (await loc.count() > 0) {
      console.log("HTML:", await loc.first().innerHTML());
  } else {
      console.log("Not found on first page. We need to click through.");
  }
  await browser.close();
})();
