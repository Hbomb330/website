# Time Core browser edition

Route: `/time-core`. The homepage Time Core card has a separate **Launch Web App** link. Windows downloads, interface-preview links and `/orbit-deck` are preserved.

## Features

- Local device clock and date; selectable 12/24-hour format.
- Signal blue, red ember and quiet monochrome styles.
- Up to eight named countdowns, with pause, resume, reset and remove.
- Three-tone Web Audio alert after explicit **Enable / test sound** activation, plus a visible completion state and polite screen-reader announcement.
- Format/style preferences stored locally, with a fallback message when storage is unavailable. Timers are deliberately session-only.
- Responsive controls with 46px minimum control heights, visible keyboard focus and a skip link. No continuous animation or external assets.

## Browser limitations

The user must enable sound with a tap. Audio may still be blocked or suspended, and device volume/silent mode affects audibility. Alerts are in-page; no system notification permission is requested. Background throttling, device sleep and screen locks can delay execution. Timers use absolute deadlines and catch up on the next tick or visibility change; they cannot wake a device. Changing the device clock affects countdowns. Refreshing, closing or leaving the page clears timers. Reset restores the initial duration and leaves it paused.

References:
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#reasons_for_delays_longer_than_specified

## Verification and remaining device checks

### Automated smoke tests

Run locally (Node 22 recommended):

```sh
npm ci
npx playwright install --with-deps chromium
npm run check
npm run test:browser -- --project=chromium
```

Playwright starts a local Vite preview of the production build at `127.0.0.1:4173`; run `npm run check` or `npm run build` again after app changes. It does not deploy or contact the public app. The Linux `check` job runs these steps with the `chromium` project and uploads an HTML report plus failure traces/screenshots for seven days. Open a downloaded trace with `npx playwright show-trace path/to/trace.zip`.

Coverage includes live clock ticks, both time formats, all three styles, preference retention after reload, countdown creation/pause/resume/reset/completion/removal, independent timers, zero-duration rejection, session-only timers, audio-unavailable visual completion, navigation from/to the hub and Orbit Deck, and horizontal control/page bounds at 320×720, 600×1024 and 1024×600. Runtime and console errors fail tests. Timer tests use Playwright's clock with fixed UTC/en-US settings, advancing time explicitly rather than sleeping. Each test gets isolated browser storage. There are no automatic retries to conceal failures.

CI also runs the unchanged seven tests in separate `windows-latest` jobs using branded Chrome (`chrome`) and Edge (`msedge`) channels. Each job ensures its browser is installed, logs the Windows/browser versions, builds locally, and uploads a uniquely named report. Missing browsers or launch failures fail the job; they are not silently skipped. Matrix fail-fast is disabled so a failure in one browser does not cancel the other. Hosted Windows runners are not the user's physical Windows 11 PC. Silk is not automated. Viewport sizes are layout checks, not Fire 7 emulation. Controlled time cannot establish real background throttling, sleep/wake behavior, autoplay policy or audible output. The audio-unavailable test deliberately simulates a rejected AudioContext; it does not validate speakers or sound quality. Actual sound activation and audibility remain device checks.

Historical local verification for the initial Linux suite: dependency installation, `npm run check`, and test discovery passed. The built preview could not start locally because the execution environment reports `uv_interface_addresses`; no local browser pass is claimed. GitHub Actions is the execution gate for the browser suite. The earlier Cloudflare type declaration problem was fixed by merged PR #13. Build/test success is not deployment proof.

### Running branded browsers on Windows 11

With Chrome and Edge already installed, run:

```powershell
npm ci
npm run build
npm run test:browser -- --project=chrome --project=msedge
```

Add `--headed` to observe the tests. If a browser is missing, install it first. CI uses `npx playwright install chrome` or `npx playwright install msedge` on disposable runners; these commands can replace an existing global browser installation, so they are not part of the local instructions. Running `npm run test:browser` without a project selects all three browsers and requires all three installed.

Channel configuration follows https://playwright.dev/docs/browsers#google-chrome--microsoft-edge.

### Physical-device checks

The user reported successful Fire 7 tablet operation after PR #15. Retain that result separately from automated coverage; it does not establish Windows sound or sleep/wake behavior.

On physical Windows 11, test both Chrome and Edge. For future tablet regressions, use Fire 7 Silk in portrait and landscape:

1. Open `/time-core` directly and via Launch Web App; check that the live clock matches the device. Switch 12/24-hour format and all styles. Refresh to confirm preference retention.
2. Enable/test sound and confirm all three tones are audible. Start two named 10-second countdowns. Confirm both show Finished and alert once. Check that ordinary timer ticks are not announced by a screen reader.
3. Pause a timer, wait, then resume; verify remaining time is held while paused. Reset a running/finished timer; verify its original duration returns and it stays paused. Remove a timer. Try zero duration, invalid values and the eight-timer limit.
4. Test without enabling audio and with audio unavailable. Completion must remain visible. Refresh with timers running and confirm the documented session-only behavior.
5. Background the tab and lock/unlock the tablet. Verify catch-up and document whether audible alerts are delayed or suppressed on that device.
6. Check touch and keyboard operation, no horizontal overflow at 320px/600px/1024px widths, and no browser console or hydration errors. Test restricted storage.
7. Verify all four existing Windows download URLs and interface-preview links still match main; confirm the hub and Orbit Deck render normally.
8. After a separate deployment, verify the public route directly. This PR is not confirmation of deployment.
