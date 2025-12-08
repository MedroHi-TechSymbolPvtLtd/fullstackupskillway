# Email Automation Features - Complete Implementation

## Overview

This document describes the complete email automation system implemented for lead management. The system includes:

1. **Email Templates** - Create and manage reusable email templates
2. **Email Automations** - Set up automated emails triggered by lead events
3. **Manual Email Sending** - Send emails to individual leads or all leads
4. **Notifications** - Get notified when emails are sent successfully or fail

---

## Features Implemented

### ✅ 1. Automated Email When New Lead Enters

**How it works:**
- When a new lead is created, the system automatically checks for active email automations with `LEAD_CREATED` trigger
- Admin/sales users can create email templates and set up automations
- The automation uses the template and renders it with lead data (name, email, organization, etc.)

**API Endpoints:**
- `POST /api/v1/email-templates` - Create email template
- `POST /api/v1/email-automations` - Create automation rule
- Automation is automatically triggered when a lead is created

**Example Template Variables:**
- `{{name}}` - Lead name
- `{{email}}` - Lead email
- `{{organization}}` - Lead organization
- `{{stage}}` - Lead stage
- `{{status}}` - Lead status

---

### ✅ 2. Manual Email Sending

**Send to Specific Lead:**
- `POST /api/v1/lead-emails/send` - Send email to a specific lead by ID or email address
- Can use a template or provide custom subject/HTML

**Send to All Leads:**
- `POST /api/v1/lead-emails/send-all` - Send email to all leads (with optional filters)
- Supports filtering by stage, status, source, assignedToId

**Request Examples:**

```json
// Send to specific lead
{
  "leadId": "uuid-here",
  "templateId": "template-uuid" // OR
  "subject": "Custom Subject",
  "html": "<p>Custom HTML</p>"
}

// Send to all leads
{
  "templateId": "template-uuid", // OR
  "subject": "Bulk Email Subject",
  "html": "<p>Bulk Email Content</p>",
  "filters": {
    "stage": "CONTACTED",
    "status": "ACTIVE"
  }
}
```

---

### ✅ 3. Email Automation Rules

**Automation Triggers:**
- `LEAD_CREATED` - When a new lead is created
- `LEAD_STAGE_CHANGED` - When lead stage changes
- `LEAD_STATUS_CHANGED` - When lead status changes
- `LEAD_ASSIGNED` - When lead is assigned to a user
- `LEAD_CONVERTED` - When lead is converted
- `CUSTOM` - Custom conditions

**API Endpoints:**
- `POST /api/v1/email-automations` - Create automation
- `GET /api/v1/email-automations` - List all automations
- `GET /api/v1/email-automations/:id` - Get automation details
- `PUT /api/v1/email-automations/:id` - Update automation
- `DELETE /api/v1/email-automations/:id` - Delete automation
- `GET /api/v1/email-automations/:id/logs` - Get automation execution logs

**Example Automation:**
```json
{
  "name": "Welcome Email for New Leads",
  "description": "Sends welcome email when lead is created",
  "triggerType": "LEAD_CREATED",
  "templateId": "template-uuid",
  "isActive": true,
  "delayMinutes": 0
}
```

---

### ✅ 4. Email Notifications

**Notification Types:**
- `EMAIL_SENT` - Email sent successfully
- `EMAIL_FAILED` - Email failed to send
- `EMAIL_DELIVERED` - Email delivered (via webhook)
- `EMAIL_OPENED` - Email opened (via webhook)
- `AUTOMATION_TRIGGERED` - Automation executed
- `AUTOMATION_FAILED` - Automation failed
- `BULK_EMAIL_COMPLETED` - Bulk email completed

