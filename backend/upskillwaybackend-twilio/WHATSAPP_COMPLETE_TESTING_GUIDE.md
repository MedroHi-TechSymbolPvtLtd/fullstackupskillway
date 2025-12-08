# WhatsApp Automation - Complete Testing Guide
## Phone Number: 8468813556

---

## ✅ Setup Complete

### What Has Been Done:

1. ✅ **WhatsApp routes enabled** in `src/app.ts`
2. ✅ **Automation added** for new leads (automatic WhatsApp message when lead is created with phone number)
3. ✅ **API endpoints ready** at `/api/v1/whatsapp`
4. ✅ **Postman testing documentation** created

---

## 🔧 Step 1: Configure WATI API

### A. Register Phone Number in WATI Dashboard

1. **Login to WATI**: https://app.wati.io
2. **Add Phone Number**:
   - Go to Settings → Phone Numbers
   - Click "Add Phone Number"
   - Enter: **8468813556**
   - Complete WhatsApp Business API verification
3. **Get Phone Number ID**:
   - After registration, copy the **Phone Number ID** (this is different from 8468813556)
   - It's usually a numeric string like: `123456789012345`

### B. Get API Credentials

1. **Vendor UID**:
   - Go to Settings → API
   - Copy your Vendor UID

2. **API Token**:
   - Go to Settings → API
   - Copy or generate your API Token

---

## 🔧 Step 2: Update Environment Variables

Add to your `.env` file:

```env
# WATI WhatsApp API Configuration
WATI_BASE_URL=https://wapi.in.net/api
WATI_VENDOR_UID=your-vendor-uid-here
WATI_API_TOKEN=your-api-token-here
WATI_PHONE_NUMBER_ID=your-phone-number-id-here
```

**Important**: 
- `WATI_PHONE_NUMBER_ID` is the WhatsApp Business API phone number ID from WATI dashboard
- It's NOT the actual phone number 8468813556
- It's a numeric ID that WATI assigns to your registered phone number

---

## 🔧 Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
# or
npm start
```

---

## ✅ Step 4: Verify Configuration

### Test 1: Check WhatsApp Status

```bash
GET http://localhost:3000/api/v1/whatsapp/status
Headers: Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
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

**✅ If you see this, configuration is correct!**

---

## 📱 Step 5: Test WhatsApp Messaging

### Test 2: Send Single Message (Postman)

**Endpoint:**
```
POST http://localhost:3000/api/v1/whatsapp/send
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Body:**
```json
{
  "phoneNumber": "919876543210",
  "message": "Hello! This is a test message from UpSkillWay WhatsApp automation system. Testing phone number 8468813556.",
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully",
  "data": {
    "success": true,
    "messageId": "wati-message-id-123",
    "status": "sent",
    "phoneNumber": "919876543210",
    "logId": "log-uuid",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**✅ Verify:**
- Check your WhatsApp (phone number 919876543210) - you should receive the message
- Message should be from number 8468813556

---

## 🤖 Step 6: Test Automation Flow

### Test 3: Create Lead with Phone Number (Automation Test)

**Endpoint:**
```
POST http://localhost:3000/api/v1/leads
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "919876543210",
  "organization": "Test Company",
  "requirement": "Interested in Full Stack Development course"
}
```

**What Happens:**
1. ✅ Lead is created
2. ✅ **Automatically sends WhatsApp message** to the lead's phone number
3. ✅ Message says: "Hello John! Thank you for your interest in UpSkillWay..."

**Expected Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "lead-uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "919876543210",
    ...
  }
}
```

**✅ Verify:**
- Check WhatsApp (phone number 919876543210)
- You should receive an automated welcome message
- Message should be from number 8468813556

---

### Test 4: Check Message History

**Endpoint:**
```
GET http://localhost:3000/api/v1/whatsapp/history?phoneNumber=919876543210
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "message": "WhatsApp message history retrieved successfully",
  "data": {
    "total": 2,
    "messages": [
      {
        "id": "message-uuid-1",
        "phoneNumber": "919876543210",
        "message": "Hello! This is a test message...",
        "status": "delivered",
        "messageId": "wati-message-id-123",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "message-uuid-2",
        "phoneNumber": "919876543210",
        "message": "Hello John! Thank you for your interest...",
        "status": "delivered",
        "messageId": "wati-message-id-124",
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    ]
  }
}
```

**✅ Verify:**
- You should see both messages (manual + automated)
- Status should be "delivered" or "read"

---

## 📋 Complete Testing Checklist

### Configuration Tests
- [ ] Environment variables set in `.env`
- [ ] Server restarted
- [ ] Status endpoint returns correct configuration
- [ ] Phone number 8468813556 registered in WATI

### Manual Messaging Tests
- [ ] Send single text message
- [ ] Message received on WhatsApp
- [ ] Message appears in history
- [ ] Message status updates correctly

### Automation Tests
- [ ] Create lead with phone number
- [ ] Automated WhatsApp sent to lead
- [ ] Lead receives welcome message
- [ ] Automation message logged in database

### Bulk Messaging Tests
- [ ] Send bulk messages (2-3 recipients)
- [ ] All messages delivered
- [ ] Check statistics updated

### Error Handling Tests
- [ ] Invalid phone number format
- [ ] Missing required fields
- [ ] Unauthorized access
- [ ] Invalid token

---

## 🎯 Postman Collection

### Collection Structure:

```
WhatsApp API Tests
├── 1. Check Status
├── 2. Send Single Message
├── 3. Send Bulk Messages
├── 4. Get Message History
├── 5. Get Statistics
├── 6. Test Endpoint (Admin)
└── Automation Tests
    ├── 7. Create Lead (Triggers WhatsApp)
    └── 8. Verify Automation Message
