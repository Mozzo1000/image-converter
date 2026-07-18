# Runs the full Playwright suite (smoke + visual) inside the same Linux container
# image CI uses, so results - especially screenshot diffs - match what GitHub
# Actions will see. Needed on Windows/macOS because Playwright's screenshot
# baselines are OS-specific and this repo's committed baselines are Linux ones.
# Extra args (e.g. --update-snapshots) are forwarded to `playwright test`.
param(
	[Parameter(ValueFromRemainingArguments = $true)]
	[string[]]$PlaywrightArgs
)

$ErrorActionPreference = "Stop"

$pwVersion = (npx playwright --version) -replace '^Version\s+', ''
$image = "mcr.microsoft.com/playwright:v$pwVersion-noble"
$repoPath = (Get-Location).Path
$extraArgs = $PlaywrightArgs -join ' '

# node_modules is bind-mounted from Windows, so native binaries (e.g. rollup's
# platform-specific optional dependency) won't match Linux. Reinstall inside the
# container - using a container-local node_modules, not the mounted one - before
# building/testing, so this matches what CI actually does.
Write-Host "Running tests in $image..."
docker run --rm -e "PW_ARGS=$extraArgs" -v "${repoPath}:/work" -v "/work/node_modules" -w /work $image bash -lc @'
set -e
npm ci
npm run build
nohup npx vite preview --port 4173 --host 127.0.0.1 > /tmp/preview.log 2>&1 &
for i in $(seq 1 30); do
  curl -s -o /dev/null http://127.0.0.1:4173/ && break
  sleep 2
done
npx playwright test $PW_ARGS
'@
exit $LASTEXITCODE
