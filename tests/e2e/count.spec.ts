import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame, setAge } from './helpers';

test('Sentuh & Hitung: each object counts once, round grows the garden (age 2-3)', async ({ page }) => {
  await setAge(page, '2-3');
  await fastVoice(page);
  await enterGarden(page);
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '0');
  await openGame(page, 'angka', 'hitung');

  for (let q = 0; q < 3; q++) {
    const items = page.getByTestId('count-item');
    await expect(items.first()).toBeVisible();
    const n = await items.count();
    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(3);
    for (let i = n - 1; i >= 0; i--) {
      await items.nth(i).dispatchEvent('pointerdown');
      await items.nth(i).dispatchEvent('pointerdown');
      await expect(items.nth(i).locator('.count-badge')).toHaveText(String(n - i));
    }
    await expect(page.getByTestId('count-big')).toHaveText(String(n));
    if (q < 2) await expect(page.getByTestId('count-big')).toHaveText('', { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
