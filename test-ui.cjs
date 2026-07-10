const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/study-guide/econometrics');
  await page.waitForTimeout(2000);
  
  // Click on Chapter 5
  await page.click('text="Interval Estimation and Hypothesis Testing"');
  await page.waitForTimeout(1000);
  
  // Get HTML of the page
  const content = await page.content();
  if (content.includes('hat{')) {
      console.log('BUG: Still contains hat{...');
  } else if (content.includes('katex')) {
      console.log('SUCCESS: Found katex classes');
      // let's look for the specific test statistics text
      const match = content.match(/calculating test statistics.*?<\/span>/s);
      if (match) console.log(match[0]);
  } else {
      console.log('Could not determine');
  }
  await browser.close();
})();
