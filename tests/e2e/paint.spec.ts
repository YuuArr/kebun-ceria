import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

test('Kuas Ajaib: buckets and regions; colouring everything grows the garden', async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
  await openGame(page, 'warna', 'kuas');
  const colors = ['merah', 'kuning', 'biru', 'hijau'];
  for (const c of colors) {
    const b = page.getByTestId(`bucket-${c}`);
    const box = (await b.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(64);
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height);
  }
  const regions = page.getByTestId('paint-region');
  const n = await regions.count();
  for (let i = 0; i < n; i++) {
    await page.getByTestId(`bucket-${colors[i % 4]}`).click();
    await regions.nth(i).dispatchEvent('pointerdown');
    await expect(regions.nth(i)).toHaveAttribute('data-color', colors[i % 4]);
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});
