# Training Programs CMS Route Fix

## 🔍 Issue Identified

**Error**: `Route GET /api/v1/cms/training-programs not found`

**Root Cause**: 
The route `/api/v1/cms/training-programs` was missing from the CMS routes. Training programs were only accessible via `/api/v1/trainings`, but the frontend (CRM) expects them under `/api/v1/cms/training-programs`.

---

## ✅ Fix Applied

### 1. Added Training Program Service Functions
**File**: `src/services/cmsService.ts`

Added:
- `getAllTrainingPrograms()` - Get all training programs with filters (status, trainingType, search, pagination)
- `getTrainingProgramById()` - Get training program by ID

**Features**:
- Supports filtering by `status` (draft/published)
- Supports filtering by `trainingType` (corporate/college)
- Supports search in title, description, tags
- Includes pagination
- Includes creator information

### 2. Added Training Program Controllers
**File**: `src/controllers/cmsController.ts`

Added:
- `getAllTrainingProgramsController` - Handles GET requests for all training programs
- `getTrainingProgramByIdController` - Handles GET requests for single training program

### 3. Added Training Program Routes
**File**: `src/routes/cms.ts`

Added:
- `GET /api/v1/cms/training-programs` - Get all training programs (public)
- `GET /api/v1/cms/training-programs/:id` - Get training program by ID (public)

---

## 📡 New Endpoints

### 1. Get All Training Programs
```http
GET /api/v1/cms/training-programs?page=1&limit=10&status=published&trainingType=corporate&search=python
Authorization: Bearer <token> (optional - public endpoint)
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `status` (string, optional) - Filter by status: `draft` or `published`
- `trainingType` (string, optional) - Filter by type: `corporate` or `college`
- `search` (string, optional) - Search in title, description, tags

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Python Corporate Training",
      "slug": "python-corporate-training",
      "description": "Comprehensive Python training for corporate teams",
      "syllabus": "Module 1: Python Basics...",
      "videoDemoUrl": "https://example.com/demo.mp4",
      "tags": ["python", "corporate", "training"],
      "price": 50000,
      "status": "published",
      "trainingType": "corporate",
      "cardImageUrl": "https://example.com/image.jpg",
      "durationMonths": 3,
      "durationHours": 120,
      "placementRate": 85.5,
      "successMetric": "85% placement rate",
      "curriculum": [
        {
          "title": "Python Fundamentals",
          "hours": 40
        }
      ],
      "testimonials": [...],
      "faqs": [...],
      "badges": ["POPULAR", "NEW"],
      "createdBy": "user-uuid",
      "createdAt": "2025-11-13T10:00:00Z",
      "updatedAt": "2025-11-13T10:00:00Z",
      "creator": {
        "id": "user-uuid",
        "name": "Admin User",
        "email": "admin@upskillway.com"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### 2. Get Training Program by ID
```http
GET /api/v1/cms/training-programs/{id}
Authorization: Bearer <token> (optional - public endpoint)
```

**Response:** Same structure as above, but single object instead of array.

---

## 🎯 For Corporate Training in CRM

### Filter for Corporate Training Programs

```http
GET /api/v1/cms/training-programs?trainingType=corporate&status=published
```

**This will return only corporate training programs that are published.**

### Example Frontend Code

```typescript
// Fetch corporate training programs
const fetchCorporateTrainings = async (page = 1, limit = 10) => {
  const response = await fetch(
    `/api/v1/cms/training-programs?trainingType=corporate&status=published&page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}` // Optional - endpoint is public
      }
    }
  );
  
  const result = await response.json();
  return result.data; // Array of training programs
};
```

---

## 🔄 Alternative Endpoints (Still Available)

The original training endpoints are still available:

### Option 1: `/api/v1/trainings` (Original)
```http
GET /api/v1/trainings?trainingType=corporate
```

### Option 2: `/api/v1/cms/training-programs` (New - For CRM)
```http
GET /api/v1/cms/training-programs?trainingType=corporate&status=published
```

**Difference**: The CMS endpoint supports additional filters like `status` and `search`.

---

## ✅ Frontend Changes Required

### ✅ **NO CHANGES NEEDED** - The endpoint now exists!

Your frontend code calling:
```http
GET /api/v1/cms/training-programs?trainingType=corporate
```

**Will now work correctly!**

### Optional: Enhanced Filtering

You can now also use:
- `status=published` - Only show published programs
- `search=python` - Search in title/description/tags
- `page` & `limit` - Pagination

---

## 📊 Query Parameter Reference

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page (max: 100) |
| `status` | string | No | - | Filter: `draft` or `published` |
| `trainingType` | string | No | - | Filter: `corporate` or `college` |
| `search` | string | No | - | Search in title, description, tags |

---

## 🎯 Use Cases

### 1. Get All Corporate Training Programs (Published)
```http
GET /api/v1/cms/training-programs?trainingType=corporate&status=published
```

### 2. Search Corporate Training Programs
```http
GET /api/v1/cms/training-programs?trainingType=corporate&search=python&status=published
```

### 3. Get All Training Programs (Both Types)
```http
GET /api/v1/cms/training-programs
```

### 4. Get Draft Corporate Training Programs
```http
GET /api/v1/cms/training-programs?trainingType=corporate&status=draft
```

---

## ✅ Verification

### Test the Endpoint

```bash
# Get corporate training programs
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?trainingType=corporate&status=published"

# Get all training programs
curl -X GET "http://localhost:3000/api/v1/cms/training-programs"

# Search training programs
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?search=python&trainingType=corporate"
```

---

## 📝 Summary

### ✅ Fixed
- Added missing route: `GET /api/v1/cms/training-programs`
- Added service functions for training programs
- Added controllers for training programs
- Supports filtering by `trainingType`, `status`, and `search`
- Includes pagination

### ✅ Frontend
- **NO CHANGES NEEDED** - Your existing code will work
- Endpoint is now available at `/api/v1/cms/training-programs`
- Can use `trainingType=corporate` to filter for corporate training

### ✅ Features
- Public endpoint (no auth required for GET)
- Supports pagination
- Supports filtering by type, status, and search
- Returns creator information
- Returns all training program fields

---

**Status**: ✅ **FIXED** - The route is now available and working!

