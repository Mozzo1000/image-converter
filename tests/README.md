# Tests

Playwright end-to-end tests live in `tests/e2e/`:

- `smoke.spec.js` — functional coverage (uploading files, changing output format, converting, downloading, clearing the queue, theme toggle/persistence).
- `visual.spec.js` — screenshot diffs for the empty dropzone and a populated queue, in light and dark mode. Baselines are committed under `tests/e2e/visual.spec.js-snapshots/`.

Run locally with `npm run test:e2e` (builds the site and serves it via `vite preview` automatically).

**On Windows/macOS**, screenshot baselines won't match natively since they're OS-specific and CI runs on Ubuntu. Use `npm run test:e2e:smoke` for fast functional-only iteration, and `npm run test:e2e:win` to run everything (including visuals) inside a Docker container matching CI before you push.

If a change intentionally alters the UI, regenerate the visual baselines and look at the new screenshots before committing them:

```
npx playwright test --update-snapshots
```

On Windows/macOS, regenerate them inside Docker instead so the baselines stay Linux-accurate:

```
npm run test:e2e:win -- --update-snapshots
```
