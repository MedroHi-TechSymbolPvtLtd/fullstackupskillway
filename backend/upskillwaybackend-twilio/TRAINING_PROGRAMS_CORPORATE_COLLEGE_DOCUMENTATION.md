# Training Programs: Corporate & College Documentation

## 📋 Overview

The UpSkillWay backend supports **both Corporate Training** and **College Training** programs through a **unified API system**. Currently, there is **ONE endpoint** that handles both types, differentiated by a `trainingType` field.

---

## 🔍 Current Implementation

### Single Endpoint Approach

**Base Endpoints:**
- `/api/v1/trainings` - Main training programs endpoint
- `/api/v1/cms/training-programs` - CMS training programs endpoint (for content management)

**Differentiation Method:**
- Uses `trainingType` field in request body (for POST/PUT)
- Uses `trainingType` query parameter (for GET requests to filter)

**Training Types:**
- `"corporate"` - For corporate training programs
- `"college"` - For college training programs

---

## 📡 API Endpoints

### 1. Get All Training Programs

**Endpoint:** `GET /api/v1/cms/training-programs`  
**Auth:** Public (No authentication required)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 10, max: 100) |
| `status` | string | No | Filter by status: `draft` or `published` |
| `trainingType` | string | No | Filter by type: `corporate` or `college` |
| `search` | string | No | Search in title, description, tags |

**Examples:**

```bash
# Get all training programs
GET /api/v1/cms/training-programs

# Get only corporate training programs
GET /api/v1/cms/training-programs?trainingType=corporate

# Get only college training programs
GET /api/v1/cms/training-programs?trainingType=college

# Get published corporate training programs
GET /api/v1/cms/training-programs?trainingType=corporate&status=published

# Search in corporate training programs
GET /api/v1/cms/training-programs?trainingType=corporate&search=data%20science
```

**Response:**
```json
{
  "success": true,
  "message": "Training programs retrieved successfully",
  "data": [
    {
      "id": "training-uuid",
      "title": "Data Science Corporate Training",
      "slug": "data-science-corporate-training",
      "description": "Comprehensive data science training for corporate teams",
      "price": 75000.00,
      "status": "published",
      "trainingType": "corporate",
      "durationMonths": 6,
      "durationHours": 200,
      "createdAt": "2025-01-15T10:30:00.000Z"
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

**Endpoint:** `GET /api/v1/cms/training-programs/:id`  
**Auth:** Public

**Example:**
```bash
GET /api/v1/cms/training-programs/123e4567-e89b-12d3-a456-426614174000
```

---

### 3. Create Training Program

**Endpoint:** `POST /api/v1/cms/training-programs`  
**Auth:** Admin Required

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

#### Create Corporate Training Program

**Request Body:**
```json
{
  "title": "Data Science Corporate Training",
  "slug": "data-science-corporate-training",
  "description": "Comprehensive data science training for corporate teams covering Python, statistics, machine learning, and business analytics.",
  "syllabus": "Module 1: Statistics & Probability\nModule 2: Machine Learning\nModule 3: Deep Learning\nModule 4: Business Analytics",
  "videoDemoUrl": "https://youtube.com/watch?v=ds123",
  "tags": ["Data Science", "Corporate", "ML", "AI", "Business Analytics"],
  "price": 75000.00,
  "status": "published",
  "trainingType": "corporate",
  "cardImageUrl": "https://example.com/images/ds-corporate-training.jpg",
  "durationMonths": 6,
  "durationHours": 200,
  "successMetric": "95% participant satisfaction rate",
  "curriculum": [
    {
      "title": "Statistics & Probability",
      "hours": 50
    },
    {
      "title": "Machine Learning",
      "hours": 80
    },
    {
      "title": "Deep Learning",
      "hours": 70
    }
  ],
  "testimonials": [
    {
      "studentName": "John Smith",
      "studentRole": "VP of Operations, TechCorp",
      "testimonialText": "Excellent training program that transformed our team's data capabilities.",
      "rating": 5,
      "studentImageUrl": "https://example.com/testimonials/john.jpg"
    }
  ],
  "faqs": [
    {
      "question": "Can this be customized for our organization?",
      "answer": "Yes, we offer customized training programs tailored to your organization's needs."
    }
  ],
  "badges": ["POPULAR", "Certified", "Enterprise"]
}
```

#### Create College Training Program

**Request Body:**
```json
{
  "title": "Campus Placement Training",
  "slug": "campus-placement-training",
  "description": "Comprehensive training program designed for college students to enhance placement opportunities.",
  "syllabus": "Module 1: Technical Skills\nModule 2: Soft Skills\nModule 3: Interview Preparation\nModule 4: Resume Building",
  "videoDemoUrl": "https://youtube.com/watch?v=placement123",
  "tags": ["Placement", "College", "Career", "Interview"],
  "price": 15000.00,
  "status": "published",
  "trainingType": "college",
  "cardImageUrl": "https://example.com/images/placement-training.jpg",
  "durationMonths": 3,
  "durationHours": 120,
  "placementRate": 85.0,
  "successMetric": "85% placement rate (All streams)",
  "curriculum": [
    {
      "title": "Technical Skills Development",
      "hours": 40
    },
    {
      "title": "Soft Skills & Communication",
      "hours": 30
    },
    {
      "title": "Interview Preparation",
      "hours": 30
    },
    {
      "title": "Resume & Portfolio Building",
      "hours": 20
    }
  ],
  "testimonials": [
    {
      "studentName": "Priya Sharma",
      "studentRole": "Computer Science Student",
      "testimonialText": "This program helped me secure a job at a top tech company!",
      "rating": 5,
      "studentImageUrl": "https://example.com/testimonials/priya.jpg"
    }
  ],
  "faqs": [
    {
      "question": "Is this suitable for all engineering streams?",
      "answer": "Yes, this program is designed for students from all engineering streams."
    }
  ],
  "badges": ["POPULAR", "Flexible", "Placement Guaranteed"]
}
```

**Key Differences:**

| Field | Corporate Training | College Training |
|-------|-------------------|------------------|
| `trainingType` | `"corporate"` | `"college"` |
| `placementRate` | Usually `null` (not applicable) | Usually included (0-100) |
| `successMetric` | Business-focused<br>"95% participant satisfaction" | Placement-focused<br>"85% placement rate" |
| `testimonials[].studentRole` | Corporate professionals<br>"VP of Operations, TechCorp" | Students<br>"Computer Science Student" |
| `badges` | Corporate-focused<br>["Certified", "Enterprise"] | Student-focused<br>["Placement Guaranteed", "Flexible"] |
| `price` | Higher (35,000 - 120,000) | Lower (8,000 - 25,000) |

---

### 4. Update Training Program

**Endpoint:** `PUT /api/v1/cms/training-programs/:id`  
**Auth:** Admin Required

**Request Body:** (All fields optional - partial update)

```json
{
  "price": 80000.00,
  "status": "published",
  "trainingType": "corporate"
}
```

---

### 5. Delete Training Program

**Endpoint:** `DELETE /api/v1/cms/training-programs/:id`  
**Auth:** Admin Required

---

## 🎯 Frontend Implementation Guide

### Option 1: Using Dropdown (Current Recommended Approach)

The frontend can use a dropdown to select the training type, which is then sent in the request body or query parameter.

#### For Creating/Updating Training Programs:

```javascript
// Frontend form with dropdown
const trainingForm = {
  title: "Data Science Training",
  slug: "data-science-training",
  description: "...",
  price: 75000,
  trainingType: "corporate", // Selected from dropdown: "corporate" or "college"
  // ... other fields
};

