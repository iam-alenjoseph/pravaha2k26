import { test, expect, type Page } from '@playwright/test';
import { motion } from '../../src/config/motion';

async function progress(page: Page, value: number) {
  await page.evaluate(p => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * p); }, value);
  await expect.poll(async () => Number(await page.locator('.story-shell').getAttribute('data-progress'))).toBeCloseTo(value, 3);
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`overlapped reveal and distributed eye approach at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await progress(page, .185);
    expect(Number(await page.locator('[data-mascot-camera]').getAttribute('opacity'))).toBeGreaterThan(.85);
    const scales: number[] = [];
    for (const fraction of [0, .25, .5, .75, 1]) {
      await progress(page, motion.stops.sketch + (motion.stops.threshold - motion.stops.sketch) * fraction);
      const pose = await page.locator('[data-mascot-camera]').evaluate(group => {
        const matrix = (group as SVGGElement).getCTM()!;
        const eye = new DOMPoint(365,262).matrixTransform(matrix);
        return { scale: matrix.a, x: eye.x, y: eye.y };
      });
      expect(pose.x).toBeCloseTo(viewport.width / 2, 0);
      expect(pose.y).toBeCloseTo(viewport.height / 2, 0);
      scales.push(pose.scale);
    }
    expect((scales[4] - scales[3]) / (scales[4] - scales[0])).toBeLessThan(.2);
    await progress(page, .70);
    await expect(page.locator('.arrival-preview')).not.toBeVisible();
    const gold = await page.evaluate(async () => {
      const mask = document.querySelector<SVGImageElement>('[data-mascot-camera] > image[href$="mascot-mask.svg"]')!;
      const image = new Image(); image.src = mask.href.baseVal; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = innerWidth; canvas.height = innerHeight;
      const ctx = canvas.getContext('2d')!; const m = mask.getCTM()!;
      ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f); ctx.drawImage(image,0,0,800,1000);
      const pixels = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let count = 0;
      for (let i=0;i<pixels.length;i+=4) if (pixels[i]>140 && pixels[i+1]>85 && pixels[i+2]<205 && pixels[i]>pixels[i+1] && pixels[i+3]>180) count++;
      return count / (canvas.width * canvas.height);
    });
    expect(gold).toBeGreaterThan(.05);
    // The visible threshold must use the extra scroll, not just an offscreen camera matrix.
    await progress(page, .76);
    const opening = await page.locator('#eye-portal > path').evaluate(path => {
      const aperture = path as SVGPathElement;
      const inverse = aperture.getCTM()!.inverse();
      const corners = [[0,0],[innerWidth,0],[innerWidth,innerHeight],[0,innerHeight]];
      return corners.map(([x,y]) => aperture.isPointInFill(new DOMPoint(x,y).matrixTransform(inverse)));
    });
    expect(opening.some(covered => !covered)).toBe(true);
    await progress(page, motion.stops.threshold);
    const filled = await page.locator('#eye-portal > path').evaluate(path => {
      const aperture = path as SVGPathElement;
      const inverse = aperture.getCTM()!.inverse();
      return [[0,0],[innerWidth,0],[innerWidth,innerHeight],[0,innerHeight]].every(([x,y]) => aperture.isPointInFill(new DOMPoint(x,y).matrixTransform(inverse)));
    });
    expect(filled).toBe(true);
  });
}

test('foreground currents leave the central light clear and the portrait settles before text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await progress(page, .86);
  const coverage = await page.evaluate(async () => {
    const layer = document.querySelector<SVGImageElement>('[data-depth="near"] image')!;
    const image = new Image(); image.src = layer.href.baseVal; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = innerWidth; canvas.height = innerHeight;
    const ctx = canvas.getContext('2d')!; const m = layer.getCTM()!;
    ctx.setTransform(m.a,m.b,m.c,m.d,m.e,m.f); ctx.drawImage(image,0,0,innerWidth,innerHeight);
    let all=0, centre=0, centralSamples=0;
    for(let y=10;y<innerHeight;y+=20) for(let x=10;x<innerWidth;x+=20) {
      const covered = ctx.getImageData(x,y,1,1).data[3]>50;
      if(covered) all++;
      if(x>innerWidth*.3 && x<innerWidth*.7 && y>innerHeight*.3 && y<innerHeight*.7) { centralSamples++; if(covered) centre++; }
    }
    return { all:all/(Math.ceil(innerWidth/20)*Math.ceil(innerHeight/20)), centre:centre/centralSamples };
  });
  expect(coverage.all).toBeLessThan(.30);
  expect(coverage.centre).toBeLessThan(.10);
  await progress(page, .971);
  const portrait = page.locator('.arrival-preview [data-arrival-portrait]');
  expect(Number(await portrait.evaluate(el => getComputedStyle(el).opacity))).toBeGreaterThan(.98);
  expect(Number(await page.locator('.arrival-preview [data-arrival-copy]').evaluate(el => getComputedStyle(el).opacity))).toBeLessThan(.01);
  const transform = await portrait.evaluate(el => getComputedStyle(el).transform);
  await progress(page, .99);
  expect(await portrait.evaluate(el => getComputedStyle(el).transform)).toBe(transform);
});
