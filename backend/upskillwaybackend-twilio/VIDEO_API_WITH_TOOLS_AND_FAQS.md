# Video API with Mastered Tools & FAQs - Complete Documentation

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

```
Authorization: Bearer <your_jwt_token>
```

---

## 🎥 VIDEO API (Updated with masteredTools & faqs)

### Overview

The Video API now includes two new fields:

- **masteredTools**: Array of tools/technologies covered in the video
- **faqs**: Array of frequently asked questions about the video content

---

## API Endpoints

### 1. GET All Videos

**Endpoint:** `GET /cms/videos`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number |
| limit | integer | No | 10 | Items per page (max 100) |
| search | string | No | - | Search in title, description |
| status | enum | No | - | `draft` or `published` |

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/cms/videos?status=published&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Videos retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete Full Stack Development Course",
      "slug": "complete-fullstack-development",
      "description": "Learn full stack development from scratch with React, Node.js, and MongoDB. Build real-world projects and master modern web development.",
      "videoUrl": "https://youtube.com/watch?v=fullstack-course",
      "tags": ["Full Stack", "React", "Node.js", "MongoDB", "JavaScript"],
      "masteredTools": [
        {
          "name": "React",
          "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
        },
        {
          "name": "Node.js",
          "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
        },
        {
          "name": "MongoDB",
          "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
        },
        {
          "name": "Express.js",
          "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
        },
        {
          "name": "Git",
          "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
        }
      ],
      "faqs": [
        {
          "question": "What prerequisites do I need?",
          "answer": "Basic understanding of computers and problem-solving skills. No prior coding experience required."
        },
        {
          "question": "Is placement support provided?",
          "answer": "Yes, students get career guidance, resume workshops, and interview preparation support."
        },
        {
          "question": "How long is the course?",
          "answer": "The complete course is approximately 40 hours of content, which you can complete at your own pace."
        },
        {
          "question": "Will I get a certificate?",
          "answer": "Yes, you'll receive a certificate of completion after finishing all modules and projects."
        }
      ],
      "status": "published",
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
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. GET Video by ID

**Endpoint:** `GET /cms/videos/:id`

**Example Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Video retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete Full Stack Development Course",
    "slug": "complete-fullstack-development",
    "description": "Learn full stack development from scratch with React, Node.js, and MongoDB. Build real-world projects and master modern web development.",
    "videoUrl": "https://youtube.com/watch?v=fullstack-course",
    "tags": ["Full Stack", "React", "Node.js", "MongoDB", "JavaScript"],
    "masteredTools": [
      {
        "name": "React",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      },
      {
        "name": "Node.js",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
      },
      {
        "name": "MongoDB",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
      }
    ],
    "faqs": [
      {
        "question": "What prerequisites do I need?",
        "answer": "Basic understanding of computers and problem-solving skills. No prior coding experience required."
      },
      {
        "question": "Is placement support provided?",
        "answer": "Yes, students get career guidance, resume workshops, and interview preparation support."
      }
    ],
    "status": "published",
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

### 3. POST Create Video

**Endpoint:** `POST /cms/videos`

**Request Body:**

```json
{
  "title": "Python for Data Science - Complete Guide",
  "slug": "python-data-science-guide",
  "description": "Master Python for data science with NumPy, Pandas, Matplotlib, and Scikit-learn. Learn data analysis, visualization, and machine learning.",
  "videoUrl": "https://youtube.com/watch?v=python-ds-guide",
  "tags": ["Python", "Data Science", "Machine Learning", "NumPy", "Pandas"],
  "masteredTools": [
    {
      "name": "Python",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
      "name": "NumPy",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
    },
    {
      "name": "Pandas",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
    },
    {
      "name": "Jupyter",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg"
    },
    {
      "name": "Scikit-learn",
      "logoUrl": "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"
    }
  ],
  "faqs": [
    {
      "question": "Do I need prior programming experience?",
      "answer": "Basic Python knowledge is recommended. If you're new to Python, we suggest taking our Python Fundamentals course first."
    },
    {
      "question": "What tools do I need to install?",
      "answer": "You'll need Python 3.8+, Jupyter Notebook, and the libraries covered in the course (NumPy, Pandas, Matplotlib, Scikit-learn)."
    },
    {
      "question": "Are there hands-on projects?",
      "answer": "Yes! The course includes 5 real-world data science projects covering data analysis, visualization, and machine learning."
    },
    {
      "question": "How long will it take to complete?",
      "answer": "The course has 35 hours of content. Most students complete it in 4-6 weeks studying 1-2 hours daily."
    },
    {
      "question": "Will I get job-ready skills?",
      "answer": "Yes! This course covers industry-standard tools and techniques used by data scientists in top companies."
    }
  ],
  "status": "published"
}
```

