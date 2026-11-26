import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('Huruf Besar-Kecil: small letters pair with capitals', async ({ page }) => {
  await openGame(page, 'huruf', 'besarkecil');
  for (let step = 0; step < 3; step++) {
    const tiles = page.locator('[data-testid="lower-tile"]:not(.placed)');
    await expect(tiles.first()).toBeVisible();
    const n = await tiles.count();
    for (let i = 0; i < n; i++) {
      const t = tiles.first();
      const l = await t.getAttribute('data-letter');
      await dragTo(page, t, page.getByTestId(`box-${l}`));
      await expect(tiles).toHaveCount(n - i - 1);
    }
    if (step < 2) await expect(page.locator('.letter-box.filled')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Susun Suku Kata: syllables go in order; wrong order bounces', async ({ page }) => {
  await openGame(page, 'huruf', 'susun');
  for (let w = 0; w < 3; w++) {
    const slot0 = page.getByTestId('syl-slot-0');
    await expect(slot0).toBeVisible();
    const slots = page.locator('.syllable-slot');
    const n = await slots.count();
    if (w === 0) {
      // second syllable dropped first is refused
      const second = await page.getByTestId('syl-slot-1').getAttribute('data-part');
      const first = await slot0.getAttribute('data-part');
      if (second !== first) {
        await dragTo(page, page.locator(`[data-testid="syllable-tile"][data-part="${second}"]`).first(), slot0);
        await expect(page.locator('.syllable-slot.filled')).toHaveCount(0);
        await page.waitForTimeout(500);
      }
    }
    for (let i = 0; i < n; i++) {
      const part = await page.getByTestId(`syl-slot-${i}`).getAttribute('data-part');
      await dragTo(page, page.locator(`[data-testid="syllable-tile"][data-part="${part}"]:not(.placed)`).first(), page.getByTestId(`syl-slot-${i}`));
      await expect(page.locator('.syllable-slot.filled')).toHaveCount(i + 1);
    }
    if (w < 2) await expect(page.locator('.syllable-slot.filled')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
