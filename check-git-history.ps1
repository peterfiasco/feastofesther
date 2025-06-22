# Git History Size Analyzer
# This script checks the git history for large objects that may be causing push issues

Write-Host "=== Git History Analysis ===" -ForegroundColor Green
Write-Host ""

# Check git repository size
Write-Host "Checking git repository size..." -ForegroundColor Yellow
$gitDir = ".git"
if (Test-Path $gitDir) {
    $gitSize = (Get-ChildItem $gitDir -Recurse | Measure-Object -Property Length -Sum).Sum
    $gitSizeMB = [math]::Round($gitSize / 1MB, 2)
    Write-Host "Git repository (.git folder) size: $gitSizeMB MB" -ForegroundColor Cyan
} else {
    Write-Host "No .git folder found!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "=== LARGEST OBJECTS IN GIT HISTORY ===" -ForegroundColor Red
Write-Host ""

# Find largest objects in git history
try {
    $largeObjects = git rev-list --objects --all | 
        ForEach-Object { 
            $parts = $_ -split ' ', 2
            if ($parts.Length -eq 2) {
                $hash = $parts[0]
                $file = $parts[1]
                try {
                    $size = git cat-file -s $hash 2>$null
                    if ($size -and $size -gt 100000) {  # Only show files > 100KB
                        [PSCustomObject]@{
                            Hash = $hash
                            File = $file
                            SizeBytes = [int]$size
                            SizeMB = [math]::Round([int]$size / 1MB, 2)
                        }
                    }
                } catch {
                    # Skip objects that can't be sized
                }
            }
        } | Sort-Object SizeBytes -Descending | Select-Object -First 20

    if ($largeObjects) {
        $largeObjects | Format-Table File, SizeMB, Hash -AutoSize
        
        Write-Host ""
        Write-Host "=== SUMMARY ===" -ForegroundColor Yellow
        $totalLargeSize = ($largeObjects | Measure-Object SizeBytes -Sum).Sum
        $totalLargeMB = [math]::Round($totalLargeSize / 1MB, 2)
        Write-Host "Total size of large objects in history: $totalLargeMB MB"
        Write-Host "Number of large objects (>100KB): $($largeObjects.Count)"
    } else {
        Write-Host "No large objects found in git history." -ForegroundColor Green
    }
} catch {
    Write-Host "Error analyzing git history: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== PACK FILE ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""

# Check pack files
$packDir = ".git\objects\pack"
if (Test-Path $packDir) {
    $packFiles = Get-ChildItem $packDir -Filter "*.pack"
    if ($packFiles) {
        Write-Host "Pack files found:"
        foreach ($pack in $packFiles) {
            $packSizeMB = [math]::Round($pack.Length / 1MB, 2)
            Write-Host "  $($pack.Name): $packSizeMB MB"
        }
        
        $totalPackSize = ($packFiles | Measure-Object Length -Sum).Sum
        $totalPackMB = [math]::Round($totalPackSize / 1MB, 2)
        Write-Host "Total pack size: $totalPackMB MB" -ForegroundColor Yellow
    } else {
        Write-Host "No pack files found."
    }
} else {
    Write-Host "No pack directory found."
}

Write-Host ""
Write-Host "=== RECOMMENDATIONS ===" -ForegroundColor Yellow
Write-Host ""

if ($gitSizeMB -gt 50) {
    Write-Host "• Your git repository is quite large ($gitSizeMB MB)" -ForegroundColor Red
    Write-Host "• This suggests large files were committed in the past" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "SOLUTIONS:" -ForegroundColor Green
    Write-Host "1. Use BFG Repo-Cleaner to remove large files from history:" -ForegroundColor White
    Write-Host "   Download from: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor Gray
    Write-Host "   java -jar bfg.jar --strip-blobs-bigger-than 10M ." -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Use git filter-branch (more complex):" -ForegroundColor White
    Write-Host "   git filter-branch --tree-filter 'rm -rf path/to/large/files' HEAD" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Create a fresh repository (nuclear option):" -ForegroundColor White
    Write-Host "   - Create new repo" -ForegroundColor Gray
    Write-Host "   - Copy current files (not .git)" -ForegroundColor Gray
    Write-Host "   - Commit fresh" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Use git-lfs for large files going forward:" -ForegroundColor White
    Write-Host "   git lfs track '*.jpg' '*.png' '*.zip'" -ForegroundColor Gray
} elseif ($gitSizeMB -gt 20) {
    Write-Host "• Your git repository is moderately large ($gitSizeMB MB)" -ForegroundColor Yellow
    Write-Host "• Consider cleaning up if push issues persist" -ForegroundColor Yellow
} else {
    Write-Host "• Your git repository size looks reasonable ($gitSizeMB MB)" -ForegroundColor Green
    Write-Host "• The push issue might be network-related or temporary" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== IMMEDIATE ACTIONS ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "Try these commands to optimize the repository:" -ForegroundColor White
Write-Host "git gc --aggressive --prune=now" -ForegroundColor Gray
Write-Host "git repack -ad" -ForegroundColor Gray
Write-Host ""
Write-Host "To check current push size:" -ForegroundColor White
Write-Host "git count-objects -vH" -ForegroundColor Gray