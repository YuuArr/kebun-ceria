import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test('Cocokkan Huruf Awal: 3 steps of letter matching grow the garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'awal');
  for (let step = 0; step < 3; step++) {
    const cards = page.locator('[data-testid="picture-card"]:not(.placed)');
    await expect(cards.first()).toBeVisible();
    const n = await cards.count();
    for (let i = 0; i < n; i++) {
      const c = cards.first();
      const l = await c.getAttribute('data-letter');
      if (i === 0) {
        const wrong = page.locator(`.letter-box:not([data-letter="${l}"])`).first();
        await dragTo(page, c, wrong);
        await expect(cards).toHaveCount(n);
        await page.waitForTimeout(500); // let it fly home
      }
      await dragTo(page, c, page.getByTestId(`box-${l}`));
      await expect(cards).toHaveCount(n - i - 1);
    }
    if (step < 2) await expect(page.locator('.letter-box.filled')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
