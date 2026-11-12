#Requires -Version 5.1
<#
.SYNOPSIS
    Проверяет и восстанавливает профиль DSH и переносит снимок его настроек.

.DESCRIPTION
    Обычный запуск (без ключей) — проверка связи профиля с исходниками плагинов:
      - зависимость link:<абсолютный путь> в package.json профиля;
      - наличие пакета в dsh.profile.bundles;
      - цель junction в node_modules;
      - записи specifier/version в pnpm-lock.yaml.
    С -Fix расхождения исправляются.

    -Capture сохраняет переносимую часть профиля в <Root>/profile/<profile>:
      список включённых bundles, список локальных плагинов и cordis.patch.yml.
    -Restore применяет этот снимок к профилю: ставит link-зависимости и junction,
      включает выбранные плагины и копирует настройки. Перед записью делается
      резервная копия в docs/recovery.

    Копировать сами встроенные плагины не нужно и вредно: они поставляются
    вместе с DSH и меняются с его версией. В снимок попадают только имена
    bundles и конфигурация профиля; код встроенных плагинов остаётся в DSH.

.PARAMETER Root
    Каталог с плагинами. По умолчанию C:/projects/DeepseekPlugins.

.PARAMETER Profile
    Профили DSH. По умолчанию desktop.

.PARAMETER ProfilesRoot
    Каталог профилей DSH. По умолчанию ~/.dsh/profiles.

.PARAMETER Fix
    Внести исправления вместо отчёта.

.PARAMETER Capture
    Сохранить снимок профиля в <Root>/profile/<profile>.

.PARAMETER Restore
    Применить снимок из <Root>/profile/<profile> к профилю.

.PARAMETER Exact
    При -Restore заменить список bundles ровно снимком. Без этого ключа
    встроенные bundles, которых нет в снимке (например, новые базовые пакеты
    после обновления DSH), сохраняются; локальные плагины всё равно приводятся
    к снимку.

.PARAMETER AllowSecrets
    Разрешить -Capture, даже если в cordis.patch.yml нашлись значения, похожие
    на секреты. По умолчанию такой снимок не сохраняется.

.PARAMETER AppAsar
    Путь к resources/app.asar. Нужен только для проверки, какие встроенные
    bundles существуют в текущей версии DSH.

.EXAMPLE
    ./install.ps1
    ./install.ps1 -Fix -Profile desktop,web
    ./install.ps1 -Capture
    ./install.ps1 -Restore
    ./install.ps1 -Restore -Exact
#>
[CmdletBinding()]
param(
    [string]$Root = 'C:/projects/DeepseekPlugins',
    [string[]]$Profile = @('desktop'),
    [string]$ProfilesRoot = (Join-Path $env:USERPROFILE '.dsh/profiles'),
    [string]$AppAsar = '',
    [switch]$Fix,
    [switch]$Capture,
    [switch]$Restore,
    [switch]$Exact,
    [switch]$AllowSecrets
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false } catch { }

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$newLine = [Environment]::NewLine
$pluginsDir = Join-Path $Root 'plugins'
$snapshotRoot = Join-Path $Root 'profile'
$recoveryRoot = Join-Path $Root 'docs/recovery'

if (-not (Test-Path -LiteralPath $pluginsDir)) { throw "Нет каталога плагинов: $pluginsDir" }
if ($Capture -and $Restore) { throw 'Ключи -Capture и -Restore несовместимы: выберите один режим.' }

# ---------------------------------------------------------------------------
# Общие помощники
# ---------------------------------------------------------------------------

function Read-Text([string]$path) {
    [System.IO.File]::ReadAllText($path)
}

function Write-Text([string]$path, [string]$text) {
    $dir = Split-Path -Parent $path
    if ($dir -and -not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($path, $text, $utf8NoBom)
}

function Read-Json([string]$path) {
    $text = Read-Text $path
    if ([string]::IsNullOrWhiteSpace($text)) { return $null }
    $text | ConvertFrom-Json
}

function Write-Json([string]$path, $value) {
    $json = $value | ConvertTo-Json -Depth 30
    # ConvertTo-Json в PowerShell 5.1 ставит два пробела после двоеточия.
    $json = $json -replace '(?m)^(\s*"[^"]+"):  ', '$1: '
    Write-Text $path ($json + $newLine)
}

function Resolve-AppAsar([string]$explicit) {
    if ($explicit) {
        if (Test-Path -LiteralPath $explicit) { return (Resolve-Path -LiteralPath $explicit).Path }
        return ''
    }
    $candidates = @(
        (Join-Path $env:LOCALAPPDATA 'Programs/DeepSeek Harness/resources/app.asar')
    )
    if ($env:ProgramFiles) {
        $candidates += (Join-Path $env:ProgramFiles 'DeepSeek Harness/resources/app.asar')
    }
    $x86 = [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')
    if ($x86) {
        $candidates += (Join-Path $x86 'DeepSeek Harness/resources/app.asar')
    }
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) { return (Resolve-Path -LiteralPath $candidate).Path }
    }
    return ''
}

