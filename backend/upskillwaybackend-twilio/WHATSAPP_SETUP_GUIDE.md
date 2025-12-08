# WhatsApp Automation Setup Guide - Phone Number: 8468813556

## Overview

This guide will help you set up WhatsApp automation using the phone number **8468813556** with WATI API integration. The system will send automated messages to leads and users.

---

## Prerequisites

1. **WATI Account**: You need an active WATI (WhatsApp API Integration) account
2. **Phone Number Registered**: The number 8468813556 must be registered and verified in WATI dashboard
3. **WATI API Credentials**: You need three pieces of information from WATI:
   - Vendor UID
   - API Token
   - Phone Number ID (WhatsApp Business API phone number ID)

---

## Step 1: Register Phone Number in WATI

### In WATI Dashboard:

1. **Login to WATI Dashboard**: https://app.wati.io
2. **Go to Phone Numbers Section**:
   - Navigate to Settings → Phone Numbers
   - Click "Add Phone Number"
3. **Add Your Number**:
   - Enter phone number: **8468813556**
   - Follow WATI's verification process
   - Complete WhatsApp Business API setup
4. **Get Phone Number ID**:
   - Once registered, you'll get a Phone Number ID (this is different from the actual phone number)
   - Copy this Phone Number ID - you'll need it for environment variables

---

## Step 2: Get WATI API Credentials

### From WATI Dashboard:

1. **Vendor UID**:
   - Go to Settings → API
   - Find your Vendor UID (usually in format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   - Copy this value

2. **API Token**:
   - Go to Settings → API
   - Generate or copy your API Token
   - Keep this secure - it's used for authentication

3. **Phone Number ID**:
   - This is the WhatsApp Business API phone number ID from Step 1
   - It's different from the actual phone number (8468813556)
   - Usually in format: `123456789012345` (numeric string)

---

## Step 3: Configure Environment Variables

### Add to your `.env` file:

```env
# WATI WhatsApp API Configuration
WATI_BASE_URL=https://wapi.in.net/api
WATI_VENDOR_UID=your-vendor-uid-here
WATI_API_TOKEN=your-api-token-here
WATI_PHONE_NUMBER_ID=your-phone-number-id-here
```

### Example:

```env
# WATI WhatsApp API Configuration
WATI_BASE_URL=https://wapi.in.net/api
WATI_VENDOR_UID=abc12345-def6-7890-ghij-klmnopqrstuv
WATI_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
WATI_PHONE_NUMBER_ID=123456789012345
```

**Important Notes:**
- `WATI_PHONE_NUMBER_ID` is NOT the phone number 8468813556
- It's the WhatsApp Business API phone number ID from WATI dashboard
- Replace all placeholder values with your actual credentials from WATI

---

## Step 4: Verify Configuration

### Check if WhatsApp routes are enabled:

The WhatsApp routes are now enabled in `src/app.ts`. The API endpoints are available at:
- Base URL: `/api/v1/whatsapp`

### Test Configuration:

Use the status endpoint to verify your configuration:

```bash
GET /api/v1/whatsapp/status
Authorization: Bearer YOUR_TOKEN
```

This will return:
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

---

## Step 5: Restart Your Server

After updating `.env` file:

```bash
# Stop your server (Ctrl+C)
# Then restart
npm run dev
# or
npm start
```

---

## WhatsApp Automation Flow

### How It Works:

1. **Lead Creation**: When a lead is created, the system can automatically send a WhatsApp message
2. **User Notifications**: Users receive WhatsApp notifications for various events
3. **Manual Sending**: Admins and sales users can send WhatsApp messages manually
4. **Bulk Messaging**: Send messages to multiple recipients at once
5. **Message Tracking**: All messages are logged in the database with status tracking

### Message Flow:

```
User/Lead → API Request → WhatsApp Service → WATI API → WhatsApp Business API → Recipient
                ↓
          Database Logging (status, messageId, response)
```

---

## API Endpoints Available

1. **Send Single Message**: `POST /api/v1/whatsapp/send`
2. **Send Bulk Messages**: `POST /api/v1/whatsapp/send-bulk`
3. **Get Message History**: `GET /api/v1/whatsapp/history`
4. **Get Statistics**: `GET /api/v1/whatsapp/statistics`
5. **Get Status**: `GET /api/v1/whatsapp/status`
6. **Test WhatsApp**: `POST /api/v1/whatsapp/test` (Admin only)

---

## Troubleshooting

### Issue: "WATI API configuration is incomplete"

**Solution**: 
- Check that all three environment variables are set:
  - `WATI_VENDOR_UID`
  - `WATI_API_TOKEN`
  - `WATI_PHONE_NUMBER_ID`
- Restart your server after updating `.env`

### Issue: "Invalid phone number format"

**Solution**:
- Phone numbers should be 7-15 digits
- Include country code (e.g., 91 for India)
- Format: `919876543210` (91 + 10-digit number)

### Issue: Messages not being delivered

**Solution**:
- Verify phone number is registered and active in WATI
- Check WATI dashboard for delivery status
- Ensure recipient has WhatsApp installed
- Verify phone number format (should include country code)

### Issue: "Authentication failed"

**Solution**:
- Verify `WATI_API_TOKEN` is correct
- Check token hasn't expired
- Regenerate token in WATI dashboard if needed

---

## Next Steps

1. ✅ Complete WATI setup (register number, get credentials)
2. ✅ Add environment variables to `.env` file
3. ✅ Restart server
4. ✅ Test using Postman (see `WHATSAPP_POSTMAN_TESTING.md`)
5. ✅ Verify message delivery
6. ✅ Set up automation triggers for leads/users

---

## Support

For WATI-specific issues:
- WATI Documentation: https://docs.wati.io
- WATI Support: support@wati.io

For API issues:
- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Test using the `/api/v1/whatsapp/status` endpoint




