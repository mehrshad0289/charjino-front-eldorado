# فروشگاه V2 — build روی ویندوز، بعد همان مسیر PM2 فروشگاه قدیم روی :3001
param([switch]$SkipBuild)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\..\docs-charjino\deploy\charjino\ssh-common.ps1"
$Root = $PSScriptRoot
$Tar = 'C:\Users\Asus\Desktop\charjino-frontend-deploy.tar.gz'
Set-Location $Root

if (-not $SkipBuild) {
  $local = Join-Path $Root '.env.local'
  $bak = Join-Path $Root '.env.local.pack-bak'
  if (Test-Path $local) {
    if (Test-Path $bak) { Remove-Item $bak -Force }
    Rename-Item $local $bak
  }
  try {
    $env:NODE_ENV = 'production'
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'npm run build failed' }
  } finally {
    Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
    if (Test-Path $bak) {
      if (Test-Path $local) { Remove-Item $local -Force }
      Rename-Item $bak $local
    }
  }
}

if (-not (Test-Path (Join-Path $Root '.next\BUILD_ID'))) {
  throw '.next missing'
}

if (Test-Path $Tar) { Remove-Item $Tar -Force }
& tar -czf $Tar --exclude=.git --exclude=node_modules --exclude=.env --exclude=.env.local --exclude=.next/dev --exclude=.next/cache -C $Root .next public src package.json package-lock.json next.config.mjs jsconfig.json
if ($LASTEXITCODE -ne 0) { throw 'tar failed' }

Write-Host '==> upload V2 shop archive'
Send-CharjinoFile $Tar '/tmp/charjino-frontend-deploy.tar.gz'
Write-Host '==> replace shop (keep server .env) + npm ci + pm2'
Invoke-CharjinoSsh 'cd /var/www/charjino-frontend && pm2 stop charjino-shop && rm -rf .next src && rm -f next.config.ts next.config.js next.config.mjs && tar -xzf /tmp/charjino-frontend-deploy.tar.gz && rm -rf .next/cache && npm ci --omit=dev && pm2 restart charjino-shop && pm2 save && echo FRONTEND_OK'
Write-Host 'FRONTEND_OK'
