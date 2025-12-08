# College CRUD API - Postman Testing Guide

## Base URL
```
http://localhost:3000/api/v1/colleges
```

**Authentication:** All endpoints require Bearer Token (Admin/Sales role)

---

## All Fields Reference

### Required Fields

| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `name` | string | min: 1, max: 200 | College name |
| `assignedToId` | UUID | Valid UUID | User ID of assigned sales person |

### Optional Fields

| Field | Type | Validation | Description |
|-------|------|-----------|-------------|
| `location` | string | - | College location/address |
| `city` | string | - | City name |
| `state` | string | - | State name |
| `type` | enum | See below | College type |
| `ranking` | integer | Positive | College ranking |
| `enrollment` | integer | Positive | Number of students enrolled |
| `establishedYear` | integer | 1800 - current year | Year college was established |
| `contactPerson` | string | - | Contact person name |
| `contactEmail` | string | Valid email | Contact email |
| `contactPhone` | string | - | Contact phone number |
| `website` | string | Valid URL | College website URL |
| `totalRevenue` | number | min: 0 | Total revenue |
| `status` | enum | See below | College status (default: ACTIVE) |
| `assignedTrainer` | UUID | Valid UUID | Assigned trainer ID |

### Enum Values

**CollegeType:**
- `ENGINEERING`
- `MEDICAL`
- `MANAGEMENT`
- `ARTS_SCIENCE`
- `LAW`
- `PHARMACY`
- `ARCHITECTURE`
- `OTHER`

**CollegeStatus:**
- `PROSPECTIVE`
- `ACTIVE` (default)
- `INACTIVE`
- `PARTNER`

---

## 1. CREATE College (POST)

### Endpoint
```
POST http://localhost:3000/api/v1/colleges
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body (Minimal - Required Fields Only)

```json
{
  "name": "ABC Engineering College",
  "assignedToId": "user-uuid-here"
}
```

### Request Body (Complete - All Fields)

```json
{
  "name": "ABC Engineering College",
  "location": "123 Main Street, Tech Park",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "ENGINEERING",
  "ranking": 25,
  "enrollment": 5000,
  "establishedYear": 1995,
  "contactPerson": "Dr. Rajesh Kumar",
  "contactEmail": "contact@abcengg.edu",
  "contactPhone": "+91-9876543210",
  "website": "https://www.abcengg.edu",
  "totalRevenue": 5000000.50,
  "status": "ACTIVE",
  "assignedToId": "user-uuid-here"
}
```

### Response (Success - 201)
```json
{
  "success": true,
  "message": "College created successfully",
  "data": {
    "id": "college-uuid",
    "name": "ABC Engineering College",
    "location": "123 Main Street, Tech Park",
    "city": "Bangalore",
    "state": "Karnataka",
    "type": "ENGINEERING",
    "ranking": 25,
    "enrollment": 5000,
    "establishedYear": 1995,
    "contactPerson": "Dr. Rajesh Kumar",
    "contactEmail": "contact@abcengg.edu",
    "contactPhone": "+91-9876543210",
    "totalRevenue": 5000000.50,
    "avgRating": null,
    "assignedToId": "user-uuid-here",
    "status": "ACTIVE",
    "lastTrainingAt": null,
    "assignedTrainer": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person Name",
      "email": "sales@example.com"
    }
  }
}
```

### Postman Setup
1. **Method:** POST
2. **URL:** `http://localhost:3000/api/v1/colleges`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body:** Select `raw` → `JSON` → Paste the JSON above

---

## 2. GET All Colleges (GET)

### Endpoint
```
GET http://localhost:3000/api/v1/colleges
```

### Query Parameters (All Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (default: 1) | `?page=1` |
| `limit` | integer | Items per page (default: 10, max: 100) | `?limit=20` |
| `search` | string | Search by name, location, city | `?search=Bangalore` |
| `status` | enum | Filter by status | `?status=ACTIVE` |
| `type` | enum | Filter by type | `?type=ENGINEERING` |
| `assignedTo` | UUID | Filter by assigned sales person | `?assignedTo=user-uuid` |

### Examples

**Get all colleges:**
```
GET http://localhost:3000/api/v1/colleges
```

**Get with pagination:**
```
GET http://localhost:3000/api/v1/colleges?page=1&limit=20
```

**Search colleges:**
```
GET http://localhost:3000/api/v1/colleges?search=Bangalore
```

**Filter by status:**
```
GET http://localhost:3000/api/v1/colleges?status=ACTIVE
```

**Filter by type:**
```
GET http://localhost:3000/api/v1/colleges?type=ENGINEERING
```

