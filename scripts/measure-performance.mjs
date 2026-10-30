import { createServer } from 'node:http';
import { readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { chromium } from '@playwright/test';

const root = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff' };
const server = createServer(async (request, response) => {
  try {
    let file = resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    try { if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html'); } catch { file = resolve(root, 'index.html'); }
    let body = await readFile(file);
    const mime = types[extname(file)] ?? 'application/octet-stream';
    const compress = /text|svg/.test(mime);
    if (compress) body = gzipSync(body);
    response.writeHead(200, { 'Content-Type': mime, 'Content-Length': body.length, ...(compress ? { 'Content-Encoding': 'gzip' } : {}), 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(500); response.end(); }
});
await new Promise(resolve => server.listen(4180, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.argv[2] });
  const results = [];
  for (const profile of [
    { name: 'desktop-local', viewport: { width: 1440, height: 900 }, cpu: 1 },
    { name: 'mobile-simulated-4g', viewport: { width: 390, height: 844 }, cpu: 4, network: { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 } },
  ]) {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: 1, isMobile: profile.cpu > 1, hasTouch: profile.cpu > 1 });
    const page = await context.newPage();
    const errors = [], failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failedRequests.push(request.url()));
    await page.addInitScript(() => {
      window.__pravahaMetrics = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.__pravahaMetrics.lcp = entry.startTime; window.__pravahaMetrics.lcpElement = entry.element?.className; window.__pravahaMetrics.lcpUrl = entry.url; } }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__pravahaMetrics.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const session = await context.newCDPSession(page);
    await session.send('Network.enable');
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
    await session.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
    if (profile.network) await session.send('Network.emulateNetworkConditions', profile.network);
    await page.goto('http://127.0.0.1:4180');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => ({ ...window.__pravahaMetrics, firstViewTransferBytes: performance.getEntriesByType('resource').reduce((sum, resource) => sum + resource.transferSize, 0) + performance.getEntriesByType('navigation')[0].transferSize }));
    const scrollFrames = await page.evaluate(async () => {
      const total = document.querySelector('.story-shell').clientHeight - document.querySelector('.story-stage').clientHeight;
      const intervals = [];
      await new Promise(resolve => { let step = 0, previous; function frame(now) { if (previous) intervals.push(now - previous); previous = now; window.scrollTo(0, total * step / 150); if (++step <= 150) requestAnimationFrame(frame); else resolve(); } requestAnimationFrame(frame); });
      const sorted = [...intervals].sort((a,b) => a-b);
      return { frames: intervals.length, medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.floor(sorted.length * .95)], over50ms: intervals.filter(n => n > 50).length };
    });
    results.push({ profile, browser: browser.version(), ...metrics, scrollFrames, errors, failedRequests });
    await context.close();
  }
  await mkdir('docs', { recursive: true });
  await writeFile('docs/performance.json', JSON.stringify({ measuredAt: new Date().toISOString(), hosting: 'Local static build served with gzip; cold cache per profile', results }, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
