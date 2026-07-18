# Dependency updates

How dependency updates flow through this repo, and the steps that still need a human.

## How the automated pipeline works

1. **Dependabot** (`.github/dependabot.yml`) checks weekly for npm and GitHub Actions updates.
   - Patch/minor npm updates are grouped into a single PR (`npm-patch-minor`) to cut down on noise.
   - Major npm updates open as their own individual PR, one per package.
   - GitHub Actions updates follow the same patch/minor grouping.
2. **CI** (`.github/workflows/ci.yml`) runs on every pull request:
   - `npm ci`
   - `npm run build` (Vite build + prerender)
   - `npx playwright install --with-deps chromium`
   - `npm run test:e2e` (the Playwright smoke + visual suite in `tests/e2e/`)
   - The Playwright HTML report is uploaded as a build artifact on every run (pass or fail) — download it from the Actions run summary to see diffs without re-running locally.
3. **Auto-merge** (`.github/workflows/dependabot-auto-merge.yml`) runs only for PRs opened by `dependabot[bot]`:
   - If the update is patch or minor, it enables GitHub's native auto-merge, which merges the PR (squash) automatically once CI passes.
   - If the update is major, the workflow does nothing — the PR waits for manual review and merge. See below.

Two one-time repo settings this depends on (can't be set from a workflow file):
- Settings -> General -> Pull Requests -> "Allow auto-merge" must be enabled.
- Settings -> Branches -> branch protection on `main` should require the `CI / Build & Test` check to pass before merging, otherwise `gh pr merge --auto` may merge before Playwright has finished.

## Running everything locally

```
npm ci                              # install exact versions from package-lock.json
npm run build                       # full production build (vite build/prerender)
npm run preview                     # serve the built dist/ at http://localhost:4173

npx playwright install              # one-time browser install
npm run test:e2e                    # run the full smoke + visual suite headless
npx playwright test --ui             # interactive runner, great for debugging one failing spec
npx playwright show-report          # view the HTML report/diffs from the last run
npx playwright test --update-snapshots   # regenerate visual baselines after an intentional UI change
```

`npm run test:e2e` (and `playwright.config.js`'s `webServer`) already runs `npm run build && npm run preview` for you, so you don't need to start the server by hand before running tests.

After `--update-snapshots`, open the changed PNGs under `tests/e2e/visual.spec.js-snapshots/` and look at them before committing — the command regenerates baselines unconditionally, it doesn't know whether the new look is correct.

### Running on Windows (or macOS)

CI runs on Ubuntu, and Playwright's screenshot baselines are OS-specific (the committed ones are named `*-chromium-linux.png`). Running the bare commands above on Windows/macOS will report "snapshot doesn't exist" for every visual test, even when nothing is actually broken — it's not a real failure, just a platform mismatch. Two commands sidestep this:

- `npm run test:e2e:smoke` — runs only the functional smoke tests natively (fast, no Docker). Use this for day-to-day iteration; it has no platform-specific baseline issue.
- `npm run test:e2e:win` — runs the entire suite, including the visual regression tests, inside the same `mcr.microsoft.com/playwright:v<version>-noble` Docker image the `ci.yml` workflow effectively matches (same Playwright version, resolved automatically from `npx playwright --version`, same Ubuntu base). This is what actually tells you whether CI will pass. It reinstalls `node_modules` inside the container (`scripts/test-e2e-docker.ps1`) since native deps like Rollup's optional binary differ between Windows and Linux, so it's slower (~30s) than the native run but requires only Docker Desktop to be running.

Run `npm run test:e2e:win` before pushing anything that could affect layout, styling, or a dependency that touches rendering (Tailwind, Preact, Vite) — that's the only local command that mirrors CI exactly. `npm run test:e2e:smoke` is enough for everything else.

To regenerate visual baselines correctly (i.e. as Linux screenshots, matching what CI compares against), do it inside the same container rather than natively on Windows. `test:e2e:win` forwards any extra arguments straight to `playwright test` inside the container, so:

```
npm run test:e2e:win -- --update-snapshots
```

Then, as always, look at the changed PNGs before committing them. Only the files that actually exceed `maxDiffPixelRatio` get rewritten — a full run typically leaves most snapshots untouched.

Note: running `npm ci` inside the container can rewrite `package-lock.json` (e.g. dropping/adding `libc` fields) if the container's bundled npm version differs from the one you last ran `npm install` with locally. That's lockfile churn from the tool version, not a real dependency change — `git checkout -- package-lock.json` before committing if you see it and didn't intend to touch dependencies.

## Handling a major-version Dependabot PR

Major bumps don't auto-merge, so work through this checklist manually:

1. Read the PR body and the linked release notes for breaking changes (Dependabot links the changelog/release for you).
2. Check out the PR branch locally: `gh pr checkout <PR-number>`.
3. `npm ci && npm run build` — confirm the site still builds and prerenders cleanly.
4. `npm run test:e2e` (Linux/CI) or `npm run test:e2e:win` (Windows/macOS) — confirm smoke and visual tests pass.
   - A smoke test failure usually means a real functional break (an API changed, an event no longer fires the way it used to) — dig into the failing spec.
   - A visual diff means pixels moved. Open the HTML report (`npx playwright show-report`) and judge it: if it's an acceptable, intentional-looking rendering change from the new library version, rerun with `--update-snapshots` and commit the new baselines; if it looks broken, that's a regression to fix or a reason to hold off on the update.
5. Spot-check `npm run dev` in a browser for anything outside the Playwright suite's coverage.
6. Merge manually once satisfied. Note any follow-up (e.g. new peer-dependency warnings, config changes made) in the PR description before merging.

## When CI goes red on a dependency PR

Open the failed Actions run and check, in this order:
1. The `npm run build` step — if this fails, it's almost always a real breaking change (removed API, changed plugin config shape, etc.), not a test issue.
2. Playwright test failures (not screenshot diffs) — a functional regression; read the assertion that failed.
3. Playwright screenshot diffs — download the `playwright-report` artifact from the run and open it; it shows expected/actual/diff images side by side.

## When a dependency update needs an accompanying code change

Sometimes CI goes red not because of a real bug, but because the new dependency version needs a matching change elsewhere in the repo (a config option renamed, a plugin API changed, a component's default behavior shifted). When that happens, push the fix directly onto the Dependabot PR's branch rather than opening a separate PR.

Why: it keeps the version bump and its compensating code change atomic. If this update is ever reverted or rolled back, the fix goes with it. It also means CI validates the bump and the fix together — which is the actual combination you're merging — instead of validating them in isolation.

How:

```
gh pr checkout <PR-number>          # check out the Dependabot branch locally
# make the code change needed to accommodate the new version
git commit -am "Adjust for <package> vX breaking change"
git push                            # pushes back onto the same Dependabot branch
```

Notes:
- Dependabot won't overwrite your commit — if it later needs to update the branch (e.g. rebasing on a newer patch release), that's additive, not destructive. Still, re-check CI after any further Dependabot activity on the branch.
- Only reach for a separate PR if the code change is substantial or risky enough to warrant independent review before the bump lands. For the typical "adjust for a breaking API change" fix, bundle it into the same PR.
- Once pushed, this PR no longer qualifies for auto-merge if it was previously a patch/minor bump that failed for an unrelated reason — but major bumps were already headed for manual review anyway (see "Handling a major-version Dependabot PR").