function Get-NodePath {
    $command = Get-Command node -ErrorAction SilentlyContinue
    if ($command -and $command.Source) { return $command.Source }
    return ''
}

$script:AsarPath = Resolve-AppAsar $AppAsar
$script:DshVersion = ''
$script:AsarPackages = $null

function Get-DshVersion {
    if ($script:DshVersion) { return $script:DshVersion }
    $script:DshVersion = 'unknown'
    $node = Get-NodePath
    $tool = Join-Path $Root 'tools/asar.mjs'
    if (-not $script:AsarPath -or -not $node -or -not (Test-Path -LiteralPath $tool)) { return $script:DshVersion }
    try {
        $raw = (& $node $tool $script:AsarPath cat 'dsh/package.json' 2>$null) -join $newLine
        $pkg = $raw | ConvertFrom-Json
        if ($pkg -and $pkg.version) { $script:DshVersion = [string]$pkg.version }
    } catch {
        $script:DshVersion = 'unknown'
    }
    return $script:DshVersion
}

function Get-AsarPackages {
    if ($null -ne $script:AsarPackages) { return $script:AsarPackages }
    $script:AsarPackages = @()
    $node = Get-NodePath
    $tool = Join-Path $Root 'tools/asar.mjs'
    if (-not $script:AsarPath -or -not $node -or -not (Test-Path -LiteralPath $tool)) { return $script:AsarPackages }
    try {
        $lines = & $node $tool $script:AsarPath list '^dsh/node_modules/(@[^/]+/[^/]+|[^/]+)/package.json$' 2>$null
        foreach ($line in @($lines)) {
            $entry = [string]$line
            $tab = $entry.LastIndexOf([char]9)
            if ($tab -ge 0) { $entry = $entry.Substring($tab + 1) }
            if ($entry -match '^dsh/node_modules/((?:@[^/]+/)?[^/]+)/package.json$') {
                $script:AsarPackages += $Matches[1]
            }
        }
        $script:AsarPackages = @($script:AsarPackages | Sort-Object -Unique)
    } catch {
        $script:AsarPackages = @()
    }
    return $script:AsarPackages
}

function Get-LocalPlugins {
    $plugins = @()
    foreach ($dir in Get-ChildItem -LiteralPath $pluginsDir -Directory) {
        $manifestPath = Join-Path $dir.FullName 'package.json'
        if (-not (Test-Path -LiteralPath $manifestPath)) {
            Write-Host "  [skip] $($dir.Name): нет package.json" -ForegroundColor DarkGray
            continue
        }
        $manifest = Read-Json $manifestPath
        if (-not $manifest -or -not $manifest.name) {
            Write-Host "  [skip] $($dir.Name): нет имени пакета" -ForegroundColor DarkGray
            continue
        }
        $plugins += [pscustomobject]@{
            Name = [string]$manifest.name
            Dir = $dir.FullName
            Version = [string]$manifest.version
        }
    }
    return $plugins
}

function Get-RequiredBundles([string]$profileName) {
    if ($profileName -eq 'headless') {
        return @('@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless')
    }
    return @('@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app')
}

