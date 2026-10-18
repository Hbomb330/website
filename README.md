# HBOMB R.G. app hub

This React Router app runs on Cloudflare Workers. `wrangler.json` routes the Worker to `hbombrg2.com/*`.

## Pages

- `/`: Windows app downloads, browser preview links, and development status for HB Transfer and HB Chat.
- `/time-core`: a working browser clock with 12/24-hour formats, three styles, and up to eight named countdown timers. See [Time Core features and testing](docs/time-core-web.md).
- `/orbit-deck`: the preserved Orbit Deck presentation, including its media and Payhip links.

App versions and download URLs match the published `Hbomb330/hbombrg-com` catalog. Time Core has a functional browser edition; the separate interface previews are simulations. Transfer and Chat have no public production downloads listed.

## Install and develop

Use Node.js and npm, then install dependencies from the repository root:

```sh
npm install
npm run dev
```

## Check and preview

```sh
npm run cf-typegen
npm run typecheck
npm run check
npm run preview
```

`cf-typegen` generates Cloudflare binding and React Router types. `typecheck` runs type generation and TypeScript checks. `check` runs TypeScript, a production build, and a Wrangler deployment dry run. `preview` builds and serves the production bundle locally.

## Browser tests

After building the app, install Chromium and run the Playwright smoke tests:

```sh
npx playwright install --with-deps chromium
npm run test:browser
```

See [the testing guide](docs/time-core-web.md) for coverage, browser limitations, and physical-device checks. Browser tests run against a local production preview; passing tests does not establish public deployment or audible alerts.

## Deploy

After checking the changes, authenticate Wrangler with the Cloudflare account that owns the `hbombrg2.com` zone, then run:

```sh
npm run deploy
```

This deploys the Worker using the `hbombrg2.com/*` route in `wrangler.json`. Confirm the route and target account before deploying; the command updates the live site.