// API call
POST /api/v1/cms/training-programs
Body: trainingForm
```

#### For Filtering Training Programs:

```javascript
// Frontend dropdown for filtering
const selectedType = "corporate"; // or "college" from dropdown

// API call
GET /api/v1/cms/training-programs?trainingType=${selectedType}
```

**Frontend Dropdown Example:**
```html
<select name="trainingType" id="trainingType">
  <option value="">All Training Programs</option>
  <option value="corporate">Corporate Training</option>
  <option value="college">College Training</option>
</select>
```

---

### Option 2: Separate Endpoints (Not Currently Implemented)

If you want to create separate endpoints for better separation, you would need to:

1. **Create new routes:**
   - `/api/v1/cms/corporate-training-programs`
   - `/api/v1/cms/college-training-programs`

2. **Benefits:**
   - Clearer API structure
   - Easier to add type-specific validations
   - Better for frontend routing

3. **Drawbacks:**
   - Code duplication
   - More endpoints to maintain
   - Current approach is more flexible

**Example Implementation (if you want to add this):**

```typescript
// In src/routes/cms.ts

// Corporate Training Programs
router.get('/corporate-training-programs', getAllCorporateTrainingProgramsController);
router.post('/corporate-training-programs', createCorporateTrainingProgramController);
router.get('/corporate-training-programs/:id', getCorporateTrainingProgramByIdController);
router.put('/corporate-training-programs/:id', updateCorporateTrainingProgramController);
router.delete('/corporate-training-programs/:id', deleteCorporateTrainingProgramController);

