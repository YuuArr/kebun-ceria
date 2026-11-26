import { expect, test } from '@playwright/test';
import { enterGarden } from './helpers';

test('start → access code → map, and remembered after reload', async ({ page }) => {
  await page.goto('./');
  await page.getByTestId('play-button').click();
  await page.getByTestId('code-input').fill('salah');
  await page.getByTestId('code-submit').click();
  await expect(page.getByText('Kode belum cocok, coba lagi ya.')).toBeVisible();
  await page.getByTestId('code-input').fill('ceria-2026');
  await page.getByTestId('code-submit').click();
  for (const a of ['huruf', 'angka', 'warna']) await expect(page.getByTestId(`area-${a}`)).toBeVisible();

  await page.reload();
  await page.getByTestId('play-button').click();
  await expect(page.getByTestId('garden')).toBeVisible();
});

test('parent corner opens only after a 3 s hold', async ({ page }) => {
  await enterGarden(page);
  const btn = page.getByTestId('parent-button');
  await btn.click();
  await page.waitForTimeout(500);
  await expect(page.getByText('Pojok Orang Tua')).toHaveCount(0);

  const box = (await btn.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
  await expect(page.getByRole('heading', { name: 'Pojok Orang Tua' })).toBeVisible();
  await page.getByTestId('age-4-5').click();
  await expect(page.getByTestId('age-4-5')).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('parent-back').click();
  await expect(page.getByTestId('garden')).toBeVisible();
});

test('works when localStorage throws (private mode)', async ({ page }) => {
  await page.addInitScript(() => {
    const deny = () => { throw new Error('denied'); };
    Storage.prototype.getItem = deny;
    Storage.prototype.setItem = deny;
  });
  await enterGarden(page);
  await expect(page.getByTestId('area-angka')).toBeVisible();
});

test('area buttons stay inside the viewport after rotation', async ({ page }) => {
  await enterGarden(page);
  for (const size of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    for (const a of ['huruf', 'angka', 'warna']) {
      const b = (await page.getByTestId(`area-${a}`).boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.y).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(size.width);
      expect(b.y + b.height).toBeLessThanOrEqual(size.height);
      expect(b.width).toBeGreaterThanOrEqual(64);
    }
  }
});
