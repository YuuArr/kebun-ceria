import { expect, test } from '@playwright/test';
import { enterGarden, fastVoice, openGame } from './helpers';

test.beforeEach(async ({ page }) => {
  await fastVoice(page);
  await enterGarden(page);
});

test('Xilofon & Drum: done appears after playing; tapping it grows the garden', async ({ page }) => {
  await openGame(page, 'musik', 'xilofon');
  await expect(page.getByTestId('music-done')).not.toHaveClass(/ready/);
  for (let i = 0; i < 10; i++) await page.getByTestId(`bar-${i % 8}`).dispatchEvent('pointerdown');
  await page.getByTestId('drum-kick').dispatchEvent('pointerdown');
  await page.getByTestId('drum-tambourine').dispatchEvent('pointerdown');
  await expect(page.getByTestId('music-done')).toHaveClass(/ready/);
  await page.getByTestId('music-done').dispatchEvent('pointerdown');
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 15_000 });
});

test('Tiru Nada: a wrong bar replays the tune; echoing 3 tunes grows the garden', async ({ page }) => {
  await openGame(page, 'musik', 'ritme');
  const xylo = page.locator('.xylophone');
  for (let t = 0; t < 3; t++) {
    await expect(xylo).toHaveClass(/your-turn/, { timeout: 15_000 });
    const seq = (await xylo.getAttribute('data-sequence'))!.split(',').map(Number);
    if (t === 0) {
      const wrong = seq[0] === 0 ? 1 : 0;
      await page.getByTestId(`bar-${wrong}`).dispatchEvent('pointerdown');
      await expect(xylo).not.toHaveClass(/your-turn/);
      await expect(xylo).toHaveClass(/your-turn/, { timeout: 15_000 });
    }
    for (const n of seq) await page.getByTestId(`bar-${n}`).dispatchEvent('pointerdown');
    if (t < 2) await expect(xylo).not.toHaveAttribute('data-sequence', seq.join(','), { timeout: 15_000 });
  }
  await expect(page.getByTestId('garden')).toHaveAttribute('data-growth', '1', { timeout: 20_000 });
});
