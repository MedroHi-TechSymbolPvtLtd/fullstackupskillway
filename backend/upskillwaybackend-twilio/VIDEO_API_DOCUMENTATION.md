# Video API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
- **Public Endpoints:** GET requests (read-only)
- **Protected Endpoints:** POST, PUT, DELETE (require Bearer token)

```
Authorization: Bearer <your_jwt_token>
```

---

## 🎥 VIDEO API

### 1. Get All Videos (Public)
**Endpoint:** `GET /cms/videos`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number (min: 1) |
| limit | integer | No | 10 | Items per page (min: 1, max: 100) |
| search | string | No | - | Search by title, description |
| status | enum | No | - | Filter by status: `draft`, `published` |

**Example Request:**
```bash
GET /api/v1/cms/videos?page=1&limit=10&status=published&search=python
```

**Response:**
```json
{
  "success": true,
  "message": "Videos retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Python Programming Tutorial",
      "slug": "python-programming-tutorial",
      "description": "Learn Python programming from scratch with this comprehensive tutorial",
      "videoUrl": "https://youtube.com/watch?v=abc123",
      "tags": ["Python", "Programming", "Tutorial", "Beginner"],
      "status": "published",
      "createdBy": "user-uuid",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z",
      "creator": {
        "id": "user-uuid",
        "name": "Admin User",
        "email": "admin@upskillway.com"
      }
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Data Science with Python",
      "slug": "data-science-python",
      "description": "Master data science concepts using Python",
      "videoUrl": "https://youtube.com/watch?v=xyz789",
      "tags": ["Python", "Data Science", "Machine Learning"],
      "status": "published",
      "createdBy": "user-uuid",
      "createdAt": "2025-01-05T00:00:00.000Z",
      "updatedAt": "2025-01-12T00:00:00.000Z",
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
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Get Video by ID (Public)
**Endpoint:** `GET /cms/videos/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | ✅ Yes | Video ID |

**Example Request:**
```bash
GET /api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "message": "Video retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Python Programming Tutorial",
    "slug": "python-programming-tutorial",
    "description": "Learn Python programming from scratch with this comprehensive tutorial covering variables, functions, OOP, and more.",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "tags": ["Python", "Programming", "Tutorial", "Beginner", "Free"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-10T00:00:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@upskillway.com"
    }
  }
}
```

---

### 3. Create Video (Protected - Admin Only)
**Endpoint:** `POST /cms/videos`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "title": "JavaScript ES6 Features",
  "slug": "javascript-es6-features",
  "description": "Explore modern JavaScript ES6 features including arrow functions, promises, async/await, and more",
  "videoUrl": "https://youtube.com/watch?v=js123",
  "tags": ["JavaScript", "ES6", "Modern JS", "Tutorial"],
  "status": "published"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| title | string | ✅ Yes | Min: 1, Max: 200 chars | Video title |
| slug | string | ✅ Yes | Unique, URL-friendly | URL slug (lowercase, hyphens) |
| description | string | No | Max: 1000 chars | Video description |
| videoUrl | string | ✅ Yes | Valid URL | Video URL (YouTube, Vimeo, etc.) |
| tags | string[] | No | Array of strings | Tags for categorization |
| status | enum | No | `draft` or `published` | Publication status (default: `draft`) |

**Slug Format Rules:**
- Lowercase letters only
- Numbers allowed
- Hyphens allowed (not at start/end)
- No spaces or special characters
- Must be unique
- Examples: `python-tutorial`, `data-science-101`, `web-dev-2024`

**Example Request:**
```bash
POST /api/v1/cms/videos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "JavaScript ES6 Features",
  "slug": "javascript-es6-features",
  "description": "Explore modern JavaScript ES6 features",
  "videoUrl": "https://youtube.com/watch?v=js123",
  "tags": ["JavaScript", "ES6", "Modern JS"],
  "status": "published"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "JavaScript ES6 Features",
    "slug": "javascript-es6-features",
    "description": "Explore modern JavaScript ES6 features",
    "videoUrl": "https://youtube.com/watch?v=js123",
    "tags": ["JavaScript", "ES6", "Modern JS"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@upskillway.com"
    }
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "videoUrl",
      "message": "Invalid video URL"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Admin access required"
}
```

**409 Conflict - Duplicate Slug:**
```json
{
  "success": false,
  "message": "Video with this slug already exists",
  "error": "Slug 'javascript-es6-features' is already in use"
}
```

---

### 4. Update Video (Protected - Admin Only)
**Endpoint:** `PUT /cms/videos/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | ✅ Yes | Video ID to update |

**Request Body:** (All fields optional)
```json
{
  "title": "JavaScript ES6 Features - Updated",
  "description": "Updated description with more details about ES6 features",
  "tags": ["JavaScript", "ES6", "Modern JS", "Advanced"],
  "status": "published"
}
```

**Example Request:**
```bash
PUT /api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "JavaScript ES6 Features - Updated",
  "description": "Updated description",
  "status": "published"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "JavaScript ES6 Features - Updated",
    "slug": "javascript-es6-features",
    "description": "Updated description",
    "videoUrl": "https://youtube.com/watch?v=js123",
    "tags": ["JavaScript", "ES6", "Modern JS", "Advanced"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T11:30:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@upskillway.com"
    }
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "message": "Video not found",
  "error": "No video found with ID: 550e8400-e29b-41d4-a716-446655440002"
}
```

---

### 5. Delete Video (Protected - Admin Only)
**Endpoint:** `DELETE /cms/videos/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | uuid | ✅ Yes | Video ID to delete |

