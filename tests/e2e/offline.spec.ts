import { expect, test } from '@playwright/test';
import { fastVoice } from './helpers';

test('works offline after the first visit', async ({ page, context }) => {
  await fastVoice(page);
  await page.goto('./');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // Wait until the service worker controls the page (precache done).
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 15_000 }).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await page.getByTestId('play-button').click();
  await page.getByTestId('code-input').fill('ceria-2026');
  await page.getByTestId('code-submit').click();
  await expect(page.getByTestId('garden')).toBeVisible();
  await page.getByTestId('area-warna').click();
  await expect(page.getByTestId('game-kuas')).toBeVisible();
});