// College Training Programs
router.get('/college-training-programs', getAllCollegeTrainingProgramsController);
router.post('/college-training-programs', createCollegeTrainingProgramController);
router.get('/college-training-programs/:id', getCollegeTrainingProgramByIdController);
router.put('/college-training-programs/:id', updateCollegeTrainingProgramController);
router.delete('/college-training-programs/:id', deleteCollegeTrainingProgramController);
```

**Note:** These endpoints don't exist yet. You would need to create controllers that automatically set `trainingType` to the appropriate value.

---

## 📊 Complete Field Reference

### Required Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | Min: 1, Max: 200 chars | Training program title |
| `slug` | string | ✅ Yes | Unique, URL-friendly | URL slug |
| `description` | string | ✅ Yes | Min: 1, Max: 2000 chars | Program description |
| `price` | number | ✅ Yes | Min: 0 | Training program price |
| `trainingType` | enum | ✅ Yes | `"corporate"` or `"college"` | Type of training |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `syllabus` | string | Course syllabus (text or JSON) |
| `videoDemoUrl` | string | Demo video URL (valid URL) |
| `tags` | string[] | Tags for categorization (default: []) |
| `status` | enum | Publication status: `"draft"` or `"published"` (default: `"draft"`) |
| `cardImageUrl` | string | Card image URL (valid URL) |
| `durationMonths` | number | Duration in months (integer, min: 0) |
| `durationHours` | number | Duration in hours (integer, min: 0) |
| `placementRate` | number | Placement rate (0-100) - Usually for college training |
| `successMetric` | string | Success metric description (max: 200 chars) |
| `curriculum` | object[] | Curriculum modules array |
| `testimonials` | object[] | Testimonials array |
| `faqs` | object[] | FAQs array |
| `badges` | string[] | Badges array (default: []) |

### Curriculum Item Schema

```json
{
  "title": "Module Title",
  "hours": 50
}
```

### Testimonial Schema

```json
{
  "studentName": "John Doe",
  "studentRole": "VP of Operations",
  "testimonialText": "Great program!",
  "rating": 5,
  "studentImageUrl": "https://example.com/image.jpg"
}
```

### FAQ Schema

```json
{
  "question": "What is the duration?",
  "answer": "The program is 6 months long."
}
```

---

## 🔄 Comparison: Current vs. Separate Endpoints

### Current Implementation (Single Endpoint)

**Pros:**
- ✅ Single codebase to maintain
- ✅ Flexible filtering via query parameters
- ✅ Easy to add new training types in the future
- ✅ Less code duplication
- ✅ Consistent API structure

**Cons:**
- ❌ Frontend needs to handle `trainingType` field/parameter
- ❌ Slightly more complex filtering logic

### Separate Endpoints (Not Implemented)

**Pros:**
- ✅ Clearer API structure
- ✅ Easier frontend routing (`/corporate-training` vs `/college-training`)
- ✅ Can add type-specific validations easily
- ✅ Better for type-specific features

**Cons:**
- ❌ Code duplication
- ❌ More endpoints to maintain
- ❌ Harder to add new training types
- ❌ More complex routing

---

## 💡 Recommendations

### For Frontend Development:

1. **Use Dropdown Approach (Current):**
   - Add a dropdown/select field for `trainingType`
   - Use the same endpoint with `trainingType` in request body
   - Filter using query parameter: `?trainingType=corporate` or `?trainingType=college`

2. **Example Frontend Code:**
   ```javascript
   // React example
   const [trainingType, setTrainingType] = useState('corporate');
   
   const createTraining = async (data) => {
     const response = await fetch('/api/v1/cms/training-programs', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         ...data,
         trainingType: trainingType // From dropdown
       })
     });
   };
   
   const getTrainings = async () => {
     const response = await fetch(
       `/api/v1/cms/training-programs?trainingType=${trainingType}`
     );
   };
   ```

### For Backend (If You Want Separate Endpoints):

If you decide to implement separate endpoints, you would need to:

1. Create wrapper controllers that set `trainingType` automatically
2. Add new routes in `src/routes/cms.ts`
3. Update frontend to use new endpoints

**Example Controller:**
```typescript
export const createCorporateTrainingProgramController = asyncHandler(
  async (req: Request, res: Response) => {
    // Automatically set trainingType to "corporate"
    req.body.trainingType = 'corporate';
    return createTrainingProgramController(req, res);
  }
);
```

---

## 📝 Summary

**Current Status:**
- ✅ Single endpoint: `/api/v1/cms/training-programs`
- ✅ Uses `trainingType` field/parameter to differentiate
- ✅ Supports both "corporate" and "college" types
- ✅ Frontend can use dropdown to select type

**Recommended Approach:**
- Use the **current single endpoint** with dropdown selection
- Filter using `?trainingType=corporate` or `?trainingType=college`
- Set `trainingType` in request body when creating/updating

**If You Want Separate Endpoints:**
- Would require backend changes
- Create wrapper controllers
- Add new routes
- Update frontend to use new endpoints

---

## 🚀 Quick Start Examples

### Get All Corporate Training Programs
```bash
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?trainingType=corporate&status=published"
```

### Get All College Training Programs
```bash
curl -X GET "http://localhost:3000/api/v1/cms/training-programs?trainingType=college&status=published"
```

### Create Corporate Training Program
```bash
curl -X POST "http://localhost:3000/api/v1/cms/training-programs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Data Science Corporate Training",
    "slug": "data-science-corporate-training",
    "description": "Comprehensive data science training",
    "price": 75000,
    "trainingType": "corporate",
    "status": "published"
  }'
```

### Create College Training Program
```bash
curl -X POST "http://localhost:3000/api/v1/cms/training-programs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Campus Placement Training",
    "slug": "campus-placement-training",
    "description": "Training for college students",
    "price": 15000,
    "trainingType": "college",
    "status": "published",
    "placementRate": 85.0
  }'
```

---

**Document Version:** 1.0  
**Last Updated:** January 15, 2025  
**Maintained By:** UpSkillWay Development Team



