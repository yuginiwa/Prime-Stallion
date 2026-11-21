import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage explains the company and shows a real project', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Building Strength. Creating Legacy.' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Carmona home/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'View Our Work', exact: true })).toHaveAttribute('href', '/projects');
});

test('hero image spans edge to edge on desktop and mobile', async ({page}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({width, height: 820});
    await page.goto('/');
    const image = page.locator('.hero').getByRole('img');
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    // The clipped photo frame stays full bleed while the image scales inside it.
    const box = (await page.locator('.hero-photo').boundingBox())!;
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(box.x).toBeCloseTo(0, 0);
    expect(box.width).toBeCloseTo(viewportWidth, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewportWidth);
    await expect(page.locator('.hero').getByRole('link', {name: 'Discuss Your Project'})).toBeInViewport();
  }
});

test('homepage service cards display distinct images and keep service links', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/#services');
  const cards = page.getByRole('region', {name:'Build. Renovate. Develop.'}).getByRole('article');
  await expect(cards).toHaveCount(3);
  for (const [index, service] of ['build', 'renovate', 'develop'].entries()) {
    const card = cards.nth(index);
    const image = card.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(card.getByRole('link')).toHaveAttribute('href', `/services#${service}`);
  }
  await expect(cards.last()).toContainText('Concept illustration');
});

test('homepage motion respects reduced-motion preferences', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const photo = page.locator('.hero img');
  await expect(photo).toHaveCSS('animation-name', 'hero-settle');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(photo).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('heading', {name:'Building Strength. Creating Legacy.'})).toBeVisible();
});

test('renovation service opens a tailored Messenger inquiry', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/services');
  await page.getByRole('link', {name: 'Discuss a Renovation'}).click();
  await expect(page).toHaveURL(/\/contact\?service=renovate$/);
  await expect(page.getByLabel('Message template')).toHaveValue(/RENOVATE/);
  await page.getByRole('button', {name: 'Copy Message'}).click();
  await expect(page.getByRole('status')).toHaveText('Message copied.');
  await expect(page.getByRole('link', {name: 'Open Messenger'})).toHaveAttribute('href', 'https://m.me/61565507044439');
});

test('services present the confirmed scope and route development inquiries', async ({page}) => {
  await page.goto('/services');
  for (const scope of ['Ground-up construction', 'Design and build with signed and sealed plans', 'Home renovations', 'Condo renovations', 'Gates and fences', 'Hardscaping', 'Housing development', 'Roads and gutters', 'Stormwater drainage']) {
    await expect(page.getByText(scope, {exact:true})).toBeVisible();
  }
  await page.getByRole('link', {name:'Discuss a Development Project'}).click();
  await expect(page).toHaveURL(/service=develop$/);
  await expect(page.getByLabel('Message template')).toHaveValue(/^DEVELOP —.*site development/);
});

test('service pages connect customers to matching portfolio examples', async ({page}) => {
  await page.goto('/services');
  await page.getByRole('link', {name: 'View Build Projects'}).click();
  await expect(page).toHaveURL(/projects#build$/);
  const build = page.getByRole('region', {name: 'Build projects'});
  await expect(build.getByRole('link', {name: /Avida Settings Nuvali/})).toBeVisible();
  await expect(build.getByRole('link')).toHaveCount(1);
  await expect(page.getByRole('region', {name: 'Renovation projects'}).getByRole('link')).toHaveCount(3);
  await page.goto('/services#develop');
  await expect(page.locator('#develop').getByRole('link')).toHaveCount(1);
});

test('only approved service keys affect the message template', async ({page}) => {
  await page.goto('/contact?service=unknown');
  await expect(page.getByLabel('Message template')).toHaveValue(/BUILD, RENOVATE, or DEVELOP/);
  await page.goto('/contact?service=build');
  await expect(page.getByLabel('Message template')).toHaveValue(/^BUILD —/);
});

test('portfolio links to four case studies and unknown slugs return 404', async ({page}) => {
  await page.goto('/projects');
  const cards = page.locator('main article').getByRole('link');
  await expect(cards).toHaveCount(4);
  const links = await cards.evaluateAll(a => a.map(e => e.getAttribute('href')!));
  for (const href of links) {
    expect((await page.goto(href))?.status()).toBe(200);
    await expect(page.getByRole('heading', {name:'Project scope'})).toBeVisible();
  }
  expect((await page.goto('/projects/unknown'))?.status()).toBe(404);
});

test('Avida is presented as a BUILD project with a build inquiry', async ({page}) => {
  await page.goto('/projects');
  await page.getByRole('link', {name: /Avida Settings Nuvali/}).click();
  await expect(page).toHaveURL(/avida-settings-nuvali$/);
  await expect(page.getByRole('heading', {name: 'Avida Settings Nuvali'})).toBeVisible();
  await expect(page.getByText('Early groundworks', {exact: true})).toBeVisible();
  const image = page.getByRole('img', {name: /Avida.*façade/i});
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('link', {name: 'Discuss a Similar Project'}).click();
  await expect(page.getByLabel('Message template')).toHaveValue(/^BUILD —/);
});

test('keyboard can open the mobile menu at 320px without horizontal overflow', async ({page}) => {
  await page.setViewportSize({width:320,height:760});
  await page.goto('/');
  const menu = page.getByText('Menu',{exact:true});
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('navigation', {name:'Mobile navigation'}).getByRole('link', {name:'About'}).click();
  await expect(page).toHaveURL(/\/about$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('public pages pass automated WCAG A/AA scans', async ({page}) => {
  for (const route of ['/', '/about', '/services', '/projects', '/projects/carmona-renovation', '/projects/avida-settings-nuvali', '/contact']) {
    await page.goto(route);
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations.map(v => ({id:v.id, targets:v.nodes.map(n=>n.target)})), route).toEqual([]);
  }
});
