# PowerShell Script zum Hinzufuegen von Games via API
# Konfiguration
$apiBase = "http://localhost:8080/api"
$username = "admin_user"
$password = "password123"

# Funktion zum Anmelden und JWT-Token erhalten
function Get-JwtToken {
    param(
        [string]$user,
        [string]$pass
    )

    $loginUrl = "$apiBase/auth/signin"
    $body = @{
        username = $user
        password = $pass
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri $loginUrl `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing

        $data = $response.Content | ConvertFrom-Json
        return $data.token
    }
    catch {
        Write-Host "Fehler beim Login: $_" -ForegroundColor Red
        return $null
    }
}

# Funktion zum Hinzufuegen eines Games
function Add-Game {
    param(
        [string]$token,
        [string]$title,
        [int]$steamAppId,
        [int]$playtimeHours,
        [bool]$installed = $true,
        [string]$lastPlayed = $null
    )

    $gamesUrl = "$apiBase/games"

    $body = @{
        title = $title
        steamAppId = $steamAppId
        playtimeHours = $playtimeHours
        installed = $installed
        lastPlayed = $lastPlayed
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    try {
        $response = Invoke-WebRequest -Uri $gamesUrl `
            -Method POST `
            -Headers $headers `
            -Body $body `
            -UseBasicParsing

        Write-Host "OK: $title" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: $title - $_" -ForegroundColor Red
        return $false
    }
}

# Hauptskript
Write-Host "Logging in as '$username'..." -ForegroundColor Cyan
$token = Get-JwtToken -user $username -pass $password

if ($null -eq $token) {
    Write-Host "Login failed. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "Token received. Adding games..." -ForegroundColor Cyan
Write-Host ""

# Liste von Spielen zum Hinzufuegen
$games = @(
    @{ title = "Elden Ring"; steamAppId = 1091150; playtimeHours = 45; installed = $true; lastPlayed = "2026-03-10" },
    @{ title = "The Witcher 3"; steamAppId = 292030; playtimeHours = 120; installed = $true; lastPlayed = "2026-03-12" },
    @{ title = "Baldurs Gate 3"; steamAppId = 1238140; playtimeHours = 80; installed = $true; lastPlayed = "2026-03-13" },
    @{ title = "Starfield"; steamAppId = 1716740; playtimeHours = 35; installed = $false; lastPlayed = $null },
    @{ title = "Cyberpunk 2077"; steamAppId = 1091500; playtimeHours = 60; installed = $true; lastPlayed = "2026-03-08" },
    @{ title = "Dark Souls III"; steamAppId = 374320; playtimeHours = 95; installed = $true; lastPlayed = "2026-02-28" },
    @{ title = "Hollow Knight"; steamAppId = 367520; playtimeHours = 25; installed = $true; lastPlayed = "2026-03-05" },
    @{ title = "Stardew Valley"; steamAppId = 413150; playtimeHours = 150; installed = $true; lastPlayed = "2026-03-14" }
)

$successCount = 0
$failCount = 0

foreach ($game in $games) {
    $added = Add-Game -token $token `
        -title $game.title `
        -steamAppId $game.steamAppId `
        -playtimeHours $game.playtimeHours `
        -installed $game.installed `
        -lastPlayed $game.lastPlayed

    if ($added) {
        $successCount++
    } else {
        $failCount++
    }

    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Done! Success: $successCount, Failed: $failCount" -ForegroundColor Yellow