function Test-BundleAvailable([string]$name, [string]$profileDir) {
    if (-not $name) { return $false }
    if ($name -like '@local/*') {
        return (@($script:Plugins | Where-Object { $_.Name -eq $name }).Count -gt 0)
    }
    $asar = Get-AsarPackages
    if ($asar.Count -gt 0) {
        if ($asar -contains $name) { return $true }
        $installed = Join-Path (Join-Path $profileDir 'node_modules') ($name.Replace('/', '\'))
        if (Test-Path -LiteralPath (Join-Path $installed 'package.json')) { return $true }
        return $false
    }
    # Не удалось прочитать app.asar — не блокируем восстановление.
    return $true
}

function Assert-PatchSafe([string]$text, [string]$path) {
    $suspects = @()
    $lines = $text -split '\r?\n'
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match '(?i)^\s*(api[_-]?key|apikey|token|secret|password|passwd|authorization)\s*:\s*(.+?)\s*$') {
            $value = $Matches[2].Trim()
            $clean = $value.Trim([char[]]@([char]39, [char]34))
            if ($clean -match '^(\$\{[^}]+\}|\$[A-Z][A-Z0-9_]*|%[A-Z][A-Z0-9_]*%|!!js|process\.env|env:.+|null|~)$') { continue }
            if ($clean -match '^[A-Z][A-Z0-9_]*$') { continue }
            $suspects += ('строка ' + ($i + 1) + ': ' + $Matches[1])
        }
        if ($line -match 'BEGIN [A-Z ]*PRIVATE KEY') {
            $suspects += ('строка ' + ($i + 1) + ': private key')
        }
    }
    if ($suspects.Count -gt 0) {
        $message = "В $path похоже на секреты:" + $newLine + '  ' + ($suspects -join ($newLine + '  ')) + $newLine + 'Снимок не сохранён. Уберите секреты из профиля или запустите с -AllowSecrets.'
        if ($AllowSecrets) { Write-Warning $message } else { throw $message }
    }
}

function Assert-PatchPortable([string]$text, [string]$path) {
    $issues = @()
    if ($text -match [regex]::Escape($Root)) { $issues += 'путь репозитория' }
    if ($env:USERPROFILE -and $text -match [regex]::Escape($env:USERPROFILE)) { $issues += 'путь домашнего каталога' }
    if ($issues.Count -gt 0) {
        Write-Warning "В $path есть машинно-зависимые пути ($($issues -join ', ')). На другом компьютере их придётся поправить."
    }
}

function Get-LinkState([string]$linkPath, [string]$targetPath) {
    $item = Get-Item -LiteralPath $linkPath -Force -ErrorAction SilentlyContinue
    if (-not $item) { return 'missing' }
    if ($item.LinkType -ne 'Junction' -and $item.LinkType -ne 'SymbolicLink') { return 'not-a-link' }
    $current = @($item.Target)[0]
    if ($current -eq $targetPath) { return 'ok' }
    return "wrong:$current"
}

function Get-RelativeLinkPath([string]$fromDir, [string]$toPath) {
    $from = $fromDir.Replace([char]92, [char]47).TrimEnd('/').Split('/')
    $to = $toPath.Replace([char]92, [char]47).TrimEnd('/').Split('/')
    $i = 0
    while ($i -lt $from.Count -and $i -lt $to.Count -and $from[$i] -eq $to[$i]) { $i++ }
    $parts = @()
    for ($j = $i; $j -lt $from.Count; $j++) { $parts += '..' }
    for ($j = $i; $j -lt $to.Count; $j++) { $parts += $to[$j] }
    return ($parts -join '/')
}

function Repair-Lock([string]$lockPath, [string]$name, [string]$spec, [string]$rel) {
    if (-not (Test-Path -LiteralPath $lockPath)) { return $false }
    $text = [System.IO.File]::ReadAllText($lockPath)
    $escaped = [regex]::Escape($name)
    $pattern = "(?m)^(\s*'" + $escaped + "':\r?\n\s*specifier: )\S+(\r?\n\s*version: )\S+"
    $updated = [regex]::Replace($text, $pattern, ('1' + $spec + '2' + $rel))
    if ($updated -eq $text) { return $false }
    [System.IO.File]::WriteAllText($lockPath, $updated)
    return $true
}

function Remove-Link([string]$linkPath) {
    try {
        [System.IO.Directory]::Delete($linkPath, $false)
    } catch {
        cmd /c rmdir "$linkPath" | Out-Null
    }
}

