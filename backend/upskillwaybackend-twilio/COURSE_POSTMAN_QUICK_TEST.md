# Course API - Postman Quick Test Guide

Quick reference for testing Course API in Postman.

---

## Base URL
```
http://localhost:3000/api/v1/courses
```

---

## 1. Get All Courses (Public - No Auth)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/v1/courses?page=1&limit=10`

**Query Params (Optional):**
- `page` = 1
- `limit` = 10
- `status` = `published` or `draft`

**Headers:** None required

---

## 2. Get Course by ID (Public - No Auth)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/v1/courses/{course-id}`

**Headers:** None required

---

## 3. Create Course (Admin - Auth Required)

**Method:** `POST`  
**URL:** `http://localhost:3000/api/v1/courses`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Minimal Request Body (Required Fields Only):**
```json
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development"
}
```

**Complete Request Body (All Fields):**
```json
{
  "title": "Full Stack Web Development",
  "slug": "full-stack-web-development",
  "description": "Master full stack web development with React, Node.js, and MongoDB",
  "shortDescription": "Learn full stack development and build real-world projects",
  "syllabus": "Module 1: HTML/CSS, Module 2: JavaScript, Module 3: React",
  "videoDemoUrl": "https://example.com/demo.mp4",
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
      "topics": ["HTML5 & CSS3", "JavaScript ES6+", "Responsive Design"]
    },
    {
      "moduleTitle": "React Development",
      "topics": ["React Components", "State Management", "React Hooks"]
    }
  ],
  "trainingOptions": [
    {
      "name": "Self-Paced",
      "price": 19999,
      "currency": "INR",
      "descriptionPoints": ["Lifetime access", "Recorded sessions", "Community support"]
    },
    {
      "name": "Live Bootcamp",
      "price": 29999,
      "currency": "INR",
      "descriptionPoints": ["Live instructor-led sessions", "Real-time doubt clearing", "1-on-1 mentorship"]
    }
  ],
  "projects": [
    {
      "title": "E-Commerce Platform",
      "imageUrl": "https://example.com/project1.jpg",
      "description": "Build a complete e-commerce platform with payment integration"
    }
  ],
  "mentors": [
    {
      "name": "John Doe",
      "title": "Senior Full Stack Developer",
      "imageUrl": "https://example.com/mentor1.jpg",
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
      "testimonialText": "This course transformed my career!",
      "rating": 5,
      "studentImageUrl": "https://example.com/student1.jpg"
    }
  ],
  "faqs": [
    {
      "question": "What prerequisites do I need?",
      "answer": "Basic programming knowledge is helpful but not required."
    }
  ],
  "relatedPrograms": [
    {
      "title": "Data Science Bootcamp",
      "imageUrl": "https://example.com/datascience.jpg",
      "duration": "6 months",
      "price": "₹35,999",
      "slug": "data-science-bootcamp"
    }
  ]
}
```

---

## 4. Update Course (Admin - Auth Required)

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/v1/courses/{course-id}`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body (Only fields to update):**
```json
{
  "title": "Updated Course Title",
  "price": 34999.00,
  "status": "published"
}
```

---

## 5. Delete Course (Admin - Auth Required)

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/v1/courses/{course-id}`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

---

## Field Reference for Postman

### Required Fields (Create Course)
| Field | Type | Example |
|-------|------|---------|
| `title` | string | "Full Stack Web Development" |
| `slug` | string | "full-stack-web-development" |

### Optional Basic Fields
| Field | Type | Example |
|-------|------|---------|
| `description` | string | "Master full stack web development..." |
| `shortDescription` | string | "Learn full stack development..." |
| `syllabus` | string | "Module 1: HTML/CSS..." |
| `videoDemoUrl` | string | "https://example.com/demo.mp4" |
| `tags` | string[] | ["web development", "javascript"] |
| `price` | number | 29999.00 |
| `status` | string | "published" or "draft" |

### Optional Enhanced Fields
| Field | Type | Example |
|-------|------|---------|
| `bannerImageUrl` | string | "https://example.com/banner.jpg" |
| `programName` | string | "Full Stack Developer Program" |
| `durationMonths` | number | 6 |
| `durationHours` | number | 480 |
| `deliveryModes` | string[] | ["Online Bootcamp", "Offline Course"] |
| `language` | string | "English" |
| `aboutSectionImageUrl` | string | "https://example.com/about.jpg" |

### JSON Fields (All Optional)
| Field | Type | Structure |
|-------|------|-----------|
| `masteredTools` | object[] | `[{name, logoUrl}]` |
| `curriculum` | object[] | `[{moduleTitle, topics[]}]` |
| `trainingOptions` | object[] | `[{name, price, currency, descriptionPoints[]}]` |
| `projects` | object[] | `[{title, imageUrl, description}]` |
| `mentors` | object[] | `[{name, title, imageUrl, bio}]` |
| `careerRoles` | object[] | `[{title, description}]` |
| `testimonials` | object[] | `[{studentName, studentRole, testimonialText, rating, studentImageUrl}]` |
| `faqs` | object[] | `[{question, answer}]` |
| `relatedPrograms` | object[] | `[{title, imageUrl, duration, price, slug}]` |

---

## Quick Test Scenarios

### Test 1: Minimal Create
```json
{
  "title": "Test Course",
  "slug": "test-course"
}
```

### Test 2: Basic Create
```json
{
  "title": "Test Course",
  "slug": "test-course",
  "description": "Test description",
  "price": 9999.00,
  "status": "published",
  "tags": ["test", "course"]
}
```

### Test 3: Full Create (All Fields)
Use the complete request body from section 3 above.

### Test 4: Update Single Field
```json
{
  "price": 19999.00
}
```

### Test 5: Update Multiple Fields
```json
{
  "title": "Updated Title",
  "price": 24999.00,
  "status": "published"
}
```

---

## Expected Responses

### Success (200/201)
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "uuid",
    "title": "...",
    // ... all course fields
  }
}
```

### Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### Error (401)
```json
{
  "success": false,
  "message": "Authentication failed"
}
```

### Error (404)
```json
{
  "success": false,
  "message": "Course not found"
}
```

---

## Postman Collection Setup

### Environment Variables
- `base_url` = `http://localhost:3000/api/v1`
- `token` = `YOUR_ACCESS_TOKEN`

### Request URLs
- Get All: `{{base_url}}/courses?page=1&limit=10`
- Get One: `{{base_url}}/courses/{{course_id}}`
- Create: `{{base_url}}/courses`
- Update: `{{base_url}}/courses/{{course_id}}`
- Delete: `{{base_url}}/courses/{{course_id}}`

### Authorization Header
```
Authorization: Bearer {{token}}
```

---

## Quick Copy-Paste Examples

### Minimal Create
```json
{"title":"Test Course","slug":"test-course"}
```

### Basic Create
```json
{"title":"Test Course","slug":"test-course","description":"Test description","price":9999,"status":"published","tags":["test"]}
```

### Update
```json
{"price":19999,"status":"published"}
```

---

**Ready to test in Postman!** 🚀

