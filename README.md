# HBOMB R.G. Orbit Deck site

This React Router app runs on Cloudflare Workers. `wrangler.json` routes the Worker to `hbombrg2.com/*`.

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

## Deploy

After checking the changes, authenticate Wrangler with the Cloudflare account that owns the `hbombrg2.com` zone, then run:

```sh
npm run deploy
```

This deploys the Worker using the `hbombrg2.com/*` route in `wrangler.json`. Confirm the route and target account before deploying; the command updates the live site.