function Ensure-PluginLink([string]$profileDir, $plugin) {
    $name = $plugin.Name
    $targetPath = $plugin.Dir
    $spec = 'link:' + $targetPath.Replace([char]92, [char]47)
    $rel = 'link:' + (Get-RelativeLinkPath $profileDir $targetPath)
    $linkPath = Join-Path (Join-Path $profileDir 'node_modules') ($name.Replace('/', '\'))
    $linkState = Get-LinkState $linkPath $targetPath
    if ($linkState -ne 'ok') {
        if ($linkState -ne 'missing') { Remove-Link $linkPath }
        $parent = Split-Path -Parent $linkPath
        if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
        New-Item -ItemType Junction -Path $linkPath -Target $targetPath | Out-Null
    }
    foreach ($lockPath in @((Join-Path $profileDir 'pnpm-lock.yaml'), (Join-Path $profileDir 'node_modules/.pnpm/lock.yaml'))) {
        if (-not (Test-Path -LiteralPath $lockPath)) { continue }
        $lockText = [System.IO.File]::ReadAllText($lockPath)
        if ($lockText -notmatch [regex]::Escape($spec)) { [void](Repair-Lock $lockPath $name $spec $rel) }
    }
}

function Backup-Profile([string]$profileName, [string]$profileDir) {
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $dest = Join-Path $recoveryRoot ("restore-$stamp-$profileName")
    $suffix = 1
    while (Test-Path -LiteralPath $dest) {
        $dest = Join-Path $recoveryRoot ("restore-$stamp-$profileName-$suffix")
        $suffix++
    }
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    foreach ($name in @('package.json', 'cordis.patch.yml', 'pnpm-lock.yaml', 'pnpm-workspace.yaml')) {
        $source = Join-Path $profileDir $name
        if (Test-Path -LiteralPath $source) {
            Copy-Item -LiteralPath $source -Destination (Join-Path $dest $name) -Force
        }
    }
    $note = "Резервная копия профиля '$profileName' перед восстановлением из profile/$profileName." + $newLine + 'Создана: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '.' + $newLine
    Write-Text (Join-Path $dest 'README.txt') $note
    return $dest
}

function Invoke-Capture([string]$profileName) {
    $profileDir = Join-Path $ProfilesRoot $profileName
    $pkgPath = Join-Path $profileDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkgPath)) {
        Write-Host "Профиль '$profileName' не найден: $pkgPath" -ForegroundColor Yellow
        return
    }
    $pkg = Read-Json $pkgPath
    if (-not $pkg -or -not $pkg.dsh -or -not $pkg.dsh.profile) {
        throw "В $pkgPath нет dsh.profile — это не профиль DSH."
    }

    $snapshotDir = Join-Path $snapshotRoot $profileName
    New-Item -ItemType Directory -Force -Path $snapshotDir | Out-Null

    $snapshot = [ordered]@{
        schema = 1
        profile = $profileName
        dshVersion = Get-DshVersion
        plugins = @($script:Plugins | ForEach-Object { $_.Name })
        bundles = @($pkg.dsh.profile.bundles)
    }

    $remote = [ordered]@{}
    if ($pkg.PSObject.Properties['dependencies']) {
        foreach ($dep in $pkg.dependencies.PSObject.Properties) {
            if ($dep.Name -like '@local/*') { continue }
            $spec = [string]$dep.Value
            if ($spec -like 'link:*') { continue }
            $remote[$dep.Name] = $spec
        }
    }
    if ($remote.Count -gt 0) { $snapshot['remoteDependencies'] = $remote }

    $patchSource = Join-Path $profileDir 'cordis.patch.yml'
    $patchTarget = Join-Path $snapshotDir 'cordis.patch.yml'
    $patchText = $null
    if (Test-Path -LiteralPath $patchSource) {
        $patchText = Read-Text $patchSource
        Assert-PatchSafe $patchText $patchSource
        Assert-PatchPortable $patchText $patchSource
    }

    # Пишем снимок только после проверки: при найденном секрете ничего не
    # остаётся в profile/<profile>.
    Write-Json (Join-Path $snapshotDir 'profile.json') $snapshot
    if ($null -ne $patchText) {
        Write-Text $patchTarget $patchText
    } elseif (Test-Path -LiteralPath $patchTarget) {
        Remove-Item -LiteralPath $patchTarget -Force
    }

    Write-Host "Снимок профиля '$profileName' сохранён: $snapshotDir" -ForegroundColor Green
    $settingsState = 'нет'
    if (Test-Path -LiteralPath $patchTarget) { $settingsState = 'cordis.patch.yml' }
    Write-Host ("  bundles: {0}; локальных плагинов: {1}; настройки: {2}" -f @($snapshot.bundles).Count, @($snapshot.plugins).Count, $settingsState) -ForegroundColor DarkGray
}

