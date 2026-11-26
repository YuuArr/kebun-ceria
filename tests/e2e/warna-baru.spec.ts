import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame, setAge } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
});

test('Cari Bayangan: 5 matches grow the garden', async ({ page }) => {
  await enterGarden(page);
  await openGame(page, 'warna', 'bayangan');
  for (let i = 0; i < 5; i++) {
    const right = page.locator('.choice[data-correct]');
    await expect(right).toBeVisible();
    if (i === 0) await page.locator('.choice:not([data-correct])').first().dispatchEvent('pointerdown');
    await right.dispatchEvent('pointerdown');
    await expect(page.locator('.choice.chosen')).toHaveCount(1);
    if (i < 4) await expect(page.locator('.choice.chosen')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Campur Warna (4-5): a wrong mix is named and retried; three targets grow the garden', async ({ page }) => {
  await enterGarden(page);
  await openGame(page, 'warna', 'campur');
  const recipe: Record<string, [string, string]> = { oranye: ['merah', 'kuning'], hijau: ['kuning', 'biru'], ungu: ['merah', 'biru'] };
  const goal = page.getByTestId('mix-goal');
  for (let i = 0; i < 3; i++) {
    const t = (await goal.getAttribute('data-target'))!;
    if (i === 0) {
      // same colour twice is not the target: stays on the same goal
      await page.getByTestId('pot-biru').dispatchEvent('pointerdown');
      await page.waitForTimeout(300);
      await page.getByTestId('pot-biru').dispatchEvent('pointerdown');
      await expect(page.locator('.paint-pot.poured')).toHaveCount(0, { timeout: 10_000 });
      await expect(goal).toHaveAttribute('data-target', t);
    }
    const [a, b] = recipe[t];
    await page.getByTestId(`pot-${a}`).dispatchEvent('pointerdown');
    await page.waitForTimeout(300);
    await page.getByTestId(`pot-${b}`).dispatchEvent('pointerdown');
    if (i < 2) await expect(goal).not.toHaveAttribute('data-target', t, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Campur Warna (2-3): three free mixes grow the garden', async ({ page }) => {
  await setAge(page, '2-3');
  await enterGarden(page);
  await openGame(page, 'warna', 'campur');
  for (let i = 0; i < 3; i++) {
    await page.getByTestId('pot-merah').dispatchEvent('pointerdown');
    await page.waitForTimeout(300);
    await page.getByTestId('pot-kuning').dispatchEvent('pointerdown');
    if (i < 2) await expect(page.locator('.paint-pot.poured')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Puzzle Gambar: pieces only fit their own place', async ({ page }) => {
  await enterGarden(page);
  await openGame(page, 'warna', 'puzzle');
  const pieces = page.locator('[data-testid="puzzle-piece"]:not(.placed)');
  const total = await pieces.count();
  for (let i = 0; i < total; i++) {
    const p = pieces.first();
    const cell = await p.getAttribute('data-cell');
    await dragTo(page, p, page.getByTestId(`slot-${cell}`));
    await expect(pieces).toHaveCount(total - i - 1);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Gambar Bebas: draw, stamp a sticker, tap done', async ({ page }) => {
  await enterGarden(page);
  await openGame(page, 'warna', 'gambar');
  const c = (await page.getByTestId('draw-canvas').boundingBox())!;
  await page.mouse.move(c.x + 40, c.y + 40);
  await page.mouse.down();
  for (let i = 0; i < 20; i++) await page.mouse.move(c.x + 40 + i * 8, c.y + 40 + (i % 5) * 10);
  await page.mouse.up();
  await page.getByTestId('sticker-bintang').click();
  await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2);
  await expect(page.locator('.sticker')).toHaveCount(1);
  await expect(page.getByTestId('draw-done')).toHaveClass(/ready/);
  await page.getByTestId('draw-done').dispatchEvent('pointerdown');
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
