import { test, expect } from '@playwright/test';

test('opening, aligned sketch, eye portal, reverse, and anchor handoff', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Pravaha 2k26/ })).toBeAttached();
  await expect(page.locator('.hero-logo')).toBeVisible();
  const progress = async (p: number) => {
    await page.evaluate(value => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, shell.getBoundingClientRect().top + scrollY + (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * value); }, p);
    await page.waitForTimeout(150);
  };
  await progress(.38);
  await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'mascot');
  await page.screenshot({ path: 'docs/screenshots/desktop-mascot.png' });
  await progress(.66);
  await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'sketch');
  const sketchOpacity = await page.locator('image[href$="mascot-sketch.svg"]').getAttribute('opacity');
  expect(Number(sketchOpacity)).toBeGreaterThan(.9);
  await page.screenshot({ path: 'docs/screenshots/desktop-sketch.png' });
  await progress(.80);
  await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'portal');
  const transforms = await page.evaluate(() => ({ art: document.querySelector('image[href$="mascot-colour.svg"]')?.parentElement?.getAttribute('transform'), eye: document.querySelector('#eye-portal>path')?.getAttribute('transform') }));
  expect(transforms.art).toBe(transforms.eye);
  await page.screenshot({ path: 'docs/screenshots/desktop-portal.png' });
  await progress(.38);
  await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', 'mascot');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('#programs')).toBeFocused();
  await expect(page.locator('#programs')).not.toHaveClass(/waiting-for-portal/);
  expect(await page.locator('#programs').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
  expect(errors).toEqual([]);
});

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`responsive journey at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.goto('/');
    await expect(page.locator('.hero-logo')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390 || width === 1440) await page.screenshot({ path: `docs/screenshots/${width === 390 ? 'mobile' : 'desktop'}-opening.png` });
    await page.getByRole('button', { name: 'Skip intro' }).click();
    await expect(page.locator('#programs')).toBeFocused();
    await expect(page.locator('.event-card')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.events-grid').scrollIntoViewIfNeeded();
    if (width === 390 || width === 1440) await page.screenshot({ path: `docs/screenshots/${width === 390 ? 'mobile' : 'desktop'}-programs.png` });
    await page.locator('#artists').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('heading', { name: 'Line-up to be announced' })).toBeVisible();
    await expect(page.locator('#sponsors')).toHaveCount(0);
    await page.locator('footer').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('direct routes, registration states, browser Back, anchors, and 404', async ({ page }) => {
  await page.goto('/events/dance');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dance');
  await expect(page.locator('.registration-state').first()).toHaveText('Registration opening soon');
  await expect(page.locator('.registration-link')).toHaveCount(0);
  await page.getByRole('link', { name: '← All events' }).click();
  await expect(page).toHaveURL(/\/events$/);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dance');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dance');
  await page.goto('/schedule');
  await expect(page.getByRole('heading', { name: 'Schedule to be announced.' })).toBeVisible();
  await page.goto('/#programs');
  await expect(page.locator('#programs')).toBeFocused();
  await expect(page.locator('#programs')).not.toHaveClass(/waiting-for-portal/);
  await page.goto('/#artists');
  await expect(page.locator('#artists')).toBeVisible();
  await page.goto('/does-not-exist');
  await expect(page.getByRole('heading', { name: /Lost in/ })).toBeVisible();
});

test('reduced motion removes the long stage and persists a manual preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.story-shell')).not.toHaveClass(/has-motion/);
  const height = await page.locator('.story-shell').evaluate(el => el.clientHeight);
  expect(height).toBeLessThanOrEqual(900);
  await expect(page.locator('#programs')).not.toHaveClass(/waiting-for-portal/);
  const toggle = page.getByRole('button', { name: /Reduce motion/ });
  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await page.reload();
  await expect(page.locator('.story-shell')).toHaveClass(/has-motion/);
  await toggle.scrollIntoViewIfNeeded();
  await toggle.click();
  await page.reload();
  await expect(page.locator('.story-shell')).not.toHaveClass(/has-motion/);
  await expect(page.locator('.hero-logo')).toBeVisible();
});

test('mobile navigation opens, closes with Escape, and routes without leftover stages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.click();
  await page.locator('#primary-nav').getByRole('link', { name: /Events/ }).click();
  await expect(page).toHaveURL(/\/events$/);
  await expect(page.locator('.story-shell')).toHaveCount(0);
  await page.getByRole('link', { name: 'Pravaha home' }).click();
  await expect(page.locator('.story-shell')).toHaveCount(1);
  await expect(page.locator('.hero-logo')).toBeVisible();
});

test('image failures retain deliberate branded fallbacks', async ({ page }) => {
  await page.route('**/assets/identity/pravaha-logo.jpeg', route => route.abort());
  await page.route('**/assets/placeholders/program-dance.svg', route => route.abort());
  await page.goto('/events');
  await expect(page.locator('.event-art-link .art-fallback').first()).toBeVisible();
  await page.goto('/');
  await expect(page.locator('.hero-logo')).toHaveAttribute('src', '/assets/placeholders/logo.svg');
});

test('portrait to landscape refresh preserves eye alignment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 844 * 4.2 * .78));
  await page.waitForTimeout(200);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(400);
  const transforms = await page.evaluate(() => ({ art: document.querySelector('image[href$="mascot-colour.svg"]')?.parentElement?.getAttribute('transform'), eye: document.querySelector('#eye-portal>path')?.getAttribute('transform') }));
  expect(transforms.art).toBe(transforms.eye);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a broken primary logo and broken fallback stop retrying and keep an identity', async ({ page }) => {
  let attempts = 0;
  await page.route('**/assets/identity/pravaha-logo.jpeg', route => { attempts++; return route.abort(); });
  await page.route('**/assets/placeholders/logo.svg', route => { attempts++; return route.abort(); });
  await page.goto('/');
  await expect(page.locator('.hero-identity .art-fallback')).toBeVisible();
  expect(attempts).toBeLessThanOrEqual(3); // Includes the logo preload.
});

test('mobile story, refresh at the portal, and handoff stay continuous', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const [progress, scene] of [[.38, 'mascot'], [.66, 'sketch'], [.8, 'portal'], [.95, 'handoff']] as const) {
    await page.evaluate(value => { const shell = document.querySelector('.story-shell')!; window.scrollTo(0, (shell.clientHeight - document.querySelector('.story-stage')!.clientHeight) * value); }, progress);
    await expect(page.locator('.story-shell')).toHaveAttribute('data-scene', scene);
    if (progress === .8) await page.screenshot({ path: 'docs/screenshots/mobile-portal.png' });
  }
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page.locator('#programs')).toBeFocused();
  await expect(page.locator('.programs-intro').last()).toBeVisible();
});
