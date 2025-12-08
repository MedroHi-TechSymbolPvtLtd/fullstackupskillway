# Training API - Complete Reference Guide

## Base URL
```
/api/v1/trainings
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/trainings` | No | Get all training programs (filter by `trainingType`) |
| GET | `/api/v1/trainings/:id` | No | Get training program by ID |
| POST | `/api/v1/trainings` | Yes (Admin) | Create new training program |
| PUT | `/api/v1/trainings/:id` | Yes (Admin) | Update training program |
| DELETE | `/api/v1/trainings/:id` | Yes (Admin) | Delete training program |

---

## All Fields Reference

### Required Fields

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `title` | string | min: 1, max: 200 | Training program title |
| `slug` | string | unique, URL-friendly | Unique URL slug |
| `description` | string | min: 1, max: 2000 | Program description |
| `price` | number | min: 0 | Training program price |
| `trainingType` | enum | "college" or "corporate" | Type of training |

### Optional Basic Fields

| Field | Type | Validation | Description | Default |
|-------|------|------------|-------------|---------|
| `syllabus` | string | - | Course syllabus (text or JSON) | null |
| `videoDemoUrl` | string | Valid URL | Demo video URL | null |
| `tags` | string[] | Array of strings | Tags for categorization | [] |
| `status` | enum | "draft" or "published" | Publication status | "draft" |

### Enhanced Fields (Optional)

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `cardImageUrl` | string | Valid URL | Card image URL for program display |
| `durationMonths` | integer | min: 0 | Program duration in months |
| `durationHours` | integer | min: 0 | Program duration in hours |
| `placementRate` | number | min: 0, max: 100 | Placement rate percentage (usually for college) |
| `successMetric` | string | max: 200 | Success metric text |
| `curriculum` | array | JSON array | Curriculum items with hours |
| `testimonials` | array | JSON array | Student/participant testimonials |
| `faqs` | array | JSON array | FAQs with question and answer |
| `badges` | string[] | Array of strings | Badge labels | [] |

---

## JSON Field Structures

### 1. Curriculum Array

```json
[
  {
    "title": "Module or Topic Title",
    "hours": 30
  }
]
```

**Fields:**
- `title` (required): Curriculum item title
- `hours` (optional): Number of hours (integer, min: 0)

---

### 2. Testimonials Array

```json
[
  {
    "studentName": "Participant Name",
    "studentRole": "Role/Title",
    "testimonialText": "Testimonial text here",
    "rating": 5,
    "studentImageUrl": "https://example.com/image.jpg"
  }
]
```

**Fields:**
- `studentName` (required): Participant's name
- `studentRole` (optional): Role/title
- `testimonialText` (required): Testimonial text
- `rating` (optional): Rating from 1-5
- `studentImageUrl` (optional): Valid URL to participant image

---

### 3. FAQs Array

```json
[
  {
    "question": "FAQ Question",
    "answer": "FAQ Answer"
  }
]
```

**Fields:**
- `question` (required): FAQ question text
- `answer` (required): FAQ answer text

---

### 4. Badges Array

```json
["POPULAR", "Flexible", "Certified", "Enterprise", "NEW"]
```

Simple array of strings. Common badges:
- `POPULAR` - Popular program
- `Flexible` - Flexible scheduling
- `Certified` - Certified program
- `Enterprise` - Enterprise-grade program
- `NEW` - Newly added program

---

## Complete Example Request

