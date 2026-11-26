// Renders the app icons from the Cici mascot (run with the dev server up: npm run dev).
// Usage: node scripts/icons.mjs http://localhost:5173/kebun-ceria/
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:5173/kebun-ceria/';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(url);
for (const [name, size, pad] of [['icon-192.png', 192, 0.12], ['icon-512.png', 512, 0.12], ['icon-maskable-512.png', 512, 0.22], ['apple-touch-icon.png', 180, 0.12]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.evaluate(async ({ size, pad }) => {
    const { cici } = await import('/kebun-ceria/src/art/cici.ts');
    document.body.innerHTML = '';
    const box = document.createElement('div');
    box.style.cssText = `position:fixed;inset:0;background:radial-gradient(circle at 50% 35%,#BDE6FF 0 55%,#7CC36E 56%);display:grid;place-items:center;padding:${size * pad}px`;
    const svg = cici('happy');
    svg.style.cssText = 'width:100%;height:100%';
    box.append(svg);
    document.body.append(box);
  }, { size, pad });
  await page.screenshot({ path: `public/icons/${name}` });
  console.log('wrote', name);
}
await browser.close();
