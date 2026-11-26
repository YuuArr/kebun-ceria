import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('Kartu Kata: next unlocks after a tap; 5 cards grow the garden', async ({ page }) => {
  await openGame(page, 'huruf', 'kartu');
  for (let i = 0; i < 5; i++) {
    await expect(page.getByTestId('card-next')).not.toHaveClass(/ready/);
    if (i % 2) await page.getByTestId('card-letter').dispatchEvent('pointerdown');
    else await page.getByTestId('card-picture').dispatchEvent('pointerdown');
    await expect(page.getByTestId('card-next')).toHaveClass(/ready/);
    await page.getByTestId('card-next').click();
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Sortir Warna: wrong basket returns, sorting all grows the garden', async ({ page }) => {
  await openGame(page, 'warna', 'sortir');
  const items = page.locator('[data-testid="sort-item"]:not(.placed)');
  const total = await items.count();
  const c0 = await items.first().getAttribute('data-color');
  await dragTo(page, items.first(), page.locator(`.sort-basket:not([data-color="${c0}"])`).first());
  await expect(items).toHaveCount(total);
  await page.waitForTimeout(500);
  for (let i = 0; i < total; i++) {
    const c = await items.first().getAttribute('data-color');
    await dragTo(page, items.first(), page.getByTestId(`basket-${c}`));
    await expect(items).toHaveCount(total - i - 1);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Banyak-Sedikit: wrong side bounces, 5 answers grow the garden', async ({ page }) => {
  await openGame(page, 'angka', 'banding');
  for (let i = 0; i < 5; i++) {
    const right = page.locator('.compare-side[data-correct]');
    await expect(right).toBeVisible();
    if (i === 0) {
      await page.locator('.compare-side:not([data-correct])').dispatchEvent('pointerdown');
      await expect(page.locator('.compare-side.chosen')).toHaveCount(0);
    }
    await right.dispatchEvent('pointerdown');
    await expect(page.locator('.compare-side.chosen')).toHaveCount(1);
    if (i < 4) await expect(page.locator('.compare-side.chosen')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