```json
POST /api/v1/trainings
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Campus Placement Training",
  "slug": "campus-placement-training",
  "description": "Comprehensive training program designed to prepare students for campus placements with aptitude, communication, and interview skills.",
  "syllabus": "Module 1: Aptitude & Logical Reasoning\nModule 2: Communication Skills\nModule 3: Mock Interviews & Group Discussions\nModule 4: Resume Building Workshops",
  "videoDemoUrl": "https://example.com/videos/placement-training-demo.mp4",
  "tags": ["placement", "aptitude", "communication", "interview"],
  "price": 15000,
  "status": "published",
  "trainingType": "college",
  "cardImageUrl": "https://example.com/images/campus-placement-training-card.jpg",
  "durationMonths": 3,
  "durationHours": 120,
  "placementRate": 85.0,
  "successMetric": "85% placement rate (All streams)",
  "curriculum": [
    {
      "title": "Aptitude & logical reasoning",
      "hours": 40
    },
    {
      "title": "Communication skills",
      "hours": 30
    },
    {
      "title": "Mock interviews & GDs",
      "hours": 25
    },
    {
      "title": "Resume building workshops",
      "hours": 25
    }
  ],
  "testimonials": [
    {
      "studentName": "Rajesh Kumar",
      "studentRole": "Computer Science Student",
      "testimonialText": "This training program helped me secure a job at a top MNC. The mock interviews were especially helpful!",
      "rating": 5,
      "studentImageUrl": "https://example.com/images/students/rajesh.jpg"
    },
    {
      "studentName": "Priya Sharma",
      "studentRole": "Electronics Engineering Student",
      "testimonialText": "Excellent program! The communication skills module boosted my confidence significantly.",
      "rating": 5,
      "studentImageUrl": "https://example.com/images/students/priya.jpg"
    }
  ],
  "faqs": [
    {
      "question": "How do I enroll in the Campus Placement Training program?",
      "answer": "You can enroll by clicking the 'Enroll Now' button on the program page, or contact our admissions team for assistance."
    },
    {
      "question": "What are the prerequisites for this program?",
      "answer": "No specific prerequisites. The program is designed for final year students preparing for campus placements across all streams."
    },
    {
      "question": "What is the duration of the training?",
      "answer": "The program is 3 months long with 120 hours of comprehensive training covering aptitude, communication, and interview skills."
    },
    {
      "question": "Will I get placement assistance?",
      "answer": "Yes, we provide mock interviews, resume building workshops, and placement assistance to help you secure your dream job."
    }
  ],
  "badges": ["POPULAR"]
}
```

---

## GET /api/v1/trainings

**Get all training programs**

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trainingType` | string | No | Filter by type: `"college"` or `"corporate"` |

### Examples

```bash
# Get all training programs
GET /api/v1/trainings

# Get only college training
GET /api/v1/trainings?trainingType=college

