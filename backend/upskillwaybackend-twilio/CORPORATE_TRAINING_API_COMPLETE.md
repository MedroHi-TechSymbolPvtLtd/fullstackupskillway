# Corporate Training API - Complete Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
```
Authorization: Bearer <your_jwt_token>
```

---

## 🏢 CORPORATE TRAINING PROGRAM API

### Overview
Corporate Training Programs are designed for corporate clients and organizations. They are stored in the `training_programs` table with `trainingType = 'corporate'`.

---

## API Endpoints

### 1. GET All Corporate Training Programs
**Endpoint:** `GET /cms/training-programs`

**Query Parameters:**
```
?page=1
&limit=10
&search=python
&status=published
&trainingType=corporate
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number (min: 1) |
| limit | integer | No | 10 | Items per page (min: 1, max: 100) |
| search | string | No | - | Search in title, description |
| status | enum | No | - | `draft` or `published` |
| trainingType | enum | No | - | `corporate` or `college` |

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?trainingType=corporate&status=published" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Training programs retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Advanced Python for Corporate Teams",
      "slug": "advanced-python-corporate",
      "description": "Comprehensive Python training designed specifically for corporate professionals looking to enhance their programming skills",
      "syllabus": "Module 1: Python Fundamentals\n- Variables and Data Types\n- Control Flow\n- Functions\n\nModule 2: Advanced Concepts\n- OOP\n- Decorators\n- Generators\n\nModule 3: Real-world Applications\n- API Development\n- Database Integration\n- Testing",
      "videoDemoUrl": "https://youtube.com/watch?v=demo123",
      "tags": ["Python", "Corporate", "Advanced", "Programming"],
      "price": 50000.00,
      "status": "published",
      "trainingType": "corporate",
      "cardImageUrl": "https://example.com/images/python-training-card.jpg",
      "durationMonths": 3,
      "durationHours": 120,
      "placementRate": 85.5,
      "successMetric": "90% completion rate with hands-on projects",
      "curriculum": {
        "modules": [
          {
            "id": 1,
            "title": "Python Fundamentals",
            "duration": "40 hours",
            "topics": ["Variables", "Functions", "OOP", "Error Handling"],
            "projects": ["Calculator App", "File Manager"]
          },
          {
            "id": 2,
            "title": "Advanced Python",
            "duration": "40 hours",
            "topics": ["Decorators", "Generators", "Context Managers", "Async/Await"],
            "projects": ["Web Scraper", "API Client"]
          },
          {
            "id": 3,
            "title": "Python for Data Science",
            "duration": "40 hours",
            "topics": ["NumPy", "Pandas", "Matplotlib", "Data Analysis"],
            "projects": ["Data Dashboard", "Analytics Tool"]
          }
        ],
        "totalProjects": 6,
        "assessments": 12
      },
      "testimonials": [
        {
          "id": 1,
          "name": "John Doe",
          "company": "Tech Corp India",
          "role": "Senior Developer",
          "feedback": "Excellent training program that helped our entire team level up their Python skills. The hands-on projects were particularly valuable.",
          "rating": 5,
          "imageUrl": "https://example.com/testimonials/john-doe.jpg",
          "date": "2024-12-15"
        },
        {
          "id": 2,
          "name": "Sarah Johnson",
          "company": "Data Solutions Ltd",
          "role": "Team Lead",
          "feedback": "Best corporate training we've invested in. The trainer was knowledgeable and the content was highly relevant to our work.",
          "rating": 5,
          "imageUrl": "https://example.com/testimonials/sarah-johnson.jpg",
          "date": "2024-11-20"
        }
      ],
      "faqs": [
        {
          "id": 1,
          "question": "What is the duration of the program?",
          "answer": "The program runs for 3 months with a total of 120 hours of training, including live sessions, hands-on projects, and assessments."
        },
        {
          "id": 2,
          "question": "Is this suitable for beginners?",
          "answer": "This is an advanced program. Participants should have basic Python knowledge and programming experience."
        },
        {
          "id": 3,
          "question": "Do you provide certificates?",
          "answer": "Yes, participants receive an industry-recognized certificate upon successful completion of the program."
        },
        {
          "id": 4,
          "question": "Can we customize the curriculum?",
          "answer": "Absolutely! We can tailor the curriculum to match your organization's specific needs and use cases."
        }
      ],
      "badges": ["Certified", "Industry Recognized", "Hands-on Projects", "Live Sessions"],
      "createdBy": "admin-uuid-123",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z",
      "creator": {
        "id": "admin-uuid-123",
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

### 2. GET Corporate Training Program by ID
**Endpoint:** `GET /cms/training-programs/:id`

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/cms/training-programs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Training program retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Advanced Python for Corporate Teams",
    "slug": "advanced-python-corporate",
    "description": "Comprehensive Python training designed specifically for corporate professionals",
    "syllabus": "Module 1: Python Fundamentals...",
    "videoDemoUrl": "https://youtube.com/watch?v=demo123",
    "tags": ["Python", "Corporate", "Advanced", "Programming"],
    "price": 50000.00,
    "status": "published",
    "trainingType": "corporate",
    "cardImageUrl": "https://example.com/images/python-training-card.jpg",
    "durationMonths": 3,
    "durationHours": 120,
    "placementRate": 85.5,
    "successMetric": "90% completion rate with hands-on projects",
    "curriculum": { /* full curriculum object */ },
    "testimonials": [ /* array of testimonials */ ],
    "faqs": [ /* array of FAQs */ ],
    "badges": ["Certified", "Industry Recognized", "Hands-on Projects"],
    "createdBy": "admin-uuid-123",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-10T00:00:00.000Z",
    "creator": {
      "id": "admin-uuid-123",
      "name": "Admin User",
      "email": "admin@upskillway.com"
    }
  }
}
```

