import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

const TOP = { hitung: 9, monyet: 9, banding: 9, sungai: 9, kuas: 9, kotakpos: 9, sortir: 9, rakit: 9, huruf: 9, awal: 9, kartu: 9, cerita: 9 };

test('top-level rounds for 4-5 still fit on screen', async ({ page }) => {
  await page.addInitScript((top) => {
    localStorage.setItem('kc:progress', JSON.stringify(top));
    localStorage.setItem('kc:settings', JSON.stringify({ age: '4-5' }));
  }, TOP);
  await fastVoice(page);
  await enterGarden(page);
  const vp = page.viewportSize()!;
  const cases: [string, string, string][] = [
    ['warna', 'kotakpos', '.post-hole, .post-item'],
    ['warna', 'sortir', '.sort-basket, .sort-item'],
    ['huruf', 'awal', '.letter-box, .picture-card'],
    ['angka', 'sungai', '.stone'],
    ['angka', 'hitung', '.count-item'],
    ['angka', 'monyet', '.banana'],
  ];
  for (const [area, game, sel] of cases) {
    await openGame(page, area, game);
    await page.waitForTimeout(700);
    for (const el of await page.locator(sel).all()) {
      const b = (await el.boundingBox())!;
      expect(b.x, `${game} ${sel}`).toBeGreaterThanOrEqual(0);
      expect(b.y + b.height, `${game} ${sel}`).toBeLessThanOrEqual(vp.height + 1);
      expect(b.x + b.width, `${game} ${sel}`).toBeLessThanOrEqual(vp.width + 1);
    }
    await page.getByTestId('home-button').click();
    await page.getByTestId('home-button').click();
  }
});