```

---

## 📱 Phone Number Format Guide

### For India (8468813556):

**Format:** `91` + `8468813556` = `918468813556`

**Examples:**
- ✅ `918468813556` (correct - with country code)
- ✅ `8468813556` (will auto-add 91)
- ❌ `+91 8468813556` (don't use + or spaces)
- ❌ `8468813556` (missing country code for WATI)

**For Recipients:**
- ✅ `919876543210` (India: 91 + 10 digits)
- ✅ `91987654321` (10 digits)
- ✅ `1234567890` (10 digits - auto-adds 91)

---

## 🔄 Automation Flow

### Lead Creation Flow:

```
1. Lead Created via POST /api/v1/leads
   ↓
2. System checks if lead has phone number
   ↓
3. If phone exists → Automatically sends WhatsApp
   ↓
4. Message: "Hello [Name]! Thank you for your interest..."
   ↓
5. Message logged in database
   ↓
6. Lead receives WhatsApp message
```

### Manual Message Flow:

```
1. Admin/Sales sends message via POST /api/v1/whatsapp/send
   ↓
2. System validates phone number
   ↓
3. Formats phone number (adds country code)
   ↓
4. Sends via WATI API
   ↓
5. Message logged in database
   ↓
6. Recipient receives message from 8468813556
```

---

## 📊 Monitoring & Verification

### Check Message Delivery:

1. **Via API**:
   ```
   GET /api/v1/whatsapp/history?phoneNumber=919876543210
   ```

2. **Via WATI Dashboard**:
   - Login to WATI
   - Go to Messages section
   - Check delivery status

3. **Via Database**:
   ```sql
   SELECT * FROM whatsapp_messages 
   WHERE phone_number = '919876543210' 
   ORDER BY created_at DESC;
   ```

### Check Statistics:

```
GET /api/v1/whatsapp/statistics
```

Returns:
- Total messages sent
- Success/failure rates
- Today/This Week/This Month stats

---

## 🐛 Troubleshooting

### Issue: "WATI API configuration is incomplete"

**Solution:**
1. Check `.env` file has all three variables:
   - `WATI_VENDOR_UID`
   - `WATI_API_TOKEN`
   - `WATI_PHONE_NUMBER_ID`
2. Restart server after updating `.env`
3. Verify using status endpoint

### Issue: Messages not being delivered

**Solutions:**
1. **Check WATI Dashboard**:
   - Verify phone number 8468813556 is active
   - Check message status in WATI dashboard
   - Verify phone number is verified

2. **Check Recipient**:
   - Recipient must have WhatsApp installed
   - Phone number must be correct format
   - Recipient must have internet connection

3. **Check Phone Format**:
   - Must include country code (91 for India)
   - No spaces, dashes, or plus signs
   - Format: `919876543210`

### Issue: Automation not working

**Solutions:**
1. **Check Admin User**:
   - Ensure at least one admin user exists in database
   - Admin user must be active

2. **Check Lead Phone**:
   - Lead must have phone number
   - Phone number must be valid format

3. **Check Logs**:
   - Check server logs for errors
   - Look for "Failed to send automated WhatsApp" messages

### Issue: "Invalid phone number format"

**Solution:**
- Use format: `919876543210` (country code + number)
- Remove spaces, dashes, plus signs
- For India: Always start with `91`

---

## ✅ Final Verification Steps

### 1. Configuration Verified
```bash
GET /api/v1/whatsapp/status
# Should return active status with your credentials
```

### 2. Manual Message Sent
```bash
POST /api/v1/whatsapp/send
# Send message to your phone
# Verify you received it
```

### 3. Automation Tested
```bash
POST /api/v1/leads
# Create lead with your phone number
# Verify you received automated message
```

### 4. History Verified
```bash
GET /api/v1/whatsapp/history
# Should show both manual and automated messages
```

### 5. Statistics Checked
```bash
GET /api/v1/whatsapp/statistics
# Should show message counts
```

---

## 📝 Important Notes

1. **Phone Number**: 8468813556 is the sender number (configured in WATI)
2. **Automation**: Automatically sends WhatsApp when lead is created with phone number
3. **Logging**: All messages are logged in database with status tracking
4. **Error Handling**: Automation failures don't break lead creation
5. **Rate Limits**: Be mindful of WATI API rate limits
6. **Testing**: Always test with real WhatsApp numbers you can verify

---

## 🎯 Quick Test Commands

### Test 1: Status Check
```bash
curl -X GET "http://localhost:3000/api/v1/whatsapp/status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Send Message
```bash
curl -X POST "http://localhost:3000/api/v1/whatsapp/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "phoneNumber": "919876543210",
    "message": "Test message from UpSkillWay"
  }'
```

### Test 3: Create Lead (Triggers Automation)
```bash
curl -X POST "http://localhost:3000/api/v1/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "919876543210",
    "requirement": "Test requirement"
  }'
```

---

## 📚 Documentation Files

1. **WHATSAPP_SETUP_GUIDE.md** - Complete setup instructions
2. **WHATSAPP_POSTMAN_TESTING.md** - Detailed Postman testing guide
3. **WHATSAPP_QUICK_START.md** - Quick reference
4. **WHATSAPP_COMPLETE_TESTING_GUIDE.md** - This file (complete testing)

---

## 🎉 You're Ready!

Once you complete all steps:
1. ✅ WATI configured
2. ✅ Environment variables set
3. ✅ Server restarted
4. ✅ Status endpoint working
5. ✅ Test message sent and received
6. ✅ Automation tested

**Your WhatsApp automation with phone number 8468813556 is now active!**

All messages will be sent from this number to leads and users automatically.




