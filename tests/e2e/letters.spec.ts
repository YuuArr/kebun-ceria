import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

test('Gelembung Huruf: wrong bubble stays, target pops once, 5 steps grow the garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'huruf');
  for (let step = 0; step < 5; step++) {
    const bubbles = page.getByTestId('bubble');
    await expect(bubbles).toHaveCount(3);
    const wrong = page.locator('[data-testid="bubble"]:not([data-target])').first();
    const wrongLetter = await wrong.getAttribute('data-letter');
    await wrong.dispatchEvent('pointerdown');
    await expect(page.locator(`[data-testid="bubble"][data-letter="${wrongLetter}"]`)).toBeVisible();
    await expect(page.locator('.popped')).toHaveCount(0);
    const target = page.locator('[data-testid="bubble"][data-target]');
    await target.dispatchEvent('pointerdown');
    await target.dispatchEvent('pointerdown');
    await expect(page.locator('.popped')).toHaveCount(1);
    await expect(page.locator('.popped')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Gelembung Huruf: bubbles fit on screen', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'huruf');
  await page.waitForTimeout(600); // pop-in animation (staggered delay)
  const vp = page.viewportSize()!;
  for (const b of await page.getByTestId('bubble').all()) {
    const box = (await b.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(64);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
  }
});
