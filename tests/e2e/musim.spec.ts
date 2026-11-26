import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

test('a full garden is harvested into the album and the theme changes', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('kc:garden', JSON.stringify({ growth: 19, seen: 19, season: 0, album: [] }));
      sessionStorage.setItem('seeded', '1');
    }
  });
  await fastVoice(page);
  await enterGarden(page);
  await expect(page.getByTestId('garden')).toHaveAttribute('data-theme', 'bunga');
  // finish one round of Kartu Kata
  await openGame(page, 'huruf', 'kartu');
  for (let i = 0; i < 5; i++) {
    await page.getByTestId('card-picture').dispatchEvent('pointerdown');
    await expect(page.getByTestId('card-next')).toHaveClass(/ready/);
    await page.getByTestId('card-next').click();
  }
  await expect(page.getByTestId('harvest')).toBeVisible({ timeout: 20_000 });
  await page.getByTestId('harvest-next').click({ timeout: 15_000 });
  await expect(page.getByTestId('garden')).toHaveAttribute('data-theme', 'buah');
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '0');
  await page.getByTestId('album-button').click();
  await expect(page.getByTestId('album-page')).toHaveCount(1);
});
