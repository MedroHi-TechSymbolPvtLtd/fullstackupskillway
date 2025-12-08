# Course API - Complete Reference

Complete documentation for all Course API endpoints, fields, and examples for Postman testing.

---

## Base URL
```
http://localhost:3000/api/v1/courses
```

---

## Authentication

**Public Endpoints** (No authentication required):
- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get course by ID

**Admin-Only Endpoints** (Bearer token required):
- `POST /api/v1/courses` - Create course
- `PUT /api/v1/courses/:id` - Update course
- `DELETE /api/v1/courses/:id` - Delete course

**Authorization Header:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## API Endpoints

### 1. Get All Courses (Public)

**Endpoint:** `GET /api/v1/courses`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page (max 100) |
| `status` | string | No | - | Filter by status: `draft` or `published` |

**Example Request:**
```http
GET http://localhost:3000/api/v1/courses?page=1&limit=10&status=published
```

**Response:**
```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Full Stack Web Development",
      "slug": "full-stack-web-development",
      "description": "Complete course description...",
      "shortDescription": "Learn full stack development...",
      "syllabus": "Course syllabus...",
      "videoDemoUrl": "https://example.com/video.mp4",
      "tags": ["web development", "javascript", "react"],
      "price": 29999.00,
      "status": "published",
      "bannerImageUrl": "https://example.com/banner.jpg",
      "programName": "Full Stack Developer Program",
      "durationMonths": 6,
      "durationHours": 480,
      "deliveryModes": ["Online Bootcamp", "Offline Course"],
      "language": "English",
      "aboutSectionImageUrl": "https://example.com/about.jpg",
      "masteredTools": [...],
      "curriculum": [...],
      "trainingOptions": [...],
      "projects": [...],
      "mentors": [...],
      "careerRoles": [...],
      "testimonials": [...],
      "faqs": [...],
      "relatedPrograms": [...],
      "createdBy": "uuid",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "creator": {
        "id": "uuid",
        "name": "Admin User",
        "email": "admin@upskillway.com"
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

### 2. Get Course by ID (Public)

**Endpoint:** `GET /api/v1/courses/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Course ID |

**Example Request:**
```http
GET http://localhost:3000/api/v1/courses/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "success": true,
  "message": "Course retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Full Stack Web Development",
    "slug": "full-stack-web-development",
    // ... all course fields
  }
}
```

---

### 3. Create Course (Admin Only)

**Endpoint:** `POST /api/v1/courses`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body Fields:**

#### Required Fields:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `title` | string | Course title | Min 1, Max 200 chars |
| `slug` | string | URL-friendly identifier | Unique, lowercase, alphanumeric with hyphens |

#### Optional Fields:
| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `description` | string | Full course description | Max 1000 chars |
| `shortDescription` | string | Short preview description | Max 500 chars |
| `syllabus` | string | Course syllabus (text or JSON) | - |
| `videoDemoUrl` | string | Demo video URL | Valid URL |
| `tags` | string[] | Course tags | Array of strings, default: [] |
| `price` | number | Course price | Min 0, Decimal |
| `status` | string | Course status | `draft` or `published`, default: `draft` |
| `bannerImageUrl` | string | Main banner image URL | Valid URL |
| `programName` | string | Program name/title | Max 200 chars |
| `durationMonths` | number | Duration in months | Integer, Min 0 |
| `durationHours` | number | Duration in hours | Integer, Min 0 |
| `deliveryModes` | string[] | Delivery modes | Array of strings, default: [] |
| `language` | string | Course language | Max 50 chars |
| `aboutSectionImageUrl` | string | About section image URL | Valid URL |
| `masteredTools` | object[] | Tools students will master | Array of objects (see structure below) |
| `curriculum` | object[] | Course curriculum modules | Array of objects (see structure below) |
| `trainingOptions` | object[] | Training options with pricing | Array of objects (see structure below) |
| `projects` | object[] | Course projects | Array of objects (see structure below) |
| `mentors` | object[] | Course mentors | Array of objects (see structure below) |
| `careerRoles` | object[] | Career roles after course | Array of objects (see structure below) |
| `testimonials` | object[] | Student testimonials | Array of objects (see structure below) |
| `faqs` | object[] | Frequently asked questions | Array of objects (see structure below) |
| `relatedPrograms` | object[] | Related programs | Array of objects (see structure below) |

