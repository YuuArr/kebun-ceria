import { expect, test } from '@playwright/test';
import { dragTo, enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('Menulis Angka: tracing 3 digits grows the garden', async ({ page }) => {
  await openGame(page, 'angka', 'tulisangka');
  const board = page.getByTestId('trace-board');
  for (let i = 0; i < 3; i++) {
    await expect(board).toHaveAttribute('data-strokes', /.+/);
    const item = await board.getAttribute('data-letter');
    const paths = await board.evaluate((svg) => {
      const strokes: [number, number][][] = JSON.parse((svg as SVGSVGElement).dataset.strokes!);
      const m = (svg as SVGSVGElement).getScreenCTM()!;
      return strokes.map((st) => {
        const out: [number, number][] = [];
        for (let k = 1; k < st.length; k++) {
          const [x0, y0] = st[k - 1], [x1, y1] = st[k];
          const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3));
          for (let j = 0; j <= n; j++) { const p = new DOMPoint(x0 + ((x1 - x0) * j) / n, y0 + ((y1 - y0) * j) / n).matrixTransform(m); out.push([p.x, p.y]); }
        }
        return out;
      });
    });
    for (const pts of paths) {
      await page.mouse.move(pts[0][0], pts[0][1]);
      await page.mouse.down();
      for (const [x, y] of pts) await page.mouse.move(x, y);
      await page.mouse.up();
    }
    if (i < 2) await expect(board).not.toHaveAttribute('data-letter', item!, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Pola Berulang: wrong choice bounces, 5 answers grow the garden', async ({ page }) => {
  await openGame(page, 'angka', 'pola');
  for (let i = 0; i < 5; i++) {
    const right = page.locator('.choice[data-correct]');
    await expect(right).toBeVisible();
    if (i === 0) {
      await page.locator('.choice:not([data-correct])').first().dispatchEvent('pointerdown');
      await expect(page.locator('.pattern-card.hole')).toHaveCount(1);
    }
    await right.dispatchEvent('pointerdown');
    await expect(page.locator('.pattern-card.hole')).toHaveCount(0);
    if (i < 4) await expect(page.locator('.pattern-card.hole')).toHaveCount(1, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Angka & Jumlah: numerals go to the matching group', async ({ page }) => {
  await openGame(page, 'angka', 'jumlah');
  for (let step = 0; step < 3; step++) {
    const tiles = page.locator('[data-testid="numeral"]:not(.placed)');
    await expect(tiles.first()).toBeVisible();
    const n = await tiles.count();
    for (let i = 0; i < n; i++) {
      const t = tiles.first();
      const v = await t.getAttribute('data-n');
      await dragTo(page, t, page.getByTestId(`group-${v}`));
      await expect(tiles).toHaveCount(n - i - 1);
    }
    if (step < 2) await expect(page.locator('.amount-group.matched')).toHaveCount(0, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
