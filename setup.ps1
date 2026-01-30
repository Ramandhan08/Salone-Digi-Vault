# 🚀 Quick Setup Script for Salone Digital Vault

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Salone Digital Vault - Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    
    # Create .env.local with super admin credentials
    @"
# SUPER ADMIN CREDENTIALS
# IMPORTANT: Change these immediately!
SUPER_ADMIN_EMAIL=admin@salonedigitalvault.com
SUPER_ADMIN_PASSWORD=ChangeThisPassword123!

# Email Configuration (Optional for development)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@salonedigitalvault.com

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=dev-secret-key-change-in-production
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔐 SUPER ADMIN CREDENTIALS" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Email: admin@salonedigitalvault.com" -ForegroundColor Yellow
Write-Host "Password: ChangeThisPassword123!" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  CHANGE THESE IN .env.local IMMEDIATELY!" -ForegroundColor Red
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "📦 Installing Dependencies..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Login: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "  Email: admin@salonedigitalvault.com" -ForegroundColor Yellow
Write-Host "  Password: ChangeThisPassword123!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Read ADMIN_SECURITY.md for security details" -ForegroundColor Cyan
Write-Host ""
