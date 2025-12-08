# Blog API - Complete Field List & Postman Testing Guide

## 📋 Complete Blog Fields

### Required Fields
- **title** (string, max 200 chars) - Blog post title
- **slug** (string, unique) - URL-friendly identifier (e.g., "my-awesome-blog-post")
- **content** (string, required) - Main blog content

### Optional Fields
- **excerpt** (string, max 500 chars) - Short description/summary
- **imageUrl** (string, valid URL) - Featured image URL
- **category** (string, max 100 chars) - Blog category (NEW!)
- **tags** (array of strings) - Blog tags/categories
- **status** (enum: "draft" or "published") - Default: "draft"

### Auto-Generated Fields (Read-only)
- **id** (UUID) - Unique identifier
- **createdBy** (UUID) - User ID who created the blog
- **createdAt** (DateTime) - Creation timestamp
- **updatedAt** (DateTime) - Last update timestamp
- **creator** (Object) - User details (id, name, email)

---

## 🔌 API Endpoints

**Base URL:** `http://localhost:PORT/api/v1`

Replace `PORT` with your server port (usually `3000` or `5000`)

---

### 1. **GET All Blogs** (Public - No Auth Required)

**Endpoint:**
```
GET /api/v1/blogs
```

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 10, max: 100) - Items per page
- `status` (string, optional) - Filter by status: "draft" or "published"
- `search` (string, optional) - Search term

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/blogs?page=1&limit=10`
- **Headers:** None required
- **Body:** None

**Example with Filters:**
```
http://localhost:3000/api/v1/blogs?page=1&limit=10&status=published
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "title": "My Blog Post",
      "slug": "my-blog-post",
      "excerpt": "Short excerpt",
      "content": "Full content...",
      "imageUrl": "https://example.com/image.jpg",
      "category": "Technology",
      "tags": ["tech", "programming"],
      "status": "published",
      "createdBy": "user-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### 2. **GET Blog by ID** (Public - No Auth Required)

**Endpoint:**
```
GET /api/v1/blogs/:id
```

**Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/v1/blogs/{blog-id-uuid}`
  - Replace `{blog-id-uuid}` with actual blog UUID
- **Headers:** None required
- **Body:** None

**Example URL:**
```
http://localhost:3000/api/v1/blogs/123e4567-e89b-12d3-a456-426614174000
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My Blog Post",
    "slug": "my-blog-post",
    "excerpt": "Short excerpt",
    "content": "Full content...",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Technology",
    "tags": ["tech", "programming"],
    "status": "published",
    "createdBy": "user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "creator": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 3. **POST Create Blog** (Admin Only - Auth Required)

**Endpoint:**
```
POST /api/v1/blogs
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/blogs`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON` and paste:

**Complete Example with All Fields:**
```json
{
  "title": "Getting Started with TypeScript",
  "slug": "getting-started-with-typescript",
  "excerpt": "Learn TypeScript basics in this comprehensive guide",
  "content": "TypeScript is a superset of JavaScript that adds static type definitions. It helps catch errors early and makes code more maintainable. In this blog post, we'll explore the fundamentals...",
  "imageUrl": "https://example.com/typescript-image.jpg",
  "category": "Technology",
  "tags": ["typescript", "programming", "web-development"],
  "status": "draft"
}
```

**Minimum Required Fields Only:**
```json
{
  "title": "My First Blog",
  "slug": "my-first-blog",
  "content": "This is the blog content..."
}
```

**Example with Category:**
```json
{
  "title": "Web Development Trends 2024",
  "slug": "web-development-trends-2024",
  "excerpt": "Explore the latest trends in web development",
  "content": "The web development landscape is constantly evolving...",
  "category": "Web Development",
  "tags": ["web", "trends", "2024"],
  "status": "published"
}
```

**Example Response (201 Created):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "id": "new-uuid-here",
    "title": "Getting Started with TypeScript",
    "slug": "getting-started-with-typescript",
    "excerpt": "Learn TypeScript basics in this comprehensive guide",
    "content": "TypeScript is a superset of JavaScript...",
    "imageUrl": "https://example.com/typescript-image.jpg",
    "category": "Technology",
    "tags": ["typescript", "programming", "web-development"],
    "status": "draft",
    "createdBy": "your-user-uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. **PUT Update Blog** (Admin Only - Auth Required)

**Endpoint:**
```
PUT /api/v1/blogs/:id
```

**Postman Setup:**
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/v1/blogs/{blog-id-uuid}`
  - Replace `{blog-id-uuid}` with actual blog UUID
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {your-access-token}`
- **Body:** Select `raw` → `JSON` (All fields are optional)

**Update Only Category:**
```json
{
  "category": "Updated Category"
}
```

**Update Multiple Fields:**
```json
{
  "title": "Updated Blog Title",
  "category": "Education",
  "status": "published",
  "tags": ["updated", "tags", "2024"]
}
```

**Update Status and Category:**
```json
{
  "status": "published",
  "category": "Technology"
}
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "blog-uuid",
    "title": "Updated Blog Title",
    "slug": "existing-slug",
    "content": "Existing content...",
    "category": "Education",
    "status": "published",
    "tags": ["updated", "tags"],
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. **DELETE Blog** (Admin Only - Auth Required)

