# Frontend API Endpoints Summary - Complete List

## 🔐 Authentication Required
All endpoints (except public lead creation) require:
```
Authorization: Bearer <access_token>
```

---

## 📊 Dashboard Endpoints

### 1. Dashboard Statistics
```http
GET /api/v1/dashboard/stats
```

### 2. Leads by Dashboard Stages ⭐ **FOR STAGE TRACKING**
```http
GET /api/v1/dashboard/leads-by-stages
```
**Tracks**: START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED

### 3. Converted Leads with Colleges ⭐ **FOR CONVERSION TRACKING**
```http
GET /api/v1/dashboard/converted-leads?page=1&limit=10
```

### 4. Recent Activities
```http
GET /api/v1/dashboard/activities?limit=10
```

### 5. Lead Funnel Data
```http
GET /api/v1/dashboard/funnel
```

### 6. Monthly Trends
```http
GET /api/v1/dashboard/trends?months=6
```

### 7. Performance Metrics
```http
GET /api/v1/dashboard/metrics
```

---

## 📥 Lead Management Endpoints

### 1. Create Lead (Public - No Auth)
```http
POST /api/v1/leads
Body: {
  "email": "required",
  "name": "optional",
  "organization": "optional but REQUIRED for conversion",
  "phone": "optional",
  "requirement": "optional",
  "source": "optional"
}
```

### 2. Get All Leads
```http
GET /api/v1/leads?page=1&limit=10&stage=IN_PROGRESS&status=ACTIVE
```

### 3. Get Lead by ID
```http
GET /api/v1/leads/{leadId}
```

### 4. Update Lead Status ⭐ **FOR CONVERSION**
```http
PATCH /api/v1/leads/{leadId}/status
Body: {
  "stage": "CONVERT",  // Use CONVERT to trigger college creation
  "notes": "optional",
  "value": "optional"
}
```

**Response includes warning if organization is missing:**
```json
{
  "success": true,
  "message": "Lead status updated successfully. Warning: Lead converted but college not created: organization field is missing...",
  "warning": "Lead converted but college not created: organization field is missing...",
  "data": { ... }
}
```

### 5. Update Lead
```http
PUT /api/v1/leads/{leadId}
```

### 6. Assign Lead
```http
PATCH /api/v1/leads/{leadId}/assign
```

### 7. Get Lead Statistics
```http
GET /api/v1/leads/stats
```

### 8. Delete Lead
```http
DELETE /api/v1/leads/{leadId}
```

---

## 🏫 College Management Endpoints

### 1. Get All Colleges
```http
GET /api/v1/colleges?page=1&limit=10&search=ABC&status=ACTIVE
```

### 2. Get College by ID
```http
GET /api/v1/colleges/{collegeId}
```

### 3. Get College Statistics
```http
GET /api/v1/colleges/stats
```

### 4. Get Colleges by Status
```http
GET /api/v1/colleges/status/{status}
```

### 5. Create College
```http
POST /api/v1/colleges
```

### 6. Update College
```http
PUT /api/v1/colleges/{collegeId}
```

### 7. Delete College
```http
DELETE /api/v1/colleges/{collegeId}
```

---

## ✅ Implementation Status

### ✅ Already Implemented
- Dashboard stage tracking (START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED)
- Converted leads with colleges endpoint
- Lead to college conversion logic
- Enhanced error messages for missing organization

### ✅ Just Fixed
- Better conversion warnings when organization is missing
- Clear error messages in API responses

---

## 🎯 Critical Endpoints for Your Requirements

### For Dashboard Stage Tracking
```
GET /api/v1/dashboard/leads-by-stages
```

### For Lead Conversion
```
PATCH /api/v1/leads/{leadId}/status
Body: { "stage": "CONVERT" }
```

### For Viewing Converted Leads
```
GET /api/v1/dashboard/converted-leads?page=1&limit=10
```

### For Updating Lead Stage
```
PATCH /api/v1/leads/{leadId}/status
Body: { "stage": "START|IN_CONVERSATION|EMAIL_WHATSAPP|IN_PROGRESS|DENIED" }
```

---

See `FRONTEND_INTEGRATION_GUIDE.md` for detailed examples and implementation guide.


