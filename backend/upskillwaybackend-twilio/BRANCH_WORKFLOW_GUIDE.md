# Git Branch Workflow Guide

## Current Setup
- **Main Branch**: `main` (your production-ready code)
- **Feature Branch**: `feature/new-changes` (for your new changes)

## Workflow Steps

### 1. Make Changes on Feature Branch
You're currently on `feature/new-changes`. Make your changes here:

```bash
# You're already on feature/new-changes
# Make your code changes
# Then commit them:
git add .
git commit -m "Your commit message"
```

### 2. Compare Feature Branch with Main
Compare your feature branch with main to see differences:

```bash
# See what files are different
git diff main..feature/new-changes --name-status

# See detailed differences
git diff main..feature/new-changes

# See commit differences
git log main..feature/new-changes

# See a summary of changes
git diff main..feature/new-changes --stat
```

### 3. Push Feature Branch to GitHub
```bash
git push origin feature/new-changes
```

### 4. Merge Feature Branch into Main

#### Option A: Merge via Command Line
```bash
# Switch to main branch
git checkout main

# Pull latest changes from remote
git pull origin main

# Merge your feature branch
git merge feature/new-changes

# Push to GitHub
git push origin main
```

#### Option B: Create Pull Request on GitHub (Recommended)
1. Push your feature branch: `git push origin feature/new-changes`
2. Go to GitHub repository
3. Click "Compare & pull request"
4. Review changes
5. Merge pull request on GitHub

### 5. Clean Up (After Merging)
```bash
# Delete local feature branch
git branch -d feature/new-changes

# Delete remote feature branch (if needed)
git push origin --delete feature/new-changes
```

## Quick Comparison Commands

### View All Differences
```bash
git diff main..feature/new-changes
```

### View Specific File Differences
```bash
git diff main..feature/new-changes -- path/to/file
```

### View Summary Statistics
```bash
git diff main..feature/new-changes --stat
```

### View File List Changed
```bash
git diff main..feature/new-changes --name-only
```

## Current Branch Status
```bash
# Check current branch
git branch

# Check branch comparison
git log main..feature/new-changes --oneline
```






