# Frontend Integration Guide - Leads & Colleges Dashboard

## 🔍 Issues Identified & Solutions

### Issue 1: Lead to College Conversion Not Working
**Problem**: Leads with stage `CONVERTED` are not creating colleges in the college table.

**Root Cause Analysis**:
1. Conversion requires `organization` field to be present
2. Conversion triggers on `CONVERT` or `CONVERTED` stage
3. If `organization` is missing, conversion happens but no college is created

**Solution**: 
- ✅ Ensure `organization` field is filled before conversion
- ✅ Use `CONVERT` stage (not `CONVERTED`) to trigger conversion
- ✅ Backend automatically creates college when `organization` exists

### Issue 2: Dashboard Stage Tracking
**Status**: ✅ **ALREADY IMPLEMENTED**

The dashboard tracking for these stages is already implemented:
- START
- IN_CONVERSATION
- EMAIL_WHATSAPP
- IN_PROGRESS
- CONVERT
- DENIED

---

## 📡 Complete API Endpoints for Frontend Integration

### 🔐 Authentication
All endpoints (except public lead creation) require:
```
Authorization: Bearer <access_token>
```

---

## 📊 Dashboard Endpoints

### 1. Get Dashboard Statistics
```http
GET /api/v1/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "totalColleges": 25,
    "totalTrainers": 10,
    "totalUsers": 5,
    "recentLeads": 12,
    "conversionRate": 16.67,
    "activeTrainings": 8,
    "monthlyRevenue": 500000
  }
}
```

### 2. Get Leads by Dashboard Stages ⭐ **NEW**
```http
GET /api/v1/dashboard/leads-by-stages
Authorization: Bearer <token>
```

**Purpose**: Track leads in specific stages for dashboard visualization

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "stage": "START",
      "count": 15,
      "leads": [
        {
          "id": "uuid",
          "name": "John Doe",
          "email": "john@example.com",
          "organization": "ABC College",
          "stage": "START",
          "status": "ACTIVE",
          "priority": "HIGH",
          "updatedAt": "2025-11-13T...",
          "assignedTo": {
            "id": "user-uuid",
            "name": "Sales Person",
            "email": "sales@upskillway.com"
          }
        }
      ]
    },
    {
      "stage": "IN_CONVERSATION",
      "count": 8,
      "leads": [...]
    },
    {
      "stage": "EMAIL_WHATSAPP",
      "count": 12,
      "leads": [...]
    },
    {
      "stage": "IN_PROGRESS",
      "count": 20,
      "leads": [...]
    },
    {
      "stage": "CONVERT",
      "count": 5,
      "leads": [...]
    },
    {
      "stage": "DENIED",
      "count": 3,
      "leads": [...]
    }
  ]
}
```

**Use Case**: Display leads grouped by stage in dashboard cards/columns

### 3. Get Converted Leads with Colleges ⭐ **NEW**
```http
GET /api/v1/dashboard/converted-leads?page=1&limit=10
Authorization: Bearer <token>
```

**Purpose**: View all converted leads and their associated colleges

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead-uuid",
      "name": "John Doe",
      "email": "john@abc.edu",
      "organization": "ABC College",
      "stage": "CONVERTED",
      "status": "CONVERTED",
      "convertedAt": "2025-11-13T10:00:00Z",
      "college": {
        "id": "college-uuid",
        "name": "ABC College",
        "status": "PROSPECTIVE",
        "city": "Mumbai",
        "state": "Maharashtra",
        "contactEmail": "john@abc.edu",
        "contactPhone": "+1234567890"
      },
      "assignedTo": {
        "id": "user-uuid",
        "name": "Sales Person",
        "email": "sales@upskillway.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Use Case**: Show converted leads that have been transferred to colleges table

### 4. Get Recent Activities
```http
GET /api/v1/dashboard/activities?limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number, default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity-uuid",
      "type": "STAGE_CHANGE",
      "description": "Lead stage changed from IN_PROGRESS to CONVERT",
      "notes": "Ready to convert",
      "performedBy": "user-uuid",
      "createdAt": "2025-11-13T10:00:00Z",
      "lead": {
        "id": "lead-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "organization": "ABC College",
        "stage": "CONVERT",
        "status": "ACTIVE"
      }
    }
  ]
}
```

### 5. Get Lead Funnel Data
```http
GET /api/v1/dashboard/funnel
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "funnelData": [
      {
        "stage": "LEAD_GENERATED",
        "count": 50,
        "percentage": 33.33
      },
      {
        "stage": "IN_PROGRESS",
        "count": 30,
        "percentage": 20.00
      },
      {
        "stage": "CONVERTED",
        "count": 25,
        "percentage": 16.67
      }
    ],
    "conversionRate": 16.67
  }
}
```

### 6. Get Monthly Trends
```http
GET /api/v1/dashboard/trends?months=6
Authorization: Bearer <token>
```

**Query Parameters:**
- `months` (number, default: 6, max: 12)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "Jun 2025",
      "leads": 25,
      "converted": 5,
      "colleges": 5,
      "conversionRate": 20.00
    },
    {
      "month": "Jul 2025",
      "leads": 30,
      "converted": 8,
      "colleges": 8,
      "conversionRate": 26.67
    }
  ]
}
```

