# May Tinh Tran Anh Frontend Startup Script
Write-Host "🚀 Starting May Tinh Tran Anh Frontend..." -ForegroundColor Green
Write-Host ""

# Change to frontend directory
$frontendPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $frontendPath
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Cyan

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Start development server
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Magenta
npm run dev
