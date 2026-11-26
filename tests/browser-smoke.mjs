import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const failures = [];
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
async function openPage(viewport, path) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.supabase={createClient:()=>({auth:{getUser:async()=>({data:{user:null},error:null})}})};`
    })
  );
  await page.route('https://fonts.googleapis.com/**', route => route.abort());
  await page.route('https://fonts.gstatic.com/**', route => route.abort());
  await page.goto(`${baseURL}/${path}`, { waitUntil: 'domcontentloaded' });
  return { context, page, pageErrors };
}
async function testBuilder(viewport, label) {
  const { context, page, pageErrors } = await openPage(viewport, 'site-builder.html');
  try {
    await page.locator('#preview').waitFor();
    check(await page.locator('html').getAttribute('dir') === 'rtl', 'Builder must be RTL');
    check((await page.title()).includes('سایت‌ساز'), 'Builder title is missing');
    await page.locator('#siteName').fill('<img src=x onerror=alert(1)>');
    await page.locator('#headline').fill('عنوان آزمایشی');
    const frame = page.frameLocator('#preview');
    check((await frame.locator('h1').innerText()).includes('عنوان آزمایشی'), 'Live preview did not update');
    check(await frame.locator('img').count() === 0, 'User text was not safely escaped');
    await page.locator('[data-template="store"]').click();
    check(await page.locator('[data-template="store"]').getAttribute('aria-pressed') === 'true', 'Template selection failed');
    await page.locator('#saveDraft').click();
    const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('mw-site-builder-draft')));
    check(draft && draft.template === 'store', 'Local draft did not save');
    check(await page.locator('#cloudProjects a').getAttribute('href') === 'auth.html?next=site-builder.html', 'Signed-out cloud save login link is missing');
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    check(dimensions.width <= dimensions.viewport, `Horizontal overflow at ${label}: ${JSON.stringify(dimensions)}`);
    check(pageErrors.length === 0, `Browser errors in builder at ${label}: ${pageErrors.join('; ')}`);
    console.log(`PASS builder ${label}`);
  } finally {
    await context.close();
  }
}
async function testAssistant(viewport, label) {
  const { context, page, pageErrors } = await openPage(viewport, 'ai-assistant.html');
  try {
    check(await page.locator('html').getAttribute('dir') === 'rtl', 'Assistant must be RTL');
    await page.locator('#kind').selectOption('store');
    await page.locator('#goal').selectOption('sales');
    await page.locator('#features').selectOption('all');
    await page.locator('#notes').fill('<script>unsafe()</script> نیاز آزمایشی');
    await page.locator('#generate').click();
    const result = await page.locator('#result').innerText();
    check(result.includes('فروشگاهی') && result.includes('فروشگاه') && result.includes('نیاز آزمایشی'), 'Assistant did not generate expected project plan');
    check(await page.locator('#result script').count() === 0, 'Assistant rendered user notes as HTML');
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
    check(dimensions.width <= dimensions.viewport, `Horizontal overflow at ${label}: ${JSON.stringify(dimensions)}`);
    check(pageErrors.length === 0, `Browser errors in assistant at ${label}: ${pageErrors.join('; ')}`);
    console.log(`PASS assistant ${label}`);
  } finally {
    await context.close();
  }
}
try {
  await testBuilder({ width: 1365, height: 900 }, 'desktop');
  await testBuilder({ width: 390, height: 844 }, 'mobile');
  await testAssistant({ width: 1365, height: 900 }, 'desktop');
  await testAssistant({ width: 390, height: 844 }, 'mobile');
  console.log('All browser smoke tests passed.');
} catch (error) {
  failures.push(error);
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
