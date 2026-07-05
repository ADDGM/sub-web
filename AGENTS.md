# AGENTS GUIDE

Vue 2.7 + Vite 8 SPA with Element UI. Keep changes small, follow existing patterns, avoid refactors during fixes.

## Quick Facts

- Framework: Vue 2.7 (Options API)
- Build tool: Vite 8
- UI: Element UI 2
- Router: Vue Router 3 (history mode, base from `import.meta.env.BASE_URL`)
- Node: 24.x
- No automated tests currently

## Commands

| Command        | Description                      |
| -------------- | -------------------------------- |
| `yarn install` | Install dependencies             |
| `yarn dev`     | Start dev server (host: 0.0.0.0) |
| `yarn build`   | Production build                 |
| `yarn preview` | Preview production build locally |
| `yarn lint`    | ESLint fix                       |
| `yarn lint:check` | ESLint check                  |

## CI / Workflows

- **build.yml**: triggers on push to `master`/`develop` and PRs to `develop` — runs `yarn install --frozen-lockfile` + `yarn lint:check` + `yarn build`, then uploads `dist/` as artifact (7-day retention)
- **docker-build-push.yml**: triggers on `v*` tags or manual dispatch on a tag ref — builds and pushes multi-arch images (`linux/amd64`, `linux/arm64`) to Docker Hub and GHCR; `vX.Y.Z-rc.N` pushes only `<tag>`, while `vX.Y.Z` also pushes `latest`
- Required GitHub settings for Docker Hub publishing: repository variable `DOCKER_IMAGE` (for example `yourname/subweb`) and secrets `DOCKERHUB_USERNAME` / `DOCKERHUB_PASSWORD`; GHCR uses `GITHUB_TOKEN` with `packages: write`

## Branch & Release Workflow

- `master` mirrors upstream only; avoid custom application changes there.
- `develop` contains local custom changes and is the normal development branch.
- Sync upstream into `master`, then merge `master` into `develop` before releases.
- Keep `package.json` `version` aligned with the release tag without the `v` prefix, e.g. `0.1.0` for `v0.1.0`.
- Validate release candidates from `develop` with `yarn lint:check` and `yarn build`.
- Use `vX.Y.Z-rc.N` tags for release-candidate Docker validation, e.g. `v0.1.0-rc.1`; use `vX.Y.Z` tags for releases, e.g. `v0.1.0`.

## Repository Layout

```
src/
├── main.js                      # App bootstrap, plugin registration, Vue mount
├── App.vue
├── router/index.js              # Vue Router (history mode)
├── views/Subconverter.vue       # Main page
├── components/
│   ├── ConfigUploadDialog.vue   # Config upload dialog
│   ├── UrlParseDialog.vue       # URL parse dialog
│   └── SvgIcon/index.vue        # SVG icon wrapper component
├── composables/
│   ├── useSubscription.js       # URL building logic (makeUrl, buildBaseUrl, buildAdvancedParams)
│   ├── useSubscriptionForm.js   # Reactive form state + addCustomParam + saveSubUrl
│   └── useUrlParser.js          # Short-link expansion + URL-to-form parser (analyzeUrl, parseUrl)
├── services/
│   ├── backendService.js        # BackendService.getBackendVersion()
│   ├── shortUrlService.js       # ShortUrlService.generateShortUrl()
│   └── configUploadService.js   # ConfigUploadService.uploadConfig(), handleUploadSuccess()
├── config/
│   ├── constants.js             # CONSTANTS (env-backed, DEFAULT_CLIENT_TYPE='clash')
│   ├── client-types.js          # CLIENT_TYPES map (display label → target value)
│   └── remote-configs.js        # REMOTE_CONFIGS grouped options array
├── utils/
│   ├── storage.js               # getLocalStorageItem / setLocalStorageItem (TTL-based)
│   ├── validators.js            # validateSubUrl → { valid, message } | validateForm → boolean
│   ├── formatters.js            # formatVersion, formatErrorMessage, processSubUrl
│   └── search.js                # Backend autocomplete search helper
├── plugins/                     # Vue plugin registrations (element-ui, clipboard, axios, device)
└── icons/
    ├── index.js                 # Registers SVG sprite
    └── svg/                     # SVG source files (e.g., github.svg)
services/                        # Docker Compose stack (subweb + myurls + redis)
```

## Key Modules

### `src/config/constants.js`

All values read from `import.meta.env` with `VITE_` prefix. Key constants:

- `DEFAULT_BACKEND` — appends `/sub?` to `VITE_SUBCONVERTER_DEFAULT_BACKEND`
- `DEFAULT_CLIENT_TYPE` — hardcoded `'clash'`
- `SHORT_URL_API`, `CONFIG_UPLOAD_API`, `PROJECT`, `BOT_LINK`, etc.

### `src/composables/useSubscriptionForm.js`

