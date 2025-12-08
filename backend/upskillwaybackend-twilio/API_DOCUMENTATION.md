---

## Newly Added Routes

### Study Abroad Destinations (Public)
**GET** `/api/v1/study-abroad/destinations`

**Query Parameters (optional):**
```json
{
  "city": "Toronto",
  "university": "University of Toronto",
  "minTuition": 20000,
  "maxTuition": 40000,
  "pricePerYear": 30000,
  "duration": 12,
  "partTime": false,
  "limit": 10,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Study abroad destinations retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "city": "Toronto",
      "country": "Canada",
      "universities": ["University of Toronto"],
      "pricePerYear": 32000,
      "durationMonths": 12,
      "partTimeAvailable": false,
      "description": "Program details...",
      "tags": ["engineering"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

---

### Asset Loader (Admin only)
**POST** `/api/v1/assets/load-image-from-url`

**Request Body:**
```json
{
  "url": "https://example.com/path/to/image.png"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image asset created successfully",
  "data": {
    "imageId": "uuid",
    "url": "https://cdn.upskillway.com/assets/image.png",
    "mimeType": "image/png",
    "createdAt": "2025-11-19T10:00:00.000Z"
  },
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

---

### Course Curriculum (Admin GET)
**GET** `/api/v1/cms/courses/{id}/curriculum`

**Response:**
```json
{
  "success": true,
  "message": "Course curriculum retrieved successfully",
  "data": {
    "id": "course-uuid",
    "title": "Full Stack Engineering",
    "curriculum": [
      { "moduleTitle": "Module 1: Foundations", "topics": ["HTML", "CSS"] },
      { "moduleTitle": "Module 2: Backend", "topics": ["Node.js", "Prisma"] }
    ]
  },
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

**POST** `/api/v1/cms/courses/{id}/curriculum` *(admin only)*
```json
{
  "curriculum": [
    { "moduleTitle": "Module 1: Foundations", "topics": ["HTML", "CSS"] },
    { "moduleTitle": "Module 2: Backend", "topics": ["Node.js", "Prisma"] }
  ]
}
```

---

### Referral Partners & Testimonials (Public GET)
**GET** `/api/v1/refer/partners`

**Response:**
```json
{
  "success": true,
  "message": "Referral partners retrieved successfully",
  "data": [
    {
      "id": "partner-uuid",
      "name": "Tech Academy",
      "logoUrl": "https://cdn.upskillway.com/partners/tech-academy.png",
      "websiteUrl": "https://techacademy.example.com",
      "testimonial": "Great experience!"
    }
  ],
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

**GET** `/api/v1/refer/testimonials`
```json
{
  "success": true,
  "message": "Referral testimonials retrieved successfully",
  "data": [
    {
      "id": "testimonial-uuid",
      "authorName": "Jane Doe",
      "text": "UpskillWay helped us grow!",
      "rating": 4.8
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1, "hasNext": false, "hasPrev": false },
  "timestamp": "2025-11-19T10:00:00.000Z"
}
```

---

# UpSkillWay Backend API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Content Posting APIs (CMS)](#content-posting-apis-cms) ⭐
4. [CMS APIs - Complete CRUD Operations](#cms-apis---complete-crud-operations) 🔄
5. [Other APIs](#other-apis)
6. [Response Format](#response-format)
7. [Error Handling](#error-handling)

---

## Overview

This document provides comprehensive documentation for all UpSkillWay Backend APIs, with special emphasis on **Content Posting APIs** used to post content on the website.

**Base URL:** `/api/v1`

**Authentication:** Most endpoints require JWT Bearer token authentication. Admin role is required for content posting operations.

---

## Authentication

### Login (Admin)
**Endpoint:** `POST /api/v1/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@upskillway.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "email": "admin@upskillway.com",
      "name": "Admin User",
      "role": "admin"
    }
  }
}
```

**Usage:** Include the `accessToken` in the Authorization header for all protected endpoints:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Content Posting APIs (CMS) ⭐

These APIs are specifically used to **post content on the website**. All content posting endpoints require:
- ✅ Authentication (JWT Bearer token)
- ✅ Admin role
- ✅ Valid request body with required fields

### 1. Blog APIs

#### Create Blog
**Endpoint:** `POST /api/v1/cms/blogs`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Introduction to Full Stack Development",
  "slug": "introduction-to-full-stack-development",
  "excerpt": "Learn the fundamentals of full stack web development",
  "content": "Full stack development involves both frontend and backend...",
  "imageUrl": "https://example.com/images/blog-image.jpg",
  "category": "Web Development",
  "tags": ["Full Stack", "Web Development", "Tutorial"],
  "status": "published"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Blog title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug (lowercase, hyphens) |
| `content` | string | ✅ Yes | Min: 1 char | Blog content |
| `excerpt` | string | No | Max: 500 chars | Short preview text |
| `imageUrl` | string | No | Valid URL | Featured image URL |
| `category` | string | No | Max: 100 chars | Blog category |
| `tags` | string[] | No | Array of strings | Tags for categorization |
| `status` | enum | No | `draft` or `published` | Publication status (default: `draft`) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "blog-uuid",
    "title": "Introduction to Full Stack Development",
    "slug": "introduction-to-full-stack-development",
    "excerpt": "Learn the fundamentals of full stack web development",
    "content": "Full stack development involves both frontend and backend...",
    "imageUrl": "https://example.com/images/blog-image.jpg",
    "category": "Web Development",
    "tags": ["Full Stack", "Web Development", "Tutorial"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Blog
**Endpoint:** `PUT /api/v1/cms/blogs/:id`

**Request Body:** (All fields optional - only include fields to update)
```json
{
  "title": "Updated Blog Title",
  "status": "published"
}
```

#### Delete Blog
**Endpoint:** `DELETE /api/v1/cms/blogs/:id`

---

### 2. Video APIs

#### Create Video
**Endpoint:** `POST /api/v1/cms/videos`

**Request Body:**
```json
{
  "title": "Python Programming Tutorial",
  "slug": "python-programming-tutorial",
  "description": "Learn Python programming from scratch with this comprehensive tutorial",
  "videoUrl": "https://youtube.com/watch?v=abc123",
  "tags": ["Python", "Programming", "Tutorial", "Beginner"],
  "status": "published",
  "masteredTools": [
    {
      "name": "Python",
      "logoUrl": "https://example.com/logos/python.png"
    }
  ],
  "faqs": [
    {
      "question": "Is this course for beginners?",
      "answer": "Yes, this course is designed for absolute beginners."
    }
  ]
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Video title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `videoUrl` | string | ✅ Yes | Valid URL | Video URL (YouTube, Vimeo, etc.) |
| `description` | string | No | Max: 1000 chars | Video description |
| `tags` | string[] | No | Array of strings | Tags for categorization |
| `status` | enum | No | `draft` or `published` | Publication status |
| `masteredTools` | object[] | No | Array of tool objects | Tools covered in video |
| `faqs` | object[] | No | Array of FAQ objects | Frequently asked questions |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "id": "video-uuid",
    "title": "Python Programming Tutorial",
    "slug": "python-programming-tutorial",
    "description": "Learn Python programming from scratch...",
    "videoUrl": "https://youtube.com/watch?v=abc123",
    "tags": ["Python", "Programming", "Tutorial"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Video
**Endpoint:** `PUT /api/v1/cms/videos/:id`

#### Delete Video
**Endpoint:** `DELETE /api/v1/cms/videos/:id`

---

### 3. FAQ APIs

#### Create FAQ
**Endpoint:** `POST /api/v1/cms/faqs`

**Request Body:**
```json
{
  "question": "What is the course duration?",
  "answer": "The course duration is 6 months with flexible scheduling options.",
  "category": "Course Information"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `question` | string | ✅ Yes | Min: 1, Max: 500 chars | FAQ question |
| `answer` | string | ✅ Yes | Min: 1 char | FAQ answer |
| `category` | string | No | Max: 100 chars | FAQ category |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "FAQ created successfully",
  "data": {
    "id": "faq-uuid",
    "question": "What is the course duration?",
    "answer": "The course duration is 6 months...",
    "category": "Course Information",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update FAQ
**Endpoint:** `PUT /api/v1/cms/faqs/:id`

#### Delete FAQ
**Endpoint:** `DELETE /api/v1/cms/faqs/:id`

---

### 4. Testimonial APIs

#### Create Testimonial
**Endpoint:** `POST /api/v1/cms/testimonials`

**Request Body:**
```json
{
  "authorName": "John Doe",
  "role": "Software Engineer at Tech Corp",
  "text": "This course transformed my career. Highly recommended!",
  "avatarUrl": "https://example.com/avatars/john.jpg",
  "videoUrl": "https://example.com/videos/testimonial-john.mp4",
  "status": "approved"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `authorName` | string | ✅ Yes | Min: 1, Max: 100 chars | Testimonial author name |
| `text` | string | ✅ Yes | Min: 1, Max: 1000 chars | Testimonial text |
| `role` | string | No | Max: 100 chars | Author's role/position |
| `avatarUrl` | string | No | Valid URL | Author's avatar image |
| `videoUrl` | string | No | Valid URL | Video testimonial URL |
| `status` | enum | No | `pending` or `approved` | Approval status (default: `pending`) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Testimonial created successfully",
  "data": {
    "id": "testimonial-uuid",
    "authorName": "John Doe",
    "role": "Software Engineer at Tech Corp",
    "text": "This course transformed my career...",
    "avatarUrl": "https://example.com/avatars/john.jpg",
    "status": "approved",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Testimonial
**Endpoint:** `PUT /api/v1/cms/testimonials/:id`

#### Delete Testimonial
**Endpoint:** `DELETE /api/v1/cms/testimonials/:id`

---

### 5. Course APIs

#### Create Course
**Endpoint:** `POST /api/v1/cms/courses`

**Request Body:**
```json
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development",
  "description": "Complete full stack web development course covering frontend and backend technologies",
  "shortDescription": "Learn full stack development in 6 months",
  "syllabus": "Module 1: HTML/CSS\nModule 2: JavaScript\nModule 3: React\nModule 4: Node.js",
  "videoDemoUrl": "https://youtube.com/watch?v=demo123",
  "tags": ["Full Stack", "Web Development", "React", "Node.js"],
  "price": 50000.00,
  "status": "published",
  "bannerImageUrl": "https://example.com/images/course-banner.jpg",
  "programName": "Full Stack Developer Program",
  "durationMonths": 6,
  "durationHours": 200,
  "deliveryModes": ["Online", "Offline", "Hybrid"],
  "language": "English",
  "aboutSectionImageUrl": "https://example.com/images/about-section.jpg",
  "masteredTools": [
    {
      "name": "React",
      "logoUrl": "https://example.com/logos/react.png"
    },
    {
      "name": "Node.js",
      "logoUrl": "https://example.com/logos/nodejs.png"
    }
  ],
  "curriculum": [
    {
      "moduleTitle": "Frontend Fundamentals",
      "topics": ["HTML", "CSS", "JavaScript Basics"]
    },
    {
      "moduleTitle": "React Development",
      "topics": ["Components", "State Management", "Hooks"]
    }
  ],
  "trainingOptions": [
    {
      "name": "Standard",
      "price": 50000,
      "currency": "INR",
      "descriptionPoints": ["6 months duration", "Live sessions", "Projects"]
    }
  ],
  "projects": [
    {
      "title": "E-commerce Website",
      "imageUrl": "https://example.com/projects/ecommerce.jpg",
      "description": "Build a complete e-commerce platform"
    }
  ],
  "mentors": [
    {
      "name": "Jane Smith",
      "title": "Senior Full Stack Developer",
      "imageUrl": "https://example.com/mentors/jane.jpg",
      "bio": "10+ years of experience in web development"
    }
  ],
  "careerRoles": [
    {
      "title": "Full Stack Developer",
      "description": "Build end-to-end web applications"
    }
  ],
  "testimonials": [
    {
      "studentName": "Alice Johnson",
      "studentRole": "Software Developer",
      "testimonialText": "Best course I've taken!",
      "rating": 5,
      "studentImageUrl": "https://example.com/students/alice.jpg"
    }
  ],
  "faqs": [
    {
      "question": "Do I need prior experience?",
      "answer": "No prior experience required. This course is for beginners."
    }
  ],
  "relatedPrograms": [
    {
      "title": "Advanced Full Stack",
      "imageUrl": "https://example.com/programs/advanced.jpg",
      "duration": "12 months",
      "price": "100000",
      "slug": "advanced-full-stack"
    }
  ]
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Course title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `description` | string | No | Max: 1000 chars | Full course description |
| `shortDescription` | string | No | Max: 500 chars | Short preview |
| `syllabus` | string | No | - | Course syllabus (text or JSON) |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array of strings | Course tags |
| `price` | number | No | Min: 0 | Course price |
| `status` | enum | No | `draft` or `published` | Publication status |
| `bannerImageUrl` | string | No | Valid URL | Banner image |
| `programName` | string | No | Max: 200 chars | Program name |
| `durationMonths` | number | No | Integer, Min: 0 | Duration in months |
| `durationHours` | number | No | Integer, Min: 0 | Duration in hours |
| `deliveryModes` | string[] | No | Array of strings | Delivery modes |
| `language` | string | No | Max: 50 chars | Course language |
| `masteredTools` | object[] | No | Array of tool objects | Tools covered |
| `curriculum` | object[] | No | Array of module objects | Course curriculum |
| `trainingOptions` | object[] | No | Array of option objects | Training packages |
| `projects` | object[] | No | Array of project objects | Course projects |
| `mentors` | object[] | No | Array of mentor objects | Course mentors |
| `careerRoles` | object[] | No | Array of role objects | Career opportunities |
| `testimonials` | object[] | No | Array of testimonial objects | Student testimonials |
| `faqs` | object[] | No | Array of FAQ objects | Course FAQs |
| `relatedPrograms` | object[] | No | Array of program objects | Related programs |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "course-uuid",
    "title": "Full Stack Web Development",
    "slug": "full-stack-web-development",
    "description": "Complete full stack web development course...",
    "price": 50000.00,
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Course
**Endpoint:** `PUT /api/v1/cms/courses/:id`

#### Delete Course
**Endpoint:** `DELETE /api/v1/cms/courses/:id`

---

### 6. Ebook APIs

#### Create Ebook
**Endpoint:** `POST /api/v1/cms/ebooks`

**Request Body:**
```json
{
  "title": "Complete Guide to JavaScript",
  "slug": "complete-guide-to-javascript",
  "description": "Comprehensive guide covering all aspects of JavaScript programming",
  "coverImageUrl": "https://example.com/images/ebook-cover.jpg",
  "pdfUrl": "https://example.com/pdfs/javascript-guide.pdf",
  "tags": ["JavaScript", "Programming", "Guide"],
  "status": "published"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Ebook title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `pdfUrl` | string | ✅ Yes | Valid URL | PDF file URL |
| `description` | string | No | Max: 1000 chars | Ebook description |
| `coverImageUrl` | string | No | Valid URL | Cover image URL |
| `tags` | string[] | No | Array of strings | Ebook tags |
| `status` | enum | No | `draft` or `published` | Publication status |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Ebook created successfully",
  "data": {
    "id": "ebook-uuid",
    "title": "Complete Guide to JavaScript",
    "slug": "complete-guide-to-javascript",
    "description": "Comprehensive guide...",
    "coverImageUrl": "https://example.com/images/ebook-cover.jpg",
    "pdfUrl": "https://example.com/pdfs/javascript-guide.pdf",
    "tags": ["JavaScript", "Programming"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Ebook
**Endpoint:** `PUT /api/v1/cms/ebooks/:id`

#### Delete Ebook
**Endpoint:** `DELETE /api/v1/cms/ebooks/:id`

---

### 7. Study Abroad APIs

#### Create Study Abroad
**Endpoint:** `POST /api/v1/cms/study-abroad`

**Request Body:**
```json
{
  "city": "Toronto",
  "imageUrl": "https://example.com/images/toronto.jpg",
  "universities": [
    "University of Toronto",
    "York University",
    "Ryerson University"
  ],
  "avgTuition": 25000,
  "livingCost": 15000,
  "description": "Study in Toronto, one of Canada's most vibrant cities",
  "tags": ["Canada", "Toronto", "Higher Education"],
  "programs": ["undergraduate", "postgraduate", "scholarship_program"],
  "faqs": [
    {
      "question": "What is the cost of living in Toronto?",
      "answer": "The average cost of living is approximately $15,000 CAD per year."
    }
  ],
  "status": "published"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `city` | string | ✅ Yes | Min: 1, Max: 100 chars | City name |
| `universities` | string[] | ✅ Yes | Min: 1 university | List of universities |
| `avgTuition` | number | No | Min: 0 | Average tuition fee |
| `livingCost` | number | No | Min: 0 | Average living cost |
| `description` | string | No | Max: 1000 chars | City description |
| `imageUrl` | string | No | Valid URL | City image URL |
| `tags` | string[] | No | Array of strings | Tags |
| `programs` | enum[] | No | Array of program types | Available programs |
| `faqs` | object[] | No | Array of FAQ objects | Study abroad FAQs |
| `status` | enum | No | `draft` or `published` | Publication status |

**Program Types:** `undergraduate`, `postgraduate`, `short_term`, `scholarship_program`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Study abroad record created successfully",
  "data": {
    "id": "study-abroad-uuid",
    "city": "Toronto",
    "universities": ["University of Toronto", "York University"],
    "avgTuition": 25000,
    "livingCost": 15000,
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Study Abroad
**Endpoint:** `PUT /api/v1/cms/study-abroad/:id`

#### Delete Study Abroad
**Endpoint:** `DELETE /api/v1/cms/study-abroad/:id`

---

### 8. Short Course APIs

#### Create Short Course
**Endpoint:** `POST /api/v1/cms/short-courses`

**Request Body:**
```json
{
  "title": "Introduction to React",
  "slug": "introduction-to-react",
  "description": "Learn React basics in 2 weeks",
  "syllabus": "Day 1: React Basics\nDay 2: Components\nDay 3: State Management",
  "videoDemoUrl": "https://youtube.com/watch?v=react123",
  "tags": ["React", "Frontend", "Short Course"],
  "price": 5000.00,
  "status": "published"
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Course title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `description` | string | No | Max: 1000 chars | Course description |
| `syllabus` | string | No | - | Course syllabus |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array of strings | Course tags |
| `price` | number | No | Min: 0 | Course price |
| `status` | enum | No | `draft` or `published` | Publication status |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Short course created successfully",
  "data": {
    "id": "short-course-uuid",
    "title": "Introduction to React",
    "slug": "introduction-to-react",
    "price": 5000.00,
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Short Course
**Endpoint:** `PUT /api/v1/cms/short-courses/:id`

#### Delete Short Course
**Endpoint:** `DELETE /api/v1/cms/short-courses/:id`

---

### 9. Certified Course APIs

#### Create Certified Course
**Endpoint:** `POST /api/v1/cms/certified-courses`

**Request Body:**
```json
{
  "title": "AWS Certified Solutions Architect",
  "slug": "aws-certified-solutions-architect",
  "description": "Prepare for AWS certification with hands-on training",
  "syllabus": "Module 1: Cloud Fundamentals\nModule 2: AWS Services\nModule 3: Architecture Design",
  "videoDemoUrl": "https://youtube.com/watch?v=aws123",
  "tags": ["AWS", "Cloud", "Certification"],
  "price": 30000.00,
  "status": "published"
}
```

**Field Details:** (Same as Short Course)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Certified course created successfully",
  "data": {
    "id": "certified-course-uuid",
    "title": "AWS Certified Solutions Architect",
    "slug": "aws-certified-solutions-architect",
    "price": 30000.00,
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Certified Course
**Endpoint:** `PUT /api/v1/cms/certified-courses/:id`

#### Delete Certified Course
**Endpoint:** `DELETE /api/v1/cms/certified-courses/:id`

---

### 10. Training Program APIs

#### Create Training Program
**Endpoint:** `POST /api/v1/cms/training-programs`

**Request Body:**
```json
{
  "title": "Data Science Corporate Training",
  "slug": "data-science-corporate-training",
  "description": "Comprehensive data science training for corporate teams",
  "syllabus": "Module 1: Statistics\nModule 2: Machine Learning\nModule 3: Deep Learning",
  "videoDemoUrl": "https://youtube.com/watch?v=ds123",
  "tags": ["Data Science", "Corporate", "ML"],
  "price": 75000.00,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/ds-training.jpg",
  "durationMonths": 6,
  "durationHours": 200
}
```

**Field Details:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Program title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `description` | string | No | Max: 1000 chars | Program description |
| `syllabus` | string | No | - | Program syllabus |
| `videoDemoUrl` | string | No | Valid URL | Demo video URL |
| `tags` | string[] | No | Array of strings | Program tags |
| `price` | number | No | Min: 0 | Program price |
| `status` | enum | No | `draft` or `published` | Publication status |
| `trainingType` | string | No | - | Type of training (corporate/college) |
| `cardImageUrl` | string | No | Valid URL | Card image URL |
| `durationMonths` | number | No | Integer, Min: 0 | Duration in months |
| `durationHours` | number | No | Integer, Min: 0 | Duration in hours |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Training program created successfully",
  "data": {
    "id": "training-program-uuid",
    "title": "Data Science Corporate Training",
    "slug": "data-science-corporate-training",
    "price": 75000.00,
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Training Program
**Endpoint:** `PUT /api/v1/cms/training-programs/:id`

#### Delete Training Program
**Endpoint:** `DELETE /api/v1/cms/training-programs/:id`

---

## CMS APIs - Complete CRUD Operations 🔄

This section provides a comprehensive overview of all **CRUD (Create, Read, Update, Delete)** operations available for each CMS content type. All operations require **Admin authentication** unless specified otherwise.

### Overview

All CMS content types support the following operations:
- ✅ **CREATE** - Add new content (Admin only)
- ✅ **READ** - Retrieve content (Public for GET, Admin for filtered queries)
- ✅ **UPDATE** - Modify existing content (Admin only)
- ✅ **DELETE** - Remove content (Admin only)

---

### 1. Blog CRUD Operations

#### Create Blog
**Endpoint:** `POST /api/v1/cms/blogs`  
**Auth:** Admin Required  
**Description:** Create a new blog post

**Request Body:**
```json
{
  "title": "Introduction to Full Stack Development",
  "slug": "introduction-to-full-stack-development",
  "excerpt": "Learn the fundamentals of full stack web development",
  "content": "Full stack development involves both frontend and backend...",
  "imageUrl": "https://example.com/images/blog-image.jpg",
  "category": "Web Development",
  "tags": ["Full Stack", "Web Development", "Tutorial"],
  "status": "published"
}
```

#### Read Blogs
**Endpoint:** `GET /api/v1/cms/blogs`  
**Auth:** Public (No auth required)  
**Description:** Get all blogs with pagination

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |
| `status` | string | No | Filter by status: `draft` or `published` |

**Example:** `GET /api/v1/cms/blogs?page=1&limit=10&status=published`

#### Read Blog by ID
**Endpoint:** `GET /api/v1/cms/blogs/:id`  
**Auth:** Public (No auth required)  
**Description:** Get a specific blog by its ID

**Response:**
```json
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "id": "blog-uuid",
    "title": "Introduction to Full Stack Development",
    "slug": "introduction-to-full-stack-development",
    "content": "...",
    "status": "published",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

#### Update Blog
**Endpoint:** `PUT /api/v1/cms/blogs/:id`  
**Auth:** Admin Required  
**Description:** Update an existing blog post

**Request Body:** (All fields optional - only include fields to update)
```json
{
  "title": "Updated Blog Title",
  "status": "published",
  "tags": ["Updated", "Tags"]
}
```

#### Delete Blog
**Endpoint:** `DELETE /api/v1/cms/blogs/:id`  
**Auth:** Admin Required  
**Description:** Delete a blog post

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully",
  "data": {
    "id": "blog-uuid"
  }
}
```

---

### 2. Video CRUD Operations

#### Create Video
**Endpoint:** `POST /api/v1/cms/videos`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "Python Programming Tutorial",
  "slug": "python-programming-tutorial",
  "description": "Learn Python programming from scratch",
  "videoUrl": "https://youtube.com/watch?v=abc123",
  "tags": ["Python", "Programming", "Tutorial"],
  "status": "published"
}
```

#### Read Videos
**Endpoint:** `GET /api/v1/cms/videos`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Video by ID
**Endpoint:** `GET /api/v1/cms/videos/:id`  
**Auth:** Public

#### Update Video
**Endpoint:** `PUT /api/v1/cms/videos/:id`  
**Auth:** Admin Required

#### Delete Video
**Endpoint:** `DELETE /api/v1/cms/videos/:id`  
**Auth:** Admin Required

---

### 3. FAQ CRUD Operations

#### Create FAQ
**Endpoint:** `POST /api/v1/cms/faqs`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "question": "What is the course duration?",
  "answer": "The course duration is 6 months with flexible scheduling options.",
  "category": "Course Information"
}
```

#### Read FAQs
**Endpoint:** `GET /api/v1/cms/faqs`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `category`

#### Read FAQ by ID
**Endpoint:** `GET /api/v1/cms/faqs/:id`  
**Auth:** Public

#### Update FAQ
**Endpoint:** `PUT /api/v1/cms/faqs/:id`  
**Auth:** Admin Required

#### Delete FAQ
**Endpoint:** `DELETE /api/v1/cms/faqs/:id`  
**Auth:** Admin Required

---

### 4. Testimonial CRUD Operations

#### Create Testimonial
**Endpoint:** `POST /api/v1/cms/testimonials`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "authorName": "John Doe",
  "role": "Software Engineer at Tech Corp",
  "text": "This course transformed my career. Highly recommended!",
  "avatarUrl": "https://example.com/avatars/john.jpg",
  "status": "approved"
}
```

#### Read Testimonials
**Endpoint:** `GET /api/v1/cms/testimonials`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Testimonial by ID
**Endpoint:** `GET /api/v1/cms/testimonials/:id`  
**Auth:** Public

#### Update Testimonial
**Endpoint:** `PUT /api/v1/cms/testimonials/:id`  
**Auth:** Admin Required

#### Delete Testimonial
**Endpoint:** `DELETE /api/v1/cms/testimonials/:id`  
**Auth:** Admin Required

---

### 5. Course CRUD Operations

#### Create Course
**Endpoint:** `POST /api/v1/cms/courses`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development",
  "description": "Complete full stack web development course",
  "price": 50000.00,
  "status": "published",
  "tags": ["Full Stack", "Web Development"]
}
```

#### Read Courses
**Endpoint:** `GET /api/v1/cms/courses`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Course by ID
**Endpoint:** `GET /api/v1/cms/courses/:id`  
**Auth:** Public

#### Update Course
**Endpoint:** `PUT /api/v1/cms/courses/:id`  
**Auth:** Admin Required

#### Delete Course
**Endpoint:** `DELETE /api/v1/cms/courses/:id`  
**Auth:** Admin Required

---

### 6. Ebook CRUD Operations

#### Create Ebook
**Endpoint:** `POST /api/v1/cms/ebooks`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "Complete Guide to JavaScript",
  "slug": "complete-guide-to-javascript",
  "description": "Comprehensive guide covering all aspects of JavaScript",
  "coverImageUrl": "https://example.com/images/ebook-cover.jpg",
  "pdfUrl": "https://example.com/pdfs/javascript-guide.pdf",
  "tags": ["JavaScript", "Programming"],
  "status": "published"
}
```

#### Read Ebooks
**Endpoint:** `GET /api/v1/cms/ebooks`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Ebook by ID
**Endpoint:** `GET /api/v1/cms/ebooks/:id`  
**Auth:** Public

#### Update Ebook
**Endpoint:** `PUT /api/v1/cms/ebooks/:id`  
**Auth:** Admin Required

#### Delete Ebook
**Endpoint:** `DELETE /api/v1/cms/ebooks/:id`  
**Auth:** Admin Required

---

### 7. Study Abroad CRUD Operations

#### Create Study Abroad
**Endpoint:** `POST /api/v1/cms/study-abroad`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "city": "Toronto",
  "universities": ["University of Toronto", "York University"],
  "avgTuition": 25000,
  "livingCost": 15000,
  "description": "Study in Toronto, one of Canada's most vibrant cities",
  "status": "published"
}
```

#### Read Study Abroad Records
**Endpoint:** `GET /api/v1/cms/study-abroad`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Study Abroad by ID
**Endpoint:** `GET /api/v1/cms/study-abroad/:id`  
**Auth:** Public

#### Update Study Abroad
**Endpoint:** `PUT /api/v1/cms/study-abroad/:id`  
**Auth:** Admin Required

#### Delete Study Abroad
**Endpoint:** `DELETE /api/v1/cms/study-abroad/:id`  
**Auth:** Admin Required

---

### 8. Short Course CRUD Operations

#### Create Short Course
**Endpoint:** `POST /api/v1/cms/short-courses`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "Introduction to React",
  "slug": "introduction-to-react",
  "description": "Learn React basics in 2 weeks",
  "price": 5000.00,
  "status": "published"
}
```

#### Read Short Courses
**Endpoint:** `GET /api/v1/cms/short-courses`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Short Course by ID
**Endpoint:** `GET /api/v1/cms/short-courses/:id`  
**Auth:** Public

#### Update Short Course
**Endpoint:** `PUT /api/v1/cms/short-courses/:id`  
**Auth:** Admin Required

#### Delete Short Course
**Endpoint:** `DELETE /api/v1/cms/short-courses/:id`  
**Auth:** Admin Required

---

### 9. Certified Course CRUD Operations

#### Create Certified Course
**Endpoint:** `POST /api/v1/cms/certified-courses`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "AWS Certified Solutions Architect",
  "slug": "aws-certified-solutions-architect",
  "description": "Prepare for AWS certification with hands-on training",
  "price": 30000.00,
  "status": "published"
}
```

#### Read Certified Courses
**Endpoint:** `GET /api/v1/cms/certified-courses`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`

#### Read Certified Course by ID
**Endpoint:** `GET /api/v1/cms/certified-courses/:id`  
**Auth:** Public

#### Update Certified Course
**Endpoint:** `PUT /api/v1/cms/certified-courses/:id`  
**Auth:** Admin Required

#### Delete Certified Course
**Endpoint:** `DELETE /api/v1/cms/certified-courses/:id`  
**Auth:** Admin Required

---

### 10. Training Program CRUD Operations

#### Create Training Program
**Endpoint:** `POST /api/v1/cms/training-programs`  
**Auth:** Admin Required

**Request Body:**
```json
{
  "title": "Data Science Corporate Training",
  "slug": "data-science-corporate-training",
  "description": "Comprehensive data science training for corporate teams",
  "price": 75000.00,
  "status": "published",
  "trainingType": "corporate"
}
```

#### Read Training Programs
**Endpoint:** `GET /api/v1/cms/training-programs`  
**Auth:** Public  
**Query Parameters:** `page`, `limit`, `status`, `trainingType`, `search`

#### Read Training Program by ID
**Endpoint:** `GET /api/v1/cms/training-programs/:id`  
**Auth:** Public

#### Update Training Program
**Endpoint:** `PUT /api/v1/cms/training-programs/:id`  
**Auth:** Admin Required

#### Delete Training Program
**Endpoint:** `DELETE /api/v1/cms/training-programs/:id`  
**Auth:** Admin Required

---

## CMS CRUD Operations Summary Table

| Content Type | CREATE | READ (List) | READ (ById) | UPDATE | DELETE |
|-------------|--------|-------------|--------------|--------|--------|
| **Blog** | `POST /cms/blogs` | `GET /cms/blogs` | `GET /cms/blogs/:id` | `PUT /cms/blogs/:id` | `DELETE /cms/blogs/:id` |
| **Video** | `POST /cms/videos` | `GET /cms/videos` | `GET /cms/videos/:id` | `PUT /cms/videos/:id` | `DELETE /cms/videos/:id` |
| **FAQ** | `POST /cms/faqs` | `GET /cms/faqs` | `GET /cms/faqs/:id` | `PUT /cms/faqs/:id` | `DELETE /cms/faqs/:id` |
| **Testimonial** | `POST /cms/testimonials` | `GET /cms/testimonials` | `GET /cms/testimonials/:id` | `PUT /cms/testimonials/:id` | `DELETE /cms/testimonials/:id` |
| **Course** | `POST /cms/courses` | `GET /cms/courses` | `GET /cms/courses/:id` | `PUT /cms/courses/:id` | `DELETE /cms/courses/:id` |
| **Ebook** | `POST /cms/ebooks` | `GET /cms/ebooks` | `GET /cms/ebooks/:id` | `PUT /cms/ebooks/:id` | `DELETE /cms/ebooks/:id` |
| **Study Abroad** | `POST /cms/study-abroad` | `GET /cms/study-abroad` | `GET /cms/study-abroad/:id` | `PUT /cms/study-abroad/:id` | `DELETE /cms/study-abroad/:id` |
| **Short Course** | `POST /cms/short-courses` | `GET /cms/short-courses` | `GET /cms/short-courses/:id` | `PUT /cms/short-courses/:id` | `DELETE /cms/short-courses/:id` |
| **Certified Course** | `POST /cms/certified-courses` | `GET /cms/certified-courses` | `GET /cms/certified-courses/:id` | `PUT /cms/certified-courses/:id` | `DELETE /cms/certified-courses/:id` |
| **Training Program** | `POST /cms/training-programs` | `GET /cms/training-programs` | `GET /cms/training-programs/:id` | `PUT /cms/training-programs/:id` | `DELETE /cms/training-programs/:id` |

### Authentication Requirements

| Operation | Authentication Required | Role Required |
|-----------|------------------------|---------------|
| **CREATE** | ✅ Yes | Admin |
| **READ (List)** | ❌ No (Public) | - |
| **READ (ById)** | ❌ No (Public) | - |
| **UPDATE** | ✅ Yes | Admin |
| **DELETE** | ✅ Yes | Admin |

### Common Query Parameters for READ Operations

All `GET /cms/{content-type}` endpoints support the following query parameters:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 10 | Number of items per page (max: 100) |
| `status` | string | No | - | Filter by status: `draft` or `published` |
| `category` | string | No | - | Filter by category (for FAQs) |
| `trainingType` | string | No | - | Filter by training type (for Training Programs) |
| `search` | string | No | - | Search term (for Training Programs) |

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Operation successful (GET, PUT, DELETE) |
| `201` | Created - Resource created successfully (POST) |
| `400` | Bad Request - Validation error |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Admin role required |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists (e.g., duplicate slug) |

### Best Practices

1. **Slug Uniqueness:** Ensure slugs are unique within each content type
2. **Status Management:** Use `draft` status while creating content, then update to `published` when ready
3. **Pagination:** Always use pagination for list endpoints to improve performance
4. **Validation:** All required fields must be provided for CREATE operations
5. **Partial Updates:** For UPDATE operations, only include fields that need to be changed
6. **Error Handling:** Check response status codes and handle errors appropriately

---

## Other APIs

### Lead Management

#### Create Lead (Public)
**Endpoint:** `POST /api/v1/leads`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "courseInterest": "Full Stack Development",
  "message": "I'm interested in learning more about this course"
}
```

### User Management (Admin Only)

#### Create User
**Endpoint:** `POST /api/v1/users`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "secure_password",
  "role": "sales"
}
```

### College Management

#### Create College
**Endpoint:** `POST /api/v1/colleges`

**Request Body:**
```json
{
  "name": "ABC University",
  "email": "contact@abcuniversity.edu",
  "phone": "+1234567890",
  "address": "123 University Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

### Trainer Management

#### Create Trainer
**Endpoint:** `POST /api/v1/trainers`

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "specialization": "Data Science",
  "experience": 10,
  "qualifications": ["PhD in Computer Science", "AWS Certified"]
}
```

### Email Service

#### Send Email
**Endpoint:** `POST /api/v1/email/send`

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Welcome to UpSkillWay",
  "html": "<h1>Welcome!</h1><p>Thank you for joining us.</p>",
  "text": "Welcome! Thank you for joining us."
}
```

### WhatsApp Service

#### Send WhatsApp Message
**Endpoint:** `POST /api/v1/whatsapp/send`

**Request Body:**
```json
{
  "phone": "+1234567890",
  "message": "Hello! This is a test message from UpSkillWay."
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_TYPE",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `400` | Bad Request - Validation error or invalid input |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Insufficient permissions (Admin role required) |
| `404` | Not Found - Resource not found |
| `409` | Conflict - Resource already exists (e.g., duplicate slug) |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server error |

### Validation Errors

When validation fails, the API returns a `400 Bad Request` with details:

```json
{
  "success": false,
  "message": "Validation error",
  "error": "ValidationError",
  "details": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "slug",
      "message": "Slug must be unique"
    }
  ],
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Important Notes

### Slug Format Rules
- ✅ Lowercase letters only
- ✅ Numbers allowed
- ✅ Hyphens allowed (not at start/end)
- ❌ No spaces or special characters
- ✅ Must be unique across the content type

**Example:** `full-stack-web-development` ✅  
**Invalid:** `Full Stack Web Development` ❌

### Authentication
- All content posting endpoints require **Admin role**
- Include JWT token in `Authorization` header: `Bearer YOUR_TOKEN`
- Token expires after 15 minutes (use refresh token to get new access token)

### Rate Limiting
- CMS endpoints: 100 requests per minute
- General API: 5000 requests per 15 minutes
- Burst protection: 500 requests per minute

### Content Status
- `draft`: Content is saved but not visible on website
- `published`: Content is live and visible on website

---

## Quick Reference: Content Posting Endpoints Summary

| Content Type | Create Endpoint | Update Endpoint | Delete Endpoint |
|-------------|----------------|-----------------|-----------------|
| **Blog** | `POST /api/v1/cms/blogs` | `PUT /api/v1/cms/blogs/:id` | `DELETE /api/v1/cms/blogs/:id` |
| **Video** | `POST /api/v1/cms/videos` | `PUT /api/v1/cms/videos/:id` | `DELETE /api/v1/cms/videos/:id` |
| **FAQ** | `POST /api/v1/cms/faqs` | `PUT /api/v1/cms/faqs/:id` | `DELETE /api/v1/cms/faqs/:id` |
| **Testimonial** | `POST /api/v1/cms/testimonials` | `PUT /api/v1/cms/testimonials/:id` | `DELETE /api/v1/cms/testimonials/:id` |
| **Course** | `POST /api/v1/cms/courses` | `PUT /api/v1/cms/courses/:id` | `DELETE /api/v1/cms/courses/:id` |
| **Ebook** | `POST /api/v1/cms/ebooks` | `PUT /api/v1/cms/ebooks/:id` | `DELETE /api/v1/cms/ebooks/:id` |
| **Study Abroad** | `POST /api/v1/cms/study-abroad` | `PUT /api/v1/cms/study-abroad/:id` | `DELETE /api/v1/cms/study-abroad/:id` |
| **Short Course** | `POST /api/v1/cms/short-courses` | `PUT /api/v1/cms/short-courses/:id` | `DELETE /api/v1/cms/short-courses/:id` |
| **Certified Course** | `POST /api/v1/cms/certified-courses` | `PUT /api/v1/cms/certified-courses/:id` | `DELETE /api/v1/cms/certified-courses/:id` |
| **Training Program** | `POST /api/v1/cms/training-programs` | `PUT /api/v1/cms/training-programs/:id` | `DELETE /api/v1/cms/training-programs/:id` |

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2025  
**Maintained By:** UpSkillWay Development Team

