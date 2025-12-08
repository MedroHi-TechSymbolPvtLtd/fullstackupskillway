# WhatsApp API - Postman Testing Guide

## Base URL
```
http://localhost:3000/api/v1/whatsapp
```

**Authentication:** All endpoints require Bearer Token (Admin/Sales role)

**Phone Number Setup:** 8468813556 (configured in WATI)

---

## Environment Variables Setup

Before testing, ensure these are set in your `.env` file:

```env
WATI_BASE_URL=https://wapi.in.net/api
WATI_VENDOR_UID=your-vendor-uid
WATI_API_TOKEN=your-api-token
WATI_PHONE_NUMBER_ID=your-phone-number-id
```

---

## 1. Check WhatsApp Status

### Endpoint
```
GET http://localhost:3000/api/v1/whatsapp/status
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Postman Setup
1. **Method:** GET
2. **URL:** `http://localhost:3000/api/v1/whatsapp/status`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`

### Response (Success - 200)
```json
{
  "success": true,
  "message": "WhatsApp API status retrieved successfully",
  "data": {
    "apiStatus": "active",
    "vendorUid": "your-vendor-uid",
    "phoneNumberId": "your-phone-number-id",
    "lastChecked": "2024-01-15T10:30:00.000Z"
  }
}
```

**Use this to verify your configuration is correct!**

---

## 2. Send Single WhatsApp Message

### Endpoint
```
POST http://localhost:3000/api/v1/whatsapp/send
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `phoneNumber` | string | Yes | Phone number (7-15 digits, with country code) | `"919876543210"` |
| `message` | string | Yes | Message text (max 4096 chars) | `"Hello, this is a test message"` |
| `firstName` | string | No | Contact first name | `"John"` |
| `lastName` | string | No | Contact last name | `"Doe"` |
| `email` | string | No | Contact email | `"john@example.com"` |
| `languageCode` | string | No | Language code (2 chars) | `"en"` |
| `country` | string | No | Country code (2 chars) | `"IN"` |
| `media` | object | No | Media attachment (image/video/audio/document) | See below |

### Request Body (Simple - Text Only)

```json
{
  "phoneNumber": "919876543210",
  "message": "Hello! This is a test message from UpSkillWay WhatsApp automation. Your lead has been successfully registered."
}
```

### Request Body (Complete - With Contact Info)

```json
{
  "phoneNumber": "919876543210",
  "message": "Hello John! Welcome to UpSkillWay. We have received your inquiry and our team will contact you soon.",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "languageCode": "en",
  "country": "IN"
}
```

### Request Body (With Media)

```json
{
  "phoneNumber": "919876543210",
  "message": "Check out our latest course brochure!",
  "firstName": "John",
  "lastName": "Doe",
  "media": {
    "type": "image",
    "url": "https://example.com/images/course-brochure.jpg",
    "caption": "UpSkillWay Course Catalog 2024"
  }
}
```

**Media Types:**
- `image` - Image file (JPG, PNG, etc.)
- `video` - Video file (MP4, etc.)
- `audio` - Audio file (MP3, etc.)
- `document` - Document file (PDF, DOC, etc.)

### Response (Success - 200)
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "data": {
    "success": true,
    "messageId": "wati-message-id-123",
    "status": "sent",
    "phoneNumber": "919876543210",
    "logId": "log-uuid-here",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Postman Setup
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/v1/whatsapp/send`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body:** Select `raw` → `JSON` → Paste the JSON above

---

## 3. Send Bulk WhatsApp Messages

