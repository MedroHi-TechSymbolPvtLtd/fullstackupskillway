# Study Abroad API - Complete Field List & Postman Testing Guide

## 📋 Complete Study Abroad Fields

### Required Fields
- **city** (string, max 100 chars) - City name where study abroad program is located
- **universities** (array of strings, min 1) - List of universities in that city (at least one required)

### Optional Fields
- **imageUrl** (string, valid URL) - Image URL for the city/study abroad program
- **avgTuition** (number, min 0) - Average tuition cost (decimal with 2 decimal places)
- **livingCost** (number, min 0) - Average living cost (decimal with 2 decimal places)
- **description** (string, max 1000 chars) - Description of the study abroad program
- **tags** (array of strings) - Tags/categories for the study abroad program
- **status** (enum: "draft" or "published") - Default: "draft"

### Auto-Generated Fields (Read-only)
- **id** (UUID) - Unique identifier
- **createdBy** (UUID) - User ID who created the record
- **createdAt** (DateTime) - Creation timestamp
- **updatedAt** (DateTime) - Last update timestamp
- **creator** (Object) - User details (id, name, email)

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:PORT/api/v1`

Replace `PORT` with your server port (usually `3000` or `5000`)

---

### 1. **GET All Study Abroad Records** (Public - No Auth Required)

**Endpoint:**
```
GET /api/v1/study-abroad
```

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10, max: 100) - Items per page
- `status` (string, optional) - Filter by status: "draft" or "published"
- `search` (string, optional) - Search term

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/study-abroad?page=1&limit=10`
- **Headers:** None required
- **Body:** None

**Example with Filters:**
```
http://localhost:3000/api/v1/study-abroad?page=1&limit=10&status=published
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "city": "London",
      "imageUrl": "https://example.com/london.jpg",
      "universities": ["University of London", "Imperial College London"],
      "avgTuition": 25000.00,
      "livingCost": 12000.00,
      "description": "Study in the heart of London with world-class universities",
      "tags": ["uk", "europe", "prestigious"],
      "status": "published",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

---

### 2. **GET Study Abroad by ID** (Public - No Auth Required)

**Endpoint:**
```
GET /api/v1/study-abroad/:id
```

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/study-abroad/{study-abroad-id-uuid}`
  - Replace `{study-abroad-id-uuid}` with actual UUID
- **Headers:** None required
- **Body:** None

**Example URL:**
```
http://localhost:3000/api/v1/study-abroad/123e4567-e89b-12d3-a456-426614174000
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "city": "London",
    "imageUrl": "https://example.com/london.jpg",
    "universities": [
      "University of London",
      "Imperial College London",
      "London School of Economics"
    ],
    "avgTuition": 25000.00,
    "livingCost": 12000.00,
    "description": "Study in the heart of London with world-class universities offering excellent programs in various fields.",
    "tags": ["uk", "europe", "prestigious", "business"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

---

### 3. **POST Create Study Abroad** (Admin Only - Auth Required)

**Endpoint:**
```
POST /api/v1/study-abroad
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/study-abroad`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON`

**Complete Example with All Fields:**
```json
{
  "city": "Toronto",
  "imageUrl": "https://example.com/toronto.jpg",
  "universities": [
    "University of Toronto",
    "York University",
    "Ryerson University"
  ],
  "avgTuition": 30000.00,
  "livingCost": 15000.00,
  "description": "Toronto offers excellent educational opportunities with diverse programs and multicultural environment.",
  "tags": ["canada", "north-america", "multicultural"],
  "status": "published"
}
```

**Minimum Required Fields Only:**
```json
{
  "city": "New York",
  "universities": ["Columbia University"]
}
```

