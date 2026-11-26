import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test('Kasih Makan Monyet: feeds exactly n, refuses extra, 3 feedings grow the garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'angka', 'monyet');
  const mouth = page.getByTestId('monyet-mouth');
  for (let q = 0; q < 3; q++) {
    const num = page.locator('.thought-num');
    await expect(num).toBeVisible();
    const n = Number(await num.textContent());
    const bananas = page.locator('[data-testid="banana"]:not(.placed)');
    await expect(bananas).toHaveCount(n + 2);
    for (let i = 0; i < n; i++) await dragTo(page, bananas.first(), mouth);
    await expect(page.locator('[data-testid="banana"].placed')).toHaveCount(n);
    if (q === 0) {
      // Extra banana is refused and stays in the basket.
      await dragTo(page, bananas.first(), mouth);
      await expect(page.locator('[data-testid="banana"].placed')).toHaveCount(n);
    }
    if (q < 2) await expect(page.locator('[data-testid="banana"].placed')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