Returns plain object merged into `data()` via spread. Form fields include: `sourceSubUrl`, `clientType`, `customBackend`, `remoteConfig`, `emoji`, `nodeList`, `sort`, `udp`, `tfo`, `scv`, `fdn`, `expand`, `appendType`, `insert`, `new_name`, `tpl.surge.doh`, `tpl.clash.doh`. Default mode is advanced (`advanced: "2"`).

### `src/composables/useSubscription.js`

`makeUrl(form, advanced, processedSubUrl, currentBackend, customParams, needUdp)` — returns empty string on validation failure, otherwise builds full query string. Advanced mode adds remote config, include/exclude, filename, UDP, template, and custom params.

### `src/composables/useUrlParser.js`

`analyzeUrl(url)` — if URL contains `"target"`, returns as-is; otherwise fetches and returns `response.url` (short-link expansion, requires CORS on short-link service).  
`parseUrl(url, form, customParams, onSuccess, onError)` — parses all query params back into form fields; unknown params become `customParams` entries.

### `src/services/`

All service classes are static methods. They take `$axios` as first argument (injected via plugin). Silent failures are acceptable for `getBackendVersion`. Upload response shape: `{ code: 0, data: { url }, msg }`. Short URL response shape: `{ Code: 1, ShortUrl, Message }`.

### `src/utils/storage.js`

TTL stored inside the JSON value as `{ setTime, ttl, expire, value }`. `expire` checked on every read; expired entries are removed automatically. TTL value comes from `VITE_CACHE_TTL` env var.

## Code Style

- Indentation: 2 spaces
- Quotes: single quotes preferred
- Semicolons: none (`semi: 0`)
- Vue component names: single-word allowed (`vue/multi-word-component-names: off`)
- `no-console` / `no-debugger`: error in production, off in dev
- ESLint extends: `plugin:vue/essential`, `eslint:recommended`
- Parser: `@babel/eslint-parser` with `requireConfigFile: false`

## Imports & Modules

- ES modules (`import`/`export`) throughout
- Absolute alias `@` maps to `src/` (see `vite.config.js`)
- Import order: core libs → local config/utils → services → components
- Dynamic imports only for route lazy-load

## Vue Patterns

- Options API everywhere; do not introduce Composition API
- Component structure: `<template>`, `<script>`, `<style>`
- Reactive state in `data()`; derived state in `computed`
- Composables spread via `...useSubscription()` / `...useUrlParser()` in `methods`
- `useSubscriptionForm()` spread via `...subscriptionForm` in `data()`

## Icons

- SVG sprites via `vite-plugin-svg-icons`; icon dirs: `src/icons/svg`
- Usage: `<svg-icon icon-class="name" />`
- Symbol ID format: `icon-[name]`

## Environment Variables

- All env vars use `VITE_` prefix; access via `import.meta.env`
- Do not commit `.env.local`, `.env.*.local`
- Constants centralised in `src/config/constants.js` — do not scatter `import.meta.env` calls

## Validation

- Use `src/utils/validators.js` for user-facing checks
- `validateSubUrl` returns `{ valid, message }`; `validateForm` returns boolean
- Do not throw for validation flow

## Error Handling

- UI errors via `this.$message.*` or `this.$notify`
- Silent failures acceptable only when UX demands it (e.g., backend version fetch)
- Use `formatErrorMessage` from `src/utils/formatters.js` for consistent error strings

## Docker

- Base images: `node:24-alpine` (build), `nginx:1.24-alpine` (runtime)
- Build: `yarn install --frozen-lockfile && yarn build`, output copied to `/usr/share/nginx/html`
- Services compose stack in `services/` includes myurls + Redis

## Git Hygiene

- Do not commit `dist/`, `node_modules/`, `.env.local`, `.env.*.local`
- Avoid adding generated files

## Frontend Safety

- Avoid inline styles unless already present in nearby code
- Prefer Element UI components and existing patterns
- Keep UI message strings consistent (mostly Chinese)

## Performance

- Do not introduce heavy dependencies; prefer existing utilities
- Keep all network calls in `src/services/`

## Example Patterns

```js
// Route lazy-load
component: () => import('../views/Subconverter.vue')

// Service class
export class BackendService {
  static async getBackendVersion($axios) { ... }
}

// Composable (Options API style)
export function useSubscription() {
  return { makeUrl, buildBaseUrl, buildAdvancedParams }
}

// Spread composable into methods
methods: {
  ...useSubscription(),
  ...useUrlParser()
}

// Spread form state into data()
data() {
  return { ...useSubscriptionForm(), otherField: '' }
}
```

## Suggested Manual Checks

- `yarn lint:check`
- `yarn build`
- Run `yarn dev` and smoke the main screen

## Notes for Agents

- Follow existing patterns; minimise scope
- No large refactors unless explicitly requested
- Do not introduce TypeScript or new tooling without approval
- No test runner configured; if added, document the single-test command here
