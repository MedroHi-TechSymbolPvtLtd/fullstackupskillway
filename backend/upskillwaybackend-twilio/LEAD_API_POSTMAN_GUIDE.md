# Lead API - Complete Field List & Postman Testing Guide

## 📋 Complete Lead Fields

### Required Fields (for Public Lead Creation)
- **name** (string, max 100 chars) - Lead's full name
- **email** (string, valid email) - Lead's email address

### Optional Fields (for Public Lead Creation)
- **organization** (string, max 100 chars) - Company/Organization name
- **phone** (string, valid phone format) - Contact phone number
- **requirement** (string, max 1000 chars) - Lead's requirement/need description
- **source** (string, max 100 chars) - Lead source (e.g., "website", "referral", "social-media")

### Additional Fields (Admin/Sales Only - for Updates)
- **assignedToId** (UUID) - User ID to assign lead to
- **collegeId** (UUID) - College ID to associate with lead
- **priority** (enum) - Priority level: `LOW`, `MEDIUM`, `HIGH`, `URGENT` (default: `MEDIUM`)
- **stage** (enum) - Lead stage (see LeadStage enum below)
- **status** (enum) - Lead status (see LeadStatus enum below)
- **notes** (string, max 2000 chars) - Internal notes about the lead
- **value** (number, min 0) - Lead value/deal amount
- **nextFollowUp** (DateTime) - Next follow-up date/time

### Auto-Generated Fields (Read-only)
- **id** (UUID) - Unique identifier
- **createdAt** (DateTime) - Creation timestamp
- **updatedAt** (DateTime) - Last update timestamp
- **convertedAt** (DateTime, nullable) - Conversion timestamp (when lead converted)
- **lastContactAt** (DateTime, nullable) - Last contact timestamp
- **assignedTo** (Object) - Assigned user details
- **college** (Object) - Associated college details
- **activities** (Array) - Lead activity history

---

## 📊 Lead Stage Enum Values

The `stage` field can be one of:
- `LEAD_GENERATED` - Initial lead creation
- `CONTACTED` - Lead has been contacted
- `DEMO_GIVEN` - Demo has been provided
- `TRAINING_BOOKED` - Training has been booked
- `START` - Process has started
- `IN_CONVERSATION` - Currently in conversation
- `EMAIL_WHATSAPP` - Communication via email/WhatsApp
- `PENDING` - Pending action
- `IN_PROGRESS` - Lead is in progress
- `CLOSED_WON` - Lead won/converted successfully
- `FEEDBACK_COLLECTED` - Feedback has been collected
- `CONVERT` - Ready to convert
- `CONVERTED` - Successfully converted
- `DENIED` - Lead denied/rejected

---

## 📊 Lead Status Enum Values

The `status` field can be one of:
- `NEW` - New lead
- `CONTACTED` - Lead has been contacted
- `QUALIFIED` - Lead has been qualified
- `PROPOSAL` - Proposal sent
- `NEGOTIATION` - In negotiation
- `CLOSED_WON` - Deal won
- `CLOSED_LOST` - Deal lost
- `ACTIVE` - Active lead (default)
- `CONVERTED` - Lead converted
- `DENIED` - Lead denied
- `RECYCLED` - Lead recycled

---

## 📊 Priority Enum Values

The `priority` field can be one of:
- `LOW` - Low priority
- `MEDIUM` - Medium priority (default)
- `HIGH` - High priority
- `URGENT` - Urgent priority

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:PORT/api/v1`

Replace `PORT` with your server port (usually `3000` or `5000`)

---

### 1. **POST Create Lead** (Public - No Auth Required)

**Endpoint:**
```
POST /api/v1/leads
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/leads`
- **Headers:**
  - `Content-Type: application/json`
- **Body:** Select `raw` → `JSON`

**Complete Example:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "organization": "ABC Corporation",
  "phone": "+1234567890",
  "requirement": "Need training for our development team on Node.js and TypeScript",
  "source": "website"
}
```

**Minimum Required Fields:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Lead submitted successfully",
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "organization": "ABC Corporation",
    "phone": "+1234567890",
    "requirement": "Need training for our development team",
    "source": "website",
    "priority": "MEDIUM",
    "stage": "LEAD_GENERATED",
    "status": "ACTIVE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. **GET All Leads** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
