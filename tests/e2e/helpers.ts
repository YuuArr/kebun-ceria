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

/** Replace speech with an instant fake so voice lines don't slow tests down. */
export async function fastVoice(page: Page) {
  await page.addInitScript(() => {
    const fake = {
      speak: (u: SpeechSynthesisUtterance) => setTimeout(() => u.onend?.(new Event('end') as SpeechSynthesisEvent), 5),
      cancel: () => {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  });
}

/** Drags the centre of `source` onto the centre of `target` with a real pointer. */
export async function dragTo(page: Page, source: import('@playwright/test').Locator, target: import('@playwright/test').Locator) {
  const a = (await source.boundingBox())!;
  const b = (await target.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
  await page.mouse.up();
}

/** Sets the age group before the app loads. */
export async function setAge(page: Page, age: '2-3' | '4-5') {
  await page.addInitScript((a) => localStorage.setItem('kc:settings', JSON.stringify({ age: a })), age);
}
