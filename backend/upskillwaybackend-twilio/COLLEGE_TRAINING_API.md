# College Training API Documentation

## Overview

There are two types of college training entities in the system:

1. **TrainingProgram** - Training program templates/catalog (filter by `trainingType: "college"`)
2. **Training** - Scheduled training sessions at specific colleges with trainers

---

## 1. Training Program API (TrainingProgram)

### Base URL: `/api/v1/trainings`

Training programs are the catalog/templates of training offerings. Use `trainingType: "college"` to filter for college-specific training programs.

---

### GET /api/v1/trainings

**Get all training programs (with optional filter)**

**Authentication:** Not required (public)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trainingType` | string | No | Filter by type: `"college"` or `"corporate"` |

**Example Request:**
```
GET /api/v1/trainings?trainingType=college
```

**Response:**
```json
{
  "success": true,
  "message": "Trainings retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Full Stack Development Training",
      "slug": "full-stack-development-training",
      "description": "Comprehensive training program for full stack development",
      "syllabus": "Module 1: Frontend...",
      "videoDemoUrl": "https://example.com/demo.mp4",
      "tags": ["web-development", "full-stack"],
      "price": 25000,
      "status": "published",
      "trainingType": "college",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /api/v1/trainings/:id

**Get training program by ID**

**Authentication:** Not required (public)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

**Response:**
```json
{
  "success": true,
  "message": "Training retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Full Stack Development Training",
    "slug": "full-stack-development-training",
    "description": "Comprehensive training program...",
    "syllabus": "Module 1...",
    "videoDemoUrl": "https://example.com/demo.mp4",
    "tags": ["web-development"],
    "price": 25000,
    "status": "published",
    "trainingType": "college",
    "createdBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### POST /api/v1/trainings

**Create a new training program**

**Authentication:** Required (Admin only)

**Request Body Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | min: 1 | Training program title |
| `slug` | string | Yes | unique, URL-friendly | Unique URL slug |
| `description` | string | Yes | min: 1 | Training program description |
| `syllabus` | string | No | - | Course syllabus (text or JSON) |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array | Tags for categorization |
| `price` | number | Yes | min: 0 | Training program price |
| `status` | enum | No | "draft" or "published" | Publication status (default: "draft") |
| `trainingType` | enum | Yes | "college" or "corporate" | Type of training |

**Example Request:**
```json
{
  "title": "Advanced Web Development Training",
  "slug": "advanced-web-development-training",
  "description": "Comprehensive training covering modern web technologies",
  "syllabus": "Module 1: React Fundamentals\nModule 2: Node.js Backend\nModule 3: Database Design",
  "videoDemoUrl": "https://example.com/demo.mp4",
  "tags": ["web-development", "react", "nodejs"],
  "price": 30000,
  "status": "published",
  "trainingType": "college"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Training created successfully",
  "data": {
    "id": "uuid",
    "title": "Advanced Web Development Training",
    "slug": "advanced-web-development-training",
    "description": "Comprehensive training covering modern web technologies",
    "syllabus": "Module 1: React Fundamentals...",
    "videoDemoUrl": "https://example.com/demo.mp4",
    "tags": ["web-development", "react", "nodejs"],
    "price": 30000,
    "status": "published",
    "trainingType": "college",
    "createdBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT /api/v1/trainings/:id

**Update training program**

**Authentication:** Required (Admin only)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

**Request Body Fields:** (All fields optional)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | No | min: 1 | Training program title |
| `slug` | string | No | unique if changed | Unique URL slug |
| `description` | string | No | min: 1 | Training program description |
| `syllabus` | string | No | - | Course syllabus |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array | Tags |
| `price` | number | No | min: 0 | Training program price |
| `status` | enum | No | "draft" or "published" | Publication status |
| `trainingType` | enum | No | "college" or "corporate" | Type of training |

**Example Request:**
```json
{
  "price": 35000,
  "status": "published"
}
```

---

### DELETE /api/v1/trainings/:id

**Delete training program**

**Authentication:** Required (Admin only)

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

**Response:**
```json
{
  "success": true,
  "message": "Training deleted successfully",
  "data": null
}
```

---

## 2. Training Model (Scheduled Training Sessions)

**Note:** This model exists in the database but may not have dedicated API endpoints yet. Here are the fields for reference:

### Training Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Unique identifier |
| `title` | string | Yes | Training session title |
| `description` | string | No | Training description |
| `collegeId` | UUID | Yes | College where training is conducted |
| `trainerId` | UUID | Yes | Trainer assigned to the training |
| `startDate` | DateTime | Yes | Training start date/time |
| `endDate` | DateTime | No | Training end date/time |
| `mode` | enum | Yes | Training mode: `ONLINE`, `OFFLINE`, `HYBRID` |
| `status` | enum | No | Status: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` (default: `SCHEDULED`) |
| `participants` | integer | No | Number of participants |
| `feedback` | float | No | Feedback rating (0-5) |
| `createdAt` | DateTime | Auto | Creation timestamp |
| `updatedAt` | DateTime | Auto | Last update timestamp |

### Relationships

- `college` - Reference to College model
- `trainer` - Reference to Trainer model

---

## Training Program Schema (Database)

### TrainingProgram Model Fields

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Unique identifier | Auto-generated |
| `title` | string | Yes | Training program title | - |
| `slug` | string | Yes | Unique URL slug | - |
| `description` | string | Yes | Training description | - |
| `syllabus` | string | No | Course syllabus | Nullable |
| `videoDemoUrl` | string | No | Demo video URL | Nullable |
| `tags` | string[] | No | Tags array | [] |
| `price` | Float | Yes | Training price | - |
| `status` | ContentStatus | No | "draft" or "published" | "draft" |
| `trainingType` | TrainingTypeEnum | Yes | "college" or "corporate" | - |
| `createdBy` | UUID | No | Creator user ID | Nullable |
| `createdAt` | DateTime | Auto | Creation timestamp | Auto |
| `updatedAt` | DateTime | Auto | Last update timestamp | Auto |

---

## Enums

### TrainingTypeEnum
- `corporate` - Corporate training programs
- `college` - College training programs

### TrainingMode (for Training model)
- `ONLINE` - Online training
- `OFFLINE` - In-person training
- `HYBRID` - Combination of online and offline

### TrainingStatus (for Training model)
- `SCHEDULED` - Training is scheduled
- `IN_PROGRESS` - Training is currently ongoing
- `COMPLETED` - Training has been completed
- `CANCELLED` - Training was cancelled

### ContentStatus (for TrainingProgram)
- `draft` - Not published
- `published` - Published and visible

---

## Example: Create College Training Program

```bash
POST http://localhost:3000/api/v1/trainings
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Data Science Fundamentals for Colleges",
  "slug": "data-science-fundamentals-colleges",
  "description": "A comprehensive data science training program designed for college students covering Python, statistics, machine learning, and data visualization.",
  "syllabus": "Module 1: Python Basics\nModule 2: Data Analysis with Pandas\nModule 3: Machine Learning Fundamentals\nModule 4: Data Visualization",
  "videoDemoUrl": "https://example.com/videos/data-science-demo.mp4",
  "tags": ["data-science", "python", "machine-learning", "college"],
  "price": 25000,
  "status": "published",
  "trainingType": "college"
}
```

---

## Example: Get All College Training Programs

```bash
GET http://localhost:3000/api/v1/trainings?trainingType=college
```

---

## Notes

1. **TrainingProgram vs Training:**
   - **TrainingProgram** = Training catalog/template (what you offer)
   - **Training** = Actual scheduled training session (when and where it happens)

2. To create college-specific training programs, always set `trainingType: "college"`

3. The `Training` model is for scheduling actual training sessions at colleges with specific trainers and dates

4. All endpoints require authentication except GET endpoints (public access)

5. Admin role required for POST, PUT, DELETE operations

