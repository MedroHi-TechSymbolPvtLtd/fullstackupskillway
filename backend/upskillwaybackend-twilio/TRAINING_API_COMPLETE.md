# Complete Training API Documentation - College & Corporate

## Overview

There is **ONE API endpoint** (`/api/v1/trainings`) that handles both **College Training** and **Corporate Training** programs. They are differentiated by the `trainingType` field:
- `trainingType: "college"` - For college training programs
- `trainingType: "corporate"` - For corporate training programs

Both use the same endpoints and fields, but with different use cases and typical values.

---

## API Endpoints (Shared)

### Base URL: `/api/v1/trainings`

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/v1/trainings` | No | Get all training programs (filter by `trainingType`) |
| GET | `/api/v1/trainings/:id` | No | Get training program by ID |
| POST | `/api/v1/trainings` | Yes (Admin) | Create new training program |
| PUT | `/api/v1/trainings/:id` | Yes (Admin) | Update training program |
| DELETE | `/api/v1/trainings/:id` | Yes (Admin) | Delete training program |

---

## Complete Field Reference

### Required Fields (Both Types)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | min: 1, max: 200 | Training program title |
| `slug` | string | Yes | unique, URL-friendly | Unique URL slug |
| `description` | string | Yes | min: 1, max: 2000 | Program description |
| `price` | number | Yes | min: 0 | Training program price |
| `trainingType` | enum | Yes | "college" or "corporate" | Type of training |

### Optional Basic Fields (Both Types)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `syllabus` | string | No | - | Course syllabus (text or JSON) |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array | Tags for categorization (default: []) |
| `status` | enum | No | "draft" or "published" | Publication status (default: "draft") |

### Enhanced Fields (Both Types - Optional)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `cardImageUrl` | string | No | Valid URL | Card image URL for program display |
| `durationMonths` | integer | No | min: 0 | Program duration in months |
| `durationHours` | integer | No | min: 0 | Program duration in hours |
| `placementRate` | number | No | min: 0, max: 100 | Placement rate percentage |
| `successMetric` | string | No | max: 200 | Success metric text |
| `curriculum` | array | No | - | JSON array of curriculum items with hours |
| `testimonials` | array | No | - | JSON array of student/participant testimonials |
| `faqs` | array | No | - | JSON array of FAQs with question and answer |
| `badges` | string[] | No | Array | Badge labels (default: []) |

---

# 1. COLLEGE TRAINING API

## Usage

Set `trainingType: "college"` when creating or filtering college training programs.

## Typical Field Values for College Training

| Field | Typical Value | Notes |
|-------|---------------|-------|
| `trainingType` | `"college"` | Required |
| `placementRate` | 0-100 (e.g., 85) | Usually included - shows placement percentage |
| `successMetric` | "85% placement rate (All streams)" | Placement-focused metrics |
| `testimonials` | Student testimonials | Features students (name, role as student) |
| `badges` | ["POPULAR", "Flexible"] | Student-friendly badges |
| `price` | Lower range (e.g., 8,000 - 25,000) | Student-friendly pricing |

---

## Example: College Training - Campus Placement Training

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

## Example: College Training - Technical Upskilling Program

```json
POST /api/v1/trainings
{
  "title": "Technical Upskilling Program",
  "slug": "technical-upskilling-program",
  "description": "Comprehensive technical training covering data analytics, AI, cloud computing, and full-stack development.",
  "cardImageUrl": "https://example.com/images/technical-upskilling-card.jpg",
  "durationMonths": 6,
  "durationHours": 240,
  "placementRate": 78.0,
  "successMetric": "78% tech placement rate (CSE, IT, ECE, EEE)",
  "curriculum": [
    {
      "title": "Data Analytics & Python",
      "hours": 60
    },
    {
      "title": "AI & Machine Learning",
      "hours": 60
    },
    {
      "title": "Cloud computing - AWS/Azure",
      "hours": 60
    },
    {
      "title": "Full-stack development",
      "hours": 60
    }
  ],
  "testimonials": [
    {
      "studentName": "Amit Verma",
      "studentRole": "CSE Student",
      "testimonialText": "The AI & ML module was outstanding. Got placed at a leading tech company!",
      "rating": 5
    }
  ],
  "tags": ["technical", "python", "ai", "cloud", "full-stack"],
  "price": 25000,
  "status": "published",
  "trainingType": "college",
  "badges": []
}
```

---

## Get All College Training Programs

```bash
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
      "title": "Campus Placement Training",
      "slug": "campus-placement-training",
      "trainingType": "college",
      "placementRate": 85.0,
      "durationMonths": 3,
      "durationHours": 120,
      ...
    }
  ]
}
```

---

# 2. CORPORATE TRAINING API

## Usage

Set `trainingType: "corporate"` when creating or filtering corporate training programs.

## Typical Field Values for Corporate Training

| Field | Typical Value | Notes |
|-------|---------------|-------|
| `trainingType` | `"corporate"` | Required |
| `placementRate` | `null` or omitted | Usually not applicable for corporate |
| `successMetric` | "95% participant satisfaction" | Business-focused metrics |
| `testimonials` | Corporate participant testimonials | Features professionals (name, role, company) |
| `badges` | ["POPULAR", "Certified", "Enterprise"] | Corporate-focused badges |
| `price` | Higher range (e.g., 35,000 - 120,000) | Corporate pricing |

---

## Example: Corporate Training - Leadership Development

```json
POST /api/v1/trainings
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Corporate Leadership Development Program",
  "slug": "corporate-leadership-development",
  "description": "Comprehensive leadership training program designed for corporate executives and managers to enhance their leadership skills, strategic thinking, and team management capabilities.",
  "syllabus": "Module 1: Leadership Fundamentals\nModule 2: Strategic Planning\nModule 3: Team Management\nModule 4: Communication & Influence\nModule 5: Change Management\nModule 6: Performance Management",
  "videoDemoUrl": "https://example.com/videos/leadership-demo.mp4",
  "tags": ["leadership", "management", "corporate", "executive"],
  "price": 75000,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/corporate-leadership-card.jpg",
  "durationMonths": 6,
  "durationHours": 180,
  "placementRate": null,
  "successMetric": "95% participant satisfaction | 80% promotion rate",
  "curriculum": [
    {
      "title": "Leadership Fundamentals & Core Principles",
      "hours": 30
    },
    {
      "title": "Strategic Planning & Decision Making",
      "hours": 30
    },
    {
      "title": "Team Management & Building High-Performance Teams",
      "hours": 35
    },
    {
      "title": "Effective Communication & Influence",
      "hours": 30
    },
    {
      "title": "Change Management & Organizational Transformation",
      "hours": 30
    },
    {
      "title": "Performance Management & Employee Development",
      "hours": 25
    }
  ],
  "testimonials": [
    {
      "studentName": "Rajesh Kumar",
      "studentRole": "VP of Operations, TechCorp",
      "testimonialText": "This program transformed our leadership approach. The strategic planning module was particularly valuable for our team.",
      "rating": 5,
      "studentImageUrl": "https://example.com/images/testimonials/rajesh-corp.jpg"
    },
    {
      "studentName": "Priya Sharma",
      "studentRole": "Director of HR, InnovateLabs",
      "testimonialText": "Excellent program! The team management strategies we learned have significantly improved our team's productivity.",
      "rating": 5,
      "studentImageUrl": "https://example.com/images/testimonials/priya-corp.jpg"
    }
  ],
  "faqs": [
    {
      "question": "What is the format of the Corporate Leadership Development Program?",
      "answer": "The program is delivered in a hybrid format with both online modules and in-person workshops, spread over 6 months with 180 hours of training."
    },
    {
      "question": "Who should attend this program?",
      "answer": "This program is designed for corporate executives, managers, team leads, and professionals looking to enhance their leadership capabilities and strategic thinking."
    },
    {
      "question": "Is this program certified?",
      "answer": "Yes, participants receive a certificate upon successful completion of the program and all assessments."
    },
    {
      "question": "Can this be customized for our organization?",
      "answer": "Yes, we offer customized corporate training programs tailored to your organization's specific needs and objectives."
    }
  ],
  "badges": ["POPULAR", "Certified"]
}
```

---

## Example: Corporate Training - Data Analytics & BI

```json
POST /api/v1/trainings
{
  "title": "Corporate Data Analytics & Business Intelligence",
  "slug": "corporate-data-analytics-bi",
  "description": "Advanced data analytics and business intelligence training for corporate teams to make data-driven decisions and improve business outcomes.",
  "cardImageUrl": "https://example.com/images/data-analytics-corporate-card.jpg",
  "durationMonths": 4,
  "durationHours": 120,
  "placementRate": null,
  "successMetric": "90% ROI improvement reported by participants",
  "curriculum": [
    {
      "title": "Data Fundamentals & SQL",
      "hours": 25
    },
    {
      "title": "Advanced Excel & Power BI",
      "hours": 30
    },
    {
      "title": "Python for Data Analysis",
      "hours": 30
    },
    {
      "title": "Business Intelligence & Reporting",
      "hours": 20
    },
    {
      "title": "Data Visualization & Dashboards",
      "hours": 15
    }
  ],
  "testimonials": [
    {
      "studentName": "Sneha Patel",
      "studentRole": "Business Analyst, FinanceCorp",
      "testimonialText": "The Power BI and Python modules revolutionized how we analyze our business data. Highly recommended!",
      "rating": 5
    }
  ],
  "tags": ["data-analytics", "business-intelligence", "python", "power-bi", "corporate"],
  "price": 60000,
  "status": "published",
  "trainingType": "corporate",
  "badges": ["Certified"]
}
```

---

## Get All Corporate Training Programs

```bash
GET /api/v1/trainings?trainingType=corporate
```

**Response:**
```json
{
  "success": true,
  "message": "Trainings retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Corporate Leadership Development Program",
      "slug": "corporate-leadership-development",
      "trainingType": "corporate",
      "placementRate": null,
      "durationMonths": 6,
      "durationHours": 180,
      ...
    }
  ]
}
```

---

## JSON Field Structures (Both Types)

### Curriculum Array

```json
[
  {
    "title": "Module or Topic Title",
    "hours": 30  // optional, integer
  }
]
```

**Validation:**
- `title` (required): Curriculum item title
- `hours` (optional): Number of hours (integer, min: 0)

---

### Testimonials Array

```json
[
  {
    "studentName": "Participant Name",
    "studentRole": "Role/Title",  // optional
    "testimonialText": "Testimonial text here",
    "rating": 5,  // optional, 1-5
    "studentImageUrl": "https://example.com/image.jpg"  // optional
  }
]
```

**Validation:**
- `studentName` (required): Participant's name
- `studentRole` (optional): Role/title (for college: "CSE Student", for corporate: "VP of Operations, TechCorp")
- `testimonialText` (required): Testimonial text
- `rating` (optional): Rating from 1-5
- `studentImageUrl` (optional): Valid URL to participant image

---

### FAQs Array

```json
[
  {
    "question": "FAQ Question",
    "answer": "FAQ Answer"
  }
]
```

**Validation:**
- `question` (required): FAQ question text
- `answer` (required): FAQ answer text

**Example FAQs for College Training:**
- Enrollment questions
- Prerequisites
- Duration and schedule
- Placement assistance
- Certification

**Example FAQs for Corporate Training:**
- Program format and delivery
- Target audience
- Certification
- Customization options
- ROI and outcomes

---

### Badges Array

```json
["POPULAR", "Flexible", "Certified", "Enterprise", "NEW"]
```

Simple array of strings.

**Common College Badges:**
- `POPULAR` - Popular program
- `Flexible` - Flexible scheduling

**Common Corporate Badges:**
- `POPULAR` - Popular program
- `Certified` - Certified program
- `Enterprise` - Enterprise-grade program
- `NEW` - Newly added program

---

## Comparison Table: College vs Corporate

| Aspect | College Training | Corporate Training |
|--------|-----------------|-------------------|
| **API Endpoint** | `/api/v1/trainings` | `/api/v1/trainings` |
| **trainingType** | `"college"` | `"corporate"` |
| **Filter Query** | `?trainingType=college` | `?trainingType=corporate` |
| **placementRate** | Usually included (0-100) | Usually `null` (not applicable) |
| **successMetric** | Placement-focused<br>"85% placement rate (All streams)" | Business-focused<br>"95% participant satisfaction" |
| **Testimonials** | Students<br>"Computer Science Student" | Corporate professionals<br>"VP of Operations, TechCorp" |
| **Badges** | Student-focused<br>["POPULAR", "Flexible"] | Corporate-focused<br>["POPULAR", "Certified", "Enterprise"] |
| **Price Range** | Lower (8,000 - 25,000) | Higher (35,000 - 120,000) |
| **Duration** | Usually aligned with academic calendar | Flexible (intensive or spread) |
| **Focus** | Student placement, skill development | Business outcomes, ROI, efficiency |

---

## All Endpoints Reference

### 1. GET /api/v1/trainings
**Get all training programs**

Query Parameters:
- `trainingType` (optional): `"college"` or `"corporate"`

Examples:
- Get all: `GET /api/v1/trainings`
- Get college only: `GET /api/v1/trainings?trainingType=college`
- Get corporate only: `GET /api/v1/trainings?trainingType=corporate`

---

### 2. GET /api/v1/trainings/:id
**Get training program by ID**

URL Parameters:
- `id` (required): UUID of training program

---

### 3. POST /api/v1/trainings
**Create new training program**

Authentication: Required (Admin)

Request Body: See examples above

**Key Point:** Set `trainingType: "college"` or `trainingType: "corporate"` to specify the type.

---

### 4. PUT /api/v1/trainings/:id
**Update training program**

Authentication: Required (Admin)

URL Parameters:
- `id` (required): UUID of training program

Request Body: All fields optional (partial update)

Example:
```json
{
  "price": 80000,
  "status": "published",
  "successMetric": "96% participant satisfaction"
}
```

---

### 5. DELETE /api/v1/trainings/:id
**Delete training program**

Authentication: Required (Admin)

URL Parameters:
- `id` (required): UUID of training program

Response:
```json
{
  "success": true,
  "message": "Training deleted successfully",
  "data": null
}
```

---

## Response Format

All endpoints return the training program object with all fields populated:

```json
{
  "success": true,
  "message": "Training created successfully",
  "data": {
    "id": "uuid",
    "title": "Training Title",
    "slug": "training-slug",
    "description": "Description...",
    "cardImageUrl": "https://example.com/image.jpg",
    "durationMonths": 6,
    "durationHours": 180,
    "placementRate": 85.0,  // or null for corporate
    "successMetric": "Success metric text",
    "curriculum": [...],
    "testimonials": [...],
    "faqs": [...],
    "badges": ["POPULAR"],
    "price": 50000,
    "status": "published",
    "trainingType": "college",  // or "corporate"
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Quick Reference

### Create College Training
```bash
POST /api/v1/trainings
{
  "title": "...",
  "slug": "...",
  "description": "...",
  "price": 15000,
  "trainingType": "college",  # ← Set to "college"
  "placementRate": 85.0,
  "successMetric": "85% placement rate",
  ...
}
```

### Create Corporate Training
```bash
POST /api/v1/trainings
{
  "title": "...",
  "slug": "...",
  "description": "...",
  "price": 75000,
  "trainingType": "corporate",  # ← Set to "corporate"
  "placementRate": null,  # Usually null
  "successMetric": "95% participant satisfaction",
  ...
}
```

### Get College Training Programs
```bash
GET /api/v1/trainings?trainingType=college
```

### Get Corporate Training Programs
```bash
GET /api/v1/trainings?trainingType=corporate
```

---

## Notes

1. **Same API, Different Types**: Both college and corporate training use the same endpoint (`/api/v1/trainings`)
2. **Differentiation**: Use `trainingType` field to distinguish between them
3. **Same Fields**: All fields are available for both types
4. **Different Usage Patterns**: 
   - College: Focus on placement rates, student testimonials
   - Corporate: Focus on business metrics, professional testimonials
5. **All fields optional** except required ones (title, slug, description, price, trainingType)
6. **JSON fields** (`curriculum`, `testimonials`) are automatically serialized/deserialized

---

## Database Migration

If you haven't run the migration for enhanced fields yet:

```bash
psql -U your_user -d UpSkillWay -f prisma/migrations/manual_add_training_program_enhanced_fields.sql
```

Or use Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