### 7. Get Performance Metrics
```http
GET /api/v1/dashboard/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 500000,
    "avgDealSize": 20000,
    "conversionRate": 16.67,
    "avgResponseTime": 0
  }
}
```

---

## 📥 Lead Management Endpoints

### 1. Create Lead (Public - No Auth)
```http
POST /api/v1/leads
Content-Type: application/json

{
  "email": "contact@college.edu",
  "name": "John Doe",
  "organization": "ABC College",  // ⚠️ IMPORTANT: Required for conversion
  "phone": "+1234567890",
  "requirement": "Need training for 100 students",
  "source": "Website"
}
```

**Note**: `organization` field is **critical** for automatic college creation on conversion!

### 2. Get All Leads
```http
GET /api/v1/leads?page=1&limit=10&stage=IN_PROGRESS&status=ACTIVE
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string) - Search in name, email, organization, phone
- `stage` (LeadStage) - Filter by stage
- `status` (LeadStatus) - Filter by status
- `priority` (Priority) - Filter by priority
- `assignedTo` (UUID) - Filter by assigned user
- `collegeId` (UUID) - Filter by college
- `source` (string) - Filter by source

### 3. Get Lead by ID
```http
GET /api/v1/leads/{leadId}
Authorization: Bearer <token>
```

**Response includes**: activities, assignedTo, college

### 4. Update Lead Status ⭐ **CRITICAL FOR CONVERSION**
```http
PATCH /api/v1/leads/{leadId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "stage": "CONVERT",  // ⚠️ Use "CONVERT" to trigger college creation
  "notes": "Ready to convert to college",
  "value": 50000
}
```

**Important Notes**:
- Use `"stage": "CONVERT"` to trigger automatic college creation
- Backend automatically changes it to `CONVERTED` after processing
- College is created only if `organization` field exists in lead
- If college with same name exists, lead is linked to existing college

**Response:**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "data": {
    "id": "lead-uuid",
    "name": "John Doe",
    "email": "john@abc.edu",
    "organization": "ABC College",
    "stage": "CONVERTED",  // Auto-updated from CONVERT
    "status": "CONVERTED",  // Auto-updated
    "convertedAt": "2025-11-13T10:00:00Z",
    "collegeId": "college-uuid",  // Auto-set
    "college": {
      "id": "college-uuid",
      "name": "ABC College",
      "status": "PROSPECTIVE",
      "contactEmail": "john@abc.edu",
      "contactPhone": "+1234567890"
    },
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person",
      "email": "sales@upskillway.com"
    }
  }
}
```

### 5. Update Lead (General)
```http
PUT /api/v1/leads/{leadId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "organization": "ABC College",  // Can update organization
  "phone": "+1234567890",
  "priority": "HIGH"
}
```

