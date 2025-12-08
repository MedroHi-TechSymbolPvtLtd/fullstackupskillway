# PowerShell script to merge feature branch into main

param(
    [string]$FeatureBranch = "feature/new-changes",
    [string]$MainBranch = "main"
)

Write-Host "=== Merging $FeatureBranch into $MainBranch ===" -ForegroundColor Cyan
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "Warning: You have uncommitted changes!" -ForegroundColor Red
    Write-Host "Please commit or stash your changes first." -ForegroundColor Red
    exit 1
}

# Switch to main branch
Write-Host "Switching to $MainBranch branch..." -ForegroundColor Yellow
git checkout $MainBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to switch to $MainBranch!" -ForegroundColor Red
    exit 1
}

# Pull latest changes
Write-Host "Pulling latest changes from remote..." -ForegroundColor Yellow
git pull origin $MainBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Failed to pull latest changes. Continuing anyway..." -ForegroundColor Yellow
}

# Show what will be merged
Write-Host ""
Write-Host "Changes to be merged:" -ForegroundColor Yellow
git log $MainBranch..$FeatureBranch --oneline
Write-Host ""

# Ask for confirmation
$response = Read-Host "Do you want to proceed with the merge? (y/n)"
if ($response -ne 'y' -and $response -ne 'Y') {
    Write-Host "Merge cancelled." -ForegroundColor Yellow
    exit 0
}

# Merge feature branch
Write-Host "Merging $FeatureBranch into $MainBranch..." -ForegroundColor Yellow
git merge $FeatureBranch --no-ff -m "Merge $FeatureBranch into $MainBranch"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Merge failed! There may be conflicts." -ForegroundColor Red
    Write-Host "Please resolve conflicts and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Merge successful!" -ForegroundColor Green
Write-Host ""

# Ask if user wants to push
$pushResponse = Read-Host "Do you want to push to remote? (y/n)"
if ($pushResponse -eq 'y' -or $pushResponse -eq 'Y') {
    Write-Host "Pushing to remote..." -ForegroundColor Yellow
    git push origin $MainBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed to remote!" -ForegroundColor Green
    } else {
        Write-Host "Error: Failed to push to remote." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Merge Complete ===" -ForegroundColor Green