# Get only corporate training
GET /api/v1/trainings?trainingType=corporate
```

### Response

```json
{
  "success": true,
  "message": "Trainings retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Campus Placement Training",
      "slug": "campus-placement-training",
      "description": "Comprehensive training program...",
      "cardImageUrl": "https://example.com/images/card.jpg",
      "durationMonths": 3,
      "durationHours": 120,
      "placementRate": 85.0,
      "successMetric": "85% placement rate (All streams)",
      "curriculum": [...],
      "testimonials": [...],
      "faqs": [...],
      "badges": ["POPULAR"],
      "price": 15000,
      "status": "published",
      "trainingType": "college",
      "tags": ["placement", "aptitude"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## GET /api/v1/trainings/:id

**Get training program by ID**

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

### Example

```bash
GET /api/v1/trainings/123e4567-e89b-12d3-a456-426614174000
```

### Response

```json
{
  "success": true,
  "message": "Training retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Campus Placement Training",
    "slug": "campus-placement-training",
    "description": "Comprehensive training program...",
    "cardImageUrl": "https://example.com/images/card.jpg",
    "durationMonths": 3,
    "durationHours": 120,
    "placementRate": 85.0,
    "successMetric": "85% placement rate (All streams)",
    "curriculum": [...],
    "testimonials": [...],
    "faqs": [...],
    "badges": ["POPULAR"],
    "price": 15000,
    "status": "published",
    "trainingType": "college",
    "tags": ["placement", "aptitude"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## POST /api/v1/trainings

**Create new training program**

### Authentication
Required (Admin only)

### Request Body

All fields from the "All Fields Reference" section above.

**Required:** `title`, `slug`, `description`, `price`, `trainingType`

### Example: College Training

```json
{
  "title": "Campus Placement Training",
  "slug": "campus-placement-training",
  "description": "Comprehensive training program...",
  "price": 15000,
  "trainingType": "college",
  "placementRate": 85.0,
  "successMetric": "85% placement rate (All streams)",
  "durationMonths": 3,
  "durationHours": 120,
  "curriculum": [...],
  "testimonials": [...],
  "faqs": [...],
  "badges": ["POPULAR"]
}
```

### Example: Corporate Training

```json
{
  "title": "Corporate Leadership Development",
  "slug": "corporate-leadership-development",
  "description": "Comprehensive leadership training...",
  "price": 75000,
  "trainingType": "corporate",
  "placementRate": null,
  "successMetric": "95% participant satisfaction",
  "durationMonths": 6,
  "durationHours": 180,
  "curriculum": [...],
  "testimonials": [...],
  "faqs": [...],
  "badges": ["POPULAR", "Certified"]
}
```

### Response

```json
{
  "success": true,
  "message": "Training created successfully",
  "data": {
    "id": "uuid",
    "title": "Campus Placement Training",
    ...
  }
}
```

---

## PUT /api/v1/trainings/:id

**Update training program**

### Authentication
Required (Admin only)

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

### Request Body

All fields are optional (partial update). Include only fields you want to update.

### Example

```json
{
  "price": 80000,
  "status": "published",
  "successMetric": "96% participant satisfaction",
  "faqs": [
    {
      "question": "Updated question?",
      "answer": "Updated answer"
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Training updated successfully",
  "data": {
    "id": "uuid",
    "title": "Campus Placement Training",
    ...
  }
}
```

---

## DELETE /api/v1/trainings/:id

**Delete training program**

### Authentication
Required (Admin only)

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Training program ID |

### Example

```bash
DELETE /api/v1/trainings/123e4567-e89b-12d3-a456-426614174000
```

### Response

```json
{
  "success": true,
  "message": "Training deleted successfully",
  "data": null
}
```

---

## Field Usage Guide

### College Training (`trainingType: "college"`)

**Typical Values:**
- `placementRate`: 0-100 (e.g., 85.0)
- `successMetric`: "85% placement rate (All streams)"
- `testimonials`: Student testimonials
- `badges`: ["POPULAR", "Flexible"]
- `price`: Lower range (8,000 - 25,000)

### Corporate Training (`trainingType: "corporate"`)

**Typical Values:**
- `placementRate`: null (not applicable)
- `successMetric`: "95% participant satisfaction"
- `testimonials`: Corporate participant testimonials
- `badges`: ["POPULAR", "Certified", "Enterprise"]
- `price`: Higher range (35,000 - 120,000)

---

## Quick Reference Card

### Create College Training
```json
POST /api/v1/trainings
{
  "title": "...",
  "slug": "...",
  "description": "...",
  "price": 15000,
  "trainingType": "college",
  "placementRate": 85.0,
  "curriculum": [...],
  "testimonials": [...],
  "faqs": [...]
}
```

### Create Corporate Training
```json
POST /api/v1/trainings
{
  "title": "...",
  "slug": "...",
  "description": "...",
  "price": 75000,
  "trainingType": "corporate",
  "placementRate": null,
  "curriculum": [...],
  "testimonials": [...],
  "faqs": [...]
}
```

### Get by Type
```bash
GET /api/v1/trainings?trainingType=college
GET /api/v1/trainings?trainingType=corporate
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "error": "Field validation failed"
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
  "message": "Training not found",
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Slug already exists",
  "error": "Duplicate resource"
}
```

---

## Notes

1. **Same API for Both Types**: Use `trainingType` field to differentiate
2. **All JSON Fields**: `curriculum`, `testimonials`, `faqs` are automatically serialized/deserialized
3. **Optional Fields**: All fields except required ones can be omitted
4. **Partial Updates**: PUT endpoint accepts partial updates
5. **Authentication**: GET endpoints are public, POST/PUT/DELETE require admin authentication