**Endpoint:**
```
DELETE /api/v1/blogs/:id
```

**Postman Setup:**
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/v1/blogs/{blog-id-uuid}`
  - Replace `{blog-id-uuid}` with actual blog UUID
- **Headers:**
  - `Authorization: Bearer {your-access-token}`
- **Body:** None

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

## 🔑 Authentication Setup in Postman

### Step 1: Get Access Token

First, you need to login to get your access token:

**Endpoint:**
```
POST /api/v1/auth/login
```

**Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/v1/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "id": "user-uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

**Copy the `accessToken` value!**

### Step 2: Set Authorization Header

In Postman, you have two options:

**Option A: Using Authorization Tab**
1. Go to the **Authorization** tab in your request
2. Select **Type: Bearer Token**
3. Paste your token in the **Token** field

**Option B: Manual Header**
1. Go to the **Headers** tab
2. Add a new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer {paste-your-token-here}`

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Postman Collection

Here's a ready-to-import Postman collection:

```json
{
  "info": {
    "name": "Blog API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@example.com\",\n  \"password\": \"your-password\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Blogs",
      "item": [
        {
          "name": "Get All Blogs",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/blogs?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["blogs"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"},
                {"key": "status", "value": "published", "disabled": true},
                {"key": "search", "value": "", "disabled": true}
              ]
            }
          }
        },
        {
          "name": "Get Blog by ID",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/blogs/:id",
              "host": ["{{baseUrl}}"],
              "path": ["blogs", ":id"],
              "variable": [
                {"key": "id", "value": ""}
              ]
            }
          }
        },
        {
          "name": "Create Blog",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"My Blog Post\",\n  \"slug\": \"my-blog-post\",\n  \"content\": \"Blog content here...\",\n  \"excerpt\": \"Short description\",\n  \"imageUrl\": \"https://example.com/image.jpg\",\n  \"category\": \"Technology\",\n  \"tags\": [\"tech\", \"programming\"],\n  \"status\": \"draft\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/blogs",
              "host": ["{{baseUrl}}"],
              "path": ["blogs"]
            }
          }
        },
        {
          "name": "Update Blog",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Title\",\n  \"category\": \"Education\",\n  \"status\": \"published\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/blogs/:id",
              "host": ["{{baseUrl}}"],
              "path": ["blogs", ":id"],
              "variable": [
                {"key": "id", "value": ""}
              ]
            }
          }
        },
        {
          "name": "Delete Blog",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/blogs/:id",
              "host": ["{{baseUrl}}"],
              "path": ["blogs", ":id"],
              "variable": [
                {"key": "id", "value": ""}
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    }
  ]
}
```