---

### 3. POST Create Corporate Training Program
**Endpoint:** `POST /cms/training-programs`

**Request Body:**
```json
{
  "title": "Data Science for Corporate Teams",
  "slug": "data-science-corporate",
  "description": "Complete data science training program for corporate professionals covering statistics, machine learning, and deep learning",
  "syllabus": "Module 1: Statistics & Probability\n- Descriptive Statistics\n- Inferential Statistics\n- Probability Theory\n\nModule 2: Machine Learning\n- Supervised Learning\n- Unsupervised Learning\n- Model Evaluation\n\nModule 3: Deep Learning\n- Neural Networks\n- CNN\n- RNN\n- Transformers",
  "videoDemoUrl": "https://youtube.com/watch?v=ds-demo",
  "tags": ["Data Science", "Corporate", "ML", "AI", "Python"],
  "price": 75000.00,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/ds-training-card.jpg",
  "durationMonths": 6,
  "durationHours": 200,
  "placementRate": 90.0,
  "successMetric": "95% completion rate with capstone projects",
  "curriculum": {
    "modules": [
      {
        "id": 1,
        "title": "Statistics & Probability",
        "duration": "50 hours",
        "topics": [
          "Descriptive Statistics",
          "Inferential Statistics",
          "Probability Distributions",
          "Hypothesis Testing"
        ],
        "projects": [
          "Statistical Analysis Dashboard",
          "A/B Testing Framework"
        ]
      },
      {
        "id": 2,
        "title": "Machine Learning",
        "duration": "80 hours",
        "topics": [
          "Linear Regression",
          "Logistic Regression",
          "Decision Trees",
          "Random Forests",
          "SVM",
          "Clustering",
          "Dimensionality Reduction"
        ],
        "projects": [
          "Customer Churn Prediction",
          "Recommendation System",
          "Fraud Detection Model"
        ]
      },
      {
        "id": 3,
        "title": "Deep Learning",
        "duration": "70 hours",
        "topics": [
          "Neural Networks Fundamentals",
          "CNN for Computer Vision",
          "RNN for Sequence Data",
          "LSTM & GRU",
          "Transformers & Attention",
          "Transfer Learning"
        ],
        "projects": [
          "Image Classification System",
          "Text Sentiment Analysis",
          "Time Series Forecasting"
        ]
      }
    ],
    "totalProjects": 8,
    "assessments": 18,
    "capstoneProject": {
      "title": "End-to-End ML Pipeline",
      "description": "Build a complete machine learning solution from data collection to deployment",
      "duration": "2 weeks"
    }
  },
  "testimonials": [
    {
      "id": 1,
      "name": "Jane Smith",
      "company": "Data Corp India",
      "role": "Data Analyst",
      "feedback": "Best data science program I've attended. The curriculum is comprehensive and the projects are industry-relevant.",
      "rating": 5,
      "imageUrl": "https://example.com/testimonials/jane-smith.jpg",
      "date": "2024-12-01"
    },
    {
      "id": 2,
      "name": "Michael Chen",
      "company": "Analytics Solutions",
      "role": "ML Engineer",
      "feedback": "Transformed our team's capabilities. We're now building ML models in-house thanks to this training.",
      "rating": 5,
      "imageUrl": "https://example.com/testimonials/michael-chen.jpg",
      "date": "2024-11-15"
    }
  ],
  "faqs": [
    {
      "id": 1,
      "question": "Do I need programming experience?",
      "answer": "Yes, basic Python programming knowledge is required. We recommend completing our Python fundamentals course first if you're new to programming."
    },
    {
      "id": 2,
      "question": "What tools and technologies will we use?",
      "answer": "We use Python with libraries like NumPy, Pandas, Scikit-learn, TensorFlow, and PyTorch. All tools are industry-standard and widely used."
    },
    {
      "id": 3,
      "question": "Will I get a certificate?",
      "answer": "Yes, you'll receive an industry-recognized certificate upon successful completion of all modules and the capstone project."
    },
    {
      "id": 4,
      "question": "Can we get customized training for our specific use case?",
      "answer": "Absolutely! We can customize the curriculum to focus on your industry-specific problems and datasets."
    },
    {
      "id": 5,
      "question": "What is the class size?",
      "answer": "We maintain small batch sizes of 15-20 participants to ensure personalized attention and effective learning."
    }
  ],
  "badges": [
    "Certified",
    "Project-Based",
    "Industry Mentors",
    "Capstone Project",
    "Job-Ready Skills"
  ]
}
```

