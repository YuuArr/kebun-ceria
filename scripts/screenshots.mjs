// Captures README screenshots from a running preview: npm run build && npm run preview
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4173/kebun-ceria/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: 'reduce' });
await ctx.addInitScript(() => {
  localStorage.setItem('kc:access', JSON.stringify({ unlocked: true }));
  localStorage.setItem('kc:garden', JSON.stringify({ growth: 24, seen: 24 }));
  localStorage.setItem('kc:settings', JSON.stringify({ age: '4-5' }));
  Object.defineProperty(window, 'speechSynthesis', { value: { speak: (u) => setTimeout(() => u.onend?.(), 300), cancel() {} }, configurable: true });
});
const page = await ctx.newPage();
const open = async (area, game) => {
  await page.goto(base);
  await page.getByTestId('play-button').click();
  if (area) {
    await page.getByTestId(`area-${area}`).click();
    await page.getByTestId(`game-${game}`).click();
    await page.waitForTimeout(800);
  }
};
await page.goto(base);
await page.screenshot({ path: 'docs/screenshots/mulai.png' });
await open();
await page.waitForTimeout(500);
await page.screenshot({ path: 'docs/screenshots/peta-kebun.png' });
await open('angka', 'hitung');
const items = page.getByTestId('count-item');
for (let i = 0; i < Math.min(3, await items.count() - 1); i++) await items.nth(i).dispatchEvent('pointerdown');
await page.waitForTimeout(400);
await page.screenshot({ path: 'docs/screenshots/sentuh-hitung.png' });
await open('warna', 'kuas');
const regions = page.getByTestId('paint-region');
const colors = ['kuning', 'biru', 'merah', 'hijau'];
for (let i = 0; i < (await regions.count()) - 1; i++) {
  await page.getByTestId(`bucket-${colors[i % 4]}`).click();
  await regions.nth(i).dispatchEvent('pointerdown');
}
await page.waitForTimeout(800);
await page.screenshot({ path: 'docs/screenshots/kuas-ajaib.png' });
await open('huruf', 'huruf');
await page.screenshot({ path: 'docs/screenshots/gelembung-huruf.png' });
await browser.close();
console.log('screenshots written to docs/screenshots/');
