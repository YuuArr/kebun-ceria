import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('kc:garden')) localStorage.setItem('kc:garden', JSON.stringify({ growth: 10, seen: 10, season: 0, album: [] }));
  });
  await fastVoice(page);
  await enterGarden(page);
});

/** A ground thing that is on screen and not under the menu panel. */
async function visibleGroundThing(page: import('@playwright/test').Page, kind = '') {
  const panel = (await page.locator('.area-panel').boundingBox())!;
  const vp = page.viewportSize()!;
  for (const it of await page.locator(`.garden-item[data-zone="ground"]${kind ? `[data-kind="${kind}"]` : ''}`).all()) {
    const b = await it.boundingBox();
    if (!b) continue;
    const cx = b.x + b.width / 2, cy = b.y + b.height * 0.7;
    const underPanel = cx >= panel.x && cx <= panel.x + panel.width && cy >= panel.y && cy <= panel.y + panel.height;
    if (cx > 10 && cx < vp.width - 10 && cy > 80 && cy < vp.height - 10 && !underPanel) return it;
  }
  throw new Error('no visible thing');
}

test('tapping a garden thing makes it react', async ({ page }) => {
  const item = await visibleGroundThing(page);
  const b = (await item.boundingBox())!;
  await page.mouse.click(b.x + b.width / 2, b.y + b.height * 0.7);
  await expect(page.locator('.garden-item-inner.reacting')).toHaveCount(1);
});

test('dragging keeps ground things on the ground and remembers the spot', async ({ page }) => {
  const item = await visibleGroundThing(page, 'flower');
  const key = await item.getAttribute('data-key');
  const b = (await item.boundingBox())!;
  const sx = b.x + b.width / 2, sy = b.y + b.height * 0.7;
  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 40, sy - 300, { steps: 10 }); // try to drag it into the sky
  await page.mouse.up();
  const moved = page.locator(`.garden-item[data-key="${key}"]`);
  const y = Number(await moved.getAttribute('data-y'));
  expect(y).toBeGreaterThanOrEqual(290);
  const x = await moved.getAttribute('data-x');
  await page.reload();
  await page.getByTestId('play-button').click();
  await expect(page.locator(`.garden-item[data-key="${key}"]`)).toHaveAttribute('data-x', x!);
});
