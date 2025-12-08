# WhatsApp and Email Functionality - Complete Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [WhatsApp Functionality](#whatsapp-functionality)
3. [Email Functionality](#email-functionality)
4. [Integration Points](#integration-points)
5. [Error Handling](#error-handling)
6. [Configuration](#configuration)
7. [API Endpoints Reference](#api-endpoints-reference)

---

## Overview

The UpSkillWay backend provides comprehensive WhatsApp and Email communication capabilities through third-party APIs (WAPI for WhatsApp, Brevo for Email). Both systems support:

- **Single and Bulk Messaging**
- **Message History and Statistics**
- **Role-Based Access Control (Admin/Sales)**
- **Database Logging**
- **Error Handling and Retry Mechanisms**

---

## WhatsApp Functionality

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WhatsApp Request Flow                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend/API Client                                            │
│  POST /api/v1/whatsapp/send                                     │
│  - phoneNumber, message, firstName, lastName, email, etc.      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Authentication Middleware                                      │
│  - JWT Token Validation                                         │
│  - Role Check (admin/sales)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WhatsApp Controller                                            │
│  (src/controllers/whatsappController.ts)                         │
│  ├── Request Validation (Zod Schema)                           │
│  ├── Extract User Info (userId, userRole)                        │
│  └── Call WhatsApp Service                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WhatsApp Service                                                │
│  (src/services/whatsappService.ts)                               │
│  ├── Phone Number Validation & Formatting                        │
│  │   - Clean phone number (remove non-digits)                   │
│  │   - Validate length (7-15 digits)                            │
│  │   - Format: Add country code if needed (default: +91)        │
│  ├── Sales User Access Validation                                │
│  │   - Check if sales user can send to this contact              │
│  ├── Prepare WAPI Payload                                        │
│  │   - Contact info (phone, name, email, country)               │
│  │   - Message content (body, media)                             │
│  │   - WhatsApp Business Phone Number ID                         │
│  └── Call WAPI Client                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WAPI Client                                                     │
│  (src/utils/wapiClient.ts)                                       │
│  ├── Initialize Axios Instance                                   │
│  │   - Base URL: config.wapi.baseUrl                            │
│  │   - Headers: Content-Type, Accept                            │
│  │   - Timeout: 30 seconds                                      │
│  ├── Request Interceptor                                         │
│  │   - Log request details                                       │
│  ├── POST /{vendorUid}/contact/send-message?token={apiToken}    │
│  │   - Send message payload to WAPI API                         │
│  └── Response Interceptor                                         │
│      - Log response details                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WAPI API (External Service)                                     │
│  - Processes WhatsApp message                                    │
│  - Returns messageId and status                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WhatsApp Service (Continued)                                    │
│  ├── Receive WAPI Response                                        │
│  ├── Log Message in Database                                      │
│  │   - Create WhatsAppMessage record                            │
│  │   - Store: userId, userRole, phoneNumber, message, status    │
│  │   - Store: messageId, wapiResponse                            │
│  └── Return Result                                                │
│      - success, messageId, status, phoneNumber, logId            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Response to Client                                               │
│  {                                                               │
│    success: true,                                                │
│    message: "WhatsApp message sent successfully",               │
│    data: {                                                        │
│      success: true,                                              │
│      messageId: "msg_123",                                       │
│      status: "sent",                                             │
│      phoneNumber: "919876543210",                                 │
│      logId: "uuid",                                              │
│      timestamp: "2025-11-13T..."                                 │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. WhatsApp Service (`src/services/whatsappService.ts`)

**Main Methods:**

- **`sendMessage()`**: Send single WhatsApp message
  - Validates phone number (7-15 digits)
  - Formats phone number (adds country code if needed)
  - Validates sales user access
  - Prepares WAPI payload
  - Calls WAPI client
  - Logs message in database
  - Returns result

- **`sendBulkMessages()`**: Send multiple messages
  - Iterates through messages array
  - Calls `sendMessage()` for each
  - Adds 1-second delay between messages (rate limiting)
  - Collects results and errors
  - Returns summary

- **`getMessageHistory()`**: Retrieve message history
  - Filters by phoneNumber, status, date range
  - Sales users see only their messages
  - Admin users see all messages
  - Supports pagination (limit, offset)

- **`getMessageStatistics()`**: Get message statistics
  - Total, sent, delivered, failed messages
  - Today, this week, this month counts
  - Success rate calculation
  - Role-based filtering

- **`logMessage()`**: Log message in database
  - Creates `WhatsAppMessage` record
  - Handles user validation (ensures user exists)
  - Stores WAPI response and error details

#### 2. WAPI Client (`src/utils/wapiClient.ts`)

**Features:**
- Pre-configured Axios instance
- Request/Response interceptors for logging
- Phone number validation and formatting utilities
- Error handling with detailed logging

**Configuration:**
- `WAPI_VENDOR_UID`: Vendor unique identifier
- `WAPI_API_TOKEN`: API authentication token
- `WAPI_BASE_URL`: WAPI API base URL
- `WAPI_PHONE_NUMBER_ID`: WhatsApp Business Phone Number ID

#### 3. Database Schema

**WhatsAppMessage Model:**
```prisma
model WhatsAppMessage {
  id          String                @id @default(uuid())
  userId      String
  userRole    UserRole              // admin | sales
  phoneNumber String
  message     String
  status      WhatsAppMessageStatus // SENT | DELIVERED | READ | FAILED
  messageId   String?               // WAPI message ID
  wapiResponse Json?                // Full WAPI response
  error       String?               // Error message if failed
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  
  user        User                  @relation(fields: [userId], references: [id])
}
```

### Bulk Messaging Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/v1/whatsapp/send-bulk                                 │
│  { messages: [message1, message2, ...] }                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WhatsApp Service - sendBulkMessages()                          │
│  ├── Loop through messages array                                │
│  ├── For each message:                                          │
│  │   ├── Call sendMessage()                                     │
│  │   ├── Add result to results array                            │
│  │   └── Wait 1 second (rate limiting)                          │
│  ├── Collect errors in errors array                             │
│  └── Return summary:                                            │
│      - totalMessages, successfulMessages, failedMessages       │
│      - results[], errors[]                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Message History Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  GET /api/v1/whatsapp/history?phoneNumber=...&status=...         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WhatsApp Service - getMessageHistory()                         │
│  ├── Build WHERE clause:                                        │
│  │   - If sales user: filter by userId                          │
│  │   - Apply filters: phoneNumber, status, date range           │
│  ├── Query database with pagination                             │
│  └── Return:                                                    │
│      - messages[] (with pagination)                            │
│      - totalCount, hasMore                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Email Functionality

### Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Email Request Flow                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend/API Client                                            │
│  POST /api/v1/email/send                                        │
│  {                                                               │
│    to: "user@example.com",                                      │
│    subject: "Welcome",                                          │
│    html: "<h1>Hello</h1>",                                       │
│    transport: "api" | "smtp",                                   │
│    queue: true | false                                          │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Authentication Middleware                                      │
│  - JWT Token Validation                                         │
│  - Role Check (admin/sales)                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Controller                                                │
│  (src/controllers/emailController.ts)                          │
│  ├── Request Validation (Zod Schema)                             │
│  ├── Extract User Info (userId, userRole)                        │
│  └── Call Email Service                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Service                                                   │
│  (src/services/emailService.ts)                                 │
│  ├── Validate Email Address                                     │
│  ├── Sales User Access Validation                                │
│  ├── Prepare Brevo Email Data                                    │
│  │   - to, toName, subject, html, text                           │
│  │   - from, replyTo, attachments, headers, tags                 │
│  └── Check Send Options:                                         │
│      ├── If queue = true:                                        │
│      │   └── Add to Email Queue                                  │
│      └── If queue = false:                                       │
│          └── Send Immediately                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
    ┌───────────────────────┐  ┌───────────────────────┐
    │  Queue Path           │  │  Immediate Path        │
    │  (queue = true)       │  │  (queue = false)      │
    └───────────────────────┘  └───────────────────────┘
                    │                   │
                    ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Queue Manager                                            │
│  (src/utils/emailQueue.ts)                                      │
│  ├── Check Redis Availability                                    │
│  ├── If Redis Available:                                        │
│  │   ├── Add Job to BullMQ Queue                                 │
│  │   │   - Queue: "email-transactional"                          │
│  │   │   - Job Data: { emailData, transport }                    │
│  │   │   - Options: delay, priority, retry                      │
│  │   └── Return Job ID                                          │
│  └── If Redis Unavailable:                                       │
│      └── Send Email Directly (Fallback)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Worker (BullMQ)                                          │
│  ├── Process Queued Jobs                                        │
│  ├── Concurrency: 5 jobs at a time                              │
│  ├── For each job:                                              │
│  │   ├── Extract emailData and transport                        │
│  │   └── Call Brevo Client                                      │
│  └── Handle Job Events:                                         │
│      - completed: Log success                                    │
│      - failed: Log error, retry (3 attempts)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Brevo Client                                                   │
│  (src/utils/brevoClient.ts)                                     │
│  ├── Check Transport Type:                                       │
│  │   ├── If transport = "api":                                   │
│  │   │   └── Send via Brevo Transactional API                   │
│  │   │       - Use SibApiV3Sdk.TransactionalEmailsApi            │
│  │   │       - POST /v3/smtp/email                               │
│  │   └── If transport = "smtp":                                  │
│  │       └── Send via SMTP                                      │
│  │           - Use Nodemailer                                  │
│  │           - Connect to Brevo SMTP server                     │
│  │           - Send email directly                               │
│  └── Return Response:                                           │
│      - messageId, status, method, timestamp                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Brevo API / SMTP Server (External Service)                     │
│  - Processes email                                               │
│  - Returns messageId and status                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Service (Continued)                                       │
│  ├── Receive Brevo Response                                      │
│  ├── Log Email in Database                                       │
│  │   - Create EmailLog record                                    │
│  │   - Store: userId, userRole, to, subject, status              │
│  │   - Store: messageId, jobId, transport, brevoResponse        │
│  └── Return Result                                               │
│      - success, messageId, status, method, logId                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Response to Client                                               │
│  {                                                               │
│    success: true,                                                │
│    message: "Email sent successfully",                           │
│    data: {                                                        │
│      success: true,                                              │
│      messageId: "msg_123",                                       │
│      status: "sent" | "queued",                                 │
│      method: "api" | "smtp",                                    │
│      logId: "uuid",                                             │
│      timestamp: "2025-11-13T..."                                │
│    }                                                             │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Email Service (`src/services/emailService.ts`)

**Main Methods:**

- **`sendTransactionalEmail()`**: Send single transactional email
  - Validates email address format
  - Validates sales user access
  - Prepares Brevo email data
  - Checks queue option:
    - If `queue = true`: Add to queue
    - If `queue = false`: Send immediately
  - Logs email in database
  - Returns result

- **`sendBulkTransactionalEmails()`**: Send multiple emails
  - Iterates through emails array
  - Calls `sendTransactionalEmail()` for each
  - Adds 1-second delay between emails (if not queued)
  - Collects results and errors
  - Returns summary

- **`createEmailCampaign()`**: Create email campaign (Admin only)
  - Validates admin role
  - Prepares Brevo campaign data
  - Creates campaign via Brevo API
  - Logs campaign in database
  - Returns campaign ID

- **`sendEmailCampaign()`**: Send email campaign (Admin only)
  - Validates admin role
  - Sends campaign via Brevo API
  - Updates campaign log
  - Returns result

- **`getEmailHistory()`**: Retrieve email history
  - Filters by to, status, date range
  - Sales users see only their emails
  - Admin users see all emails
  - Supports pagination

- **`getEmailStatistics()`**: Get email statistics
  - Total, sent, delivered, failed emails
  - Today, this week, this month counts
  - Success rate calculation
  - Role-based filtering

- **`getQueueStatistics()`**: Get queue statistics
  - Waiting, active, completed, failed jobs
  - Separate stats for transactional and campaign queues

#### 2. Email Queue Manager (`src/utils/emailQueue.ts`)

**Features:**
- **Redis Connection Management**
  - Graceful initialization with retry strategy
  - Automatic reconnection on errors
  - Fallback to direct sending if Redis unavailable
  - Error logging throttling (once per minute)

- **BullMQ Queues**
  - `email-transactional`: For transactional emails
  - `email-campaign`: For campaign emails
  - Job options: retry (3 attempts), exponential backoff, cleanup

- **Workers**
  - Transactional worker: 5 concurrent jobs
  - Campaign worker: 2 concurrent jobs
  - Event listeners for completed/failed jobs

- **Methods:**
  - `addTransactionalEmail()`: Add email to queue
  - `addCampaignEmail()`: Add campaign to queue
  - `getQueueStats()`: Get queue statistics
  - `getJob()`: Get job by ID
  - `cleanCompletedJobs()`: Clean old completed jobs

**Queue Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Email Queue Manager - addTransactionalEmail()                  │
│  ├── Check Redis Availability                                    │
│  ├── If Redis Available:                                        │
│  │   ├── Add Job to Queue                                        │
│  │   │   - Queue: "email-transactional"                          │
│  │   │   - Job Name: "send-transactional-email"                 │
│  │   │   - Data: { emailData, transport }                       │
│  │   │   - Options: delay, priority: 1                           │
│  │   └── Return Job                                              │
│  └── If Redis Unavailable:                                       │
│      └── Send Email Directly (Fallback)                         │
│          - Call brevoClient.sendTransactionalEmail()            │
│          - Return mock job object                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Worker - Process Job                                      │
│  ├── Extract Job Data: { emailData, transport }                 │
│  ├── Call Brevo Client:                                          │
│  │   ├── If transport = "api":                                  │
│  │   │   └── brevoClient.sendTransactionalEmail()                │
│  │   └── If transport = "smtp":                                 │
│  │       └── brevoClient.sendSmtpEmail()                         │
│  └── Return Result                                               │
└─────────────────────────────────────────────────────────────────┘
```

#### 3. Brevo Client (`src/utils/brevoClient.ts`)

**Features:**
- **Dual Transport Support**
  - **API Transport**: Uses Brevo Transactional API (SibApiV3Sdk)
  - **SMTP Transport**: Uses Nodemailer with Brevo SMTP server

- **Methods:**
  - `sendTransactionalEmail()`: Send via Brevo API
  - `sendSmtpEmail()`: Send via SMTP
  - `createEmailCampaign()`: Create campaign
  - `sendEmailCampaign()`: Send campaign
  - `getCampaignStats()`: Get campaign statistics
  - `validateEmail()`: Validate email format
  - `testSmtpConnection()`: Test SMTP connection

**Configuration:**
- `BREVO_API_KEY`: Brevo API key
- `BREVO_SMTP_HOST`: SMTP host (smtp-relay.brevo.com)
- `BREVO_SMTP_PORT`: SMTP port (587)
- `BREVO_SMTP_USER`: SMTP username
- `BREVO_SMTP_PASS`: SMTP password

#### 4. Email Webhook Handler (`src/controllers/emailWebhookController.ts`)

**Purpose:** Receive webhook events from Brevo to update email status

**Events Handled:**
- `delivered`: Email delivered
- `opened`: Email opened
- `clicked`: Link clicked
- `bounced`: Email bounced
- `blocked`: Email blocked
- `unsubscribed`: User unsubscribed
- `spam`: Marked as spam

**Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/v1/email/webhook (Public - No Auth)                 │
│  {                                                               │
│    event: "delivered" | "opened" | "clicked" | ...              │
│    "message-id": "msg_123",                                     │
│    email: "user@example.com",                                   │
│    timestamp: "2025-11-13T..."                                 │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Webhook Controller                                        │
│  ├── Validate webhook data                                       │
│  ├── Route to event handler:                                    │
│  │   ├── handleDeliveredEvent()                                 │
│  │   ├── handleOpenedEvent()                                    │
│  │   ├── handleClickedEvent()                                   │
│  │   ├── handleBouncedEvent()                                   │
│  │   └── ...                                                     │
│  └── Update EmailLog status in database                          │
└─────────────────────────────────────────────────────────────────┘
```

#### 5. Database Schema

**EmailLog Model:**
```prisma
model EmailLog {
  id            String        @id @default(uuid())
  userId        String
  userRole      UserRole      // admin | sales
  to            String
  subject       String
  status        EmailStatus   // SENT | DELIVERED | OPENED | CLICKED | BOUNCED | FAILED | QUEUED
  messageId     String?       // Brevo message ID
  jobId         String?       // BullMQ job ID (if queued)
  transport     TransportType // API | SMTP
  brevoResponse Json?         // Full Brevo response
  error         String?       // Error message if failed
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  user          User          @relation(fields: [userId], references: [id])
}
```

**EmailCampaignLog Model:**
```prisma
model EmailCampaignLog {
  id            String        @id @default(uuid())
  userId        String
  userRole      UserRole
  name          String
  subject       String
  status        String        // created | scheduled | sent | queued | failed
  campaignId    String?       // Brevo campaign ID
  jobId         String?       // BullMQ job ID
  brevoResponse Json?
  error         String?
  sentAt        DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  user          User          @relation(fields: [userId], references: [id])
}
```

### Email Campaign Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/v1/email/campaign/create (Admin Only)                 │
│  {                                                               │
│    name: "Summer Promo",                                         │
│    subject: "Special Offer",                                    │
│    sender: { name: "UpSkillWay", email: "..." },                │
│    htmlContent: "<h1>...</h1>",                                  │
│    listIds: [2, 7],                                             │
│    scheduledAt: "2025-11-15T10:00:00Z"                          │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Service - createEmailCampaign()                           │
│  ├── Validate Admin Role                                         │
│  ├── Prepare Brevo Campaign Data                                 │
│  ├── If queue = true:                                            │
│  │   └── Add to Campaign Queue                                   │
│  └── If queue = false:                                           │
│      └── Create Campaign Immediately via Brevo API              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Brevo API - Create Campaign                                    │
│  - Returns campaignId                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  POST /api/v1/email/campaign/send (Admin Only)                  │
│  { campaignId: 123 }                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Email Service - sendEmailCampaign()                             │
│  ├── Validate Admin Role                                         │
│  ├── Call Brevo API - Send Campaign                             │
│  ├── Update Campaign Log                                         │
│  └── Return Result                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Lead Creation Integration

When a new lead is created, the system can automatically send welcome messages:

**Email Welcome:**
```typescript
// In leadService.ts - createLead()
if (lead.email) {
  await emailService.sendTransactionalEmail({
    to: lead.email,
    subject: 'Welcome to UpSkillWay',
    html: '<h1>Welcome!</h1><p>Thank you for your interest...</p>',
  }, systemUserId, 'admin', { queue: true });
}
```

**WhatsApp Welcome:**
```typescript
// In leadService.ts - createLead()
if (lead.phone) {
  await whatsappService.sendMessage({
    phoneNumber: lead.phone,
    message: 'Welcome to UpSkillWay! Thank you for your interest...',
    firstName: lead.name,
  }, systemUserId, 'admin');
}
```

### 2. Lead Status Update Integration

When a lead status changes, send notifications:

```typescript
// In leadService.ts - updateLeadStatus()
if (status === 'CONVERTED') {
  // Send conversion email
  await emailService.sendTransactionalEmail({
    to: lead.email,
    subject: 'Congratulations! Your Lead is Converted',
    html: '<h1>Great News!</h1><p>Your lead has been converted...</p>',
  }, userId, userRole, { queue: true });
}
```

---

## Error Handling

### WhatsApp Error Handling

1. **Phone Number Validation Errors**
   - Invalid format: Returns 400 with error message
   - Too short/long: Returns 400 with specific length requirement

2. **WAPI API Errors**
   - Network errors: Logged and re-thrown
   - API errors: Logged with full response
   - Failed messages: Logged in database with FAILED status

3. **Database Errors**
   - User not found: Attempts to find/create system admin
   - Foreign key violations: Handled gracefully

### Email Error Handling

1. **Email Validation Errors**
   - Invalid email format: Returns 400
   - Missing required fields: Returns 400 with validation errors

2. **Brevo API Errors**
   - 401 Unauthorized: Detailed error message about API key
   - 400 Bad Request: Validation error details
   - Network errors: Logged and re-thrown

3. **Redis/Queue Errors**
   - Redis unavailable: Falls back to direct sending
   - Queue errors: Falls back to direct sending
   - Worker errors: Retries up to 3 times with exponential backoff

4. **SMTP Errors**
   - Connection errors: Logged and re-thrown
   - Authentication errors: Detailed error message

### Error Logging

All errors are logged with:
- User ID and role
- Request details
- Error message and stack trace
- Timestamp

---

## Configuration

### Environment Variables

**WhatsApp (WAPI):**
```env
WAPI_VENDOR_UID=your_vendor_uid
WAPI_API_TOKEN=your_api_token
WAPI_BASE_URL=https://api.wati.io
WAPI_PHONE_NUMBER_ID=your_phone_number_id
```

**Email (Brevo):**
```env
BREVO_API_KEY=your_brevo_api_key
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_smtp_user
BREVO_SMTP_PASS=your_smtp_password
```

**Redis (for Email Queue):**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

### Configuration File (`src/config/index.ts`)

```typescript
export const config = {
  wapi: {
    vendorUid: process.env.WAPI_VENDOR_UID!,
    apiToken: process.env.WAPI_API_TOKEN!,
    baseUrl: process.env.WAPI_BASE_URL || 'https://api.wati.io',
    phoneNumberId: process.env.WAPI_PHONE_NUMBER_ID!,
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY!,
    smtpHost: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    smtpPort: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    smtpUser: process.env.BREVO_SMTP_USER!,
    smtpPass: process.env.BREVO_SMTP_PASS!,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  },
};
```

---

## API Endpoints Reference

### WhatsApp Endpoints

#### 1. Send WhatsApp Message
```http
POST /api/v1/whatsapp/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "919876543210",
  "message": "Hello from UpSkillWay!",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "languageCode": "en",
  "country": "IN",
  "media": {
    "type": "image",
    "url": "https://example.com/image.jpg",
    "caption": "Check this out!"
  }
}
```

#### 2. Send Bulk WhatsApp Messages
```http
POST /api/v1/whatsapp/send-bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [
    {
      "phoneNumber": "919876543210",
      "message": "Message 1"
    },
    {
      "phoneNumber": "919876543211",
      "message": "Message 2"
    }
  ]
}
```

#### 3. Get Message History
```http
GET /api/v1/whatsapp/history?phoneNumber=919876543210&status=sent&limit=50&offset=0
Authorization: Bearer <token>
```

#### 4. Get Message Statistics
```http
GET /api/v1/whatsapp/statistics
Authorization: Bearer <token>
```

#### 5. Get WhatsApp Status
```http
GET /api/v1/whatsapp/status
Authorization: Bearer <token>
```

#### 6. Test WhatsApp (Admin Only)
```http
POST /api/v1/whatsapp/test
Authorization: Bearer <token>
```

### Email Endpoints

#### 1. Send Transactional Email
```http
POST /api/v1/email/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "user@example.com",
  "toName": "John Doe",
  "subject": "Welcome to UpSkillWay",
  "html": "<h1>Hello John</h1><p>Welcome to UpSkillWay!</p>",
  "text": "Hello John\n\nWelcome to UpSkillWay!",
  "from": {
    "name": "UpSkillWay",
    "email": "noreply@upskillway.com"
  },
  "replyTo": {
    "name": "Support",
    "email": "support@upskillway.com"
  },
  "attachments": [
    {
      "name": "document.pdf",
      "content": "base64_encoded_content"
    }
  ],
  "tags": ["welcome", "onboarding"],
  "transport": "api",
  "queue": true,
  "delay": 0
}
```

#### 2. Send Bulk Transactional Emails
```http
POST /api/v1/email/send-bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "emails": [
    {
      "to": "user1@example.com",
      "subject": "Email 1",
      "html": "<h1>Email 1</h1>"
    },
    {
      "to": "user2@example.com",
      "subject": "Email 2",
      "html": "<h1>Email 2</h1>"
    }
  ],
  "transport": "api",
  "queue": true
}
```

#### 3. Create Email Campaign (Admin Only)
```http
POST /api/v1/email/campaign/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Summer Promo",
  "subject": "Special Summer Offer",
  "sender": {
    "name": "UpSkillWay",
    "email": "marketing@upskillway.com"
  },
  "htmlContent": "<h1>Summer Offer</h1><p>Get 50% off...</p>",
  "textContent": "Summer Offer\n\nGet 50% off...",
  "listIds": [2, 7],
  "scheduledAt": "2025-11-15T10:00:00Z",
  "tags": ["promo", "summer"],
  "queue": false
}
```

#### 4. Send Email Campaign (Admin Only)
```http
POST /api/v1/email/campaign/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "campaignId": 123
}
```

#### 5. Get Email History
```http
GET /api/v1/email/history?to=user@example.com&status=sent&limit=50&offset=0
Authorization: Bearer <token>
```

#### 6. Get Email Statistics
```http
GET /api/v1/email/statistics
Authorization: Bearer <token>
```

#### 7. Get Queue Statistics
```http
GET /api/v1/email/queue/stats
Authorization: Bearer <token>
```

#### 8. Email Webhook (Public - No Auth)
```http
POST /api/v1/email/webhook
Content-Type: application/json

{
  "event": "delivered",
  "message-id": "msg_123",
  "email": "user@example.com",
  "timestamp": "2025-11-13T12:00:00Z"
}
```

#### 9. Get Webhook Statistics (Admin Only)
```http
GET /api/v1/email/webhook/stats
Authorization: Bearer <token>
```

#### 10. Test Email (Admin Only)
```http
POST /api/v1/email/test
Authorization: Bearer <token>
```

---

## Summary

### WhatsApp Functionality
- ✅ Single and bulk message sending
- ✅ WAPI API integration
- ✅ Phone number validation and formatting
- ✅ Message history and statistics
- ✅ Role-based access control
- ✅ Database logging
- ✅ Error handling and retry

### Email Functionality
- ✅ Transactional email sending (API and SMTP)
- ✅ Bulk email sending
- ✅ Email campaign creation and sending
- ✅ Queue system with Redis/BullMQ
- ✅ Fallback to direct sending if Redis unavailable
- ✅ Webhook handling for delivery updates
- ✅ Email history and statistics
- ✅ Role-based access control
- ✅ Database logging
- ✅ Error handling and retry

Both systems are production-ready with comprehensive error handling, logging, and fallback mechanisms.

