import { expect, type Page } from '@playwright/test';

export const CODE = 'ceria-2026';

/** Fresh start → access code → map. */
export async function enterGarden(page: Page) {
  await page.goto('./');
  await page.getByTestId('play-button').click();
  const input = page.getByTestId('code-input');
  if (await input.isVisible().catch(() => false)) {
    await input.fill(CODE);
    await page.getByTestId('code-submit').click();
  }
  await expect(page.getByTestId('garden')).toBeVisible();
}

export async function openGame(page: Page, area: string, game: string) {
  await page.getByTestId(`area-${area}`).click();
  await page.getByTestId(`game-${game}`).click();
  await expect(page.getByTestId('game-stage')).toBeVisible();
}
