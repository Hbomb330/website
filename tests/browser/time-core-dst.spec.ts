import { test, expect } from '@playwright/test';

// Override UTC only here; each format gets an isolated browser context.
test.use({ timezoneId: 'America/Toronto', locale: 'en-US' });

for (const format of ['12', '24']) {
  test(`Toronto November 2026 fall-back preserves countdown in ${format}-hour format`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });

    // Advance UTC normally across 06:00Z. DST changes the local offset,
    // not Date.now(); manually turning the system clock back is a different case.
    await page.clock.install({ time: new Date('2026-11-01T05:58:00Z') });
    await page.goto('/time-core');
    const clock = page.locator('time');
    await expect(clock).not.toHaveText('--:--:--');
    await page.clock.pauseAt(new Date('2026-11-01T05:59:58Z'));
    await page.getByLabel('Clock format').selectOption(format);

    const reading = (time: string) =>
      format === '12' ? new RegExp(`^${time}\\s*AM$`) : time;
    await expect(clock).toHaveText(reading('01:59:58'));
    expect(await page.evaluate(() => new Date().getTimezoneOffset())).toBe(240);

    await page.getByLabel('Timer name').fill('DST countdown');
    await page.getByLabel('Minutes', { exact: true }).fill('0');
    await page.getByLabel('Seconds', { exact: true }).fill('10');
    await page.getByRole('button', { name: 'Start timer', exact: true }).click();
    const timer = page.getByRole('article', { name: 'DST countdown', exact: true });
    await expect(timer.locator('.tc-count')).toHaveText('00:00:10');

    await page.clock.runFor(1000);
    await expect(clock).toHaveText(reading('01:59:59'));
    await expect(timer.locator('.tc-count')).toHaveText('00:00:09');

    await page.clock.runFor(1000);
    await expect(clock).toHaveText(reading('01:00:00'));
    expect(await page.evaluate(() => new Date().getTimezoneOffset())).toBe(300);
    await expect(timer.locator('.tc-count')).toHaveText('00:00:08');
    await expect(timer.getByText('Running', { exact: true })).toBeVisible();

    await page.clock.runFor(7000);
    await expect(clock).toHaveText(reading('01:00:07'));
    await expect(timer.locator('.tc-count')).toHaveText('00:00:01');
    await expect(timer.getByText('Running', { exact: true })).toBeVisible();

    await page.clock.runFor(1000);
    await expect(clock).toHaveText(reading('01:00:08'));
    await expect(timer.locator('.tc-count')).toHaveText('00:00:00');
    await expect(timer.getByText('Finished', { exact: true })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'DST countdown finished' })).toBeVisible();
    await expect(timer.getByRole('button', { name: 'Resume', exact: true })).toBeDisabled();
    expect(errors).toEqual([]);
  });
}
