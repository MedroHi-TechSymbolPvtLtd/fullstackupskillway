# PowerShell script to compare feature branch with main

param(
    [string]$FeatureBranch = "feature/new-changes",
    [string]$MainBranch = "main"
)

Write-Host "=== Comparing $FeatureBranch with $MainBranch ===" -ForegroundColor Cyan
Write-Host ""

# Check if branches exist
$featureExists = git branch --list $FeatureBranch
$mainExists = git branch --list $MainBranch

if (-not $featureExists) {
    Write-Host "Error: Feature branch '$FeatureBranch' does not exist!" -ForegroundColor Red
    exit 1
}

if (-not $mainExists) {
    Write-Host "Error: Main branch '$MainBranch' does not exist!" -ForegroundColor Red
    exit 1
}

# 1. Show file statistics
Write-Host "1. File Change Statistics:" -ForegroundColor Yellow
git diff $MainBranch..$FeatureBranch --stat
Write-Host ""

# 2. Show list of changed files
Write-Host "2. Changed Files:" -ForegroundColor Yellow
git diff $MainBranch..$FeatureBranch --name-status
Write-Host ""

# 3. Show commit differences
Write-Host "3. Commit Differences:" -ForegroundColor Yellow
git log $MainBranch..$FeatureBranch --oneline
Write-Host ""

# 4. Ask if user wants to see detailed diff
$response = Read-Host "Do you want to see detailed differences? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "4. Detailed Differences:" -ForegroundColor Yellow
    git diff $MainBranch..$FeatureBranch
}

Write-Host ""
Write-Host "=== Comparison Complete ===" -ForegroundColor Green






