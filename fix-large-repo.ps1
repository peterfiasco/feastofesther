# Fix Large Repository - Ultimate Solution
# This script provides options to fix the large repository issue

Write-Host "=== Repository Size Fix Options ===" -ForegroundColor Green
Write-Host ""

Write-Host "Current repository size: 944 MB" -ForegroundColor Red
Write-Host "This is too large for most git hosting services." -ForegroundColor Yellow
Write-Host ""

Write-Host "=== OPTION 1: BFG Repo-Cleaner (Recommended) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "BFG Repo-Cleaner can remove large files from git history." -ForegroundColor White
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Download BFG from: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Gray
Write-Host "2. Make sure you have Java installed" -ForegroundColor Gray
Write-Host "3. Run these commands:" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Remove files larger than 10MB from history" -ForegroundColor Green
Write-Host "   java -jar bfg.jar --strip-blobs-bigger-than 10M ." -ForegroundColor White
Write-Host ""
Write-Host "   # Remove specific file types from history" -ForegroundColor Green
Write-Host "   java -jar bfg.jar --delete-files '*.{zip,jpg,JPG,png,PNG}' ." -ForegroundColor White
Write-Host ""
Write-Host "   # Clean up after BFG" -ForegroundColor Green
Write-Host "   git reflog expire --expire=now --all && git gc --prune=now --aggressive" -ForegroundColor White
Write-Host ""

Write-Host "=== OPTION 2: Fresh Repository (Nuclear Option) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Create a completely new repository with current files only." -ForegroundColor White
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "1. Create backup of current files (excluding .git)" -ForegroundColor Gray
Write-Host "2. Delete .git folder" -ForegroundColor Gray
Write-Host "3. Initialize new git repository" -ForegroundColor Gray
Write-Host "4. Add and commit current files" -ForegroundColor Gray
Write-Host ""
Write-Host "Commands:" -ForegroundColor Green
Write-Host "   # Backup current files" -ForegroundColor Gray
Write-Host "   robocopy . ..\feast-of-esther-backup /E /XD .git" -ForegroundColor White
Write-Host ""
Write-Host "   # Remove git history" -ForegroundColor Gray
Write-Host "   Remove-Item -Recurse -Force .git" -ForegroundColor White
Write-Host ""
Write-Host "   # Initialize fresh repository" -ForegroundColor Gray
Write-Host "   git init" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Initial commit - clean repository'" -ForegroundColor White
Write-Host ""
Write-Host "   # Add remote and push" -ForegroundColor Gray
Write-Host "   git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main --force" -ForegroundColor White
Write-Host ""

Write-Host "=== OPTION 3: Git LFS (For Future) ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Use Git Large File Storage for large files going forward." -ForegroundColor White
Write-Host ""
Write-Host "Commands:" -ForegroundColor Green
Write-Host "   git lfs install" -ForegroundColor White
Write-Host "   git lfs track '*.jpg' '*.png' '*.zip' '*.pdf'" -ForegroundColor White
Write-Host "   git add .gitattributes" -ForegroundColor White
Write-Host ""

Write-Host "=== RECOMMENDATION ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "For fastest solution: Use OPTION 2 (Fresh Repository)" -ForegroundColor Green
Write-Host "- Your current files are only 1.23 MB" -ForegroundColor White
Write-Host "- The 944 MB is just git history of deleted files" -ForegroundColor White
Write-Host "- A fresh repo will be tiny and push instantly" -ForegroundColor White
Write-Host ""
Write-Host "Would you like me to create the fresh repository script? (Y/N)" -ForegroundColor Cyan