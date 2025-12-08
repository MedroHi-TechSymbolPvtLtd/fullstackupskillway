# WhatsApp Automation - Quick Start Guide

## Phone Number: 8468813556

---

## ✅ Setup Complete - What Was Done

1. ✅ **WhatsApp routes enabled** in `src/app.ts`
2. ✅ **API endpoints ready** at `/api/v1/whatsapp`
3. ✅ **Documentation created** for setup and testing

---

## 🔧 Required Configuration

Add these to your `.env` file:

```env
WATI_BASE_URL=https://wapi.in.net/api
WATI_VENDOR_UID=your-vendor-uid-from-wati
WATI_API_TOKEN=your-api-token-from-wati
WATI_PHONE_NUMBER_ID=your-phone-number-id-from-wati
```

**Important**: 
- Register phone number **8468813556** in WATI dashboard first
- Get the **Phone Number ID** from WATI (not the actual phone number)
- Get **Vendor UID** and **API Token** from WATI Settings → API

---

## 🚀 Quick Test in Postman

### Step 1: Check Status
```
GET http://localhost:3000/api/v1/whatsapp/status
Headers: Authorization: Bearer YOUR_TOKEN
```

### Step 2: Send Test Message
```
POST http://localhost:3000/api/v1/whatsapp/send
Headers: 
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN

Body:
{
  "phoneNumber": "919876543210",
  "message": "Hello! This is a test message from UpSkillWay WhatsApp automation."
}
```

### Step 3: Check Message History
```
GET http://localhost:3000/api/v1/whatsapp/history
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 📱 All Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/whatsapp/status` | GET | Check WhatsApp API status |
| `/api/v1/whatsapp/send` | POST | Send single message |
| `/api/v1/whatsapp/send-bulk` | POST | Send bulk messages (up to 100) |
| `/api/v1/whatsapp/history` | GET | Get message history |
| `/api/v1/whatsapp/statistics` | GET | Get message statistics |
| `/api/v1/whatsapp/test` | POST | Test endpoint (Admin only) |

---

## 📋 Testing Checklist

- [ ] Configure `.env` with WATI credentials
- [ ] Restart server
- [ ] Test status endpoint
- [ ] Send test message to your phone
- [ ] Verify message received
- [ ] Check message history
- [ ] Test bulk messaging
- [ ] Verify automation flow

---

## 📚 Full Documentation

- **Setup Guide**: `WHATSAPP_SETUP_GUIDE.md`
- **Postman Testing**: `WHATSAPP_POSTMAN_TESTING.md`

---

## ⚠️ Important Notes

1. **Phone Number Format**: Always include country code
   - ✅ `919876543210` (India: 91 + 10 digits)
   - ❌ `9876543210` (missing country code)

2. **Authentication**: All endpoints require Bearer token with admin/sales role

3. **Message Limits**: 
   - Max message length: 4096 characters
   - Max bulk messages: 100 per request

4. **Testing**: Always test with a real WhatsApp number that you can verify

---

## 🔄 Next Steps

1. Complete WATI setup (register number, get credentials)
2. Add environment variables
3. Restart server
4. Test using Postman
5. Verify automation works for leads/users
6. Monitor message delivery and statistics









