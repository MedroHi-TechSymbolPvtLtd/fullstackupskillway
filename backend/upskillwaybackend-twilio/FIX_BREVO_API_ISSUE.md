# Fix Brevo API Authentication Issue

## Problem
You're getting a 401 error: "Key not found - Key not found" because you're using an SMTP key instead of a REST API key.

## Root Cause
Your `.env` file has `BREVO_API_KEY=xsmtpsib-...` which is an **SMTP key**, but the Brevo SDK needs a **REST API key** that starts with `xkeysib-`.

## Solution Steps

### Step 1: Get the Correct API Key from Brevo

1. Log in to your Brevo account at https://app.brevo.com
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Look for an existing API key that starts with `xkeysib-` OR create a new one
4. Copy the API key (it should look like: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxx`)

### Step 2: Update Your .env File

Replace the current `BREVO_API_KEY` value in your `.env` file with the correct API key:

```env
BREVO_API_KEY=xkeysib-YOUR_ACTUAL_API_KEY_HERE
```

**Important Notes:**
- The API key should start with `xkeysib-` (NOT `xsmtpsib-`)
- Keep your SMTP credentials as they are (they're correct)
- The SMTP user should be `998282001@smtp-brevo.com` (without `mailto:`)

### Step 3: Verify Your Sender Email

Make sure your sender email is verified in Brevo:
1. Go to **Senders & IP** → **Senders**
2. Verify that your sender email (e.g., `info@upskillway.com`) is verified
3. If not verified, add and verify it

### Step 4: Restart Your Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C if running)

# Restart the server
npm run dev
```

### Step 5: Test the Email API

Try sending a test email again. The error should be resolved.

## Prisma Database Commands (If Needed)

If you're having Prisma database issues, run these commands:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database (for development)
npm run db:push

# OR create and run migrations (for production)
npm run db:migrate

# Seed the database (optional)
npm run db:seed
```

## Verification

After fixing, you should see:
- ✅ No more "Key not found" errors
- ✅ Emails sending successfully
- ✅ Status 200 responses from the API

## Common Issues

### Issue: Still getting 401 error
**Solution:** Double-check that:
- The API key starts with `xkeysib-` (not `xsmtpsib-`)
- There are no extra spaces in the `.env` file
- You restarted the server after changing `.env`

### Issue: "Sender email not verified"
**Solution:** Verify your sender email in Brevo dashboard

### Issue: Database connection errors
**Solution:** Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running
