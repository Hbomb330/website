import { test, expect, type Page } from '@playwright/test';

// Exercise the real built route and fail on runtime/hydration console errors.
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  (page as Page & { smokeErrors: string[] }).smokeErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { smokeErrors: string[] }).smokeErrors).toEqual([]);
});

async function openClock(page: Page) {
  await page.clock.install({ time: new Date('2026-01-15T13:04:00Z') });
  await page.goto('/time-core');
  await expect(page.locator('time')).not.toHaveText('--:--:--');
  await page.clock.pauseAt(new Date('2026-01-15T13:05:00Z'));
}
async function addTimer(page: Page, name = 'Focus', seconds = '10') {
  await page.getByLabel('Timer name').fill(name);
  await page.getByLabel('Minutes', { exact: true }).fill('0');
  await page.getByLabel('Seconds', { exact: true }).fill(seconds);
  await page.getByRole('button', { name: 'Start timer', exact: true }).click();
  return page.getByRole('article', { name, exact: true });
}

test('live clock, time formats, styles and saved preferences', async ({ page }) => {
  await openClock(page);
  await expect(page).toHaveTitle('Time Core — HBOMB Browser Clock');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Time Core.');
  await expect(page.locator('time')).toHaveText('13:05:00');
  await page.clock.runFor(1000);
  await expect(page.locator('time')).toHaveText('13:05:01');
  await page.getByLabel('Clock format').selectOption('12');
  await expect(page.locator('time')).toHaveText(/01:05:01\s*PM/);
  for (const style of ['ember', 'minimal', 'signal']) {
    await page.getByLabel('Visual style').selectOption(style);
    await expect(page.locator('.tc')).toHaveClass(`tc tc-${style}`);
  }
  await page.getByLabel('Visual style').selectOption('ember');
  await page.reload();
  await expect(page.getByLabel('Clock format')).toHaveValue('12');
  await expect(page.getByLabel('Visual style')).toHaveValue('ember');
  await expect(page.locator('.tc')).toHaveClass('tc tc-ember');
  await page.getByLabel('Clock format').selectOption('24');
  await expect(page.locator('time')).toHaveText(/^13:05:/);
});

test('countdown creation, pause, resume, running reset, completion and reuse', async ({ page }) => {
  await openClock(page);
  const timer = await addTimer(page);
  await expect(timer.getByText('Running', { exact: true })).toBeVisible();
  await expect(timer.locator('.tc-count')).toHaveText('00:00:10');
  await page.clock.runFor(3000);
  await expect(timer.locator('.tc-count')).toHaveText('00:00:07');
  await timer.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.clock.runFor(20_000);
  await expect(timer.locator('.tc-count')).toHaveText('00:00:07');
  await expect(timer.getByText('Paused · ready to resume')).toBeVisible();
  await timer.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.clock.runFor(2000);
  await expect(timer.locator('.tc-count')).toHaveText('00:00:05');
  await timer.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.clock.runFor(15_000);
  await expect(timer.locator('.tc-count')).toHaveText('00:00:10');
  await expect(timer.getByText('Paused · ready to resume')).toBeVisible();
  await timer.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.clock.runFor(10_000);
  await expect(timer.getByText('Finished', { exact: true })).toBeVisible();
  await expect(timer.locator('.tc-count')).toHaveText('00:00:00');
  await expect(page.getByRole('status').filter({ hasText: 'Focus finished' })).toBeVisible();
  await expect(timer.getByRole('button', { name: 'Resume', exact: true })).toBeDisabled();
  // Completion must work even when the user has never enabled audio.
  await expect(page.getByText('Sound is blocked or suspended.', { exact: false })).toBeVisible();
  await timer.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(timer.locator('.tc-count')).toHaveText('00:00:10');
  await timer.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.clock.runFor(10_000);
  await expect(timer.getByText('Finished', { exact: true })).toBeVisible();
  await timer.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(timer).toHaveCount(0);
});

test('independent timers, invalid zero duration and session-only timers', async ({ page }) => {
  await openClock(page);
  await addTimer(page, 'Invalid', '0');
  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(page.getByText(/with a total above zero/)).toBeVisible();
  const first = await addTimer(page, 'First', '2');
  const second = await addTimer(page, 'Second', '5');
  await page.clock.runFor(2000);
  await expect(first.getByText('Finished', { exact: true })).toBeVisible();
  await expect(second.locator('.tc-count')).toHaveText('00:00:03');
  await page.reload();
  await expect(page.locator('time')).not.toHaveText('--:--:--');
  await expect(page.getByRole('article')).toHaveCount(0);
});

for (const viewport of [{ width: 320, height: 720 }, { width: 600, height: 1024 }, { width: 1024, height: 600 }]) {
  test(`controls and navigation at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.getByRole('link', { name: /Launch Web App/ }).click();
    await expect(page).toHaveURL(/\/time-core$/);
    await expect(page.locator('time')).not.toHaveText('--:--:--');
    await page.keyboard.press('Tab');
    // Test the skip link independently of focus retained by full navigation.
    await page.getByRole('link', { name: 'Skip to clock' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#tc-main$/);
    await page.getByLabel('Clock format').selectOption('12');
    await page.getByLabel('Visual style').selectOption('minimal');
    const timer = await addTimer(page, 'Small screen timer', '59');
    await timer.getByRole('button', { name: 'Pause', exact: true }).click();
    for (const control of await page.locator('.tc select, .tc input, .tc button').all()) {
      const box = await control.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: /Download Time Core/ })).toHaveAttribute('href', /HBOMB\.Time\.Core\.Setup\.2\.3\.0\.exe$/);
    await page.getByRole('link', { name: 'Orbit Deck', exact: true }).click();
    await expect(page).toHaveURL(/\/orbit-deck$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.goto('/time-core');
    await page.getByRole('link', { name: /App hub/ }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: /Launch Web App/ })).toBeVisible();
  });
}

test('audio unavailable still allows visible completion', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'AudioContext', { value: class {
      constructor() { throw new Error('Audio unavailable in this test'); }
    } });
  });
  await openClock(page);
  await page.getByRole('button', { name: 'Enable / test sound' }).click();
  await expect(page.getByText('Audio is unavailable or blocked in this browser. Visual alerts still work.')).toBeVisible();
  const timer = await addTimer(page, 'Silent', '1');
  await page.clock.runFor(1000);
  await expect(timer.getByText('Finished', { exact: true })).toBeVisible();
});