**Example Request:**
```json
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development",
  "description": "Master full stack web development with React, Node.js, and MongoDB. Build real-world projects and get job-ready.",
  "shortDescription": "Learn full stack development and build real-world projects",
  "syllabus": "Module 1: HTML/CSS, Module 2: JavaScript, Module 3: React...",
  "videoDemoUrl": "https://example.com/demo.mp4",
  "tags": ["web development", "javascript", "react", "node.js"],
  "price": 29999.00,
  "status": "published",
  "bannerImageUrl": "https://example.com/banner.jpg",
  "programName": "Full Stack Developer Program",
  "durationMonths": 6,
  "durationHours": 480,
  "deliveryModes": ["Online Bootcamp", "Offline Course"],
  "language": "English",
  "aboutSectionImageUrl": "https://example.com/about.jpg",
  "masteredTools": [
    {
      "name": "React",
      "logoUrl": "https://example.com/react-logo.png"
    },
    {
      "name": "Node.js",
      "logoUrl": "https://example.com/nodejs-logo.png"
    }
  ],
  "curriculum": [
    {
      "moduleTitle": "Frontend Fundamentals",
      "topics": [
        "HTML5 & CSS3",
        "JavaScript ES6+",
        "Responsive Design"
      ]
    },
    {
      "moduleTitle": "React Development",
      "topics": [
        "React Components",
        "State Management",
        "React Hooks"
      ]
    }
  ],
  "trainingOptions": [
    {
      "name": "Self-Paced",
      "price": 19999,
      "currency": "INR",
      "descriptionPoints": [
        "Lifetime access",
        "Recorded sessions",
        "Community support"
      ]
    },
    {
      "name": "Live Bootcamp",
      "price": 29999,
      "currency": "INR",
      "descriptionPoints": [
        "Live instructor-led sessions",
        "Real-time doubt clearing",
        "1-on-1 mentorship",
        "Job placement assistance"
      ]
    }
  ],
  "projects": [
    {
      "title": "E-Commerce Platform",
      "imageUrl": "https://example.com/project1.jpg",
      "description": "Build a complete e-commerce platform with payment integration"
    },
    {
      "title": "Social Media App",
      "imageUrl": "https://example.com/project2.jpg",
      "description": "Create a social media application with real-time features"
    }
  ],
  "mentors": [
    {
      "name": "John Doe",
      "title": "Senior Full Stack Developer",
      "imageUrl": "https://example.com/mentor1.jpg",
      "bio": "10+ years of experience in web development"
    },
    {
      "name": "Jane Smith",
      "title": "React Expert",
      "imageUrl": "https://example.com/mentor2.jpg",
      "bio": "Former Google engineer, React core contributor"
    }
  ],
  "careerRoles": [
    {
      "title": "Full Stack Developer",
      "description": "Build end-to-end web applications"
    },
    {
      "title": "Frontend Developer",
      "description": "Specialize in user interface development"
    },
    {
      "title": "Backend Developer",
      "description": "Focus on server-side development"
    }
  ],
  "testimonials": [
    {
      "studentName": "Alice Johnson",
      "studentRole": "Software Developer at Tech Corp",
      "testimonialText": "This course transformed my career. The hands-on projects were amazing!",
      "rating": 5,
      "studentImageUrl": "https://example.com/student1.jpg"
    },
    {
      "studentName": "Bob Williams",
      "studentRole": "Full Stack Developer",
      "testimonialText": "Best investment I made. Got placed within 3 months of completion.",
      "rating": 5,
      "studentImageUrl": "https://example.com/student2.jpg"
    }
  ],
  "faqs": [
    {
      "question": "What prerequisites do I need?",
      "answer": "Basic programming knowledge is helpful but not required. We start from the basics."
    },
    {
      "question": "Will I get a certificate?",
      "answer": "Yes, you'll receive a certificate upon successful completion of the course."
    },
    {
      "question": "Is job placement guaranteed?",
      "answer": "We provide job placement assistance, but placement depends on your performance and market conditions."
    }
  ],
  "relatedPrograms": [
    {
      "title": "Data Science Bootcamp",
      "imageUrl": "https://example.com/datascience.jpg",
      "duration": "6 months",
      "price": "₹35,999",
      "slug": "data-science-bootcamp"
    },
    {
      "title": "Mobile App Development",
      "imageUrl": "https://example.com/mobile.jpg",
      "duration": "4 months",
      "price": "₹24,999",
      "slug": "mobile-app-development"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Full Stack Web Development",
    "slug": "full-stack-web-development",
    // ... all fields as sent
    "createdBy": "admin-user-id",
    "createdAt": "2025-11-06T12:00:00.000Z",
    "updatedAt": "2025-11-06T12:00:00.000Z",
    "creator": {
      "id": "admin-user-id",
      "name": "Admin User",
      "email": "admin@upskillway.com"
    }
  }
}
```

---

### 4. Update Course (Admin Only)