### 6. Assign Lead
```http
PATCH /api/v1/leads/{leadId}/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedToId": "user-uuid",
  "collegeId": "college-uuid",  // Optional: Link to existing college
  "priority": "HIGH",
  "notes": "High priority lead"
}
```

### 7. Get Lead Statistics
```http
GET /api/v1/leads/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "totalConverted": 25,
    "conversionPercentage": 16.67,
    "leadsByStage": [
      { "stage": "LEAD_GENERATED", "count": 50 },
      { "stage": "IN_PROGRESS", "count": 30 },
      { "stage": "CONVERTED", "count": 25 }
    ],
    "leadsBySource": [
      { "source": "Website", "count": 80 }
    ],
    "leadsByStatus": [
      { "status": "ACTIVE", "count": 100 },
      { "status": "CONVERTED", "count": 25 }
    ],
    "recentLeads": [...]
  }
}
```

---

## 🏫 College Management Endpoints

### 1. Get All Colleges
```http
GET /api/v1/colleges?page=1&limit=10&search=ABC&status=ACTIVE
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `type`, `assignedTo`

### 2. Get College by ID
```http
GET /api/v1/colleges/{collegeId}
Authorization: Bearer <token>
```

**Response includes**: leads, trainers, trainings

### 3. Get College Statistics
```http
GET /api/v1/colleges/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalColleges": 25,
    "activePartners": 15,
    "totalRevenue": 500000,
    "avgRating": 4.5,
    "collegesByStatus": [...],
    "collegesByType": [...]
  }
}
```

### 4. Get Colleges by Status
```http
GET /api/v1/colleges/status/{status}
Authorization: Bearer <token>
```

**Status values**: `PROSPECTIVE`, `ACTIVE`, `INACTIVE`, `PARTNER`

### 5. Create College
```http
POST /api/v1/colleges
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "XYZ College",
  "city": "Delhi",
  "state": "Delhi",
  "type": "ENGINEERING",
  "contactPerson": "John Doe",
  "contactEmail": "contact@xyz.edu",
  "contactPhone": "+1234567890",
  "assignedToId": "user-uuid"  // Optional
}
```

### 6. Update College
```http
PUT /api/v1/colleges/{collegeId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACTIVE",
  "totalRevenue": 100000,
  "avgRating": 4.5
}
```

---

## 🔄 Complete Conversion Flow for Frontend

### Step-by-Step Implementation

#### Step 1: Create Lead (Public Form)
```typescript
// ⚠️ IMPORTANT: Include organization field
const createLead = async (data: {
  email: string;
  name?: string;
  organization?: string;  // Required for conversion!
  phone?: string;
  requirement?: string;
  source?: string;
}) => {
  const response = await fetch('/api/v1/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

#### Step 2: Update Lead Through Stages
```typescript
// Update lead stage for dashboard tracking
const updateLeadStage = async (leadId: string, stage: string) => {
  const response = await fetch(`/api/v1/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      stage: stage,  // START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, etc.
      notes: `Stage updated to ${stage}`
    })
  });
  return response.json();
};
```

#### Step 3: Convert Lead to College ⭐ **CRITICAL**
```typescript
// Convert lead - triggers college creation
const convertLeadToCollege = async (leadId: string) => {
  const response = await fetch(`/api/v1/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      stage: 'CONVERT',  // ⚠️ Use "CONVERT" (not "CONVERTED")
      notes: 'Lead converted to college'
    })
  });
  
  const result = await response.json();
  
  // Check if college was created
  if (result.data.college) {
    console.log('College created:', result.data.college);
    // College is now in colleges table
  } else {
    console.warn('College not created - check if organization field exists');
  }
  
  return result;
};
```

#### Step 4: Track Stages on Dashboard
```typescript
// Get leads grouped by dashboard stages
const getDashboardStages = async () => {
  const response = await fetch('/api/v1/dashboard/leads-by-stages', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Usage in React component
const Dashboard = () => {
  const [stageData, setStageData] = useState([]);
  
  useEffect(() => {
    getDashboardStages().then(data => {
      setStageData(data.data);
    });
  }, []);
  
  return (
    <div className="dashboard-stages">
      {stageData.map(stageGroup => (
        <StageColumn
          key={stageGroup.stage}
          stage={stageGroup.stage}
          count={stageGroup.count}
          leads={stageGroup.leads}
        />
      ))}
    </div>
  );
};
```

#### Step 5: View Converted Leads with Colleges
```typescript
// Get all converted leads that are now in colleges table
const getConvertedLeads = async (page = 1, limit = 10) => {
  const response = await fetch(
    `/api/v1/dashboard/converted-leads?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.json();
};
```

---

## 🐛 Troubleshooting Conversion Issues

### Problem: College Not Created After Conversion

**Checklist:**
1. ✅ Does the lead have `organization` field?
   ```typescript
   // Before conversion, verify:
   const lead = await getLeadById(leadId);
   if (!lead.organization) {
     // Update lead to add organization
     await updateLead(leadId, {
       organization: "College Name"
     });
   }
   ```

2. ✅ Are you using `CONVERT` stage (not `CONVERTED`)?
   ```typescript
   // ✅ Correct
   { stage: "CONVERT" }
   
   // ❌ Wrong (might not trigger conversion properly)
   { stage: "CONVERTED" }
   ```

3. ✅ Check the response for college data:
   ```typescript
   const result = await convertLeadToCollege(leadId);
   if (result.data.college) {
     // College created successfully
   } else if (result.data.collegeId) {
     // Linked to existing college
   } else {
     // College not created - check organization field
   }
   ```

### Problem: Dashboard Not Showing Stage Updates

**Solution:**
- Use `GET /api/v1/dashboard/leads-by-stages` endpoint
- This endpoint tracks: START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED
- Refresh dashboard after stage updates

---

## 📋 Frontend Integration Checklist

### Dashboard Integration
- [ ] Integrate `GET /api/v1/dashboard/leads-by-stages` for stage tracking
- [ ] Display 6 stage columns: START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED
- [ ] Show lead count for each stage
- [ ] Show recent leads (up to 10) in each stage column
- [ ] Update dashboard when lead stage changes

### Lead Conversion Integration
- [ ] Ensure `organization` field is captured in lead creation form
- [ ] Add "Convert to College" button/action
- [ ] Call `PATCH /api/v1/leads/{id}/status` with `stage: "CONVERT"`
- [ ] Handle response and check for `college` object
- [ ] Show success message with college details
- [ ] Redirect to colleges list or show college in converted leads view

### Converted Leads View
- [ ] Integrate `GET /api/v1/dashboard/converted-leads`
- [ ] Display converted leads with their college information
- [ ] Show pagination
- [ ] Link to college detail page

### Stage Updates
- [ ] Add stage dropdown/selector in lead detail view
- [ ] Call `PATCH /api/v1/leads/{id}/status` on stage change
- [ ] Refresh dashboard after stage update
- [ ] Show activity log for stage changes

---

## 🎯 Quick Reference: Critical Endpoints

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

## 📝 Example Frontend Code Snippets

### React Hook for Dashboard Stages
```typescript
import { useState, useEffect } from 'react';

export const useDashboardStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/v1/dashboard/leads-by-stages', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStages(data.data);
        setLoading(false);
      });
  }, []);
  
  return { stages, loading };
};
```

### Convert Lead Function
```typescript
export const convertLead = async (leadId: string, token: string) => {
  try {
    const response = await fetch(`/api/v1/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stage: 'CONVERT',
        notes: 'Converted to college'
      })
    });
    
    const result = await response.json();
    
    if (result.success && result.data.college) {
      return {
        success: true,
        lead: result.data,
        college: result.data.college,
        message: `College "${result.data.college.name}" created successfully`
      };
    } else {
      return {
        success: false,
        message: 'College not created. Please ensure lead has organization field.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};
```

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025