**To Import:**
1. Open Postman
2. Click **Import** button
3. Select **Raw text** tab
4. Paste the JSON above
5. Click **Import**

---

## ✅ Field Validation Rules

### Title
- **Required:** Yes
- **Type:** String
- **Min Length:** 1 character
- **Max Length:** 200 characters

### Slug
- **Required:** Yes
- **Type:** String
- **Must be:** Unique across all blogs
- **Format:** lowercase, alphanumeric, hyphens allowed
- **Example:** `my-blog-post-123`

### Content
- **Required:** Yes
- **Type:** String
- **Min Length:** 1 character

### Excerpt
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 500 characters

### ImageUrl
- **Required:** No (Optional)
- **Type:** String (URL)
- **Must be:** Valid URL format if provided

### Category ⭐ NEW
- **Required:** No (Optional)
- **Type:** String
- **Max Length:** 100 characters
- **Example:** "Technology", "Education", "Health", etc.

### Tags
- **Required:** No (Optional)
- **Type:** Array of Strings
- **Default:** `[]`

### Status
- **Required:** No (Optional)
- **Type:** Enum
- **Values:** `"draft"` or `"published"`
- **Default:** `"draft"`

---

## 🚨 Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "category",
      "message": "Category too long"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog not found"
}
```

### 409 Conflict - Duplicate Slug
```json
{
  "success": false,
  "message": "Blog with this slug already exists"
}
```

---

## 💡 Testing Tips

1. **Start with GET requests** - These don't require authentication
2. **Get an access token first** - Login before testing POST/PUT/DELETE
3. **Test category field** - Try creating blogs with different categories
4. **Test validation** - Try sending invalid data to see error messages
5. **Test optional fields** - Create blogs with and without optional fields
6. **Use environment variables** - Set `baseUrl` and `accessToken` as Postman variables for easy reuse
7. **Check slug uniqueness** - Each slug must be unique across all blogs
8. **Test status filter** - Use `?status=published` to filter blogs

---

## 📋 Quick Reference - All Blog Fields

| Field | Type | Required | Max Length | Default |
|-------|------|----------|------------|---------|
| `title` | string | ✅ Yes | 200 | - |
| `slug` | string | ✅ Yes | - | - |
| `content` | string | ✅ Yes | - | - |
| `excerpt` | string | ❌ No | 500 | - |
| `imageUrl` | string (URL) | ❌ No | - | - |
| `category` | string | ❌ No | 100 | `null` |
| `tags` | array of strings | ❌ No | - | `[]` |
| `status` | enum | ❌ No | - | `"draft"` |
| `id` | UUID | Auto | - | Auto |
| `createdBy` | UUID | Auto | - | Auto |
| `createdAt` | DateTime | Auto | - | Auto |
| `updatedAt` | DateTime | Auto | - | Auto |

---

## 🎯 Sample Test Cases

### Test Case 1: Create Blog with All Fields
```json
{
  "title": "Complete Guide to REST APIs",
  "slug": "complete-guide-to-rest-apis",
  "excerpt": "Learn how to design and implement RESTful APIs",
  "content": "REST APIs are a fundamental part of modern web development...",
  "imageUrl": "https://example.com/rest-api.jpg",
  "category": "Web Development",
  "tags": ["api", "rest", "backend", "web"],
  "status": "published"
}
```

### Test Case 2: Create Blog with Minimum Fields
```json
{
  "title": "Simple Blog Post",
  "slug": "simple-blog-post",
  "content": "This is a simple blog post with just required fields."
}
```

### Test Case 3: Create Blog with Category Only
```json
{
  "title": "Tech News Update",
  "slug": "tech-news-update",
  "content": "Latest tech news and updates...",
  "category": "Technology"
}
```

### Test Case 4: Update Category
```json
{
  "category": "Science"
}
```

### Test Case 5: Update Multiple Fields Including Category
```json
{
  "title": "Updated Title",
  "category": "Education",
  "status": "published",
  "tags": ["education", "learning"]
}
```

---

Happy Testing! 🚀

