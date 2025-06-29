Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"
Write-Host "Frontend starting..."
Start-Sleep 5
$response = try { Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 5 } catch { $null }
if ($response) {
    Write-Host "✅ Frontend is running successfully"
} else {
    Write-Host "❌ Frontend failed to start or is not responding"
}