**Example cURL:**
```bash
curl -X POST "http://localhost:3000/api/v1/cms/training-programs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Data Science for Corporate Teams",
    "slug": "data-science-corporate",
    "description": "Complete data science training program",
    "price": 75000.00,
    "trainingType": "corporate",
    "status": "published"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Training program created successfully",
  "data": {
    "id": "new-uuid-456",
    "title": "Data Science for Corporate Teams",
    "slug": "data-science-corporate",
    // ... all fields
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 4. PUT Update Corporate Training Program
**Endpoint:** `PUT /cms/training-programs/:id`

**Request Body:** (All fields optional)
```json
{
  "title": "Data Science for Corporate Teams - Advanced Edition",
  "price": 80000.00,
  "durationHours": 220,
  "placementRate": 92.0,
  "status": "published",
  "badges": [
    "Certified",
    "Project-Based",
    "Industry Mentors",
    "Capstone Project",
    "Job-Ready Skills",
    "Advanced Level"
  ]
}
```

**Example cURL:**
```bash
curl -X PUT "http://localhost:3000/api/v1/cms/training-programs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 80000.00,
    "status": "published"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Training program updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Data Science for Corporate Teams - Advanced Edition",
    "price": 80000.00,
    // ... updated fields
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

---

### 5. DELETE Corporate Training Program
**Endpoint:** `DELETE /cms/training-programs/:id`