### Endpoint
```
POST http://localhost:3000/api/v1/whatsapp/send-bulk
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body

```json
{
  "messages": [
    {
      "phoneNumber": "919876543210",
      "message": "Hello John! Welcome to UpSkillWay.",
      "firstName": "John",
      "lastName": "Doe"
    },
    {
      "phoneNumber": "919876543211",
      "message": "Hello Jane! Welcome to UpSkillWay.",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    {
      "phoneNumber": "919876543212",
      "message": "Hello Bob! Welcome to UpSkillWay.",
      "firstName": "Bob",
      "lastName": "Johnson"
    }
  ]
}
```

**Limits:**
- Minimum: 1 message
- Maximum: 100 messages per request

### Response (Success - 200)
```json
{
  "success": true,
  "message": "Bulk WhatsApp messages processed",
  "data": {
    "total": 3,
    "successful": 3,
    "failed": 0,
    "results": [
      {
        "success": true,
        "messageId": "wati-message-id-1",
        "status": "sent",
        "phoneNumber": "919876543210"
      },
      {
        "success": true,
        "messageId": "wati-message-id-2",
        "status": "sent",
        "phoneNumber": "919876543211"
      },
      {
        "success": true,
        "messageId": "wati-message-id-3",
        "status": "sent",
        "phoneNumber": "919876543212"
      }
    ],
    "errors": []
  }
}
```

### Postman Setup
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/v1/whatsapp/send-bulk`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body:** Select `raw` → `JSON` → Paste the JSON above

---

## 4. Get Message History

### Endpoint
```
GET http://localhost:3000/api/v1/whatsapp/history
```

### Query Parameters (All Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `phoneNumber` | string | Filter by phone number | `?phoneNumber=919876543210` |
| `status` | enum | Filter by status: `sent`, `delivered`, `read`, `failed` | `?status=sent` |
| `startDate` | datetime | Start date (ISO format) | `?startDate=2024-01-01T00:00:00Z` |
| `endDate` | datetime | End date (ISO format) | `?endDate=2024-01-31T23:59:59Z` |
| `limit` | integer | Number of results (1-100) | `?limit=20` |
| `offset` | integer | Pagination offset | `?offset=0` |

### Examples

**Get all messages:**
```
GET http://localhost:3000/api/v1/whatsapp/history
```

**Get messages for specific phone:**
```
GET http://localhost:3000/api/v1/whatsapp/history?phoneNumber=919876543210
```

**Get failed messages:**
```
GET http://localhost:3000/api/v1/whatsapp/history?status=failed
```

**Get messages with date range:**
```
GET http://localhost:3000/api/v1/whatsapp/history?startDate=2024-01-01T00:00:00Z&endDate=2024-01-31T23:59:59Z
```

**Get messages with pagination:**
```
GET http://localhost:3000/api/v1/whatsapp/history?limit=20&offset=0
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "WhatsApp message history retrieved successfully",
  "data": {
    "total": 50,
    "messages": [
      {
        "id": "message-uuid-1",
        "phoneNumber": "919876543210",
        "message": "Hello! This is a test message.",
        "status": "delivered",
        "messageId": "wati-message-id-123",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:05.000Z"
      },
      {
        "id": "message-uuid-2",
        "phoneNumber": "919876543211",
        "message": "Welcome to UpSkillWay!",
        "status": "read",
        "messageId": "wati-message-id-124",
        "createdAt": "2024-01-15T11:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:10.000Z"
      }
    ]
  }
}
```

### Postman Setup
1. **Method:** GET
2. **URL:** `http://localhost:3000/api/v1/whatsapp/history?limit=20`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`
4. **Params:** (Optional) Add query parameters in Params tab

---

## 5. Get Message Statistics

### Endpoint
```
GET http://localhost:3000/api/v1/whatsapp/statistics
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "WhatsApp message statistics retrieved successfully",
  "data": {
    "total": 1000,
    "sent": 950,
    "delivered": 900,
    "read": 850,
    "failed": 50,
    "today": {
      "total": 50,
      "sent": 48,
      "delivered": 45,
      "read": 40,
      "failed": 2
    },
    "thisWeek": {
      "total": 300,
      "sent": 290,
      "delivered": 280,
      "read": 270,
      "failed": 10
    },
    "thisMonth": {
      "total": 1000,
      "sent": 950,
      "delivered": 900,
      "read": 850,
      "failed": 50
    }
  }
}
```

### Postman Setup
1. **Method:** GET
2. **URL:** `http://localhost:3000/api/v1/whatsapp/statistics`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`

---

## 6. Test WhatsApp (Admin Only)

### Endpoint
```
POST http://localhost:3000/api/v1/whatsapp/test
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE (Admin role required)
```

### Request Body
**No body required** - Sends a test message to a predefined test number.

