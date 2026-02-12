# Activate Glassmorphism UI - Copy new screens
Write-Host "🎨 Activating Glassmorphism UI..." -ForegroundColor Cyan

$screens = @('TodayScreen', 'TrackScreen', 'AdhkarScreen')
$path = "C:\Users\pc\Desktop\Ihssan-tracker\src\screens"

foreach ($screen in $screens) {
    $source = Join-Path $path "$screen.new.tsx"
    $dest = Join-Path $path "$screen.tsx"
    
    if (Test-Path $source) {
        Copy-Item $source $dest -Force
        Write-Host "✅ Copied $screen" -ForegroundColor Green
    } else {
        Write-Host "❌ $screen.new.tsx not found" -ForegroundColor Red  
    }
}

Write-Host "`n🎉 Done! Reload your app to see the glassmorphism UI." -ForegroundColor Green
Write-Host "Press 'r' in the Expo terminal to reload." -ForegroundColor Yellow
