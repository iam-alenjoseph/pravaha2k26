import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

// A temporary build fixture changes the public guest flag without mutating source or dist.
const directory = 'test-results/guest-build';
let replaced = false;
await build({ configFile: false, logLevel: 'error', plugins: [{ name: 'approved-guest-fixture', enforce: 'pre', transform(code, id) {
  if (!id.replaceAll('\\', '/').endsWith('/src/data/lineup.ts')) return;
  const changed = code.replace('enabled: false, previewInDevelopment: true', 'enabled: true, previewInDevelopment: true');
  assert.notEqual(changed, code, 'Guest build fixture must explicitly change exactly the intended flag.');
  replaced = true; return changed;
} }, react()], build: { outDir: directory, emptyOutDir: true } });
assert(replaced);
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--outDir', directory, '--host', '127.0.0.1', '--port', '4176'], { windowsHide: true, stdio: 'ignore' });
let browser;
try {
  for (let i = 0; i < 80; i++) { try { if ((await fetch('http://127.0.0.1:4176')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 100)); }
  browser = await chromium.launch({ executablePath: process.argv[2] });
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto('http://127.0.0.1:4176');
    await page.getByRole('button', { name: 'Skip intro' }).click();
    assert.equal(await page.locator('#lineup').getAttribute('data-first-entry'), 'special-guest');
    assert.equal(await page.locator('.story-shell').getAttribute('data-arrival-id'), 'special-guest');
    assert.deepEqual(await page.locator('[data-lineup-role]').evaluateAll(elements => elements.map(el => el.getAttribute('data-lineup-role'))), ['guest', 'artist', 'artist']);
    assert(await page.locator('#lineup').evaluate(el => el === document.activeElement));
    const previewOpacity = await page.locator('.arrival-preview [data-arrival-portrait]').evaluate(el => getComputedStyle(el).opacity);
    const actualOpacity = await page.locator('[data-lineup-role="guest"] [data-arrival-portrait]').evaluate(el => getComputedStyle(el).opacity);
    assert.equal(previewOpacity, actualOpacity, 'Arrival and actual guest portrait opacity must match.');
    assert.equal(await page.locator('.guest-preview-label').count(), 0);
    await page.screenshot({ path: `docs/recordings/after/guest-enabled-${viewport.width}.png` });
    await page.goto('http://127.0.0.1:4176/#artists');
    await page.waitForTimeout(100);
    assert(await page.locator('#artists').evaluate(el => Math.abs(el.getBoundingClientRect().top) < 3));
    await page.close();
  }
  console.log('Guest-enabled production fixture passed on desktop and phone; normal production remains guest-disabled.');
} finally { await browser?.close(); server.kill(); }