**Combined filters:**
```
GET http://localhost:3000/api/v1/colleges?page=1&limit=10&status=ACTIVE&type=ENGINEERING&search=Bangalore
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "Colleges retrieved successfully",
  "data": [
    {
      "id": "college-uuid-1",
      "name": "ABC Engineering College",
      "location": "123 Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "type": "ENGINEERING",
      "ranking": 25,
      "enrollment": 5000,
      "status": "ACTIVE",
      "assignedTo": {
        "id": "user-uuid",
        "name": "Sales Person",
        "email": "sales@example.com"
      }
    },
    {
      "id": "college-uuid-2",
      "name": "XYZ Medical College",
      "city": "Mumbai",
      "type": "MEDICAL",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Postman Setup
1. **Method:** GET
2. **URL:** `http://localhost:3000/api/v1/colleges?page=1&limit=10`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`
4. **Params:** (Optional) Add query parameters in Params tab

---

## 3. GET College by ID (GET)

### Endpoint
```
GET http://localhost:3000/api/v1/colleges/:id
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | College ID |

### Example
```
GET http://localhost:3000/api/v1/colleges/123e4567-e89b-12d3-a456-426614174000
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "College retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "ABC Engineering College",
    "location": "123 Main Street, Tech Park",
    "city": "Bangalore",
    "state": "Karnataka",
    "type": "ENGINEERING",
    "ranking": 25,
    "enrollment": 5000,
    "establishedYear": 1995,
    "contactPerson": "Dr. Rajesh Kumar",
    "contactEmail": "contact@abcengg.edu",
    "contactPhone": "+91-9876543210",
    "totalRevenue": 5000000.50,
    "avgRating": 4.5,
    "assignedToId": "user-uuid",
    "status": "ACTIVE",
    "lastTrainingAt": "2024-01-10T00:00:00.000Z",
    "assignedTrainer": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person Name",
      "email": "sales@example.com"
    },
    "assignedTrainerDetails": null
  }
}
```

### Postman Setup
1. **Method:** GET
2. **URL:** `http://localhost:3000/api/v1/colleges/{{collegeId}}`
   - Replace `{{collegeId}}` with actual college UUID
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`

---

## 4. UPDATE College (PUT)

### Endpoint
```
PUT http://localhost:3000/api/v1/colleges/:id
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | College ID |

### Example
```
PUT http://localhost:3000/api/v1/colleges/123e4567-e89b-12d3-a456-426614174000
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

### Request Body (Partial Update - All Fields Optional)

```json
{
  "name": "ABC Engineering College - Updated",
  "ranking": 20,
  "enrollment": 5500,
  "status": "PARTNER",
  "contactEmail": "newcontact@abcengg.edu"
}
```

### Request Body (Complete Update)

```json
{
  "name": "ABC Engineering College - Updated",
  "location": "456 New Street, Tech Park",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "ENGINEERING",
  "ranking": 20,
  "enrollment": 5500,
  "establishedYear": 1995,
  "contactPerson": "Dr. Priya Sharma",
  "contactEmail": "newcontact@abcengg.edu",
  "contactPhone": "+91-9876543211",
  "website": "https://www.abcengg.edu",
  "totalRevenue": 6000000.00,
  "status": "PARTNER",
  "assignedToId": "user-uuid-here"
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "College updated successfully",
  "data": {
    "id": "college-uuid",
    "name": "ABC Engineering College - Updated",
    "ranking": 20,
    "enrollment": 5500,
    "status": "PARTNER",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    ...
  }
}
```

### Postman Setup
1. **Method:** PUT
2. **URL:** `http://localhost:3000/api/v1/colleges/{{collegeId}}`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body:** Select `raw` → `JSON` → Paste the JSON above

---

## 5. DELETE College (DELETE)

### Endpoint
```
DELETE http://localhost:3000/api/v1/colleges/:id
```

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | College ID |

### Example
```
DELETE http://localhost:3000/api/v1/colleges/123e4567-e89b-12d3-a456-426614174000
```

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response (Success - 200)
```json
{
  "success": true,
  "message": "College deleted successfully",
  "data": null
}
```

### Postman Setup
1. **Method:** DELETE
2. **URL:** `http://localhost:3000/api/v1/colleges/{{collegeId}}`
3. **Headers:**
   - `Authorization: Bearer YOUR_TOKEN`

---

## Complete Postman Collection Examples

### Example 1: Create Engineering College

