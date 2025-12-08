# College and Corporate Training API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints require Bearer token authentication (except public endpoints).

```
Authorization: Bearer <your_jwt_token>
```

---

## 🏫 COLLEGE API

### 1. Get All Colleges
**Endpoint:** `GET /colleges`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max 100) |
| search | string | No | - | Search by name, location, city, contact person |
| status | enum | No | - | Filter by status: `PROSPECTIVE`, `ACTIVE`, `INACTIVE`, `PARTNER` |
| type | enum | No | - | Filter by type: `ENGINEERING`, `MEDICAL`, `MANAGEMENT`, `ARTS_SCIENCE`, `LAW`, `PHARMACY`, `ARCHITECTURE`, `OTHER` |
| assignedTo | uuid | No | - | Filter by assigned user ID |

**Response:**
```json
{
  "success": true,
  "message": "Colleges retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "ABC Engineering College",
      "location": "123 Main St, Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "type": "ENGINEERING",
      "ranking": 50,
      "enrollment": 5000,
      "establishedYear": 1995,
      "contactPerson": "Dr. John Doe",
      "contactEmail": "contact@abccollege.edu",
      "contactPhone": "+919876543210",
      "totalRevenue": 50000.00,
      "avgRating": 4.5,
      "assignedToId": "user-uuid",
      "assignedTrainer": "trainer-uuid",
      "status": "ACTIVE",
      "lastTrainingAt": "2025-01-15T10:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z",
      "assignedTo": {
        "id": "user-uuid",
        "name": "Sales Person",
        "email": "sales@upskillway.com"
      },
      "trainers": [
        {
          "id": "assignment-uuid",
          "trainer": {
            "id": "trainer-uuid",
            "name": "Trainer Name",
            "specialization": ["Python", "Data Science"],
            "rating": 4.8
          }
        }
      ],
      "_count": {
        "leads": 5,
        "trainings": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. Get College by ID
**Endpoint:** `GET /colleges/:id`

**Response:**
```json
{
  "success": true,
  "message": "College retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "ABC Engineering College",
    "location": "123 Main St, Mumbai",
    "city": "Mumbai",
    "state": "Maharashtra",
    "type": "ENGINEERING",
    "ranking": 50,
    "enrollment": 5000,
    "establishedYear": 1995,
    "contactPerson": "Dr. John Doe",
    "contactEmail": "contact@abccollege.edu",
    "contactPhone": "+919876543210",
    "totalRevenue": 50000.00,
    "avgRating": 4.5,
    "assignedToId": "user-uuid",
    "assignedTrainer": "trainer-uuid",
    "status": "ACTIVE",
    "lastTrainingAt": "2025-01-15T10:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-10T00:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person",
      "email": "sales@upskillway.com"
    },
    "leads": [
      {
        "id": "lead-uuid",
        "name": "Lead Name",
        "email": "lead@example.com",
        "stage": "CONVERTED",
        "status": "CONVERTED",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "trainers": [
      {
        "id": "assignment-uuid",
        "trainer": {
          "id": "trainer-uuid",
          "name": "Trainer Name",
          "email": "trainer@upskillway.com",
          "specialization": ["Python", "Data Science"],
          "rating": 4.8,
          "status": "AVAILABLE"
        }
      }
    ],
    "trainings": [
      {
        "id": "training-uuid",
        "title": "Python Training",
        "startDate": "2025-02-01T09:00:00.000Z",
        "endDate": "2025-02-05T17:00:00.000Z",
        "mode": "ONLINE",
        "status": "SCHEDULED",
        "trainer": {
          "id": "trainer-uuid",
          "name": "Trainer Name"
        }
      }
    ]
  }
}
```

---

### 3. Create College
**Endpoint:** `POST /colleges`

**Request Body:**
```json
{
  "name": "XYZ Engineering College",
  "location": "456 Park Ave, Delhi",
  "city": "Delhi",
  "state": "Delhi",
  "type": "ENGINEERING",
  "ranking": 75,
  "enrollment": 3000,
  "establishedYear": 2000,
  "contactPerson": "Dr. Jane Smith",
  "contactEmail": "contact@xyzcollege.edu",
  "contactPhone": "+919876543211",
  "totalRevenue": 30000.00,
  "status": "PROSPECTIVE",
  "assignedToId": "user-uuid"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ Yes | College name (max 200 chars) |
| location | string | No | Full address |
| city | string | No | City name |
| state | string | No | State name |
| type | enum | No | `ENGINEERING`, `MEDICAL`, `MANAGEMENT`, `ARTS_SCIENCE`, `LAW`, `PHARMACY`, `ARCHITECTURE`, `OTHER` |
| ranking | integer | No | College ranking (positive number) |
| enrollment | integer | No | Total student enrollment (positive number) |
| establishedYear | integer | No | Year established (1800 - current year) |
| contactPerson | string | No | Contact person name |
| contactEmail | string | No | Contact email (valid email format) |
| contactPhone | string | No | Contact phone number |
| totalRevenue | number | No | Total revenue (min 0) |
| status | enum | No | `PROSPECTIVE`, `ACTIVE`, `INACTIVE`, `PARTNER` (default: `PROSPECTIVE`) |
| assignedToId | uuid | No | User ID to assign (optional - can be assigned later) |

**Response:**
```json
{
  "success": true,
  "message": "College created successfully",
  "data": {
    "id": "new-uuid",
    "name": "XYZ Engineering College",
    "location": "456 Park Ave, Delhi",
    "city": "Delhi",
    "state": "Delhi",
    "type": "ENGINEERING",
    "ranking": 75,
    "enrollment": 3000,
    "establishedYear": 2000,
    "contactPerson": "Dr. Jane Smith",
    "contactEmail": "contact@xyzcollege.edu",
    "contactPhone": "+919876543211",
    "totalRevenue": 30000.00,
    "avgRating": null,
    "assignedToId": "user-uuid",
    "assignedTrainer": null,
    "status": "PROSPECTIVE",
    "lastTrainingAt": null,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z",
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person",
      "email": "sales@upskillway.com"
    }
  }
}
```

---

### 4. Update College
**Endpoint:** `PUT /colleges/:id`

**Request Body:** (All fields optional)
```json
{
  "name": "XYZ Engineering College - Updated",
  "city": "New Delhi",
  "status": "ACTIVE",
  "assignedToId": "new-user-uuid",
  "assignedTrainer": "trainer-uuid",
  "totalRevenue": 35000.00,
  "avgRating": 4.2
}
```

**Response:**
```json
{
  "success": true,
  "message": "College updated successfully",
  "data": {
    "id": "uuid",
    "name": "XYZ Engineering College - Updated",
    // ... updated fields
  }
}
```

---

### 5. Delete College
**Endpoint:** `DELETE /colleges/:id`

**Response:**
```json
{
  "success": true,
  "message": "College deleted successfully",
  "data": {
    "message": "College deleted successfully"
  }
}
```

---

### 6. Assign Trainer to College
**Endpoint:** `POST /colleges/:id/assign-trainer`

**Request Body:**
```json
{
  "trainerId": "trainer-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trainer assigned to college successfully",
  "data": {
    "id": "assignment-uuid",
    "collegeId": "college-uuid",
    "trainerId": "trainer-uuid",
    "assignedAt": "2025-01-15T10:00:00.000Z",
    "status": "active",
    "college": {
      "id": "college-uuid",
      "name": "ABC Engineering College"
    },
    "trainer": {
      "id": "trainer-uuid",
      "name": "Trainer Name",
      "specialization": ["Python", "Data Science"]
    }
  }
}
```

---

### 7. Get College Statistics
**Endpoint:** `GET /colleges/stats`

**Response:**
```json
{
  "success": true,
  "message": "College statistics retrieved successfully",
  "data": {
    "totalColleges": 150,
    "activePartners": 75,
    "totalRevenue": 5000000.00,
    "avgRating": 4.3,
    "collegesByStatus": [
      { "status": "ACTIVE", "_count": 75 },
      { "status": "PROSPECTIVE", "_count": 50 },
      { "status": "INACTIVE", "_count": 20 },
      { "status": "PARTNER", "_count": 5 }
    ],
    "collegesByType": [
      { "type": "ENGINEERING", "_count": 80 },
      { "type": "MANAGEMENT", "_count": 40 },
      { "type": "MEDICAL", "_count": 20 },
      { "type": "OTHER", "_count": 10 }
    ]
  }
}
```

---

## 🏢 CORPORATE TRAINING API (Training Programs)

### 1. Get All Training Programs
**Endpoint:** `GET /cms/training-programs` (Note: Currently not implemented, needs to be added)

**Suggested Implementation:**

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page |
| search | string | No | - | Search by title, description |
| status | enum | No | - | `draft`, `published` |
| trainingType | enum | No | - | `corporate`, `college` |

**Expected Response:**
```json
{
  "success": true,
  "message": "Training programs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "title": "Advanced Python for Corporate Teams",
      "slug": "advanced-python-corporate",
      "description": "Comprehensive Python training for corporate professionals",
      "syllabus": "Module 1: Python Basics\nModule 2: Advanced Concepts...",
      "videoDemoUrl": "https://youtube.com/watch?v=demo",
      "tags": ["Python", "Corporate", "Advanced"],
      "price": 50000.00,
      "status": "published",
      "trainingType": "corporate",
      "cardImageUrl": "https://example.com/images/python-training.jpg",
      "durationMonths": 3,
      "durationHours": 120,
      "placementRate": 85.5,
      "successMetric": "90% completion rate",
      "curriculum": {
        "modules": [
          {
            "title": "Python Fundamentals",
            "duration": "40 hours",
            "topics": ["Variables", "Functions", "OOP"]
          }
        ]
      },
      "testimonials": [
        {
          "name": "John Doe",
          "company": "Tech Corp",
          "feedback": "Excellent training program",
          "rating": 5
        }
      ],
      "faqs": [
        {
          "question": "What is the duration?",
          "answer": "3 months with 120 hours of training"
        }
      ],
      "badges": ["Certified", "Industry Recognized"],
      "createdBy": "user-uuid",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z",
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

### 2. Get Training Program by ID
**Endpoint:** `GET /cms/training-programs/:id`

**Expected Response:**
```json
{
  "success": true,
  "message": "Training program retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Advanced Python for Corporate Teams",
    "slug": "advanced-python-corporate",
    "description": "Comprehensive Python training for corporate professionals",
    "syllabus": "Module 1: Python Basics\nModule 2: Advanced Concepts...",
    "videoDemoUrl": "https://youtube.com/watch?v=demo",
    "tags": ["Python", "Corporate", "Advanced"],
    "price": 50000.00,
    "status": "published",
    "trainingType": "corporate",
    "cardImageUrl": "https://example.com/images/python-training.jpg",
    "durationMonths": 3,
    "durationHours": 120,
    "placementRate": 85.5,
    "successMetric": "90% completion rate",
    "curriculum": {
      "modules": [
        {
          "title": "Python Fundamentals",
          "duration": "40 hours",
          "topics": ["Variables", "Functions", "OOP"]
        },
        {
          "title": "Advanced Python",
          "duration": "40 hours",
          "topics": ["Decorators", "Generators", "Async"]
        },
        {
          "title": "Python for Data Science",
          "duration": "40 hours",
          "topics": ["NumPy", "Pandas", "Matplotlib"]
        }
      ]
    },
    "testimonials": [
      {
        "name": "John Doe",
        "company": "Tech Corp",
        "role": "Senior Developer",
        "feedback": "Excellent training program that helped our team level up",
        "rating": 5,
        "imageUrl": "https://example.com/testimonials/john.jpg"
      }
    ],
    "faqs": [
      {
        "question": "What is the duration?",
        "answer": "3 months with 120 hours of training"
      },
      {
        "question": "Is it suitable for beginners?",
        "answer": "This is an advanced program. Basic Python knowledge is required."
      }
    ],
    "badges": ["Certified", "Industry Recognized", "Hands-on Projects"],
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

### 3. Create Training Program
**Endpoint:** `POST /cms/training-programs`

**Request Body:**
```json
{
  "title": "Data Science for Corporate Teams",
  "slug": "data-science-corporate",
  "description": "Complete data science training for corporate professionals",
  "syllabus": "Module 1: Statistics\nModule 2: Machine Learning\nModule 3: Deep Learning",
  "videoDemoUrl": "https://youtube.com/watch?v=demo123",
  "tags": ["Data Science", "Corporate", "ML", "AI"],
  "price": 75000.00,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/ds-training.jpg",
  "durationMonths": 6,
  "durationHours": 200,
  "placementRate": 90.0,
  "successMetric": "95% completion rate with projects",
  "curriculum": {
    "modules": [
      {
        "title": "Statistics & Probability",
        "duration": "50 hours",
        "topics": ["Descriptive Stats", "Inferential Stats", "Probability"]
      },
      {
        "title": "Machine Learning",
        "duration": "80 hours",
        "topics": ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"]
      },
      {
        "title": "Deep Learning",
        "duration": "70 hours",
        "topics": ["Neural Networks", "CNN", "RNN", "Transformers"]
      }
    ]
  },
  "testimonials": [
    {
      "name": "Jane Smith",
      "company": "Data Corp",
      "role": "Data Analyst",
      "feedback": "Best data science program I've attended",
      "rating": 5,
      "imageUrl": "https://example.com/testimonials/jane.jpg"
    }
  ],
  "faqs": [
    {
      "question": "Do I need programming experience?",
      "answer": "Yes, basic Python knowledge is required"
    },
    {
      "question": "Will I get a certificate?",
      "answer": "Yes, you'll receive an industry-recognized certificate"
    }
  ],
  "badges": ["Certified", "Project-Based", "Industry Mentors"]
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ Yes | Program title |
| slug | string | ✅ Yes | URL-friendly slug (unique) |
| description | string | ✅ Yes | Program description |
| syllabus | string | No | Detailed syllabus |
| videoDemoUrl | string | No | Demo video URL |
| tags | string[] | No | Tags for categorization |
| price | number | ✅ Yes | Program price |
| status | enum | No | `draft` or `published` (default: `draft`) |
| trainingType | enum | ✅ Yes | `corporate` or `college` |
| cardImageUrl | string | No | Card/thumbnail image URL |
| durationMonths | integer | No | Duration in months |
| durationHours | integer | No | Total training hours |
| placementRate | number | No | Placement rate percentage |
| successMetric | string | No | Success metric description |
| curriculum | JSON | No | Structured curriculum object |
| testimonials | JSON | No | Array of testimonial objects |
| faqs | JSON | No | Array of FAQ objects |
| badges | string[] | No | Program badges/highlights |

**Response:**
```json
{
  "success": true,
  "message": "Training program created successfully",
  "data": {
    "id": "new-uuid",
    "title": "Data Science for Corporate Teams",
    // ... all fields
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 4. Update Training Program
**Endpoint:** `PUT /cms/training-programs/:id`

**Request Body:** (All fields optional)
```json
{
  "title": "Data Science for Corporate Teams - Updated",
  "price": 80000.00,
  "status": "published",
  "durationHours": 220,
  "placementRate": 92.0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Training program updated successfully",
  "data": {
    "id": "uuid",
    // ... updated fields
  }
}
```

---

### 5. Delete Training Program
**Endpoint:** `DELETE /cms/training-programs/:id`

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

## 📊 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔐 Authentication

### Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "admin@upskillway.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@upskillway.com",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

---

## 📝 Notes

1. **College API** is fully implemented and working
2. **Training Program API** exists in the database schema but routes need to be added to CMS routes
3. All timestamps are in ISO 8601 format
4. UUIDs are used for all IDs
5. Pagination is available on list endpoints
6. Search functionality supports partial matching (case-insensitive)

## 🚀 Next Steps

To fully implement the Training Program API, you need to:
1. Add routes in `src/routes/cms.ts` for training programs
2. Create controllers in `src/controllers/cmsController.ts`
3. Create services in `src/services/cmsService.ts`
4. Add validators in `src/validators/cms.ts`

The database schema already supports Training Programs, so only the API layer needs to be implemented.
