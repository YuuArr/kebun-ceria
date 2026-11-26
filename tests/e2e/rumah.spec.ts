import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('Urutkan Kebiasaan: steps only fit their own number', async ({ page }) => {
  await openGame(page, 'rumah', 'kebiasaan');
  for (let r = 0; r < 2; r++) {
    const cards = page.locator('[data-testid="routine-card"]:not(.placed)');
    await expect(cards.first()).toBeVisible();
    const n = await cards.count();
    if (r === 0) {
      const c = page.locator('[data-testid="routine-card"][data-order="1"]');
      await dragTo(page, c, page.getByTestId('step-slot-0'));
      await expect(page.locator('.routine-slot.filled')).toHaveCount(0);
      await page.waitForTimeout(500);
    }
    for (let i = 0; i < n; i++) {
      await dragTo(page, page.locator(`[data-testid="routine-card"][data-order="${i}"]`), page.getByTestId(`step-slot-${i}`));
      await expect(page.locator('.routine-slot.filled')).toHaveCount(i + 1);
    }
    if (r === 0) await expect(page.locator('.routine-slot.filled')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Makanan Sehat: sweets bounce back, healthy food fills 3 plates', async ({ page }) => {
  await openGame(page, 'rumah', 'sehat');
  for (let p = 0; p < 3; p++) {
    const healthy = page.locator('[data-testid="food"][data-healthy="true"]:not(.placed)');
    await expect(healthy.first()).toBeVisible();
    const need = await healthy.count();
    if (p === 0) {
      await dragTo(page, page.locator('[data-testid="food"][data-healthy="false"]').first(), page.getByTestId('plate'));
      await expect(page.locator('.plate-item')).toHaveCount(0);
      await page.waitForTimeout(500);
    }
    for (let i = 0; i < need; i++) {
      await dragTo(page, healthy.first(), page.getByTestId('plate'));
      await expect(page.locator('.plate-item')).toHaveCount(i + 1);
    }
    if (p < 2) await expect(page.locator('.plate-item')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