function Invoke-Restore([string]$profileName) {
    $snapshotDir = Join-Path $snapshotRoot $profileName
    $snapshotPath = Join-Path $snapshotDir 'profile.json'
    if (-not (Test-Path -LiteralPath $snapshotPath)) {
        throw "Нет снимка профиля '$profileName': $snapshotPath. Сначала сделайте -Capture на исходной машине."
    }
    $snapshot = Read-Json $snapshotPath
    if (-not $snapshot -or -not $snapshot.bundles) {
        throw "Снимок $snapshotPath не содержит списка bundles."
    }

    $profileDir = Join-Path $ProfilesRoot $profileName
    $pkgPath = Join-Path $profileDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkgPath)) {
        throw "Профиль '$profileName' ещё не создан. Запустите DSH один раз, закройте его и повторите -Restore."
    }

    $running = @(Get-Process -Name 'DeepSeek Harness' -ErrorAction SilentlyContinue)
    if ($running.Count -gt 0) {
        Write-Warning 'DSH сейчас запущен. Настройки применятся после перезапуска; чтобы не спорить с приложением за профиль, лучше закрыть DSH.'
    }

    $pkg = Read-Json $pkgPath
    if (-not $pkg -or -not $pkg.dsh -or -not $pkg.dsh.profile) {
        throw "В $pkgPath нет dsh.profile — это не профиль DSH."
    }

    $backup = Backup-Profile $profileName $profileDir
    Write-Host "Профиль '$profileName': резервная копия $backup" -ForegroundColor DarkGray

    if (-not $pkg.PSObject.Properties['dependencies']) {
        $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue (New-Object psobject)
    }
    foreach ($plugin in $script:Plugins) {
        $spec = 'link:' + $plugin.Dir.Replace([char]92, [char]47)
        $pkg.dependencies | Add-Member -NotePropertyName $plugin.Name -NotePropertyValue $spec -Force
    }
    if ($snapshot.PSObject.Properties['remoteDependencies']) {
        foreach ($dep in $snapshot.remoteDependencies.PSObject.Properties) {
            if (-not $pkg.dependencies.PSObject.Properties[$dep.Name]) {
                $pkg.dependencies | Add-Member -NotePropertyName $dep.Name -NotePropertyValue ([string]$dep.Value)
            }
        }
    }

    $current = @($pkg.dsh.profile.bundles)
    $validated = @()
    $skipped = @()
    foreach ($name in @($snapshot.bundles)) {
        if (-not $name) { continue }
        $name = [string]$name
        if ($validated -contains $name) { continue }
        if (Test-BundleAvailable $name $profileDir) {
            $validated += $name
        } else {
            $skipped += $name
        }
    }

    $result = @($validated)
    if (-not $Exact) {
        foreach ($name in $current) {
            if ([string]$name -like '@local/*') { continue }
            if ($result -notcontains $name) { $result += $name }
        }
    }
    foreach ($required in (Get-RequiredBundles $profileName)) {
        if ($result -notcontains $required) {
            if (Test-BundleAvailable $required $profileDir) {
                $result = @($required) + $result
                Write-Host "  [base] добавлен обязательный bundle $required" -ForegroundColor DarkGray
            } else {
                Write-Warning "Обязательный bundle $required не найден в текущей установке DSH."
            }
        }
    }
    if ($result.Count -eq 0) { throw 'После проверки не осталось ни одного bundle — восстановление остановлено.' }

    $pkg.dsh.profile.bundles = @($result)
    Write-Json $pkgPath $pkg

    $snapshotPatch = Join-Path $snapshotDir 'cordis.patch.yml'
    if (Test-Path -LiteralPath $snapshotPatch) {
        $patchText = Read-Text $snapshotPatch
        Write-Text (Join-Path $profileDir 'cordis.patch.yml') $patchText
        Write-Host '  [settings] cordis.patch.yml восстановлен' -ForegroundColor DarkGray
    } else {
        Write-Warning 'В снимке нет cordis.patch.yml — настройки профиля не изменены.'
    }

    foreach ($plugin in $script:Plugins) {
        Ensure-PluginLink $profileDir $plugin
    }

    $enabledLocal = @($result | Where-Object { [string]$_ -like '@local/*' }).Count
    Write-Host "Профиль '$profileName' восстановлен: bundles $($result.Count), локальных включено $enabledLocal." -ForegroundColor Green
    if ($skipped.Count -gt 0) {
        Write-Warning ('Пропущены недоступные в этой версии DSH bundles: ' + ($skipped -join ', '))
    }
    $snapshotVersion = [string]$snapshot.dshVersion
    if ($snapshotVersion -and $snapshotVersion -ne 'unknown') {
        $currentVersion = Get-DshVersion
        if ($currentVersion -ne 'unknown' -and $snapshotVersion -ne $currentVersion) {
            Write-Warning "Снимок снят на DSH $snapshotVersion, сейчас $currentVersion. Проверьте страницу «Плагины» после запуска."
        }
    }
    Write-Host 'Перезапустите DSH, чтобы состав плагинов и настройки применились.' -ForegroundColor Yellow
}

