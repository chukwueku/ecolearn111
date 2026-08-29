const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testApp() {
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const testDir = path.join(__dirname, 'test_screenshots');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const dashPath = path.join(testDir, '01_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Captured 01_dashboard.png');

  // Check KaTeX errors on main page
  const katexErrors1 = await page.$$eval('.katex-error', els => els.map(e => e.textContent));
  console.log('KaTeX errors found on main page:', katexErrors1.length);

  // Navigate to Simulators
  console.log('Navigating to Economics Simulator...');
  await page.goto('http://localhost:3000/simulator', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const simPath = path.join(testDir, '02_economics_simulator.png');
  await page.screenshot({ path: simPath });
  console.log('Captured 02_economics_simulator.png');

  const katexErrors2 = await page.$$eval('.katex-error', els => els.map(e => e.textContent));
  console.log('KaTeX errors found on simulator page:', katexErrors2.length);

  // Navigate to Study Guide
  console.log('Navigating to Study Guide...');
  await page.goto('http://localhost:3000/study', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const studyPath = path.join(testDir, '03_study_guide.png');
  await page.screenshot({ path: studyPath });
  console.log('Captured 03_study_guide.png');

  const katexErrors3 = await page.$$eval('.katex-error', els => els.map(e => e.textContent));
  console.log('KaTeX errors found on study guide page:', katexErrors3.length);

  await browser.close();
  console.log('ALL TESTS SUCCESSFUL!');
}

testApp().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