### Response (Success - 200)
```json
{
  "success": true,
  "message": "WhatsApp test message sent successfully",
  "data": {
    "success": true,
    "messageId": "wati-message-id-test",
    "status": "sent",
    "phoneNumber": "919876543210",
    "logId": "log-uuid-here",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Postman Setup
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/v1/whatsapp/test`
3. **Headers:**
   - `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## Testing Scenarios

### Scenario 1: Send Welcome Message to New Lead

```json
POST /api/v1/whatsapp/send
{
  "phoneNumber": "919876543210",
  "message": "Hello! Thank you for your interest in UpSkillWay. We have received your inquiry and our team will contact you shortly. For more information, visit: https://upskillway.com",
  "firstName": "Lead",
  "lastName": "Name",
  "email": "lead@example.com"
}
```

### Scenario 2: Send Course Enrollment Confirmation

```json
POST /api/v1/whatsapp/send
{
  "phoneNumber": "919876543210",
  "message": "Congratulations! Your enrollment in the Full Stack Development course has been confirmed. Course starts on January 20, 2024. We'll send you the schedule soon.",
  "firstName": "Student",
  "lastName": "Name"
}
```

### Scenario 3: Send Bulk Messages to Multiple Leads

```json
POST /api/v1/whatsapp/send-bulk
{
  "messages": [
    {
      "phoneNumber": "919876543210",
      "message": "Hello! Check out our new course offerings at UpSkillWay.",
      "firstName": "Lead 1"
    },
    {
      "phoneNumber": "919876543211",
      "message": "Hello! Check out our new course offerings at UpSkillWay.",
      "firstName": "Lead 2"
    }
  ]
}
```

### Scenario 4: Send Message with Image

```json
POST /api/v1/whatsapp/send
{
  "phoneNumber": "919876543210",
  "message": "Check out our course catalog!",
  "media": {
    "type": "image",
    "url": "https://example.com/images/course-catalog.jpg",
    "caption": "UpSkillWay Course Catalog 2024"
  }
}
```

---

## Phone Number Format

### Important Notes:

1. **Include Country Code**: Always include country code
   - India: `91` + 10-digit number = `919876543210`
   - Format: `[country code][phone number]` (no spaces, dashes, or plus signs)

2. **Valid Formats**:
   - ✅ `919876543210` (India)
   - ✅ `91987654321` (10 digits)
   - ✅ `1234567890` (10 digits - will auto-add 91 for India)
   - ❌ `+91 9876543210` (don't use + or spaces)
   - ❌ `9876543210` (missing country code for international)

3. **Test Number**: Use a valid WhatsApp number for testing
   - Make sure the recipient has WhatsApp installed
   - Number should be able to receive messages

---

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Phone number must be at least 7 digits"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Only admin users can test WhatsApp functionality",
  "error": "Access denied"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to send WhatsApp message",
  "error": "WATI API error: [details]"
}
```

---

## Testing Checklist

### ✅ Configuration
- [ ] Environment variables set in `.env`
- [ ] Server restarted after `.env` changes
- [ ] Status endpoint returns correct configuration
- [ ] Phone number 8468813556 registered in WATI

### ✅ Basic Functionality
- [ ] Send single text message
- [ ] Send message with contact info
- [ ] Send message with media
- [ ] Send bulk messages
- [ ] Get message history
- [ ] Get statistics
- [ ] Test endpoint (admin only)

### ✅ Message Delivery
- [ ] Message sent successfully
- [ ] Message delivered to recipient
- [ ] Message read by recipient
- [ ] Check message history
- [ ] Verify statistics updated

### ✅ Error Handling
- [ ] Invalid phone number format
- [ ] Missing required fields
- [ ] Unauthorized access
- [ ] Invalid authentication token

---

## Postman Collection Setup

### Environment Variables

Create a Postman environment with:

```json
{
  "base_url": "http://localhost:3000",
  "api_token": "YOUR_BEARER_TOKEN_HERE",
  "test_phone": "919876543210",
  "wati_phone_number": "8468813556"
}
```

Then use in requests:
- URL: `{{base_url}}/api/v1/whatsapp/send`
- Authorization: `Bearer {{api_token}}`
- Body: `"phoneNumber": "{{test_phone}}"`

---

## Automation Testing

### Test Lead Automation

1. **Create a Lead** via Lead API
2. **Check if WhatsApp sent automatically** (if automation is configured)
3. **Verify message in history**
4. **Check recipient received message**

### Test User Notifications

1. **Trigger user notification event**
2. **Check WhatsApp message sent**
3. **Verify delivery status**

---

## Troubleshooting

### Issue: "Invalid phone number format"
**Solution**: Use format: `919876543210` (country code + number, no spaces)

### Issue: "WATI API configuration is incomplete"
**Solution**: Check all three WATI environment variables are set

### Issue: Messages not being delivered
**Solution**: 
- Verify phone number is registered in WATI
- Check recipient has WhatsApp installed
- Verify phone number format is correct

### Issue: "Authentication failed"
**Solution**: 
- Verify Bearer token is valid
- Check token hasn't expired
- Ensure user has admin/sales role

---

## Notes

1. **Phone Number**: 8468813556 is configured in WATI dashboard
2. **Rate Limits**: Be mindful of WATI API rate limits
3. **Message Length**: Maximum 4096 characters per message
4. **Bulk Limit**: Maximum 100 messages per bulk send
5. **Authentication**: All endpoints require admin/sales role
6. **Logging**: All messages are logged in database with status tracking

---

## Quick Start Testing

1. **Check Status**: `GET /api/v1/whatsapp/status`
2. **Send Test Message**: `POST /api/v1/whatsapp/send` (with your phone number)
3. **Check History**: `GET /api/v1/whatsapp/history`
4. **Verify Delivery**: Check your WhatsApp for the message

---

## Support

- **WATI Issues**: Check WATI dashboard for delivery status
- **API Issues**: Check server logs for detailed errors
- **Configuration**: Verify all environment variables are set correctly


