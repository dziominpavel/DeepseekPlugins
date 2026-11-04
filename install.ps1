#Requires -Version 5.1
<#
.SYNOPSIS
    Проверяет и восстанавливает связь профилей DSH с общим каталогом плагинов.

.DESCRIPTION
    Для каждого плагина из <Root>\plugins и каждого профиля из -Profile сверяет:
      - зависимость link:<абсолютный путь> в package.json профиля;
      - наличие пакета в dsh.profile.bundles;
      - цель junction в node_modules;
      - записи specifier/version в pnpm-lock.yaml.
    Без -Fix только сообщает о расхождениях, с -Fix приводит файлы в порядок.
    После -Fix перезапусти DSH: загруженные модули заменяются только новым поколением.

.PARAMETER Root
    Каталог с плагинами. По умолчанию C:\projects\dsh.

.PARAMETER Profile
    Профили DSH. По умолчанию desktop.

.PARAMETER Fix
    Внести исправления вместо отчёта.

.EXAMPLE
    .\install.ps1
    .\install.ps1 -Fix -Profile desktop,web
#>
[CmdletBinding()]
param(
    [string]$Root = 'C:/projects/dsh',
    [string[]]$Profile = @('desktop'),
    [switch]$Fix
)

$ErrorActionPreference = 'Stop'
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false } catch { }

$profilesRoot = Join-Path $env:USERPROFILE '.dsh/profiles'
$pluginsDir = Join-Path $Root 'plugins'
if (-not (Test-Path -LiteralPath $pluginsDir)) { throw "Нет каталога плагинов: $pluginsDir" }

$problems = 0
$repaired = 0

function Get-Manifest([string]$dir) {
    $path = Join-Path $dir 'package.json'
    if (-not (Test-Path -LiteralPath $path)) { return $null }
    Get-Content -LiteralPath $path -Raw -Encoding UTF8 | ConvertFrom-Json
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

$plugins = @()
foreach ($dir in Get-ChildItem -LiteralPath $pluginsDir -Directory) {
    $manifest = Get-Manifest $dir.FullName
    if (-not $manifest -or -not $manifest.name) {
        Write-Host "  [skip] $($dir.Name): нет имени пакета" -ForegroundColor DarkGray
        continue
    }
    $plugins += New-Object psobject -Property @{ Name = $manifest.name; Dir = $dir.FullName }
}

Write-Host "Плагинов в каталоге: $($plugins.Count)" -ForegroundColor Cyan

foreach ($prof in $Profile) {
    $profileDir = Join-Path $profilesRoot $prof
    $pkgPath = Join-Path $profileDir 'package.json'
    if (-not (Test-Path -LiteralPath $pkgPath)) {
        Write-Host "Профиль '$prof' не найден: $pkgPath" -ForegroundColor Yellow
        continue
    }

    Write-Host ""
    Write-Host "Профиль: $prof ($profileDir)" -ForegroundColor Cyan
    $json = Get-Content -LiteralPath $pkgPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $dirty = $false

    foreach ($plugin in $plugins) {
        $name = $plugin.Name
        $targetPath = $plugin.Dir
        $spec = 'link:' + $targetPath.Replace([char]92, [char]47)
        $rel = 'link:' + (Get-RelativeLinkPath $profileDir $targetPath)
        $linkPath = Join-Path (Join-Path $profileDir 'node_modules') $name
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

        if ($bundles -notcontains $name) {
            $status += "нет в dsh.profile.bundles"
            if ($Fix) {
                $json.dsh.profile.bundles = @($bundles + $name)
                $dirty = $true
            }
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
        $out = $json | ConvertTo-Json -Depth 20
        [System.IO.File]::WriteAllText($pkgPath, $out + [Environment]::NewLine)
        Write-Host "  [fix]  package.json перезаписан" -ForegroundColor Yellow
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
}

Write-Host ""
if ($problems -eq 0) {
    Write-Host "Всё согласовано." -ForegroundColor Green
    exit 0
}
if ($Fix) {
    Write-Host "Исправлено плагинов: $repaired. Перезапусти DSH." -ForegroundColor Yellow
    exit 0
}
Write-Host "Расхождений: $problems. Запусти с -Fix, чтобы исправить." -ForegroundColor Red
exit 1