```json
POST http://localhost:3000/api/v1/colleges
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Tech Institute of Engineering",
  "location": "789 Innovation Road",
  "city": "Pune",
  "state": "Maharashtra",
  "type": "ENGINEERING",
  "ranking": 15,
  "enrollment": 6000,
  "establishedYear": 2000,
  "contactPerson": "Dr. Amit Verma",
  "contactEmail": "contact@techinst.edu",
  "contactPhone": "+91-9876543222",
  "website": "https://www.techinst.edu",
  "totalRevenue": 7500000.00,
  "status": "ACTIVE",
  "assignedToId": "user-uuid-here"
}
```

### Example 2: Create Medical College

```json
POST http://localhost:3000/api/v1/colleges
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "City Medical College",
  "location": "456 Health Avenue",
  "city": "Delhi",
  "state": "Delhi",
  "type": "MEDICAL",
  "ranking": 10,
  "enrollment": 3000,
  "establishedYear": 1985,
  "contactPerson": "Dr. Sneha Patel",
  "contactEmail": "contact@citymed.edu",
  "contactPhone": "+91-9876543333",
  "website": "https://www.citymed.edu",
  "totalRevenue": 12000000.00,
  "status": "ACTIVE",
  "assignedToId": "user-uuid-here"
}
```

### Example 3: Create Management College

```json
POST http://localhost:3000/api/v1/colleges
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN

Body:
{
  "name": "Global Business School",
  "location": "321 Commerce Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "type": "MANAGEMENT",
  "ranking": 5,
  "enrollment": 4000,
  "establishedYear": 1990,
  "contactPerson": "Prof. Rahul Mehta",
  "contactEmail": "contact@gbs.edu",
  "contactPhone": "+91-9876543444",
  "website": "https://www.gbs.edu",
  "totalRevenue": 15000000.00,
  "status": "PARTNER",
  "assignedToId": "user-uuid-here"
}
```

---

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation error message",
  "error": "Name is required"
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

### 404 Not Found
```json
{
  "success": false,
  "message": "College not found",
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "College with this name already exists",
  "error": "Duplicate resource"
}
```

---

## Postman Environment Variables

Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:3000",
  "api_token": "YOUR_BEARER_TOKEN_HERE",
  "college_id": "college-uuid-here",
  "user_id": "user-uuid-here"
}
```

Then use in requests:
- URL: `{{base_url}}/api/v1/colleges`
- Authorization: `Bearer {{api_token}}`
- Body: `"assignedToId": "{{user_id}}"`

---

## Quick Testing Checklist

### ✅ Create (POST)
- [ ] Create college with minimal fields (name, assignedToId)
- [ ] Create college with all fields
- [ ] Test validation errors (missing required fields)
- [ ] Test invalid enum values

### ✅ Read (GET)
- [ ] Get all colleges
- [ ] Get with pagination
- [ ] Get with search filter
- [ ] Get with status filter
- [ ] Get with type filter
- [ ] Get college by ID
- [ ] Test invalid ID (404)

### ✅ Update (PUT)
- [ ] Update single field
- [ ] Update multiple fields
- [ ] Update all fields
- [ ] Test invalid ID (404)

### ✅ Delete (DELETE)
- [ ] Delete college
- [ ] Test invalid ID (404)
- [ ] Test deleting non-existent college

---

## Sample Test Data

### College 1 (Engineering)
```json
{
  "name": "ABC Engineering College",
  "city": "Bangalore",
  "state": "Karnataka",
  "type": "ENGINEERING",
  "ranking": 25,
  "enrollment": 5000,
  "status": "ACTIVE"
}
```

### College 2 (Medical)
```json
{
  "name": "XYZ Medical College",
  "city": "Mumbai",
  "state": "Maharashtra",
  "type": "MEDICAL",
  "ranking": 10,
  "enrollment": 3000,
  "status": "ACTIVE"
}
```

### College 3 (Management)
```json
{
  "name": "Global Business School",
  "city": "Delhi",
  "state": "Delhi",
  "type": "MANAGEMENT",
  "ranking": 5,
  "enrollment": 4000,
  "status": "PARTNER"
}
```

---

## Notes

1. **Authentication Required:** All endpoints require Bearer token authentication
2. **Required Fields:** Only `name` and `assignedToId` are required
3. **Partial Updates:** PUT endpoint accepts partial updates (only send fields you want to update)
4. **Enum Values:** Use exact enum values (case-sensitive): `ENGINEERING`, `ACTIVE`, etc.
5. **UUID Format:** IDs must be valid UUIDs
6. **Pagination:** GET all supports pagination with `page` and `limit` parameters
7. **Search:** Search works across name, location, and city fields

