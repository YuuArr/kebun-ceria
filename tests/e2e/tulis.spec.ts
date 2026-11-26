import { expect, test, type Page } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

/** Client coordinates for every point of every stroke of the current letter, sampled densely. */
async function strokePaths(page: Page) {
  return page.getByTestId('trace-board').evaluate((svg) => {
    const strokes: [number, number][][] = JSON.parse((svg as SVGSVGElement).dataset.strokes!);
    const m = (svg as SVGSVGElement).getScreenCTM()!;
    return strokes.map((st) => {
      const dense: [number, number][] = [];
      for (let i = 1; i < st.length; i++) {
        const [x0, y0] = st[i - 1], [x1, y1] = st[i];
        const n = Math.max(2, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3));
        for (let k = 0; k <= n; k++) dense.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
      }
      return dense.map(([x, y]) => { const p = new DOMPoint(x, y).matrixTransform(m); return [p.x, p.y] as [number, number]; });
    });
  });
}

test('Menulis Huruf: scribbling does nothing; tracing 3 letters grows the garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'huruf', 'tulis');
  const board = page.getByTestId('trace-board');
  await expect(board).toHaveAttribute('data-strokes', /.+/);
  // scribble in a corner
  const b = (await board.boundingBox())!;
  await page.mouse.move(b.x + 5, b.y + b.height - 5);
  await page.mouse.down();
  await page.mouse.move(b.x + 15, b.y + b.height - 10, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('.trace-done path')).toHaveCount(0);

  for (let i = 0; i < 3; i++) {
    const letter = await board.getAttribute('data-letter');
    const paths = await strokePaths(page);
    for (const pts of paths) {
      await page.mouse.move(pts[0][0], pts[0][1]);
      await page.mouse.down();
      for (const [x, y] of pts) await page.mouse.move(x, y);
      await page.mouse.up();
    }
    await expect(page.locator('.trace-done path')).toHaveCount(paths.length);
    if (i < 2) await expect(board).not.toHaveAttribute('data-letter', letter!, { timeout: 10_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
