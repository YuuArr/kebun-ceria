import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('every area shows 4 game tiles that fit the screen', async ({ page }) => {
  const vp = page.viewportSize()!;
  for (const area of ['angka', 'warna', 'huruf']) {
    await page.getByTestId(`area-${area}`).click();
    const tiles = page.locator('.game-tile');
    await expect(tiles).toHaveCount(4);
    for (const t of await tiles.all()) {
      const b = (await t.boundingBox())!;
      expect(b.width).toBeGreaterThanOrEqual(64);
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y + b.height).toBeLessThanOrEqual(vp.height);
      expect(b.x + b.width).toBeLessThanOrEqual(vp.width);
    }
    await page.getByTestId('home-button').click();
  }
});

test('Sungai Angka: right stone lets Cici cross; 3 crossings grow the garden', async ({ page }) => {
  await openGame(page, 'angka', 'sungai');
  for (let i = 0; i < 3; i++) {
    const gap = page.getByTestId('stone-gap');
    await expect(gap).toBeVisible();
    const missing = await gap.getAttribute('data-n');
    await dragTo(page, page.locator(`[data-testid="stone-choice"][data-n="${missing}"]`), gap);
    await expect(page.locator('.stone.filled')).toHaveCount(1);
    if (i < 2) await expect(page.locator('.stone.filled')).toHaveCount(0, { timeout: 15_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 20_000 });
});

test('Rakit: pieces only fit matching slots; finished build grows the garden', async ({ page }) => {
  await openGame(page, 'warna', 'rakit');
  const pieces = page.locator('[data-testid="build-piece"]:not(.placed)');
  const total = await pieces.count();
  for (let i = 0; i < total; i++) {
    const p = pieces.first();
    const shape = await p.getAttribute('data-shape');
    const slot = page.locator(`.build-slot:not(.filled)[data-shape="${shape}"]`).first();
    await dragTo(page, p, slot);
    await expect(pieces).toHaveCount(total - i - 1);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 20_000 });
});

test('Cerita: words light up, finishing the story grows the garden', async ({ page }) => {
  await openGame(page, 'huruf', 'cerita');
  const garden = page.getByTestId('garden');
  const next = page.getByTestId('story-next');
  for (let i = 0; i < 8; i++) {
    // Either the next page is ready, or the story ended and we are back on the map.
    await expect.poll(async () => (await garden.isVisible()) || /ready/.test((await next.getAttribute('class').catch(() => '')) ?? ''), { timeout: 15_000 }).toBe(true);
    if (await garden.isVisible()) break;
    await expect(page.locator('.story-text span').last()).toHaveClass(/lit/);
    await page.locator('.story-thing').first().dispatchEvent('pointerdown');
    await next.click();
  }
  await expect(garden).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