**Example cURL:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/cms/training-programs/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Training program deleted successfully",
  "data": {
    "message": "Training program deleted successfully"
  }
}
```

---

## 📋 Complete Field Reference

### Training Program Object

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **id** | UUID | Auto | Unique identifier | `"550e8400-e29b-41d4-a716-446655440000"` |
| **title** | String | ✅ Yes | Program title | `"Advanced Python for Corporate Teams"` |
| **slug** | String | ✅ Yes | URL-friendly unique identifier | `"advanced-python-corporate"` |
| **description** | String | ✅ Yes | Detailed program description | `"Comprehensive Python training..."` |
| **syllabus** | Text | No | Full syllabus content | `"Module 1: ...\nModule 2: ..."` |
| **videoDemoUrl** | String | No | Demo video URL | `"https://youtube.com/watch?v=demo"` |
| **tags** | String[] | No | Tags for categorization | `["Python", "Corporate", "Advanced"]` |
| **price** | Float | ✅ Yes | Program price in INR | `50000.00` |
| **status** | Enum | No | Publication status | `"draft"` or `"published"` |
| **trainingType** | Enum | ✅ Yes | Training type | `"corporate"` or `"college"` |
| **cardImageUrl** | String | No | Card/thumbnail image URL | `"https://example.com/image.jpg"` |
| **durationMonths** | Integer | No | Duration in months | `3` |
| **durationHours** | Integer | No | Total training hours | `120` |
| **placementRate** | Float | No | Placement rate percentage | `85.5` |
| **successMetric** | String | No | Success metric description | `"90% completion rate"` |
| **curriculum** | JSON | No | Structured curriculum object | See below |
| **testimonials** | JSON | No | Array of testimonial objects | See below |
| **faqs** | JSON | No | Array of FAQ objects | See below |
| **badges** | String[] | No | Program badges/highlights | `["Certified", "Industry Recognized"]` |
| **createdBy** | UUID | Auto | Creator user ID | `"admin-uuid-123"` |
| **createdAt** | DateTime | Auto | Creation timestamp | `"2025-01-01T00:00:00.000Z"` |
| **updatedAt** | DateTime | Auto | Last update timestamp | `"2025-01-10T00:00:00.000Z"` |

---

### Curriculum Object Structure

```json
{
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "duration": "40 hours",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "projects": ["Project 1", "Project 2"]
    }
  ],
  "totalProjects": 6,
  "assessments": 12,
  "capstoneProject": {
    "title": "Capstone Project Title",
    "description": "Project description",
    "duration": "2 weeks"
  }
}
```

**Curriculum Fields:**
- `modules` (Array): List of course modules
  - `id` (Integer): Module number
  - `title` (String): Module name
  - `duration` (String): Module duration
  - `topics` (String[]): Topics covered
  - `projects` (String[]): Hands-on projects
- `totalProjects` (Integer): Total number of projects
- `assessments` (Integer): Total number of assessments
- `capstoneProject` (Object): Final capstone project details

---

### Testimonials Array Structure

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "company": "Tech Corp India",
    "role": "Senior Developer",
    "feedback": "Excellent training program...",
    "rating": 5,
    "imageUrl": "https://example.com/testimonials/john.jpg",
    "date": "2024-12-15"
  }
]
```

**Testimonial Fields:**
- `id` (Integer): Testimonial ID
- `name` (String): Person's name
- `company` (String): Company name
- `role` (String): Job role/title
- `feedback` (String): Testimonial text
- `rating` (Integer): Rating (1-5)
- `imageUrl` (String): Profile image URL
- `date` (String): Date of testimonial

---

### FAQs Array Structure

```json
[
  {
    "id": 1,
    "question": "What is the duration?",
    "answer": "The program runs for 3 months..."
  }
]
```

**FAQ Fields:**
- `id` (Integer): FAQ ID
- `question` (String): Question text
- `answer` (String): Answer text

---

## 🎯 Use Cases

### Use Case 1: Corporate Python Training
```json
{
  "title": "Python Development for Enterprise",
  "slug": "python-enterprise",
  "trainingType": "corporate",
  "price": 60000.00,
  "durationMonths": 4,
  "durationHours": 150,
  "tags": ["Python", "Enterprise", "Backend", "API"]
}
```

### Use Case 2: Data Science Bootcamp
```json
{
  "title": "Data Science Bootcamp for Corporates",
  "slug": "data-science-bootcamp",
  "trainingType": "corporate",
  "price": 100000.00,
  "durationMonths": 6,
  "durationHours": 240,
  "tags": ["Data Science", "ML", "AI", "Analytics"]
}
```

### Use Case 3: DevOps Training
```json
{
  "title": "DevOps & Cloud for Corporate Teams",
  "slug": "devops-cloud-corporate",
  "trainingType": "corporate",
  "price": 70000.00,
  "durationMonths": 3,
  "durationHours": 100,
  "tags": ["DevOps", "AWS", "Docker", "Kubernetes"]
}
```

---

## 🔍 Filtering Examples

### Get only published corporate programs
```
GET /cms/training-programs?trainingType=corporate&status=published
```

### Search for Python programs
```
GET /cms/training-programs?search=python&trainingType=corporate
```

### Get programs with pagination
```
GET /cms/training-programs?page=2&limit=20&trainingType=corporate
```

---

## ⚠️ Validation Rules

