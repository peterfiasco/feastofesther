# Git Repository Size Analyzer
# This script analyzes the size of files tracked by git and identifies large files

Write-Host "=== Git Repository Size Analysis ===" -ForegroundColor Green
Write-Host ""

# Get all files tracked by git with their sizes
Write-Host "Analyzing files tracked by git..." -ForegroundColor Yellow
$gitFiles = git ls-files --cached

$fileAnalysis = @()

foreach ($file in $gitFiles) {
    if (Test-Path $file) {
        $fileInfo = Get-Item $file
        $sizeInMB = [math]::Round($fileInfo.Length / 1MB, 2)
        
        $fileAnalysis += [PSCustomObject]@{
            File = $file
            SizeBytes = $fileInfo.Length
            SizeMB = $sizeInMB
            Extension = $fileInfo.Extension
        }
    }
}

# Sort by size (largest first)
$sortedFiles = $fileAnalysis | Sort-Object SizeBytes -Descending

Write-Host ""
Write-Host "=== TOP 20 LARGEST FILES ===" -ForegroundColor Red
Write-Host ""
$sortedFiles | Select-Object -First 20 | Format-Table File, SizeMB, Extension -AutoSize

Write-Host ""
Write-Host "=== FILES OVER 1MB ===" -ForegroundColor Red
Write-Host ""
$largeFiles = $sortedFiles | Where-Object { $_.SizeMB -gt 1 }
if ($largeFiles.Count -gt 0) {
    $largeFiles | Format-Table File, SizeMB, Extension -AutoSize
    Write-Host "Total files over 1MB: $($largeFiles.Count)" -ForegroundColor Yellow
} else {
    Write-Host "No files over 1MB found." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== SIZE BY FILE TYPE ===" -ForegroundColor Cyan
Write-Host ""
$byExtension = $fileAnalysis | Group-Object Extension | ForEach-Object {
    [PSCustomObject]@{
        Extension = if ($_.Name -eq "") { "(no extension)" } else { $_.Name }
        Count = $_.Count
        TotalSizeMB = [math]::Round(($_.Group | Measure-Object SizeBytes -Sum).Sum / 1MB, 2)
        AvgSizeMB = [math]::Round((($_.Group | Measure-Object SizeBytes -Average).Average) / 1MB, 2)
    }
} | Sort-Object TotalSizeMB -Descending

$byExtension | Format-Table Extension, Count, TotalSizeMB, AvgSizeMB -AutoSize

Write-Host ""
Write-Host "=== TOTAL REPOSITORY SIZE ===" -ForegroundColor Green
$totalSizeMB = [math]::Round(($fileAnalysis | Measure-Object SizeBytes -Sum).Sum / 1MB, 2)
$totalFiles = $fileAnalysis.Count
Write-Host "Total files tracked: $totalFiles"
Write-Host "Total size: $totalSizeMB MB"

Write-Host ""
Write-Host "=== DIRECTORY ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""
$byDirectory = $fileAnalysis | ForEach-Object {
    $dir = Split-Path $_.File -Parent
    if ([string]::IsNullOrEmpty($dir)) { $dir = "(root)" }
    [PSCustomObject]@{
        Directory = $dir
        File = $_.File
        SizeBytes = $_.SizeBytes
    }
} | Group-Object Directory | ForEach-Object {
    [PSCustomObject]@{
        Directory = $_.Name
        FileCount = $_.Count
        TotalSizeMB = [math]::Round(($_.Group | Measure-Object SizeBytes -Sum).Sum / 1MB, 2)
    }
} | Sort-Object TotalSizeMB -Descending

$byDirectory | Format-Table Directory, FileCount, TotalSizeMB -AutoSize

Write-Host ""
Write-Host "=== RECOMMENDATIONS ===" -ForegroundColor Yellow
Write-Host ""

# Check for common large file patterns
$recommendations = @()

# Check for image files
$imageFiles = $sortedFiles | Where-Object { $_.Extension -match '\.(jpg|jpeg|png|gif|bmp|tiff)$' -and $_.SizeMB -gt 0.5 }
if ($imageFiles.Count -gt 0) {
    $recommendations += "• Found $($imageFiles.Count) image files over 0.5MB. Consider compressing or moving to external storage."
}

# Check for video/audio files
$mediaFiles = $sortedFiles | Where-Object { $_.Extension -match '\.(mp4|avi|mov|mp3|wav|flac)$' }
if ($mediaFiles.Count -gt 0) {
    $recommendations += "• Found $($mediaFiles.Count) media files. These should typically not be in git."
}

# Check for archive files
$archiveFiles = $sortedFiles | Where-Object { $_.Extension -match '\.(zip|rar|tar|gz|7z)$' }
if ($archiveFiles.Count -gt 0) {
    $recommendations += "• Found $($archiveFiles.Count) archive files. These should typically not be in git."
}

# Check for build artifacts
$buildFiles = $sortedFiles | Where-Object { $_.File -match '(build/|dist/|\.min\.)' }
if ($buildFiles.Count -gt 0) {
    $recommendations += "• Found $($buildFiles.Count) potential build artifacts. These should be in .gitignore."
}

# Check for log files
$logFiles = $sortedFiles | Where-Object { $_.Extension -match '\.(log|tmp|temp)$' }
if ($logFiles.Count -gt 0) {
    $recommendations += "• Found $($logFiles.Count) log/temp files. These should be in .gitignore."
}

if ($recommendations.Count -gt 0) {
    foreach ($rec in $recommendations) {
        Write-Host $rec -ForegroundColor Yellow
    }
} else {
    Write-Host "• Repository looks clean! No obvious large files detected." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== COMMANDS TO REMOVE LARGE FILES ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "To remove files from git (but keep locally):"
Write-Host "git rm --cached <filename>" -ForegroundColor White
Write-Host ""
Write-Host "To remove files completely:"
Write-Host "git rm <filename>" -ForegroundColor White
Write-Host ""
Write-Host "To add patterns to .gitignore:"
Write-Host "echo 'pattern' >> .gitignore" -ForegroundColor White