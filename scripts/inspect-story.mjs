import { chromium } from '@playwright/test';
const browser = await chromium.launch({ executablePath: process.argv[2] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', error => console.log('PAGE ERROR', error.message));
await page.goto('http://127.0.0.1:5173');
await page.waitForTimeout(1000);
for (const progress of [0, .38, .66, .8, .9, 1, .38]) {
  await page.evaluate(p => { const shell = document.querySelector('.story-shell'); window.scrollTo(0, shell.getBoundingClientRect().top + scrollY + (shell.clientHeight - document.querySelector('.story-stage').clientHeight) * p); }, progress);
  await page.waitForTimeout(300);
  console.log(JSON.stringify(await page.evaluate(p => ({ desired: p, y: scrollY, height: document.documentElement.scrollHeight, shellHeight: document.querySelector('.story-shell').clientHeight, shellTop: document.querySelector('.story-shell').getBoundingClientRect().top, stageHeight: document.querySelector('.story-stage').clientHeight, progress: document.querySelector('.story-shell').dataset.progress, scene: document.querySelector('.story-shell').dataset.scene, focused: document.activeElement?.tagName }), progress)));
}
await browser.close();
