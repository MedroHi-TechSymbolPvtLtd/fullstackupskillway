# Training Program Enhanced API - Complete Documentation

## Overview

The Training Program API has been enhanced with new fields to support rich program cards for college training programs, including images, duration, placement rates, curriculum with hours, testimonials, and badges.

---

## API Endpoint: `POST /api/v1/trainings`

### Complete Request Example

```json
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
  "badges": ["POPULAR"]
}
```

---

## Field Reference

### Basic Fields (Required)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | min: 1, max: 200 | Training program title |
| `slug` | string | Yes | unique, URL-friendly | Unique URL slug |
| `description` | string | Yes | min: 1, max: 2000 | Program description |
| `price` | number | Yes | min: 0 | Training program price |
| `trainingType` | enum | Yes | "college" or "corporate" | Type of training |

### Optional Basic Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `syllabus` | string | No | - | Course syllabus (text or JSON) |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array | Tags for categorization (default: []) |
| `status` | enum | No | "draft" or "published" | Publication status (default: "draft") |

### New Enhanced Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `cardImageUrl` | string | No | Valid URL | Card image URL for program display |
| `durationMonths` | integer | No | min: 0 | Program duration in months |
| `durationHours` | integer | No | min: 0 | Program duration in hours |
| `placementRate` | number | No | min: 0, max: 100 | Placement rate percentage |
| `successMetric` | string | No | max: 200 | Success metric text (e.g., "85% placement rate (All streams)") |
| `curriculum` | array | No | - | JSON array of curriculum items with hours |
| `testimonials` | array | No | - | JSON array of student testimonials |
| `badges` | string[] | No | Array | Badge labels (e.g., ["POPULAR", "Flexible"]) (default: []) |

---

## JSON Field Structures

### Curriculum Array

```json
[
  {
    "title": "Aptitude & logical reasoning",
    "hours": 40
  },
  {
    "title": "Communication skills",
    "hours": 30
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
    "studentName": "Student Name",
    "studentRole": "Student Role", // optional
    "testimonialText": "Testimonial text here",
    "rating": 5, // optional, 1-5
    "studentImageUrl": "https://example.com/student.jpg" // optional
  }
]
```

**Validation:**
- `studentName` (required): Student's name
- `studentRole` (optional): Student's role/title
- `testimonialText` (required): Testimonial text
- `rating` (optional): Rating from 1-5
- `studentImageUrl` (optional): Valid URL to student image

---

### Badges Array

```json
["POPULAR", "Flexible", "NEW"]
```

Simple array of strings. Common badges:
- `POPULAR` - Popular program
- `Flexible` - Flexible scheduling
- `NEW` - Newly added program

---

## Example: Technical Upskilling Program

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
  "trainingType": "college"
}
```

---

## Example: Soft Skills & Professional Grooming

```json
POST /api/v1/trainings
{
  "title": "Soft Skills & Professional Grooming",
  "slug": "soft-skills-professional-grooming",
  "description": "Intensive program focusing on confidence building, leadership, time management, and professional etiquette.",
  "cardImageUrl": "https://example.com/images/soft-skills-card.jpg",
  "durationMonths": 1,
  "durationHours": 48,
  "placementRate": 92.0,
  "successMetric": "92% interview success (All streams)",
  "curriculum": [
    {
      "title": "Confidence building",
      "hours": 12
    },
    {
      "title": "Leadership & teamwork",
      "hours": 12
    },
    {
      "title": "Time management",
      "hours": 12
    },
    {
      "title": "Professional etiquette",
      "hours": 12
    }
  ],
  "testimonials": [
    {
      "studentName": "Sneha Patel",
      "studentRole": "Management Student",
      "testimonialText": "The confidence building sessions transformed my interview performance!",
      "rating": 5
    }
  ],
  "tags": ["soft-skills", "professional", "grooming", "leadership"],
  "price": 8000,
  "status": "published",
  "trainingType": "college"
}
```

---

## Example: Customized Department Programs

```json
POST /api/v1/trainings
{
  "title": "Customized Department Programs",
  "slug": "customized-department-programs",
  "description": "Flexible training programs customized for specific departments, aligned with academic calendar and co-created curriculum.",
  "cardImageUrl": "https://example.com/images/customized-programs-card.jpg",
  "badges": ["POPULAR", "Flexible"],
  "curriculum": [
    {
      "title": "CSE, IT, ECE, EEE programs available"
    },
    {
      "title": "Arts & Commerce streams available"
    },
    {
      "title": "Aligned with academic calendar"
    },
    {
      "title": "Custom curriculum co-created"
    }
  ],
  "testimonials": [
    {
      "studentName": "Vikram Singh",
      "studentRole": "Mechanical Engineering Student",
      "testimonialText": "The customized program perfectly matched our department's needs!",
      "rating": 5
    }
  ],
  "tags": ["customized", "department-specific", "flexible"],
  "price": 20000,
  "status": "published",
  "trainingType": "college",
  "successMetric": "Results vary by program (All departments)"
}
```

---

## Response Format

All endpoints return the training program object with all fields populated. JSON fields are returned as parsed JSON objects (not strings).

**Example Response:**
```json
{
  "success": true,
  "message": "Training created successfully",
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
    "curriculum": [
      {
        "title": "Aptitude & logical reasoning",
        "hours": 40
      }
    ],
    "testimonials": [
      {
        "studentName": "Rajesh Kumar",
        "testimonialText": "Great program!",
        "rating": 5
      }
    ],
    "badges": ["POPULAR"],
    "price": 15000,
    "status": "published",
    "trainingType": "college",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Database Migration

Run the migration file to add the new fields to your database:

```bash
psql -U your_user -d UpSkillWay -f prisma/migrations/manual_add_training_program_enhanced_fields.sql
```

Or use Prisma migrate:

```bash
npx prisma migrate dev --name add_training_program_enhanced_fields
npx prisma generate
```

---

## Notes

1. All new fields are optional - existing training programs will continue to work
2. JSON fields (`curriculum`, `testimonials`) are automatically serialized/deserialized
3. `placementRate` should be a number between 0-100 (percentage)
4. `badges` array can contain any string labels (e.g., "POPULAR", "Flexible", "NEW")
5. Duration can be specified in both months and hours for flexibility
6. `successMetric` is a free-text field for displaying success statistics