**Example cURL:**

```bash
curl -X POST "http://localhost:3000/api/v1/cms/videos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python for Data Science - Complete Guide",
    "slug": "python-data-science-guide",
    "videoUrl": "https://youtube.com/watch?v=python-ds-guide",
    "tags": ["Python", "Data Science"],
    "masteredTools": [
      {
        "name": "Python",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      }
    ],
    "faqs": [
      {
        "question": "Do I need prior experience?",
        "answer": "Basic Python knowledge is recommended."
      }
    ],
    "status": "published"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "id": "new-uuid-789",
    "title": "Python for Data Science - Complete Guide",
    "slug": "python-data-science-guide",
    "description": "Master Python for data science...",
    "videoUrl": "https://youtube.com/watch?v=python-ds-guide",
    "tags": ["Python", "Data Science", "Machine Learning", "NumPy", "Pandas"],
    "masteredTools": [
      {
        "name": "Python",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      },
      {
        "name": "NumPy",
        "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
      }
    ],
    "faqs": [
      {
        "question": "Do I need prior programming experience?",
        "answer": "Basic Python knowledge is recommended..."
      }
    ],
    "status": "published",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 4. PUT Update Video

**Endpoint:** `PUT /cms/videos/:id`

**Request Body:** (All fields optional)

```json
{
  "title": "Python for Data Science - Complete Guide (Updated)",
  "description": "Updated description with more details...",
  "masteredTools": [
    {
      "name": "Python",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    },
    {
      "name": "NumPy",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"
    },
    {
      "name": "Pandas",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg"
    },
    {
      "name": "TensorFlow",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg"
    }
  ],
  "faqs": [
    {
      "question": "Do I need prior programming experience?",
      "answer": "Basic Python knowledge is recommended. If you're new to Python, we suggest taking our Python Fundamentals course first."
    },
    {
      "question": "What tools do I need to install?",
      "answer": "You'll need Python 3.8+, Jupyter Notebook, and the libraries covered in the course."
    },
    {
      "question": "Is this course suitable for beginners?",
      "answer": "This course is designed for those with basic Python knowledge. Complete beginners should start with Python Fundamentals."
    }
  ],
  "status": "published"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Python for Data Science - Complete Guide (Updated)",
    // ... updated fields
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

---

### 5. DELETE Video

**Endpoint:** `DELETE /cms/videos/:id`

**Example cURL:**

```bash
curl -X DELETE "http://localhost:3000/api/v1/cms/videos/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": {
    "message": "Video deleted successfully"
  }
}
```

---

## 📋 Complete Field Reference

### Video Object

| Field             | Type     | Required | Description                        | Example                                    |
| ----------------- | -------- | -------- | ---------------------------------- | ------------------------------------------ |
| **id**            | UUID     | Auto     | Unique identifier                  | `"550e8400-e29b-41d4-a716-446655440000"`   |
| **title**         | String   | ✅ Yes   | Video title                        | `"Complete Full Stack Development Course"` |
| **slug**          | String   | ✅ Yes   | URL-friendly unique identifier     | `"complete-fullstack-development"`         |
| **description**   | String   | No       | Video description (max 1000 chars) | `"Learn full stack development..."`        |
| **videoUrl**      | String   | ✅ Yes   | Video URL (YouTube, Vimeo, etc.)   | `"https://youtube.com/watch?v=..."`        |
| **tags**          | String[] | No       | Tags for categorization            | `["React", "Node.js", "MongoDB"]`          |
| **masteredTools** | JSON[]   | No       | Tools/technologies covered         | See below                                  |
| **faqs**          | JSON[]   | No       | Frequently asked questions         | See below                                  |
| **status**        | Enum     | No       | Publication status                 | `"draft"` or `"published"`                 |
| **createdBy**     | UUID     | Auto     | Creator user ID                    | `"admin-uuid-123"`                         |
| **createdAt**     | DateTime | Auto     | Creation timestamp                 | `"2025-01-01T00:00:00.000Z"`               |
| **updatedAt**     | DateTime | Auto     | Last update timestamp              | `"2025-01-10T00:00:00.000Z"`               |

---

### masteredTools Array Structure

```json
[
  {
    "name": "React",
    "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    "name": "Node.js",
    "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  }
]
```

**masteredTools Fields:**

- `name` (String, Required): Tool/technology name
- `logoUrl` (String, Optional): URL to tool logo/icon

**Popular Logo Sources:**

- DevIcon CDN: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{tool}/{tool}-original.svg`
- Simple Icons: `https://cdn.simpleicons.org/{tool}`
- Custom URLs: Any valid image URL

---

### faqs Array Structure

```json
[
  {
    "question": "What prerequisites do I need?",
    "answer": "Basic understanding of computers and problem-solving skills. No prior coding experience required."
  },
  {
    "question": "Is placement support provided?",
    "answer": "Yes, students get career guidance, resume workshops, and interview preparation support."
  }
]
```

**FAQ Fields:**

- `question` (String, Required): Question text
- `answer` (String, Required): Answer text

---

## 🎯 Example Use Cases

### Use Case 1: Web Development Course

```json
{
  "title": "Modern Web Development with React & Next.js",
  "slug": "modern-web-dev-react-nextjs",
  "videoUrl": "https://youtube.com/watch?v=web-dev-course",
  "tags": ["React", "Next.js", "Web Development", "JavaScript"],
  "masteredTools": [
    {
      "name": "React",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
      "name": "Next.js",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
    },
    {
      "name": "TypeScript",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
    },
    {
      "name": "Tailwind CSS",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
    }
  ],
  "faqs": [
    {
      "question": "Is JavaScript knowledge required?",
      "answer": "Yes, you should be comfortable with JavaScript ES6+ features."
    },
    {
      "question": "Will we build real projects?",
      "answer": "Yes! You'll build 3 full-stack projects including an e-commerce site."
    }
  ]
}
```

### Use Case 2: DevOps Course

```json
{
  "title": "Complete DevOps with Docker, Kubernetes & AWS",
  "slug": "complete-devops-docker-k8s-aws",
  "videoUrl": "https://youtube.com/watch?v=devops-course",
  "tags": ["DevOps", "Docker", "Kubernetes", "AWS", "CI/CD"],
  "masteredTools": [
    {
      "name": "Docker",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
    },
    {
      "name": "Kubernetes",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg"
    },
    {
      "name": "AWS",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg"
    },
    {
      "name": "Jenkins",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
    },
    {
      "name": "Terraform",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg"
    }
  ],
  "faqs": [
    {
      "question": "Do I need cloud experience?",
      "answer": "Basic understanding of cloud concepts helps, but we'll cover everything from scratch."
    },
    {
      "question": "Will I get AWS certification guidance?",
      "answer": "Yes, the course prepares you for AWS Solutions Architect Associate certification."
    }
  ]
}
```

### Use Case 3: Mobile App Development

```json
{
  "title": "React Native - Build iOS & Android Apps",
  "slug": "react-native-mobile-apps",
  "videoUrl": "https://youtube.com/watch?v=rn-mobile-course",
  "tags": ["React Native", "Mobile Development", "iOS", "Android"],
  "masteredTools": [
    {
      "name": "React Native",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
      "name": "Expo",
      "logoUrl": "https://cdn.worldvectorlogo.com/logos/expo-1.svg"
    },
    {
      "name": "Firebase",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
    },
    {
      "name": "Redux",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
    }
  ],
  "faqs": [
    {
      "question": "Can I build for both iOS and Android?",
      "answer": "Yes! React Native allows you to build for both platforms with a single codebase."
    },
    {
      "question": "Do I need a Mac for iOS development?",
      "answer": "For testing on iOS simulator, yes. But you can develop and test on Android without a Mac."
    }
  ]
}
```

---

## ⚠️ Validation Rules

1. **title**: Required, max 200 characters
2. **slug**: Required, unique, URL-friendly
3. **videoUrl**: Required, must be valid URL
4. **description**: Optional, max 1000 characters
5. **tags**: Optional, array of strings
6. **masteredTools**: Optional, array of objects
   - Each tool must have `name` (required)
   - `logoUrl` must be valid URL if provided
7. **faqs**: Optional, array of objects
   - Each FAQ must have `question` and `answer` (both required)
8. **status**: Optional, defaults to `draft`

---

## 🚨 Error Responses

### 400 - Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "masteredTools[0].logoUrl",
      "message": "Invalid logo URL"
    },
    {
      "field": "faqs[1].answer",
      "message": "Answer is required"
    }
  ]
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Video not found",
  "error": "No video found with the given ID"
}
```

### 409 - Conflict

```json
{
  "success": false,
  "message": "Video with this slug already exists",
  "error": "Slug must be unique"
}
```

---

## 📝 Implementation Status

✅ **Database Schema**: Updated with `masteredTools` and `faqs` fields
✅ **Validators**: Updated to include new fields
✅ **API Routes**: Already exist in `/cms/videos`
✅ **Controllers**: Already exist
✅ **Services**: Already exist

**Status**: Fully implemented and ready to use! 🎉

---

## 🎓 Complete Example

```json
{
  "title": "Complete MERN Stack Development 2025",
  "slug": "complete-mern-stack-2025",
  "description": "Master the MERN stack (MongoDB, Express, React, Node.js) and build production-ready full-stack applications. Learn authentication, deployment, and best practices.",
  "videoUrl": "https://youtube.com/watch?v=mern-stack-2025",
  "tags": ["MERN", "MongoDB", "Express", "React", "Node.js", "Full Stack"],
  "masteredTools": [
    {
      "name": "MongoDB",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
    },
    {
      "name": "Express.js",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
    },
    {
      "name": "React",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
      "name": "Node.js",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
    },
    {
      "name": "Redux",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg"
    },
    {
      "name": "JWT",
      "logoUrl": "https://cdn.worldvectorlogo.com/logos/jwt-3.svg"
    },
    {
      "name": "Git",
      "logoUrl": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
    },
    {
      "name": "Postman",
      "logoUrl": "https://cdn.worldvectorlogo.com/logos/postman.svg"
    }
  ],
  "faqs": [
    {
      "question": "What prerequisites do I need?",
      "answer": "Basic understanding of computers and problem-solving skills. No prior coding experience required."
    },
    {
      "question": "Is placement support provided?",
      "answer": "Yes, students get career guidance, resume workshops, and interview preparation support."
    },
    {
      "question": "How long is the course?",
      "answer": "The complete course is approximately 50 hours of content, which you can complete at your own pace."
    },
    {
      "question": "Will I build real projects?",
      "answer": "Yes! You'll build 5 full-stack projects including a social media app, e-commerce platform, and more."
    },
    {
      "question": "Do I get a certificate?",
      "answer": "Yes, you'll receive a certificate of completion after finishing all modules and projects."
    },
    {
      "question": "Can I get help if I'm stuck?",
      "answer": "Absolutely! We have a dedicated Discord community and Q&A section for student support."
    }
  ],
  "status": "published"
}
```

This is the complete Video API documentation with the new `masteredTools` and `faqs` fields! 🚀