**Example with Multiple Universities:**
```json
{
  "city": "Boston",
  "universities": [
    "Harvard University",
    "MIT",
    "Boston University",
    "Northeastern University"
  ],
  "avgTuition": 50000.00,
  "livingCost": 18000.00,
  "description": "Boston is home to some of the world's most prestigious universities.",
  "tags": ["usa", "prestigious", "ivy-league"],
  "status": "published"
}
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Study abroad record created successfully",
  "data": {
    "id": "new-uuid-here",
    "city": "Toronto",
    "imageUrl": "https://example.com/toronto.jpg",
    "universities": [
      "University of Toronto",
      "York University",
      "Ryerson University"
    ],
    "avgTuition": 30000.00,
    "livingCost": 15000.00,
    "description": "Toronto offers excellent educational opportunities...",
    "tags": ["canada", "north-america", "multicultural"],
    "status": "published",
    "createdBy": "your-user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. **PUT Update Study Abroad** (Admin Only - Auth Required)

**Endpoint:**
```
PUT /api/v1/study-abroad/:id
```

**Postman Setup:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/v1/study-abroad/{study-abroad-id-uuid}`
  - Replace `{study-abroad-id-uuid}` with actual UUID
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON` (All fields optional)

**Update City and Universities:**
```json
{
  "city": "Toronto Updated",
  "universities": [
    "University of Toronto",
    "York University"
  ]
}
```

**Update Costs Only:**
```json
{
  "avgTuition": 35000.00,
  "livingCost": 16000.00
}
```

**Update Status:**
```json
{
  "status": "published"
}
```

**Update Multiple Fields:**
```json
{
  "description": "Updated description with more details",
  "tags": ["canada", "updated", "toronto"],
  "status": "published",
  "avgTuition": 32000.00
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Study abroad record updated successfully",
  "data": {
    "id": "study-abroad-uuid",
    "city": "Toronto Updated",
    "universities": [
      "University of Toronto",
      "York University"
    ],
    "avgTuition": 35000.00,
    "livingCost": 16000.00,
    "status": "published",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. **DELETE Study Abroad** (Admin Only - Auth Required)

**Endpoint:**
```
DELETE /api/v1/study-abroad/:id
```

**Postman Setup:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/v1/study-abroad/{study-abroad-id-uuid}`
  - Replace `{study-abroad-id-uuid}` with actual UUID
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Study abroad record deleted successfully"
}
```

---

## 🔑 Authentication Setup in Postman

### Step 1: Get Access Token

First, login to get your access token:
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
    "name": "Study Abroad API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Study Abroad",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/study-abroad?page=1&limit=10",
          "host": ["{{baseUrl}}"],
          "path": ["study-abroad"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "limit", "value": "10"},
            {"key": "status", "value": "published", "disabled": true},
            {"key": "search", "value": "", "disabled": true}
          ]
        }
      }
    },
    {
      "name": "Get Study Abroad by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/study-abroad/:id",
          "host": ["{{baseUrl}}"],
          "path": ["study-abroad", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Create Study Abroad",
      "request": {
        "method": "POST",
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
          "raw": "{\n  \"city\": \"Toronto\",\n  \"universities\": [\"University of Toronto\", \"York University\"],\n  \"imageUrl\": \"https://example.com/toronto.jpg\",\n  \"avgTuition\": 30000.00,\n  \"livingCost\": 15000.00,\n  \"description\": \"Study in Toronto\",\n  \"tags\": [\"canada\", \"north-america\"],\n  \"status\": \"published\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/study-abroad",
          "host": ["{{baseUrl}}"],
          "path": ["study-abroad"]
        }
      }
    },
    {
      "name": "Update Study Abroad",
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
          "raw": "{\n  \"city\": \"Updated City\",\n  \"avgTuition\": 35000.00,\n  \"status\": \"published\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/study-abroad/:id",
          "host": ["{{baseUrl}}"],
          "path": ["study-abroad", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
        }
      }
    },
    {
      "name": "Delete Study Abroad",
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
          "raw": "{{baseUrl}}/study-abroad/:id",
          "host": ["{{baseUrl}}"],
          "path": ["study-abroad", ":id"],
          "variable": [
            {"key": "id", "value": ""}
          ]
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

**To Import:**
1. Open Postman
2. Click **Import** button
3. Select **Raw text** tab
4. Paste the JSON above
5. Click **Import**

---

## ✅ Field Validation Rules

### City
- **Required:** Yes
- **Type:** String
- **Min Length:** 1 character
- **Max Length:** 100 characters

### Universities
- **Required:** Yes
- **Type:** Array of Strings
- **Min Items:** At least 1 university required
- **Each Item:** Must be non-empty string

### ImageUrl
- **Required:** No (Optional)
- **Type:** String (URL)
- **Must be:** Valid URL format if provided

### AvgTuition
- **Required:** No (Optional)
- **Type:** Number (Decimal)
- **Min:** 0 (cannot be negative)
- **Format:** Decimal with 2 decimal places (e.g., 25000.00)

### LivingCost
- **Required:** No (Optional)
- **Type:** Number (Decimal)
- **Min:** 0 (cannot be negative)
- **Format:** Decimal with 2 decimal places (e.g., 12000.00)

### Description
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 1000 characters

### Tags
- **Required:** No (Optional)
- **Type:** Array of Strings
- **Default:** `[]`

### Status
- **Required:** No (Optional)
- **Type:** Enum
- **Values:** `"draft"` or `"published"`
- **Default:** `"draft"`

---

## 🚨 Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "city",
      "message": "City is required"
    },
    {
      "field": "universities",
      "message": "At least one university is required"
    },
    {
      "field": "avgTuition",
      "message": "Average tuition cannot be negative"
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
  "message": "Forbidden - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Study abroad record not found"
}
```

---

## 💡 Testing Tips

1. **Start with GET requests** - These don't require authentication
2. **Get an access token** - Login first to test POST/PUT/DELETE
3. **Test universities array** - Must have at least one university
4. **Test decimal values** - Use proper decimal format for costs (e.g., 25000.00)
5. **Test validation** - Try sending invalid data to see error messages
6. **Test status filter** - Use `?status=published` to filter records
7. **Use environment variables** - Set `baseUrl` and `accessToken` as Postman variables
8. **Test array updates** - Universities array can be updated with new values

---

## 📋 Quick Reference - All Study Abroad Fields

| Field | Type | Required | Max Length | Default | Notes |
|-------|------|----------|------------|---------|-------|
| `city` | string | ✅ Yes | 100 | - | City name |
| `universities` | array of strings | ✅ Yes | - | - | Min 1 item required |
| `imageUrl` | string (URL) | ❌ No | - | - | Valid URL |
| `avgTuition` | number (decimal) | ❌ No | - | - | Min: 0, 2 decimal places |
| `livingCost` | number (decimal) | ❌ No | - | - | Min: 0, 2 decimal places |
| `description` | string | ❌ No | 1000 | - | Optional |
| `tags` | array of strings | ❌ No | - | `[]` | Optional array |
| `status` | enum | ❌ No | - | `"draft"` | "draft" or "published" |
| `id` | UUID | Auto | - | Auto | Read-only |
| `createdBy` | UUID | Auto | - | Auto | Read-only |
| `createdAt` | DateTime | Auto | - | Auto | Read-only |
| `updatedAt` | DateTime | Auto | - | Auto | Read-only |

---

## 🎯 Sample Test Cases

### Test Case 1: Create Study Abroad with All Fields
```json
{
  "city": "Sydney",
  "imageUrl": "https://example.com/sydney.jpg",
  "universities": [
    "University of Sydney",
    "University of New South Wales",
    "Macquarie University"
  ],
  "avgTuition": 35000.00,
  "livingCost": 18000.00,
  "description": "Sydney offers world-class education with beautiful surroundings and excellent quality of life.",
  "tags": ["australia", "oceanic", "prestigious", "engineering"],
  "status": "published"
}
```

### Test Case 2: Create with Minimum Fields
```json
{
  "city": "Berlin",
  "universities": ["Humboldt University of Berlin"]
}
```

### Test Case 3: Create with Multiple Universities
```json
{
  "city": "Singapore",
  "universities": [
    "National University of Singapore",
    "Nanyang Technological University",
    "Singapore Management University"
  ],
  "avgTuition": 20000.00,
  "livingCost": 10000.00,
  "status": "published"
}
```

### Test Case 4: Update Costs Only
```json
{
  "avgTuition": 40000.00,
  "livingCost": 20000.00
}
```

### Test Case 5: Update Universities
```json
{
  "universities": [
    "University A",
    "University B",
    "University C",
    "University D"
  ]
}
```

### Test Case 6: Update Status
```json
{
  "status": "published"
}
```

---

## 🌍 Example Cities and Universities

### London, UK
```json
{
  "city": "London",
  "universities": [
    "University of London",
    "Imperial College London",
    "London School of Economics",
    "King's College London"
  ],
  "avgTuition": 25000.00,
  "livingCost": 12000.00,
  "tags": ["uk", "europe", "prestigious"]
}
```

### New York, USA
```json
{
  "city": "New York",
  "universities": [
    "Columbia University",
    "New York University",
    "City University of New York"
  ],
  "avgTuition": 50000.00,
  "livingCost": 20000.00,
  "tags": ["usa", "north-america", "prestigious"]
}
```

### Toronto, Canada
```json
{
  "city": "Toronto",
  "universities": [
    "University of Toronto",
    "York University",
    "Ryerson University"
  ],
  "avgTuition": 30000.00,
  "livingCost": 15000.00,
  "tags": ["canada", "north-america", "multicultural"]
}
```

---

Happy Testing! 🚀