**Endpoint:** `PUT /api/v1/courses/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Course ID |

**Request Body:**
All fields are optional. Only include fields you want to update.

**Example Request:**
```json
{
  "title": "Updated Full Stack Web Development",
  "price": 34999.00,
  "status": "published",
  "durationMonths": 7
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    // Updated course object
  }
}
```

---

### 5. Delete Course (Admin Only)

**Endpoint:** `DELETE /api/v1/courses/:id`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Course ID |

**Example Request:**
```http
DELETE http://localhost:3000/api/v1/courses/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

---

## JSON Field Structures

### 1. masteredTools
```json
[
  {
    "name": "React",
    "logoUrl": "https://example.com/react-logo.png"
  },
  {
    "name": "Node.js",
    "logoUrl": "https://example.com/nodejs-logo.png"
  }
]
```

**Fields:**
- `name` (required): Tool name
- `logoUrl` (optional): Tool logo image URL

---

### 2. curriculum
```json
[
  {
    "moduleTitle": "Frontend Fundamentals",
    "topics": [
      "HTML5 & CSS3",
      "JavaScript ES6+",
      "Responsive Design"
    ]
  },
  {
    "moduleTitle": "React Development",
    "topics": [
      "React Components",
      "State Management",
      "React Hooks"
    ]
  }
]
```

**Fields:**
- `moduleTitle` (required): Module title
- `topics` (optional, default: []): Array of topic strings

---

### 3. trainingOptions
```json
[
  {
    "name": "Self-Paced",
    "price": 19999,
    "currency": "INR",
    "descriptionPoints": [
      "Lifetime access",
      "Recorded sessions",
      "Community support"
    ]
  },
  {
    "name": "Live Bootcamp",
    "price": 29999,
    "currency": "INR",
    "descriptionPoints": [
      "Live instructor-led sessions",
      "Real-time doubt clearing",
      "1-on-1 mentorship"
    ]
  }
]
```

**Fields:**
- `name` (required): Training option name
- `price` (required): Price (number, min 0)
- `currency` (optional, default: "INR"): Currency code
- `descriptionPoints` (optional, default: []): Array of feature strings

---

### 4. projects
```json
[
  {
    "title": "E-Commerce Platform",
    "imageUrl": "https://example.com/project1.jpg",
    "description": "Build a complete e-commerce platform with payment integration"
  },
  {
    "title": "Social Media App",
    "imageUrl": "https://example.com/project2.jpg",
    "description": "Create a social media application with real-time features"
  }
]
```

**Fields:**
- `title` (required): Project title
- `imageUrl` (optional): Project image URL
- `description` (optional): Project description

---

### 5. mentors
```json
[
  {
    "name": "John Doe",
    "title": "Senior Full Stack Developer",
    "imageUrl": "https://example.com/mentor1.jpg",
    "bio": "10+ years of experience in web development"
  },
  {
    "name": "Jane Smith",
    "title": "React Expert",
    "imageUrl": "https://example.com/mentor2.jpg",
    "bio": "Former Google engineer, React core contributor"
  }
]
```

**Fields:**
- `name` (required): Mentor name
- `title` (required): Mentor title/role
- `imageUrl` (optional): Mentor image URL
- `bio` (optional): Mentor biography

---

### 6. careerRoles
```json
[
  {
    "title": "Full Stack Developer",
    "description": "Build end-to-end web applications"
  },
  {
    "title": "Frontend Developer",
    "description": "Specialize in user interface development"
  }
]
```

**Fields:**
- `title` (required): Role title
- `description` (required): Role description

---

### 7. testimonials
```json
[
  {
    "studentName": "Alice Johnson",
    "studentRole": "Software Developer at Tech Corp",
    "testimonialText": "This course transformed my career. The hands-on projects were amazing!",
    "rating": 5,
    "studentImageUrl": "https://example.com/student1.jpg"
  },
  {
    "studentName": "Bob Williams",
    "studentRole": "Full Stack Developer",
    "testimonialText": "Best investment I made. Got placed within 3 months of completion.",
    "rating": 5,
    "studentImageUrl": "https://example.com/student2.jpg"
  }
]
```

**Fields:**
- `studentName` (required): Student name
- `studentRole` (optional): Student's current role
- `testimonialText` (required): Testimonial text
- `rating` (optional): Rating (1-5)
- `studentImageUrl` (optional): Student image URL

---

### 8. faqs
```json
[
  {
    "question": "What prerequisites do I need?",
    "answer": "Basic programming knowledge is helpful but not required. We start from the basics."
  },
  {
    "question": "Will I get a certificate?",
    "answer": "Yes, you'll receive a certificate upon successful completion of the course."
  }
]
```

**Fields:**
- `question` (required): FAQ question
- `answer` (required): FAQ answer

---

