import { test, expect } from '@playwright/test';

async function progress(page: import('@playwright/test').Page, value: number) {
  await page.evaluate(p => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * p); }, value);
  await expect.poll(async () => Number(await page.locator('.story-shell').getAttribute('data-progress'))).toBeCloseTo(value, 3);
}

test('mascot fades through the departing wave and its hands move without moving the face', async ({ page }) => {
  await page.goto('/');
  await progress(page, .23);
  const opacity = Number(await page.locator('[data-mascot-camera]').getAttribute('opacity'));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  await progress(page, .32);
  await expect(page.locator('[data-mascot-joint="left-wrist"]')).toHaveCount(2);
  const camera = await page.locator('[data-mascot-camera]').getAttribute('transform');
  const hands = () => page.locator('[data-mascot-joint]').evaluateAll(joints => joints.map(joint => joint.getAttribute('transform')));
  const before = await hands();
  await page.waitForTimeout(650);
  expect(await hands()).not.toEqual(before);
  expect(await page.locator('[data-mascot-camera]').getAttribute('transform')).toBe(camera);
  await progress(page, .60);
  const still = await hands();
  await page.waitForTimeout(350);
  expect(await hands()).toEqual(still);
});

for (const size of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`the wave leaves a curved edge at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/');
    await progress(page, .185);
    const edges = await page.evaluate(async () => {
      const svg = document.querySelector<SVGImageElement>('[data-wave-crest] image')!;
      const image = new Image(); image.src = svg.href.baseVal; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = innerWidth; canvas.height = innerHeight;
      const ctx = canvas.getContext('2d')!; const m = svg.getCTM()!;
      ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f);
      ctx.drawImage(image,0,0,svg.width.baseVal.value,svg.height.baseVal.value);
      return [.1,.3,.5,.7,.9].map(y => {
        const row = ctx.getImageData(0,Math.floor(canvas.height * y),canvas.width,1).data;
        for (let x = canvas.width - 1; x >= 0; x--) if (row[x * 4 + 3] > 240) return x;
        return -1;
      });
    });
    expect(Math.max(...edges) - Math.min(...edges)).toBeGreaterThan(size.width * .12);
  });
}

test('reduced motion omits hand animation and keeps the simplified opening usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-mascot-joint]')).toHaveCount(0);
  await expect(page.locator('.hero-logo')).toBeVisible();
  await page.locator('.hero').getByRole('link', { name: 'Events' }).click();
  await expect(page).toHaveURL(/\/events$/);
});

test('a failed rig sprite retains the complete static mascot', async ({ page }) => {
  await page.route('**/assets/placeholders/mascot-rig.svg', route => route.abort());
  await page.goto('/');
  await progress(page, .32);
  await expect(page.locator('[data-mascot-joint]')).toHaveCount(0);
  await expect(page.locator('[data-mascot-camera] image[href$="mascot-colour.svg"]')).toBeAttached();
  expect(Number(await page.locator('[data-mascot-camera]').getAttribute('opacity'))).toBe(1);
});