GET /api/v1/leads
```

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10, max: 100) - Items per page
- `search` (string, optional) - Search in name, email, organization
- `stage` (enum, optional) - Filter by stage (see LeadStage enum)
- `status` (enum, optional) - Filter by status (see LeadStatus enum)
- `priority` (enum, optional) - Filter by priority: `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- `assignedTo` (UUID, optional) - Filter by assigned user ID
- `collegeId` (UUID, optional) - Filter by college ID
- `source` (string, optional) - Filter by source

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/leads?page=1&limit=10`
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example with Filters:**
```
http://localhost:3000/api/v1/leads?page=1&limit=10&status=ACTIVE&priority=HIGH&stage=IN_CONVERSATION
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "organization": "ABC Corporation",
      "phone": "+1234567890",
      "requirement": "Need training...",
      "source": "website",
      "priority": "HIGH",
      "stage": "IN_CONVERSATION",
      "status": "ACTIVE",
      "value": 5000.00,
      "assignedToId": "user-uuid",
      "collegeId": "college-uuid",
      "notes": "Follow up next week",
      "nextFollowUp": "2024-01-15T10:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z",
      "convertedAt": null,
      "lastContactAt": "2024-01-02T09:00:00.000Z",
      "assignedTo": {
        "id": "user-uuid",
        "name": "Sales Person",
        "email": "sales@example.com"
      },
      "college": {
        "id": "college-uuid",
        "name": "ABC College"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### 3. **GET Lead by ID** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
GET /api/v1/leads/:id
```

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/leads/{lead-id-uuid}`
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "organization": "ABC Corporation",
    "phone": "+1234567890",
    "requirement": "Need training...",
    "source": "website",
    "priority": "HIGH",
    "stage": "IN_CONVERSATION",
    "status": "ACTIVE",
    "value": 5000.00,
    "assignedToId": "user-uuid",
    "collegeId": "college-uuid",
    "notes": "Follow up next week",
    "nextFollowUp": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "convertedAt": null,
    "lastContactAt": "2024-01-02T09:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person",
      "email": "sales@example.com"
    },
    "college": {
      "id": "college-uuid",
      "name": "ABC College"
    },
    "activities": []
  }
}
```

---

### 4. **PUT Update Lead** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
PUT /api/v1/leads/:id
```

**Postman Setup:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/v1/leads/{lead-id-uuid}`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON` (All fields optional)

**Update Basic Info:**
```json
{
  "name": "John Doe Updated",
  "phone": "+9876543210",
  "organization": "XYZ Corp"
}
```

**Update with Priority and Status:**
```json
{
  "priority": "HIGH",
  "stage": "IN_CONVERSATION",
  "status": "QUALIFIED",
  "notes": "Client is very interested, follow up ASAP"
}
```

**Assign Lead:**
```json
{
  "assignedToId": "user-uuid",
  "collegeId": "college-uuid",
  "priority": "URGENT"
}
```

**Update Value:**
```json
{
  "value": 10000.00,
  "status": "PROPOSAL"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "id": "lead-uuid",
    "name": "John Doe Updated",
    "priority": "HIGH",
    "stage": "IN_CONVERSATION",
    "status": "QUALIFIED",
    "value": 10000.00,
    "updatedAt": "2024-01-03T00:00:00.000Z"
  }
}
```

---

### 5. **PATCH Update Lead Status** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
PATCH /api/v1/leads/:id/status
```

**Postman Setup:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/v1/leads/{lead-id-uuid}/status`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON`

**Required Field:** `stage`

**Example:**
```json
{
  "stage": "IN_PROGRESS",
  "status": "ACTIVE",
  "notes": "Client approved proposal, moving to next phase",
  "nextFollowUp": "2024-01-20T14:00:00.000Z",
  "value": 15000.00
}
```

**Move to Conversion:**
```json
{
  "stage": "CONVERT",
  "status": "CONVERTED",
  "notes": "Lead successfully converted to customer",
  "value": 20000.00
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "data": {
    "id": "lead-uuid",
    "stage": "IN_PROGRESS",
    "status": "ACTIVE",
    "notes": "Client approved proposal",
    "value": 15000.00,
    "nextFollowUp": "2024-01-20T14:00:00.000Z",
    "updatedAt": "2024-01-03T12:00:00.000Z"
  }
}
```

---

### 6. **PATCH Assign Lead** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
PATCH /api/v1/leads/:id/assign
```