### 9. relatedPrograms
```json
[
  {
    "title": "Data Science Bootcamp",
    "imageUrl": "https://example.com/datascience.jpg",
    "duration": "6 months",
    "price": "₹35,999",
    "slug": "data-science-bootcamp"
  },
  {
    "title": "Mobile App Development",
    "imageUrl": "https://example.com/mobile.jpg",
    "duration": "4 months",
    "price": "₹24,999",
    "slug": "mobile-app-development"
  }
]
```

**Fields:**
- `title` (required): Program title
- `imageUrl` (optional): Program image URL
- `duration` (optional): Program duration
- `price` (optional): Program price (string format)
- `slug` (optional): Program slug

---

## Postman Testing Examples

### 1. Get All Courses (Public)
```
GET http://localhost:3000/api/v1/courses?page=1&limit=10&status=published
```

### 2. Get Course by ID (Public)
```
GET http://localhost:3000/api/v1/courses/123e4567-e89b-12d3-a456-426614174000
```

### 3. Create Course (Admin)
```
POST http://localhost:3000/api/v1/courses

Headers:
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body (raw JSON):
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development",
  "description": "Master full stack web development...",
  "shortDescription": "Learn full stack development...",
  "price": 29999.00,
  "status": "published",
  "tags": ["web development", "javascript"]
}
```

### 4. Update Course (Admin)
```
PUT http://localhost:3000/api/v1/courses/123e4567-e89b-12d3-a456-426614174000

Headers:
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body (raw JSON):
{
  "price": 34999.00,
  "status": "published"
}
```

### 5. Delete Course (Admin)
```
DELETE http://localhost:3000/api/v1/courses/123e4567-e89b-12d3-a456-426614174000

Headers:
Authorization: Bearer YOUR_TOKEN
```

---

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ],
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication failed",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Course not found",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

### 409 Conflict - Duplicate Slug
```json
{
  "success": false,
  "message": "Course with this slug already exists",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "timestamp": "2025-11-06T12:00:00.000Z"
}
```

---

## Quick Reference

### All Endpoints Summary
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/courses` | Public | Get all courses (paginated) |
| GET | `/api/v1/courses/:id` | Public | Get course by ID |
| POST | `/api/v1/courses` | Admin | Create new course |
| PUT | `/api/v1/courses/:id` | Admin | Update course |
| DELETE | `/api/v1/courses/:id` | Admin | Delete course |

### Required Fields for Create
- `title` (string)
- `slug` (string, unique)

### Status Values
- `draft` - Course is in draft mode
- `published` - Course is published and visible

### Query Parameters for GET /courses
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `status` (string: "draft" | "published")

---

## Notes

1. **Slug Uniqueness**: The `slug` field must be unique across all courses. Use lowercase, alphanumeric characters with hyphens (e.g., `full-stack-web-development`).

2. **JSON Fields**: Fields like `masteredTools`, `curriculum`, `trainingOptions`, etc., are stored as JSON in the database. They are automatically serialized/deserialized.

3. **Price Format**: Price is stored as a decimal number. For display, format as currency (e.g., ₹29,999).

4. **Arrays Default**: Array fields (`tags`, `deliveryModes`) default to empty arrays `[]` if not provided.

5. **URL Validation**: All URL fields (`videoDemoUrl`, `bannerImageUrl`, etc.) are validated to ensure they are valid URLs.

6. **Creator Information**: The `creator` field is automatically populated from the authenticated user when creating/updating courses.

---

## Complete Field Reference

### Basic Fields
- `id` (UUID, auto-generated)
- `title` (string, required, 1-200 chars)
- `slug` (string, required, unique)
- `description` (string, optional, max 1000 chars)
- `shortDescription` (string, optional, max 500 chars)
- `syllabus` (string, optional)
- `videoDemoUrl` (string, optional, valid URL)
- `tags` (string[], optional, default: [])
- `price` (number, optional, min 0)
- `status` (enum: "draft" | "published", default: "draft")

### Enhanced Fields
- `bannerImageUrl` (string, optional, valid URL)
- `programName` (string, optional, max 200 chars)
- `durationMonths` (number, optional, integer, min 0)
- `durationHours` (number, optional, integer, min 0)
- `deliveryModes` (string[], optional, default: [])
- `language` (string, optional, max 50 chars)
- `aboutSectionImageUrl` (string, optional, valid URL)

### JSON Fields
- `masteredTools` (object[], optional)
- `curriculum` (object[], optional)
- `trainingOptions` (object[], optional)
- `projects` (object[], optional)
- `mentors` (object[], optional)
- `careerRoles` (object[], optional)
- `testimonials` (object[], optional)
- `faqs` (object[], optional)
- `relatedPrograms` (object[], optional)

### System Fields
- `createdBy` (UUID, auto-set from authenticated user)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-updated)
- `creator` (object, auto-populated with user info)

---

**Last Updated:** November 6, 2025

