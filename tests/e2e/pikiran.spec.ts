import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('map shows all 7 areas inside the screen', async ({ page }) => {
  const vp = page.viewportSize()!;
  for (const a of ['angka', 'warna', 'huruf', 'pikiran', 'rumah', 'musik', 'hewan']) {
    const b = (await page.getByTestId(`area-${a}`).boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.y).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(vp.width);
    expect(b.y + b.height).toBeLessThanOrEqual(vp.height);
    expect(b.width).toBeGreaterThanOrEqual(64);
  }
});

test('Cari Pasangan: a miss flips back, matching all pairs grows the garden', async ({ page }) => {
  await openGame(page, 'pikiran', 'memori');
  const cards = page.getByTestId('memory-card');
  await expect(cards.first()).toBeVisible();
  const arts = await cards.evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.art!));
  // a miss
  const j = arts.findIndex((a) => a !== arts[0]);
  await cards.nth(0).dispatchEvent('pointerdown');
  await cards.nth(j).dispatchEvent('pointerdown');
  await expect(page.locator('.memory-card.open')).toHaveCount(0, { timeout: 5000 });
  const done = new Set<number>();
  for (let i = 0; i < arts.length; i++) {
    if (done.has(i)) continue;
    const k = arts.findIndex((a, x) => x !== i && a === arts[i]);
    await cards.nth(i).dispatchEvent('pointerdown');
    await page.waitForTimeout(280);
    await cards.nth(k).dispatchEvent('pointerdown');
    await page.waitForTimeout(280);
    done.add(i); done.add(k);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Urutkan Kecil-Besar: each size goes to its own step', async ({ page }) => {
  await openGame(page, 'pikiran', 'urutkan');
  for (let step = 0; step < 3; step++) {
    const items = page.locator('[data-testid="order-item"]:not(.placed)');
    await expect(items.first()).toBeVisible();
    const n = await items.count();
    for (let i = 0; i < n; i++) {
      const it = items.first();
      const r = await it.getAttribute('data-rank');
      await dragTo(page, it, page.getByTestId(`rank-${r}`));
      await expect(items).toHaveCount(n - i - 1);
    }
    if (step < 2) await expect(page.locator('.order-slot.filled')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Apa yang Hilang?: pick the hidden thing 4 times', async ({ page }) => {
  await openGame(page, 'pikiran', 'hilang');
  for (let i = 0; i < 4; i++) {
    const right = page.locator('.choice[data-correct]');
    await expect(right).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.missing-item.gone')).toHaveCount(1);
    await right.dispatchEvent('pointerdown');
    await expect(page.locator('.missing-item.gone')).toHaveCount(0);
    if (i < 3) await expect(page.locator('.choice')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
