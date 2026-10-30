import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const label = process.argv[2] ?? 'after';
const executablePath = process.argv[3];
const folder = `docs/recordings/${label}`;
await mkdir(folder, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4175'], { stdio: 'ignore', windowsHide: true });
let browser;
try {
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch('http://127.0.0.1:4175')).ok) break; } catch { /* Wait for preview. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ executablePath });
  for (const device of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, recordVideo: { dir: folder, size: { width: device.width > 900 ? 960 : 390, height: device.width > 900 ? 600 : 844 } } });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4175');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const checkpoints = label === 'before' ? [0, .12, .38, .66, .8, 1] : label === 'refinement' ? [0, .065, .115, .17, .185, .205, .23, .275, .32, .38, .57, .70, .86, 1] : [0, .12, .32, .57, .70, .78, .86, .985, 1];
    let previous = 0;
    for (let index = 0; index < checkpoints.length; index++) {
      const target = checkpoints[index];
      await page.evaluate(async ({ from, to }) => {
        const shell = document.querySelector('.story-shell');
        const total = shell.clientHeight - document.querySelector('.story-stage').clientHeight;
        const start = performance.now();
        await new Promise(resolve => { function step(now) { const amount = Math.min(1, (now - start) / 800); window.scrollTo(0, total * (from + (to - from) * amount)); if (amount < 1) requestAnimationFrame(step); else resolve(); } requestAnimationFrame(step); });
      }, { from: previous, to: target });
      await page.waitForTimeout(220);
      await page.screenshot({ path: `${folder}/${device.name}-${String(index).padStart(2, '0')}.png` });
      if (label === 'refinement' && target === .32) await page.waitForTimeout(1200);
      previous = target;
    }
    // Include a reverse passage and a direct entry to the actual destination.
    await page.evaluate(() => { const shell = document.querySelector('.story-shell'); window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage').clientHeight) * .85); });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Skip intro' }).click();
    await page.waitForTimeout(500);
    const video = page.video();
    await context.close();
    await video.saveAs(`${folder}/${device.name}.webm`);
    await video.delete();
    console.log(`Saved ${folder}/${device.name}.webm and ${checkpoints.length} checkpoints.`);
  }
} finally { await browser?.close(); server.kill(); }
