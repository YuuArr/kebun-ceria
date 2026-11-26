import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame, setAge } from './helpers';

test('Gelembung Huruf: wrong bubble stays, target pops once, 5 steps grow the garden (age 2-3)', async ({ page }) => {
  await setAge(page, '2-3');
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

test('Gelembung Huruf top level (4-5): syllable steps appear and the round completes', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('kc:progress', JSON.stringify({ huruf: 9 }));
    localStorage.setItem('kc:settings', JSON.stringify({ age: '4-5' }));
  });
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'huruf');
  let syllables = 0;
  for (let step = 0; step < 5; step++) {
    await expect(page.getByTestId('bubble')).toHaveCount(4);
    if (await page.locator('.bubble.syllable').count()) syllables++;
    const target = page.locator('[data-testid="bubble"][data-target]');
    await target.dispatchEvent('pointerdown');
    await expect(page.locator('.popped')).toHaveCount(1);
    await expect(page.locator('.popped')).toHaveCount(0, { timeout: 10_000 });
  }
  expect(syllables).toBe(3);
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('fresh install defaults to age 4-5 (4 bubbles, shown as selected for parents)', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'huruf');
  await expect(page.getByTestId('bubble')).toHaveCount(4);
  await page.getByTestId('home-button').click();
  await expect(page.locator('.area-screen')).toBeVisible();
  await page.getByTestId('home-button').click();
  await expect(page.getByTestId('garden')).toBeVisible();
  await page.waitForTimeout(300);
  const btn = page.getByTestId('parent-button');
  const box = (await btn.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
  await expect(page.getByTestId('age-4-5')).toHaveAttribute('aria-pressed', 'true');
});