**Postman Setup:**
- **Method:** `PATCH`
- **URL:** `http://localhost:3000/api/v1/leads/{lead-id-uuid}/assign`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON`

**Required Field:** `assignedToId`

**Example:**
```json
{
  "assignedToId": "user-uuid-here",
  "collegeId": "college-uuid-here",
  "priority": "HIGH",
  "notes": "Assigning to sales rep for follow up"
}
```

**Assign to User Only:**
```json
{
  "assignedToId": "user-uuid-here",
  "priority": "URGENT"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Lead assigned successfully",
  "data": {
    "id": "lead-uuid",
    "assignedToId": "user-uuid-here",
    "collegeId": "college-uuid-here",
    "priority": "HIGH",
    "notes": "Assigning to sales rep",
    "updatedAt": "2024-01-03T12:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid-here",
      "name": "Sales Person",
      "email": "sales@example.com"
    }
  }
}
```

---

### 7. **DELETE Lead** (Admin Only - Auth Required)

**Endpoint:**
```
DELETE /api/v1/leads/:id
```

**Postman Setup:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/v1/leads/{lead-id-uuid}`
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

### 8. **GET Lead Statistics** (Admin/Sales Only - Auth Required)

**Endpoint:**
```
GET /api/v1/leads/stats
```

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/leads/stats`
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "leadsBySource": [
      {
        "source": "website",
        "count": 75
      },
      {
        "source": "referral",
        "count": 45
      },
      {
        "source": "social-media",
        "count": 30
      }
    ],
    "recentLeads": [
      {
        "id": "uuid-1",
        "name": "John Doe",
        "email": "john@example.com",
        "organization": "ABC Corp",
        "source": "website",
        "createdAt": "2024-01-03T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 🔑 Authentication Setup in Postman

### Step 1: Get Access Token

**Endpoint:**
```
POST /api/v1/auth/login
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**Copy the `accessToken` value!**

### Step 2: Set Authorization Header

In Postman:
1. Go to the **Authorization** tab
2. Select **Type: Bearer Token**
3. Paste your token in the **Token** field

OR manually in Headers:
- **Key:** `Authorization`
- **Value:** `Bearer {your-access-token}`

---

## 📝 Postman Collection

```json
{
  "info": {
    "name": "Lead API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Lead (Public)",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"organization\": \"ABC Corporation\",\n  \"phone\": \"+1234567890\",\n  \"requirement\": \"Need training for our team\",\n  \"source\": \"website\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/leads",
          "host": ["{{baseUrl}}"],
          "path": ["leads"]
        }
      }
    },
    {
      "name": "Get All Leads",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/leads?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["leads"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "limit", "value": "10"},
            {"key": "status", "value": "ACTIVE", "disabled": true},
            {"key": "priority", "value": "HIGH", "disabled": true}
          ]
        }
      }
    },
    {
      "name": "Get Lead by ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/leads/:id",
          "host": ["{{baseUrl}}"],
          "path": ["leads", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Update Lead",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"priority\": \"HIGH\",\n  \"stage\": \"IN_CONVERSATION\",\n  \"notes\": \"Update notes\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/leads/:id",
          "host": ["{{baseUrl}}"],
          "path": ["leads", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Update Lead Status",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"stage\": \"IN_PROGRESS\",\n  \"status\": \"ACTIVE\",\n  \"notes\": \"Status update\",\n  \"value\": 10000.00\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/leads/:id/status",
          "host": ["{{baseUrl}}"],
          "path": ["leads", ":id", "status"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Assign Lead",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"assignedToId\": \"user-uuid\",\n  \"collegeId\": \"college-uuid\",\n  \"priority\": \"HIGH\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/leads/:id/assign",
          "host": ["{{baseUrl}}"],
          "path": ["leads", ":id", "assign"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Delete Lead",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/leads/:id",
          "host": ["{{baseUrl}}"],
          "path": ["leads", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Get Lead Stats",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}",
            "type": "text"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/leads/stats",
          "host": ["{{baseUrl}}"],
          "path": ["leads", "stats"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    }
  ]
}
```

---

## ✅ Field Validation Rules