1. **title**: Required, max 200 characters
2. **slug**: Required, unique, URL-friendly
3. **description**: Required
4. **price**: Required, must be positive number
5. **trainingType**: Required, must be `corporate` or `college`
6. **status**: Optional, defaults to `draft`
7. **durationMonths**: Optional, positive integer
8. **durationHours**: Optional, positive integer
9. **placementRate**: Optional, 0-100
10. **tags**: Optional, array of strings
11. **badges**: Optional, array of strings

---

## 🚨 Error Responses

### 400 - Validation Error
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
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Training program not found",
  "error": "No training program found with the given ID"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Training program with this slug already exists",
  "error": "Slug must be unique"
}
```

---

## 📝 Implementation Status

**Database Schema:** ✅ Ready (TrainingProgram model exists)

**API Routes:** ⚠️ Need to be added to `src/routes/cms.ts`

**Controllers:** ⚠️ Need to be added to `src/controllers/cmsController.ts`

**Services:** ⚠️ Need to be added to `src/services/cmsService.ts`

**Validators:** ⚠️ Need to be added to `src/validators/cms.ts`

---

## 🎓 Example: Complete Corporate Training Program

```json
{
  "title": "Full Stack Development for Corporate Teams",
  "slug": "fullstack-corporate",
  "description": "Comprehensive full-stack development training covering frontend, backend, databases, and deployment",
  "syllabus": "Module 1: Frontend Development\n- HTML, CSS, JavaScript\n- React.js\n- State Management\n\nModule 2: Backend Development\n- Node.js & Express\n- RESTful APIs\n- Authentication\n\nModule 3: Databases\n- SQL & PostgreSQL\n- MongoDB\n- Database Design\n\nModule 4: DevOps\n- Git & GitHub\n- Docker\n- CI/CD\n- AWS Deployment",
  "videoDemoUrl": "https://youtube.com/watch?v=fullstack-demo",
  "tags": ["Full Stack", "Corporate", "React", "Node.js", "DevOps"],
  "price": 90000.00,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/fullstack-card.jpg",
  "durationMonths": 5,
  "durationHours": 180,
  "placementRate": 88.0,
  "successMetric": "92% completion rate with deployed projects",
  "curriculum": {
    "modules": [
      {
        "id": 1,
        "title": "Frontend Development",
        "duration": "50 hours",
        "topics": ["HTML5", "CSS3", "JavaScript ES6+", "React.js", "Redux"],
        "projects": ["Portfolio Website", "E-commerce Frontend", "Dashboard UI"]
      },
      {
        "id": 2,
        "title": "Backend Development",
        "duration": "50 hours",
        "topics": ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Middleware"],
        "projects": ["Blog API", "E-commerce Backend", "Authentication System"]
      },
      {
        "id": 3,
        "title": "Databases",
        "duration": "40 hours",
        "topics": ["SQL", "PostgreSQL", "MongoDB", "Prisma ORM", "Database Design"],
        "projects": ["Database Schema Design", "Data Migration", "Query Optimization"]
      },
      {
        "id": 4,
        "title": "DevOps & Deployment",
        "duration": "40 hours",
        "topics": ["Git", "Docker", "CI/CD", "AWS", "Nginx"],
        "projects": ["Dockerized App", "CI/CD Pipeline", "AWS Deployment"]
      }
    ],
    "totalProjects": 12,
    "assessments": 16,
    "capstoneProject": {
      "title": "Full Stack E-commerce Platform",
      "description": "Build and deploy a complete e-commerce platform with frontend, backend, database, and payment integration",
      "duration": "3 weeks"
    }
  },
  "testimonials": [
    {
      "id": 1,
      "name": "Rajesh Kumar",
      "company": "InfoTech Solutions",
      "role": "Tech Lead",
      "feedback": "This training transformed our development team. We're now building modern web applications with confidence.",
      "rating": 5,
      "imageUrl": "https://example.com/testimonials/rajesh.jpg",
      "date": "2024-12-20"
    }
  ],
  "faqs": [
    {
      "id": 1,
      "question": "What prerequisites are needed?",
      "answer": "Basic programming knowledge is required. Familiarity with any programming language helps."
    },
    {
      "id": 2,
      "question": "Will we build real projects?",
      "answer": "Yes! You'll build 12+ projects including a complete full-stack capstone project."
    }
  ],
  "badges": ["Certified", "Project-Based", "Industry Mentors", "Job-Ready", "Capstone Project"]
}
```

This is the complete Corporate Training API documentation with all fields and examples! 🚀
