import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

for (const game of ['induk', 'makanan']) {
  test(`${game}: tiles go to their match; 3 steps grow the garden`, async ({ page }) => {
    await openGame(page, 'hewan', game);
    for (let step = 0; step < 3; step++) {
      const tiles = page.locator('[data-testid="pair-tile"]:not(.placed)');
      await expect(tiles.first()).toBeVisible();
      const n = await tiles.count();
      for (let i = 0; i < n; i++) {
        const t = tiles.first();
        const id = await t.getAttribute('data-id');
        if (step === 0 && i === 0) {
          const wrong = page.locator(`.pair-target:not([data-id="${id}"])`).first();
          await dragTo(page, t, wrong);
          await expect(tiles).toHaveCount(n);
          await page.waitForTimeout(500);
        }
        await dragTo(page, t, page.getByTestId(`target-${id}`));
        await expect(tiles).toHaveCount(n - i - 1);
      }
      if (step < 2) await expect(page.locator('.pair-target.matched')).toHaveCount(0, { timeout: 10_000 });
    }
    await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
  });
}

test('Suara Hewan: 5 sounds answered grow the garden', async ({ page }) => {
  await openGame(page, 'hewan', 'suara');
  for (let i = 0; i < 5; i++) {
    const right = page.locator('.choice[data-correct]');
    await expect(right).toBeVisible();
    await right.dispatchEvent('pointerdown');
    await expect(page.locator('.choice.chosen')).toHaveCount(1);
    if (i < 4) await expect(page.locator('.choice.chosen')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
