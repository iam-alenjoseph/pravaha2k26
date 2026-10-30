import { test, expect } from '@playwright/test';

test('v1.2 homepage has two artist scenes and no competition content', async ({ page }) => {
  await page.goto('/#lineup');
  await expect(page.locator('main .event-card')).toHaveCount(0);
  await expect(page.locator('main .registration-state, main .registration-link')).toHaveCount(0);
  await expect(page.locator('[data-lineup-role="artist"]')).toHaveCount(2);
  await expect(page.locator('[data-lineup-role="guest"]')).toHaveCount(0);
  await expect(page.locator('#lineup')).toBeFocused();
});

for (const size of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
  test(`wave covers all corners and the configured eye stays centred at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/');
    await page.evaluate(() => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * .115); });
    await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'wave');
    const coverage = await page.evaluate(async () => {
      const svg = document.querySelector<SVGImageElement>('[data-wave-crest] image')!;
      const img = new Image(); img.src = svg.href.baseVal; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = innerWidth; canvas.height = document.querySelector('.story-stage')!.clientHeight;
      const ctx = canvas.getContext('2d')!; const matrix = svg.getCTM()!;
      ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      ctx.drawImage(img, 0, 0, svg.width.baseVal.value, svg.height.baseVal.value);
      return [.01, .5, .99].flatMap(x => [.01, .5, .99].map(y => ctx.getImageData(Math.floor(canvas.width * x), Math.floor(canvas.height * y), 1, 1).data[3]));
    });
    expect(coverage).toEqual(Array(9).fill(255));
    await page.evaluate(() => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * .70); });
    await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'eye');
    const point = await page.evaluate(() => {
      const camera = document.querySelector<SVGGElement>('[data-mascot-camera]')!;
      const eye = new DOMPoint(365, 262).matrixTransform(camera.getCTM()!);
      return { x: eye.x, y: eye.y, width: innerWidth, height: document.querySelector('.story-stage')!.clientHeight };
    });
    expect(point.x).toBeCloseTo(point.width / 2, 0);
    expect(point.y).toBeCloseTo(point.height / 2, 0);
    await expect(page.locator('.arrival-preview')).not.toBeVisible();
  });
}

test('depth groups move independently, hold on pause, and survive a fast reverse', async ({ page }) => {
  await page.goto('/');
  const scroll = async (progress: number) => {
    await page.evaluate(value => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * value); }, progress);
    await expect.poll(async () => Number(await page.locator('.story-shell').getAttribute('data-progress'))).toBeCloseTo(progress, 3);
  };
  const transforms = () => page.locator('[data-depth]').evaluateAll(groups => groups.map(group => group.getAttribute('transform')));
  await scroll(.85);
  await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'passage');
  const before = await transforms();
  expect(new Set(before).size).toBe(3);
  await page.waitForTimeout(350);
  expect(await transforms()).toEqual(before);
  await expect(page.locator('.arrival-preview')).not.toBeVisible();
  await scroll(.78);
  const bounds = await page.locator('[data-depth] image').evaluateAll(images => images.map(image => {
    const box = image.getBoundingClientRect();
    return box.left <= 0 && box.top <= 0 && box.right >= innerWidth && box.bottom >= innerHeight;
  }));
  expect(bounds).toEqual([true, true, true]);
  await scroll(.99);
  await scroll(.85);
  expect(await transforms()).toEqual(before);
  await scroll(1);
  await expect(page.locator('#lineup')).not.toHaveClass(/waiting-for-portal/);
  await page.locator('#artists').scrollIntoViewIfNeeded();
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Events' }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(page.locator('.event-card')).toHaveCount(3);
});
