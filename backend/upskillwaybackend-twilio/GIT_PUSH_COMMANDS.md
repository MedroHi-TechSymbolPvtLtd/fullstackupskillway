# Git Commands to Push Your Code

## Step 1: Create a New Branch

Create a new branch for your changes:

```bash
git checkout -b feature/brevo-email-lead-conversion-wapi
```

## Step 2: Stage All Changes

Add all your changes to staging:

```bash
git add .
```

## Step 3: Commit Your Changes

Commit with a descriptive message:

```bash
git commit -m "feat: Implement Brevo email API, lead-to-college conversion, and WATI to WAPI migration

- Fixed Brevo email API authentication (changed from SMTP key to REST API key)
- Implemented automatic lead-to-college conversion flow
- Lead converts to college when stage/status = CONVERTED
- College assignedToId is now optional (assigned manually later)
- Renamed all WATI references to WAPI throughout codebase
- Updated environment variables (WATI_* to WAPI_*)
- Updated database schema (watiResponse to wapiResponse)
- Added comprehensive documentation for all features"
```

## Step 4: Push to Remote

Push your new branch to GitHub:

```bash
git push origin feature/brevo-email-lead-conversion-wapi
```

## Step 5: Create Pull Request (Optional)

If you want to merge to main via Pull Request:

1. Go to your GitHub repository
2. Click "Compare & pull request" button
3. Review changes
4. Create pull request
5. Merge to main

## Step 6: Direct Merge to Main (Alternative)

If you want to merge directly to main:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge feature/brevo-email-lead-conversion-wapi

# Push to main
git push origin main
```

## Quick Commands (Copy-Paste)

```bash
# Create new branch
git checkout -b feature/brevo-email-lead-conversion-wapi

# Stage all changes
git add .

# Commit changes
git commit -m "feat: Implement Brevo email API, lead-to-college conversion, and WATI to WAPI migration"

# Push to remote
git push origin feature/brevo-email-lead-conversion-wapi
```

## Summary of Changes Being Committed

### 1. Brevo Email API Fix
- Fixed API key configuration (xkeysib- instead of xsmtpsib-)
- Updated SMTP user format
- Email functionality now working

### 2. Lead to College Conversion
- Auto-creates college when lead is converted
- Maps Lead.organization → College.name
- assignedToId is optional in college creation
- Keeps converted leads with collegeId reference

### 3. WATI to WAPI Migration
- Renamed all WATI references to WAPI
- Updated environment variables
- Created new wapiClient.ts
- Updated database schema

### 4. New Files Added
- `FIX_BREVO_API_ISSUE.md`
- `LEAD_TO_COLLEGE_CONVERSION_FLOW.md`
- `WATI_TO_WAPI_MIGRATION_COMPLETE.md`
- `src/utils/wapiClient.ts`
- `test-brevo-api.js`
- `test-send-email.js`

### 5. Modified Files
- `prisma/schema.prisma`
- `src/config/index.ts`
- `src/services/leadService.ts`
- `src/services/collegeService.ts`
- `src/services/whatsappService.ts`
- `src/validators/college.ts`
- `src/validators/lead.ts`
- And more...

## Important Notes

⚠️ **Before pushing:**
1. Make sure `.env` file is NOT being committed (it's in .gitignore)
2. Verify all tests pass
3. Ensure server starts without errors

✅ **After pushing:**
1. Create a Pull Request on GitHub
2. Review the changes
3. Merge to main branch
4. Deploy to production (if applicable)