# ---------------------------------------------------------------------------
# Режимы
# ---------------------------------------------------------------------------

$script:Plugins = @(Get-LocalPlugins)
Write-Host "Плагинов в каталоге: $($script:Plugins.Count)" -ForegroundColor Cyan

if ($Capture) {
    foreach ($profileName in $Profile) { Invoke-Capture $profileName }
    exit 0
}

if ($Restore) {
    foreach ($profileName in $Profile) { Invoke-Restore $profileName }
    exit 0
}

# ---------------------------------------------------------------------------
# Обычная проверка/починка профиля
# ---------------------------------------------------------------------------

$problems = 0
$repaired = 0

foreach ($profileName in $Profile) {
    $profileDir = Join-Path $ProfilesRoot $profileName
    $pkgPath = Join-Path $profileDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkgPath)) {
        Write-Host "Профиль '$profileName' не найден: $pkgPath" -ForegroundColor Yellow
        continue
    }

    Write-Host ''
    Write-Host "Профиль: $profileName ($profileDir)" -ForegroundColor Cyan
    $json = Read-Json $pkgPath
    $dirty = $false

    $snapshot = $null
    $snapshotBundles = @()
    $snapshotPlugins = @()
    $snapshotPath = Join-Path $snapshotRoot (Join-Path $profileName 'profile.json')
    if (Test-Path -LiteralPath $snapshotPath) {
        $snapshot = Read-Json $snapshotPath
        if ($snapshot) {
            $snapshotBundles = @($snapshot.bundles)
            $snapshotPlugins = @($snapshot.plugins)
        }
    }

    foreach ($plugin in $script:Plugins) {
        $name = $plugin.Name
        $targetPath = $plugin.Dir
        $spec = 'link:' + $targetPath.Replace([char]92, [char]47)
        $rel = 'link:' + (Get-RelativeLinkPath $profileDir $targetPath)
        $linkPath = Join-Path (Join-Path $profileDir 'node_modules') ($name.Replace('/', '\'))
        $status = @()

        $dep = $null
        if ($json.PSObject.Properties['dependencies']) {
            $prop = $json.dependencies.PSObject.Properties[$name]
            if ($prop) { $dep = $prop.Value }
        }
        $bundles = @()
        if ($json.PSObject.Properties['dsh'] -and $json.dsh.profile) { $bundles = @($json.dsh.profile.bundles) }

        if ($dep -ne $spec) {
            $status += "зависимость: '$dep' -> '$spec'"
            if ($Fix) {
                if (-not $json.PSObject.Properties['dependencies']) {
                    $json | Add-Member -NotePropertyName dependencies -NotePropertyValue (New-Object psobject)
                }
                $json.dependencies | Add-Member -NotePropertyName $name -NotePropertyValue $spec -Force
                $dirty = $true
            }
        }

        # Снимок — источник истины о том, включён ли локальный плагин. Новый
        # плагин, которого в снимке ещё нет, добавляем и просим сделать -Capture.
        $shouldEnable = $true
        $isNewSinceSnapshot = $false
        if ($snapshot) {
            if ($snapshotPlugins.Count -gt 0 -and $snapshotPlugins -notcontains $name) {
                $isNewSinceSnapshot = $true
            } else {
                $shouldEnable = $snapshotBundles -contains $name
            }
        }

        if ($shouldEnable -and $bundles -notcontains $name) {
            if ($isNewSinceSnapshot) { $status += 'новый плагин, добавлен в bundles' }
            else { $status += 'нет в dsh.profile.bundles' }
            if ($Fix) {
                $json.dsh.profile.bundles = @($bundles + $name)
                $dirty = $true
            }
        } elseif (-not $shouldEnable -and $bundles -contains $name) {
            Write-Host "  [снимок] $name выключен в снимке, но включён в профиле (не трогаю)" -ForegroundColor DarkYellow
        }

        $linkState = Get-LinkState $linkPath $targetPath
        if ($linkState -ne 'ok') {
            $status += "junction: $linkState"
            if ($Fix) {
                if ($linkState -ne 'missing') { Remove-Link $linkPath }
                $parent = Split-Path -Parent $linkPath
                if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
                New-Item -ItemType Junction -Path $linkPath -Target $targetPath | Out-Null
            }
        }

        $locks = @((Join-Path $profileDir 'pnpm-lock.yaml'), (Join-Path $profileDir 'node_modules/.pnpm/lock.yaml'))
        foreach ($lockPath in $locks) {
            if (-not (Test-Path -LiteralPath $lockPath)) { continue }
            $lockText = [System.IO.File]::ReadAllText($lockPath)
            if ($lockText -notmatch [regex]::Escape($spec)) {
                $status += "lock: $([System.IO.Path]::GetFileName($lockPath)) устарел"
                if ($Fix) { [void](Repair-Lock $lockPath $name $spec $rel) }
            }
        }

        if ($status.Count -eq 0) {
            Write-Host "  [ok]   $name" -ForegroundColor Green
        } else {
            $problems++
            if ($Fix) { $label = 'fixed'; $color = 'Yellow'; $repaired++ }
            else { $label = 'ПРОБЛЕМА'; $color = 'Red' }
            Write-Host "  [$label] $name" -ForegroundColor $color
            foreach ($s in $status) { Write-Host "         $s" -ForegroundColor $color }
        }
    }

    if ($Fix -and $dirty) {
        Write-Json $pkgPath $json
        Write-Host '  [fix]  package.json перезаписан' -ForegroundColor Yellow
    }

    # Плагины, объявленные в профиле, но отсутствующие на диске.
    if ($json.PSObject.Properties['dependencies']) {
        foreach ($depProp in $json.dependencies.PSObject.Properties) {
            if ($depProp.Value -notlike 'link:*') { continue }
            $path = $depProp.Value.Substring(5)
            if (-not (Test-Path -LiteralPath $path)) {
                $problems++
                Write-Host "  [ПРОБЛЕМА] $($depProp.Name): каталог не найден $path" -ForegroundColor Red
            }
        }
    }

    if ($snapshot) {
        $currentBundles = @($json.dsh.profile.bundles)
        $onlySnapshot = @($snapshotBundles | Where-Object { $currentBundles -notcontains $_ })
        $onlyCurrent = @($currentBundles | Where-Object { $snapshotBundles -notcontains $_ })
        if ($onlySnapshot.Count -gt 0 -or $onlyCurrent.Count -gt 0) {
            $currentText = '—'
            if ($onlyCurrent.Count -gt 0) { $currentText = $onlyCurrent -join ', ' }
            $snapshotText = '—'
            if ($onlySnapshot.Count -gt 0) { $snapshotText = $onlySnapshot -join ', ' }
            Write-Host ("  [снимок] расхождения: в снимке нет " + $currentText + '; в профиле нет ' + $snapshotText) -ForegroundColor DarkGray
        }
        $snapshotPatch = Join-Path (Join-Path $snapshotRoot $profileName) 'cordis.patch.yml'
        $profilePatch = Join-Path $profileDir 'cordis.patch.yml'
        if ((Test-Path -LiteralPath $snapshotPatch) -and (Test-Path -LiteralPath $profilePatch)) {
            $a = (Read-Text $snapshotPatch) -replace '\r\n', [string][char]10
            $b = (Read-Text $profilePatch) -replace '\r\n', [string][char]10
            if ($a -ne $b) {
                Write-Host '  [снимок] cordis.patch.yml отличается от снимка: после правок выполните -Capture' -ForegroundColor DarkGray
            }
        }
    }
}

Write-Host ''
if ($problems -eq 0) {
    Write-Host 'Всё согласовано.' -ForegroundColor Green
    exit 0
}
if ($Fix) {
    Write-Host "Исправлено плагинов: $repaired. Перезапусти DSH." -ForegroundColor Yellow
    exit 0
}
Write-Host "Расхождений: $problems. Запусти с -Fix, чтобы исправить." -ForegroundColor Red
exit 1
