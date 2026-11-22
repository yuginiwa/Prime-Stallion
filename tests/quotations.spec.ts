import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('calculates fractional lines, checks exclusions and previews a saved branded draft', async ({page}) => {
  await page.goto('/quotations');
  await expect(page.getByRole('heading',{name:'Quotation builder'})).toBeVisible();
  await page.getByLabel('Client',{exact:true}).fill('Test Client');
  await page.getByLabel('Project',{exact:true}).fill('Sample Renovation');
  await page.getByLabel('Site location').fill('Cavite');
  await page.getByLabel('Description 01.01').fill('Tile installation');
  await page.getByLabel('Quantity 01.01').fill('13.5');
  await page.getByLabel('Unit rate 01.01').fill('2300');
  await page.getByRole('button',{name:'Add line'}).click();
  await page.getByLabel('Description 01.02').fill('Demolition');
  await page.getByLabel('Quantity 01.02').fill('1');
  await page.getByLabel('Unit rate 01.02').fill('5000');
  await page.getByLabel('Tax treatment').selectOption('vat12');
  await expect(page.getByTestId('grand-total')).toHaveText('₱40,376.00');
  await page.getByLabel('Include 01.02').uncheck();
  await expect(page.getByRole('button',{name:'Preview draft'})).toBeDisabled();
  await page.getByLabel('Exclusion reason 01.02').fill('By owner');
  await expect(page.getByTestId('grand-total')).toHaveText('₱34,776.00');
  await page.getByRole('button',{name:'Save on this device'}).click();
  await page.reload();
  await expect(page.getByLabel('Client',{exact:true})).toHaveValue('Test Client');
  await page.getByRole('button',{name:'Preview draft'}).click();
  const draft=page.getByRole('region',{name:'Draft quotation'});
  await expect(draft.getByRole('img',{name:'Prime Stallion logo'})).toBeVisible();
  for(const text of ['DRAFT','Tile installation','By owner','₱34,776.00']) await expect(draft).toContainText(text);
  await page.emulateMedia({media:'print'});
  await expect(draft).toBeVisible();
  await expect(page.getByRole('button',{name:'Print / Save as PDF'})).toBeHidden();
  const pdf=await page.pdf({preferCSSPageSize:true,printBackground:true});
  expect(pdf.subarray(0,5).toString()).toBe('%PDF-');
  expect(pdf.length).toBeGreaterThan(10000);
});

test('quotation builder is marked noindex and fits a narrow viewport', async ({page}) => {
  await page.setViewportSize({width:320,height:760});
  await page.goto('/quotations');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByText(/development only/i)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(scan.violations.map(v=>v.id)).toEqual([]);
});
