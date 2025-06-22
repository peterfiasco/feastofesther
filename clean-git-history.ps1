# Git History Cleanup Script
# This script will clean up the git history to remove large files permanently

Write-Host "=== Git History Cleanup ===" -ForegroundColor Green
Write-Host ""

Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Red
Write-Host "Make sure you have a backup before proceeding." -ForegroundColor Yellow
Write-Host ""

# Check current size
Write-Host "Current repository size:" -ForegroundColor Cyan
git count-objects -vH

Write-Host ""
Write-Host "=== STEP 1: Garbage Collection ===" -ForegroundColor Yellow
Write-Host "Running aggressive garbage collection..."

# Run garbage collection
git gc --aggressive --prune=now

Write-Host ""
Write-Host "After garbage collection:" -ForegroundColor Cyan
git count-objects -vH

Write-Host ""
Write-Host "=== STEP 2: Repack Repository ===" -ForegroundColor Yellow
Write-Host "Repacking repository..."

# Repack the repository
git repack -ad

Write-Host ""
Write-Host "After repacking:" -ForegroundColor Cyan
git count-objects -vH

Write-Host ""
Write-Host "=== STEP 3: Prune Unreachable Objects ===" -ForegroundColor Yellow
Write-Host "Pruning unreachable objects..."

# Prune unreachable objects
git prune --expire=now

Write-Host ""
Write-Host "After pruning:" -ForegroundColor Cyan
git count-objects -vH

Write-Host ""
Write-Host "=== FINAL REPOSITORY SIZE ===" -ForegroundColor Green
$gitDir = ".git"
if (Test-Path $gitDir) {
    $gitSize = (Get-ChildItem $gitDir -Recurse | Measure-Object -Property Length -Sum).Sum
    $gitSizeMB = [math]::Round($gitSize / 1MB, 2)
    Write-Host "Git repository (.git folder) size: $gitSizeMB MB" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "1. Try pushing again: git push" -ForegroundColor White
Write-Host "2. If still too large, consider using BFG Repo-Cleaner" -ForegroundColor White
Write-Host "3. Or create a fresh repository as last resort" -ForegroundColor White