**Example Request:**
```bash
DELETE /api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440002
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": {
    "message": "Video deleted successfully"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "message": "Video not found",
  "error": "No video found with ID: 550e8400-e29b-41d4-a716-446655440002"
}
```

---

## 📋 Complete Field Reference

### Video Object Structure

```typescript
{
  id: string;              // UUID - Auto-generated
  title: string;           // Required, 1-200 chars
  slug: string;            // Required, unique, URL-friendly
  description?: string;    // Optional, max 1000 chars
  videoUrl: string;        // Required, valid URL
  tags: string[];          // Optional, array of strings
  status: 'draft' | 'published';  // Default: 'draft'
  createdBy: string;       // UUID - Auto-set to current user
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-updated
  creator: {               // Populated from User table
    id: string;
    name: string;
    email: string;
  }
}
```

---

## 🎯 Use Cases

### Use Case 1: Display Published Videos on Website
```bash
# Get all published videos
GET /api/v1/cms/videos?status=published&limit=20

# Display on frontend without authentication
```

### Use Case 2: Search Videos by Tag
```bash
# Search for Python videos
GET /api/v1/cms/videos?search=python&status=published

# Search for Data Science videos
GET /api/v1/cms/videos?search=data%20science&status=published
```

### Use Case 3: Admin Creates New Video
```bash
# 1. Admin logs in
POST /api/v1/auth/login
{
  "email": "admin@upskillway.com",
  "password": "admin123"
}

# 2. Create video with token
POST /api/v1/cms/videos
Authorization: Bearer <token>
{
  "title": "New Tutorial",
  "slug": "new-tutorial",
  "videoUrl": "https://youtube.com/watch?v=xyz",
  "status": "published"
}
```

### Use Case 4: Update Video Status (Draft to Published)
```bash
# Change from draft to published
PUT /api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
{
  "status": "published"
}
```

---

## 🔍 Filtering & Search

### Search Functionality
The search parameter searches across:
- Video title (case-insensitive)
- Video description (case-insensitive)

**Example:**
```bash
# Search for "python" in title or description
GET /api/v1/cms/videos?search=python

# Combine search with status filter
GET /api/v1/cms/videos?search=python&status=published
```

### Pagination
```bash
# Get page 2 with 20 items per page
GET /api/v1/cms/videos?page=2&limit=20

# Response includes pagination metadata
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

## 🎨 Video URL Formats Supported

The `videoUrl` field accepts various video platform URLs:

### YouTube
```
https://youtube.com/watch?v=VIDEO_ID
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

### Vimeo
```
https://vimeo.com/VIDEO_ID
https://player.vimeo.com/video/VIDEO_ID
```

### Other Platforms
```
https://dailymotion.com/video/VIDEO_ID
https://wistia.com/medias/VIDEO_ID
```

---

## 📊 Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate slug or resource conflict |
| 500 | Internal Server Error - Server-side error |

---

## 🔐 Authentication Flow

### 1. Login to Get Token
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@upskillway.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2. Use Token in Requests
```bash
POST /api/v1/cms/videos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "New Video",
  "slug": "new-video",
  "videoUrl": "https://youtube.com/watch?v=abc"
}
```

---

## 💡 Best Practices

1. **Slug Generation:**
   - Use lowercase letters
   - Replace spaces with hyphens
   - Remove special characters
   - Example: "Python Tutorial 2024!" → "python-tutorial-2024"

2. **Tags:**
   - Use consistent tag names
   - Keep tags relevant and specific
   - Limit to 5-10 tags per video
   - Examples: ["Python", "Tutorial", "Beginner"]

3. **Status Management:**
   - Create videos as `draft` first
   - Review and test before setting to `published`
   - Use `draft` for work-in-progress content

4. **Video URLs:**
   - Use direct video URLs (not playlist URLs)
   - Prefer YouTube or Vimeo for reliability
   - Test URLs before saving

5. **Descriptions:**
   - Keep descriptions concise (under 500 chars for previews)
   - Include key topics covered
   - Add relevant keywords for search

---

## 🧪 Testing with Postman

### Collection Setup
1. Create a new collection: "Video API"
2. Add environment variables:
   - `baseUrl`: `http://localhost:3000/api/v1`
   - `token`: (set after login)

### Test Sequence
1. **Login** → Save token
2. **Create Video** → Save video ID
3. **Get All Videos** → Verify creation
4. **Get Video by ID** → Verify details
5. **Update Video** → Verify changes
6. **Delete Video** → Verify deletion

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are version 4
- Public endpoints don't require authentication
- Admin role required for create/update/delete operations
- Search is case-insensitive and searches title + description
- Pagination defaults: page=1, limit=10
- Maximum limit per page: 100 items

---

## 🚀 Quick Start Example

```bash
# 1. Get all published videos (no auth needed)
curl http://localhost:3000/api/v1/cms/videos?status=published

# 2. Login as admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@upskillway.com","password":"admin123"}'

# 3. Create a video (with token from step 2)
curl -X POST http://localhost:3000/api/v1/cms/videos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Video",
    "slug": "my-first-video",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "tags": ["Tutorial", "Beginner"],
    "status": "published"
  }'
```
