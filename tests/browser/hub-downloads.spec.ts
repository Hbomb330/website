import { expect, test } from '@playwright/test';

for (const [width, height] of [[320, 568], [390, 844], [600, 1024], [768, 1024], [1280, 800]]) {
  test(`Windows download cards remain usable at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    const cards = [
      { heading: 'Blue Wave', links: [/4.1 checksums/, /Release notes/, /original V4 ZIP/, /2.1.0 EXE/, /Download Portable ZIP/] },
      { heading: 'HB Media Player 1.7 Chrome Edition', links: [/Download 1.7 Windows ZIP/, /1.7 checksums/, /Release notes/, /Older 1.6.4 fallback ZIP/, /1.6.4 checksums/] },
    ];
    for (const { heading, links } of cards) {
      const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: heading, exact: true }) });
      await expect(card.getByText(/extract the entire/i)).toBeVisible();
      for (const name of links) {
        const link = card.getByRole('link', { name });
        await link.click({ trial: true });
        expect(await link.evaluate(el => el.tabIndex)).toBeGreaterThanOrEqual(0);
      }

      // Measure each line of wrapped text, including text inside inline links and code.
      const clipped = await card.evaluate(el => {
        const bounds = el.getBoundingClientRect();
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        while (walker.nextNode()) {
          const node = walker.currentNode;
          if (!node.textContent?.trim() || node.parentElement?.closest('.hub-sr')) continue;
          range.selectNodeContents(node);
          if ([...range.getClientRects()].some(rect => rect.left < bounds.left - 1 || rect.right > bounds.right + 1)) {
            return node.textContent;
          }
        }
        return null;
      });
      expect(clipped).toBeNull();
    }
    const inlineLinks = page.locator('.hub-blue-wave .hub-install-note a');
    await expect(inlineLinks).toHaveCount(4);
    for (const link of await inlineLinks.all()) {
      await expect(link).toHaveCSS('text-decoration-line', 'underline');
    }
  });
}
