# Email Automation — Postman Testing Guide

This document lists all email automation API endpoints available in the project and shows Postman-ready examples. Use these requests to verify transactional and campaign email flows, history, queue, webhook handling and a test email endpoint.

> Note: All admin/sales endpoints require a valid Bearer token. Add header:
> Authorization: `Bearer <ADMIN_OR_SALES_TOKEN>`

Environment variables (add to your `.env` and restart the server)

```env
# Brevo Email API configuration
BREVO_API_KEY=your-brevo-api-key
BREVO_SMTP_USER=info@UpSkillWay.com
BREVO_SMTP_PASS=your-smtp-password
BREVO_BASE_URL=https://api.brevo.com/v3
```

Quick checks before testing
- Ensure `BREVO_API_KEY`, `BREVO_SMTP_USER` and `BREVO_SMTP_PASS` are set and valid.
- Confirm `BREVO_SMTP_USER` (the from address) is verified in your Brevo account (we'll use `info@UpSkillWay.com`).
- Restart the server after `.env` changes.

Base URL (local)
```
http://localhost:3000/api/v1/email
```

1) Send a transactional email
- Endpoint: POST `/send`
- Auth: Admin or Sales
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>
- Body (example — immediate send via API):

```json
{
  "to": "recipient@example.com",
  "toName": "Recipient Name",
  "subject": "Welcome to UpSkillWay",
  "html": "<h1>Hello Recipient</h1><p>Welcome to UpSkillWay.</p>",
  "text": "Hello Recipient\n\nWelcome to UpSkillWay.",
  "from": {
    "name": "UpSkillWay",
    "email": "info@UpSkillWay.com"
  },
  "transport": "api",
  "queue": false
}
```

- Expected response (200):

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "success": true,
    "messageId": "brevo-message-id",
    "status": "sent",
    "method": "api",
    "logId": "log-uuid",
    "timestamp": "..."
  },
  "timestamp": "..."
}
```

2) Send bulk transactional emails
- Endpoint: POST `/send-bulk`
- Auth: Admin or Sales
- Body (example):

```json
{
  "emails": [
    {
      "to": "a@example.com",
      "subject": "Hello A",
      "html": "<p>Hi A</p>"
    },
    {
      "to": "b@example.com",
      "subject": "Hello B",
      "html": "<p>Hi B</p>"
    }
  ],
  "transport": "api",
  "queue": false
}
```

- Expected response (200): summary of results with `results` and `errors`.

3) Create an email campaign
- Endpoint: POST `/campaign/create`
- Auth: Admin only
- Body (example):

```json
{
  "name": "UpSkill Launch",
  "subject": "Launch Offer",
  "sender": { "name": "UpSkillWay", "email": "info@UpSkillWay.com" },
  "htmlContent": "<h1>Launch</h1><p>Offer details</p>",
  "listIds": [123], 
  "queue": false
}
```

4) Send a campaign
- Endpoint: POST `/campaign/send`
- Auth: Admin only
- Body:
```json
{ "campaignId": 123 }
```

5) Get email history (logs)
- Endpoint: GET `/history`
- Auth: Admin or Sales
- Query params (optional): `to`, `status`, `startDate`, `endDate`, `limit`, `offset`
- Example:
```
GET /history?to=recipient@example.com&limit=20
```

6) Email statistics
- Endpoint: GET `/statistics`
- Auth: Admin or Sales

7) Queue statistics (if using queued sends)
- Endpoint: GET `/queue/stats`
- Auth: Admin or Sales

8) Test email (send a test message)
- Endpoint: POST `/test`
- Auth: Admin only
- This endpoint sends a preconfigured test email using the server defaults. Use this to quickly verify Brevo connectivity.

9) Webhook — receive events from Brevo (public)
- Endpoint: POST `/webhook`
- No auth required (Brevo will POST events)
- Sample webhook payload:

```json
{
  "event": "delivered",
  "message-id": "brevo-message-id",
  "email": "recipient@example.com",
  "timestamp": "2025-11-08T06:53:40.444Z"
}
```

- Verify webhooks by inspecting `/webhook/stats` (Admin only)

Testing tips
- Use `POST /send` with `queue: false` to test immediate delivery and see Brevo's API response in the returned log.
- If you don't get emails:
  - Check server logs for Brevo API error (invalid API key, sender not verified, rate limit).
  - Inspect the `email_logs` table (`status`, `brevoResponse`, `error`) or call `GET /history?to=<email>`.
  - If using SMTP transport, ensure `BREVO_SMTP_USER` and `BREVO_SMTP_PASS` are correct and Brevo SMTP is enabled for your account.

Postman collection suggestion
- Create a collection with these requests, set an environment with:
  - baseUrl = `http://localhost:3000/api/v1/email`
  - adminToken = `<ADMIN_TOKEN>`
  - recipient = `test@example.com`

Then use variables:
- Authorization header: `Bearer {{adminToken}}`
- URL: `{{baseUrl}}/send`

Ready-to-run sequence
1. POST `/test` (Admin) — verifies connectivity and credentials.
2. POST `/send` (Admin) — send a test transactional email to `recipient`.
3. GET `/history?to=recipient` — confirm log recorded and inspect `brevoResponse`.
4. POST `/send-bulk` — test multiple recipients.
5. POST `/campaign/create` → POST `/campaign/send` (Admin) — test campaign flow.
6. POST `/webhook` (simulate Brevo) → GET `/webhook/stats` (Admin) — verify webhook handling.

If you want, I can add this file to the repo and also generate a ready-to-import Postman JSON collection — tell me if you'd like that next.


