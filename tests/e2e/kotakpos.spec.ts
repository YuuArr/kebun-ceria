import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test('Kotak Pos Bentuk: wrong hole bounces back, all items posted grows garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'warna', 'kotakpos');
  const items = page.locator('[data-testid="post-item"]:not(.placed)');
  const total = await items.count();
  // wrong drop first
  const first = items.first();
  const shape = await first.getAttribute('data-shape');
  const wrongHole = page.locator(`.post-hole:not([data-shape="${shape}"])`).first();
  await dragTo(page, first, wrongHole);
  await expect(items).toHaveCount(total);
  await page.waitForTimeout(500); // let it fly home
  for (let i = 0; i < total; i++) {
    const it = items.first();
    const sh = await it.getAttribute('data-shape');
    await dragTo(page, it, page.getByTestId(`hole-${sh}`));
    await expect(items).toHaveCount(total - i - 1);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