**API Endpoints:**
- `GET /api/v1/notifications` - Get user notifications
- `GET /api/v1/notifications/unread/count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

**Automatic Notifications:**
- Created automatically when emails are sent (success or failure)
- Created when automations are triggered
- Created when bulk emails complete

---

## Database Schema

### New Models Added:

1. **EmailTemplate**
   - Stores email templates with HTML/text content
   - Supports categories and active/inactive status
   - Created by admin/sales users

2. **EmailAutomation**
   - Stores automation rules
   - Links to email templates
   - Supports trigger conditions and delays

3. **EmailAutomationLog**
   - Logs automation executions
   - Tracks success/failure status

4. **Notification**
   - Stores user notifications
   - Supports read/unread status
   - Includes metadata for context

---

## API Endpoints Summary

### Email Templates
- `POST /api/v1/email-templates` - Create template
- `GET /api/v1/email-templates` - List templates
- `GET /api/v1/email-templates/:id` - Get template
- `PUT /api/v1/email-templates/:id` - Update template
- `DELETE /api/v1/email-templates/:id` - Delete template
- `GET /api/v1/email-templates/category/:category` - Get by category

### Email Automations
- `POST /api/v1/email-automations` - Create automation
- `GET /api/v1/email-automations` - List automations
- `GET /api/v1/email-automations/:id` - Get automation
- `PUT /api/v1/email-automations/:id` - Update automation
- `DELETE /api/v1/email-automations/:id` - Delete automation
- `GET /api/v1/email-automations/:id/logs` - Get execution logs

### Lead Emails
- `POST /api/v1/lead-emails/send` - Send to specific lead
- `POST /api/v1/lead-emails/send-all` - Send to all leads

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `GET /api/v1/notifications/unread/count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

---

## Setup Instructions

### 1. Database Migration

Run Prisma migration to create new tables:

```bash
npx prisma migrate dev --name add_email_automation_features
```

Or push schema changes:

```bash
npx prisma db push
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Restart Server

Restart your development server to load the new routes and services.

---

## Usage Examples

### Step 1: Create Email Template

```bash
POST /api/v1/email-templates
Authorization: Bearer <admin-token>

{
  "name": "Welcome Email",
  "subject": "Welcome to UpSkillWay, {{name}}!",
  "htmlContent": "<h1>Hello {{name}}!</h1><p>Thank you for your interest in UpSkillWay.</p>",
  "textContent": "Hello {{name}}!\n\nThank you for your interest in UpSkillWay.",
  "category": "welcome",
  "isActive": true
}
```

### Step 2: Create Automation

```bash
POST /api/v1/email-automations
Authorization: Bearer <admin-token>

{
  "name": "Auto Welcome Email",
  "description": "Sends welcome email to new leads",
  "triggerType": "LEAD_CREATED",
  "templateId": "<template-id-from-step-1>",
  "isActive": true,
  "delayMinutes": 0
}
```

### Step 3: Test

Create a new lead - the automation will automatically trigger and send the email!

### Step 4: Check Notifications

```bash
GET /api/v1/notifications
Authorization: Bearer <admin-token>
```

You'll see notifications for:
- Email sent successfully
- Automation triggered
- Any failures

---

## Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Automated email on lead creation | ✅ | Uses email templates and automations |
| Manual email to specific lead | ✅ | By leadId or email address |
| Manual email to all leads | ✅ | With optional filters |
| Email template management | ✅ | Full CRUD operations |
| Automation rule management | ✅ | Full CRUD operations |
| Email notifications | ✅ | Automatic on send/fail |
| Automation execution logs | ✅ | Track automation runs |
| Template variable rendering | ✅ | Supports {{variable}} syntax |

---

## Notes

- All email sending uses the existing Brevo email service
- Notifications are created automatically - no manual setup needed
- Automations only trigger if both automation and template are active
- Email templates support variable substitution using `{{variableName}}` syntax
- Bulk email sending processes leads sequentially to avoid overwhelming the email service
- All endpoints require authentication (admin or sales role)

---

## Next Steps

1. Run database migration: `npx prisma migrate dev`
2. Create your first email template
3. Set up automation rules
4. Test by creating a new lead
5. Check notifications to see email status

---

## Support

For issues or questions, check:
- Email service logs in `src/services/emailService.ts`
- Automation logs via `GET /api/v1/email-automations/:id/logs`
- Notification history via `GET /api/v1/notifications`





