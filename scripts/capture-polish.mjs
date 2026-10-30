import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer as createViteServer } from 'vite';
import assert from 'node:assert/strict';

const output = 'docs/recordings/polish';
const executablePath = process.argv[2];
const selected = process.argv[3]?.split(',');
await mkdir(output, { recursive: true });
const production = spawn(process.execPath, ['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4191','--strictPort'], { windowsHide: true, stdio: 'ignore' });
let preview, browser;
try {
  for (let i=0;i<100;i++) { try { if ((await fetch('http://127.0.0.1:4191')).ok) break; } catch {} await new Promise(resolve=>setTimeout(resolve,100)); }
  browser = await chromium.launch({ executablePath });
  const cases = [
    { name: 'desktop-complete', width: 1440, height: 900 },
    { name: 'phone-complete', width: 390, height: 844 },
    { name: 'phone-reduced', width: 390, height: 844, reduced: true },
    { name: 'desktop-reduced', width: 1440, height: 900, reduced: true },
    { name: 'desktop-scrubbing', width: 1440, height: 900, scrub: true },
    { name: 'phone-scrubbing', width: 390, height: 844, scrub: true },
    { name: 'guest-sponsors-preview', width: 1440, height: 900, development: true },
    { name: 'guest-sponsors-phone-preview', width: 390, height: 844, development: true },
  ].filter(item => !selected || selected.includes(item.name));
  for (const item of cases) {
    if (item.development) {
      // Exercise actual development-only flags. Source and production data remain untouched.
      preview ??= await createViteServer({ logLevel: 'error', server: { host: '127.0.0.1', port: 4192, strictPort: true }, plugins: [{ name:'sponsor-layout-review', enforce:'pre', transform(code,id) {
        if (!id.split('?')[0].replaceAll('\\','/').endsWith('/src/config/site.ts')) return;
        assert(code.includes('preview: { sponsors: false }'));
        return code.replace('preview: { sponsors: false }','preview: { sponsors: true }');
      } }] });
      if (!preview.httpServer?.listening) await preview.listen();
    }
    const folder = `${output}/${item.name}`;
    await mkdir(folder, { recursive: true });
    const context = await browser.newContext({ viewport: { width:item.width,height:item.height }, reducedMotion: item.reduced ? 'reduce' : 'no-preference', recordVideo: { dir: folder, size: item.width>900 ? { width:960,height:600 } : { width:390,height:844 } } });
    const startedAt = Date.now();
    const page = await context.newPage();
    const errors = [], states = [];
    page.on('pageerror', error=>errors.push(error.message));
    await page.goto(item.development ? 'http://127.0.0.1:4192' : 'http://127.0.0.1:4191');
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(400);
    const go = async (target, duration=650) => {
      await page.evaluate(async ({target,duration})=> {
        const from = scrollY, start = performance.now();
        await new Promise(resolve=>{ function step(now) { const t=Math.min(1,(now-start)/duration); scrollTo(0,from+(target-from)*t); if(t<1) requestAnimationFrame(step); else resolve(); } requestAnimationFrame(step); });
      }, {target,duration});
    };
    const progress = async (value,duration=650) => {
      const target = await page.evaluate(value=>{ const shell=document.querySelector('.story-shell'); return scrollY+shell.getBoundingClientRect().top+(shell.clientHeight-document.querySelector('.story-stage').clientHeight)*value; },value);
      await go(target,duration);
      await expect.poll(async()=>Number(await page.locator('.story-shell').getAttribute('data-progress'))).toBeCloseTo(value,3);
    };
    const shot = async (key,hold=220) => {
      await page.waitForTimeout(hold);
      const file=`${folder}/${key}.png`;
      await page.screenshot({path:file});
      states.push({ key,seconds:(Date.now()-startedAt)/1000,progress:await page.locator('.story-shell').getAttribute('data-progress'),file });
    };
    await shot('00-logo',450);
    if (!item.reduced) {
      const stops = item.scrub ? [
        ['wave-pause',.185,750],['sketch-pause',.5,750],['eye-pause',.70,1000],['passage-pause',.86,1000],
        ['eye-reverse',.72,800],['sketch-reverse',.50,650],['wave-reverse',.185,650],['logo-reverse',0,650],
        ['fast-forward',.9,140],['fast-reverse',.64,140],['fast-arrival',1,220],
      ] : [
        ['01-wave-entry',.065,400],['02-wave-cover',.115,350],['03-wave-uncover',.185,550],['04-wave-clear',.23,400],
        ['05-mascot',.31,650],['06-sketch',.50,700],['07-eye-start',.58,700],
        ['08-eye-quarter',.64,650],['09-eye-half',.70,800],['10-eye-rim',.76,800],['11-threshold',.82,800],
        ['12-passage',.86,700],['13-exit-light',.90,650],['14-backdrop',.94,650],['15-portrait-settled',.971,650],['16-arrival',1,650],
      ];
      for(const [key,value,duration] of stops) { await progress(value,duration); await shot(key,item.scrub || key==='05-mascot' ? 600 : 220); }
    }
    const expected = item.development ? ['guest','artist','artist'] : ['artist','artist'];
    assert.deepEqual(await page.locator('[data-lineup-role]').evaluateAll(sections=>sections.map(section=>section.dataset.lineupRole)),expected);
    const sections = page.locator('[data-lineup-role]');
    for(let i=0;i<await sections.count();i++) {
      const section=sections.nth(i);
      await go(await section.evaluate(el=>scrollY+el.getBoundingClientRect().top),800);
      await shot(`lineup-${i+1}`,850);
    }
    if(item.development) {
      assert((await page.locator('.guest-preview-label').first().textContent()).includes('UNCONFIRMED'));
      await go(await page.locator('#sponsors').evaluate(el=>scrollY+el.getBoundingClientRect().top),800);
      await shot('sponsors-labelled-preview',900);
      assert((await page.locator('#sponsors strong').textContent()).includes('SAMPLE'));
    } else assert.equal(await page.locator('#sponsors').count(),0);
    await go(await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight),700);
    await shot('footer',650);
    assert.deepEqual(errors,[]);
    const video=page.video();
    await context.close();
    await video.saveAs(`${output}/${item.name}.webm`); await video.delete();
    await writeFile(`${folder}/states.json`,JSON.stringify({case:item,errors,states},null,2));
    console.log(`Recorded ${item.name}: ${states.length} states, through Artist 2 and ${item.development?'labelled sponsor preview':'footer (no production sponsors configured)'}.`);
  }
} finally { await browser?.close(); await preview?.close(); production.kill(); }