### Name
- **Required:** Yes (for creation)
- **Type:** String
- **Min Length:** 1 character
- **Max Length:** 100 characters

### Email
- **Required:** Yes (for creation)
- **Type:** String (valid email format)

### Organization
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 100 characters

### Phone
- **Required:** No (Optional)
- **Type:** String (valid phone format)

### Requirement
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 1000 characters

### Source
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 100 characters

### Priority
- **Required:** No (Optional)
- **Type:** Enum
- **Values:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`
- **Default:** `MEDIUM`

### Stage
- **Required:** No (Optional, but required for status update)
- **Type:** Enum (see LeadStage enum values)
- **Default:** `LEAD_GENERATED`

### Status
- **Required:** No (Optional)
- **Type:** Enum (see LeadStatus enum values)
- **Default:** `ACTIVE`

### Notes
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 2000 characters

### Value
- **Required:** No (Optional)
- **Type:** Number
- **Min:** 0

---

## 🚨 Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Admin/Sales access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Lead not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## 💡 Testing Tips

1. **Start with Public POST** - Test lead creation without authentication
2. **Get access token** - Login to test authenticated endpoints
3. **Test all stages** - Try updating leads through different stages
4. **Test filters** - Use query parameters to filter leads
5. **Test assignment** - Assign leads to different users/colleges
6. **Test priority levels** - Try different priority values
7. **Use environment variables** - Set `baseUrl` and `accessToken` as Postman variables
8. **Check statistics** - Use the stats endpoint to see lead analytics

---

## 📋 Quick Reference - All Lead Fields

| Field | Type | Required | Max Length | Default | Notes |
|-------|------|----------|------------|---------|-------|
| `name` | string | ✅ Yes | 100 | - | Required for creation |
| `email` | string | ✅ Yes | - | - | Valid email, required for creation |
| `organization` | string | ❌ No | 100 | - | Optional |
| `phone` | string | ❌ No | - | - | Valid phone format |
| `requirement` | string | ❌ No | 1000 | - | Optional |
| `source` | string | ❌ No | 100 | - | Optional |
| `assignedToId` | UUID | ❌ No | - | - | Admin/Sales only |
| `collegeId` | UUID | ❌ No | - | - | Admin/Sales only |
| `priority` | enum | ❌ No | - | `MEDIUM` | LOW, MEDIUM, HIGH, URGENT |
| `stage` | enum | ❌ No | - | `LEAD_GENERATED` | See LeadStage enum |
| `status` | enum | ❌ No | - | `ACTIVE` | See LeadStatus enum |
| `notes` | string | ❌ No | 2000 | - | Admin/Sales only |
| `value` | number | ❌ No | - | - | Min: 0 |
| `nextFollowUp` | DateTime | ❌ No | - | - | ISO 8601 format |
| `id` | UUID | Auto | - | Auto | Read-only |
| `createdAt` | DateTime | Auto | - | Auto | Read-only |
| `updatedAt` | DateTime | Auto | - | Auto | Read-only |
| `convertedAt` | DateTime | Auto | - | null | Read-only |
| `lastContactAt` | DateTime | Auto | - | null | Read-only |

---

## 🎯 Sample Test Cases

### Test Case 1: Create Lead (Public)
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@company.com",
  "organization": "Tech Solutions Inc",
  "phone": "+1-555-123-4567",
  "requirement": "Need comprehensive training on cloud infrastructure and DevOps practices",
  "source": "website"
}
```

### Test Case 2: Update Lead Priority and Stage
```json
{
  "priority": "URGENT",
  "stage": "IN_PROGRESS",
  "notes": "Client has urgent requirement, needs immediate attention"
}
```

### Test Case 3: Update Lead Status
```json
{
  "stage": "CONVERT",
  "status": "CONVERTED",
  "value": 25000.00,
  "notes": "Successfully converted to paying customer"
}
```

### Test Case 4: Assign Lead
```json
{
  "assignedToId": "sales-rep-uuid",
  "collegeId": "college-uuid",
  "priority": "HIGH",
  "notes": "Assigning to senior sales rep for better conversion"
}
```

### Test Case 5: Filter Leads
```
GET /api/v1/leads?status=ACTIVE&priority=HIGH&stage=IN_CONVERSATION&page=1&limit=20
```

---

Happy Testing! 🚀

