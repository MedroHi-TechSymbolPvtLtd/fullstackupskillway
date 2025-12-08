# Leads and Colleges Functionality - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Leads Functionality](#leads-functionality)
3. [Colleges Functionality](#colleges-functionality)
4. [Lead to College Conversion Flow](#lead-to-college-conversion-flow)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Data Models](#data-models)
7. [Workflows and Use Cases](#workflows-and-use-cases)

---

## 🎯 Overview

The UpSkillWay backend has a comprehensive **Lead Management System** and **College Management System** that work together to:

1. **Capture leads** from public forms (website, landing pages)
2. **Manage leads** through various stages of the sales funnel
3. **Convert leads** into colleges (partners)
4. **Manage college relationships** and training programs
5. **Track activities** and interactions with leads and colleges

### Key Relationships

```
Lead → (Converted) → College → Trainers → Trainings
  │                      │
  └── Assigned to User   └── Assigned to User
```

---

## 📥 Leads Functionality

### What is a Lead?

A **Lead** represents a potential customer or organization that has shown interest in UpSkillWay's services. Leads are captured through:
- Public contact forms
- Landing page submissions
- Referrals
- Other marketing channels

### Lead Data Model

```typescript
{
  id: string (UUID)
  name: string?              // Contact person name
  email: string (required)   // Contact email
  organization: string?      // Organization/College name
  phone: string?            // Contact phone
  requirement: string?       // What they're looking for
  source: string?            // Where lead came from (website, referral, etc.)
  
  // Assignment & Tracking
  assignedToId: string?      // Sales person assigned to this lead
  collegeId: string?         // Linked college (if converted)
  
  // Status & Stage
  stage: LeadStage           // Current stage in sales funnel
  status: LeadStatus        // Overall status
  priority: Priority         // LOW, MEDIUM, HIGH, URGENT
  
  // Dates
  createdAt: DateTime
  convertedAt: DateTime?    // When lead was converted
  lastContactAt: DateTime?  // Last interaction
  nextFollowUp: DateTime?   // Scheduled follow-up
  
  // Additional
  notes: string?            // Internal notes
  value: Float?             // Estimated deal value
  
  // Relations
  assignedTo: User?         // Assigned sales person
  college: College?         // Linked college
  activities: LeadActivity[] // Activity history
}
```

### Lead Stages (Sales Funnel)

```typescript
enum LeadStage {
  LEAD_GENERATED      // Initial lead created
  CONTACTED           // Sales person contacted lead
  DEMO_GIVEN          // Demo/trial provided
  TRAINING_BOOKED     // Training scheduled
  START               // Training started
  IN_CONVERSATION     // Ongoing discussions
  EMAIL_WHATSAPP      // Communication via email/WhatsApp
  PENDING             // Waiting for response
  IN_PROGRESS         // Deal in progress
  CLOSED_WON          // Deal won
  FEEDBACK_COLLECTED  // Feedback received
  CONVERT             // Ready to convert
  CONVERTED           // Successfully converted to college
  DENIED              // Lead rejected/denied
}
```

### Lead Status

```typescript
enum LeadStatus {
  NEW              // Newly created
  CONTACTED        // Initial contact made
  QUALIFIED        // Qualified as potential customer
  PROPOSAL         // Proposal sent
  NEGOTIATION      // Negotiating terms
  CLOSED_WON       // Deal won
  CLOSED_LOST      // Deal lost
  ACTIVE           // Currently active (default)
  CONVERTED        // Converted to college
  DENIED           // Rejected
  RECYCLED         // Recycled for future follow-up
}
```

### Lead Priority

```typescript
enum Priority {
  LOW      // Low priority
  MEDIUM   // Medium priority (default)
  HIGH     // High priority
  URGENT   // Urgent - needs immediate attention
}
```

### Key Features

#### 1. **Public Lead Creation** (No Authentication Required)
- Anyone can submit a lead through the public API
- Rate limited to prevent spam (50 submissions per 15 minutes per IP)
- Automatically sends welcome email and WhatsApp message (if configured)

#### 2. **Lead Assignment**
- Assign leads to sales team members
- Link leads to existing colleges
- Set priority levels
- Add notes and follow-up dates

#### 3. **Lead Status Management**
- Update lead stage through sales funnel
- Track conversion status
- Automatic activity logging
- Follow-up scheduling

#### 4. **Lead Statistics**
- Total leads count
- Leads by stage
- Leads by source
- Leads by status
- Conversion rate
- Recent leads

#### 5. **Activity Tracking**
- Automatic activity logs for:
  - Stage changes
  - Assignments
  - Status updates
  - Notes added
  - Training scheduled/completed

---

## 🏫 Colleges Functionality

### What is a College?

A **College** represents an educational institution (college, university, institute) that is either:
- A **prospective partner** (interested in training programs)
- An **active partner** (currently working with UpSkillWay)
- A **partner** (long-term relationship)

### College Data Model

```typescript
{
  id: string (UUID)
  name: string (required)        // College name
  location: string?              // Full address
  city: string?                  // City
  state: string?                 // State
  type: CollegeType?             // Type of institution
  
  // Contact Information
  contactPerson: string?         // Primary contact name
  contactEmail: string?          // Contact email
  contactPhone: string?         // Contact phone
  
  // Institution Details
  ranking: Int?                  // Institution ranking
  enrollment: Int?               // Number of students
  establishedYear: Int?          // Year established
  
  // Business Metrics
  totalRevenue: Float?           // Total revenue from this college
  avgRating: Float?              // Average training rating
  lastTrainingAt: DateTime?      // Last training date
  
  // Assignment
  assignedToId: string?          // Sales person assigned
  assignedTrainer: string?      // Primary trainer assigned
  
  // Status
  status: CollegeStatus          // PROSPECTIVE, ACTIVE, INACTIVE, PARTNER
  
  // Relations
  assignedTo: User?              // Assigned sales person
  assignedTrainerDetails: Trainer? // Primary trainer
  trainers: CollegeTrainer[]     // All assigned trainers
  leads: Lead[]                  // Associated leads
  trainings: Training[]          // Training history
  trainerBookings: TrainerBooking[] // Trainer bookings
}
```

### College Types

```typescript
enum CollegeType {
  ENGINEERING      // Engineering college
  MEDICAL          // Medical college
  MANAGEMENT       // Management institute
  ARTS_SCIENCE     // Arts & Science college
  LAW              // Law college
  PHARMACY         // Pharmacy college
  ARCHITECTURE     // Architecture college
  OTHER            // Other type
}
```

### College Status

```typescript
enum CollegeStatus {
  PROSPECTIVE    // Interested, not yet active (default)
  ACTIVE         // Currently active partner
  INACTIVE       // Not currently active
  PARTNER        // Long-term partner
}
```

### Key Features

#### 1. **College Management**
- Create, read, update, delete colleges
- Search and filter colleges
- View college details with related data

#### 2. **Trainer Assignment**
- Assign trainers to colleges
- Multiple trainers per college
- Track trainer-college relationships
- View trainer availability

#### 3. **Training History**
- View all trainings conducted at college
- Track training dates and feedback
- Monitor training status

#### 4. **Lead Association**
- View all leads associated with a college
- Track lead conversion history
- Link multiple leads to one college

#### 5. **College Statistics**
- Total colleges count
- Active partners count
- Total revenue
- Average rating
- Colleges by status
- Colleges by type

---

## 🔄 Lead to College Conversion Flow

### Automatic Conversion Process

When a lead is marked as **CONVERTED**, the system automatically:

1. **Checks if college exists** with the same organization name
2. **Creates new college** if it doesn't exist (from lead data)
3. **Links lead to college** (existing or newly created)
4. **Updates lead status** to CONVERTED
5. **Creates activity log** for tracking
6. **Updates college status** if lead already had a college

### Conversion Data Mapping

| Lead Field | → | College Field |
|------------|---|---------------|
| `organization` | → | `name` (required) |
| `name` | → | `contactPerson` |
| `email` | → | `contactEmail` |
| `phone` | → | `contactPhone` |
| - | → | `status` = "PROSPECTIVE" |
| - | → | `assignedToId` = null (manual assignment) |

### Conversion Flow Diagram

```
┌─────────────────────────────────────────┐
│  Lead Created (Public Form)            │
│  - organization: "ABC College"         │
│  - email: "contact@abc.edu"            │
│  - stage: LEAD_GENERATED               │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Sales Person Works on Lead             │
│  - Updates stage: CONTACTED             │
│  - Updates stage: DEMO_GIVEN            │
│  - Updates stage: IN_PROGRESS           │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Lead Conversion Triggered              │
│  PATCH /api/v1/leads/:id/status         │
│  { stage: "CONVERT" }                   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  System Checks:                         │
│  ├── College exists with name?          │
│  │   ├── Yes → Link to existing         │
│  │   └── No → Create new college        │
│  └── Update lead status                 │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  College Created                        │
│  - name: "ABC College"                  │
│  - contactEmail: "contact@abc.edu"      │
│  - status: "PROSPECTIVE"                │
│  - assignedToId: null                   │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Lead Updated                            │
│  - stage: "CONVERTED"                    │
│  - status: "CONVERTED"                   │
│  - collegeId: <new-college-id>           │
│  - convertedAt: <timestamp>             │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Activity Log Created                    │
│  - Type: STAGE_CHANGE                    │
│  - Description: "Lead converted"        │
│  - Notes: "College auto-created"        │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  Manual Steps (Admin/Sales)              │
│  ├── Assign sales person to college     │
│  ├── Assign trainer to college          │
│  └── Schedule training                   │
└─────────────────────────────────────────┘
```

### Conversion API Example

**Request:**
```http
PATCH /api/v1/leads/{leadId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "stage": "CONVERT",
  "status": "CONVERTED",
  "notes": "Lead successfully converted after demo",
  "value": 50000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "data": {
    "id": "lead-uuid",
    "name": "John Doe",
    "email": "john@abc.edu",
    "organization": "ABC College",
    "stage": "CONVERTED",
    "status": "CONVERTED",
    "convertedAt": "2025-11-13T10:00:00.000Z",
    "collegeId": "college-uuid",
    "college": {
      "id": "college-uuid",
      "name": "ABC College",
      "contactEmail": "john@abc.edu",
      "status": "PROSPECTIVE"
    },
    "assignedTo": {
      "id": "user-uuid",
      "name": "Sales Person",
      "email": "sales@upskillway.com"
    }
  }
}
```

---

## 📡 API Endpoints Reference

### Leads Endpoints

#### 1. Create Lead (Public)
```http
POST /api/v1/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "organization": "ABC College",
  "phone": "+1234567890",
  "requirement": "Need training for 100 students",
  "source": "Website"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "stage": "LEAD_GENERATED",
    "status": "ACTIVE",
    "createdAt": "2025-11-13T..."
  }
}
```

#### 2. Get All Leads (Authenticated)
```http
GET /api/v1/leads?page=1&limit=10&stage=IN_PROGRESS&status=ACTIVE
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string) - Search in name, email, organization, phone
- `stage` (LeadStage) - Filter by stage
- `status` (LeadStatus) - Filter by status
- `priority` (Priority) - Filter by priority
- `assignedTo` (UUID) - Filter by assigned user
- `collegeId` (UUID) - Filter by college
- `source` (string) - Filter by source

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "organization": "ABC College",
      "stage": "IN_PROGRESS",
      "status": "ACTIVE",
      "assignedTo": { "id": "...", "name": "..." },
      "college": { "id": "...", "name": "..." },
      "_count": { "activities": 5 }
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

#### 3. Get Lead by ID
```http
GET /api/v1/leads/{leadId}
Authorization: Bearer <token>
```

**Response:** `200 OK` (includes activities and related data)

#### 4. Update Lead
```http
PUT /api/v1/leads/{leadId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "requirement": "Updated requirement"
}
```

#### 5. Update Lead Status
```http
PATCH /api/v1/leads/{leadId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "stage": "CONVERT",
  "status": "CONVERTED",
  "notes": "Conversion notes",
  "nextFollowUp": "2025-11-20T10:00:00Z",
  "value": 50000
}
```

#### 6. Assign Lead
```http
PATCH /api/v1/leads/{leadId}/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedToId": "user-uuid",
  "collegeId": "college-uuid",
  "priority": "HIGH",
  "notes": "High priority lead"
}
```

#### 7. Get Lead Statistics
```http
GET /api/v1/leads/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "totalConverted": 25,
    "conversionPercentage": 16.67,
    "leadsByStage": [
      { "stage": "LEAD_GENERATED", "count": 50 },
      { "stage": "IN_PROGRESS", "count": 30 },
      { "stage": "CONVERTED", "count": 25 }
    ],
    "leadsBySource": [
      { "source": "Website", "count": 80 },
      { "source": "Referral", "count": 40 }
    ],
    "leadsByStatus": [
      { "status": "ACTIVE", "count": 100 },
      { "status": "CONVERTED", "count": 25 }
    ],
    "recentLeads": [...]
  }
}
```

#### 8. Delete Lead
```http
DELETE /api/v1/leads/{leadId}
Authorization: Bearer <token>
```

---

### Colleges Endpoints

#### 1. Get All Colleges
```http
GET /api/v1/colleges?page=1&limit=10&search=ABC&status=ACTIVE
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string) - Search in name, location, city, contactPerson
- `status` (CollegeStatus) - Filter by status
- `type` (CollegeType) - Filter by type
- `assignedTo` (UUID) - Filter by assigned user

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "ABC College",
      "city": "Mumbai",
      "state": "Maharashtra",
      "status": "ACTIVE",
      "assignedTo": { "id": "...", "name": "..." },
      "trainers": [
        {
          "trainer": {
            "id": "...",
            "name": "Trainer Name",
            "specialization": ["Java", "Python"]
          }
        }
      ],
      "_count": {
        "leads": 5,
        "trainings": 10
      }
    }
  ],
  "pagination": { ... }
}
```

#### 2. Get College by ID
```http
GET /api/v1/colleges/{collegeId}
Authorization: Bearer <token>
```

**Response:** `200 OK` (includes leads, trainers, trainings)

#### 3. Create College
```http
POST /api/v1/colleges
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "XYZ College",
  "city": "Delhi",
  "state": "Delhi",
  "type": "ENGINEERING",
  "contactPerson": "John Doe",
  "contactEmail": "contact@xyz.edu",
  "contactPhone": "+1234567890",
  "assignedToId": "user-uuid"
}
```

#### 4. Update College
```http
PUT /api/v1/colleges/{collegeId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACTIVE",
  "totalRevenue": 100000,
  "avgRating": 4.5
}
```

#### 5. Delete College
```http
DELETE /api/v1/colleges/{collegeId}
Authorization: Bearer <token>
```

---

## 🗄️ Data Models

### Database Schema Relationships

```
User (Sales/Admin)
  ├── assignedLeads (Lead[]) - Leads assigned to this user
  └── assignedColleges (College[]) - Colleges assigned to this user

Lead
  ├── assignedTo (User?) - Sales person assigned
  ├── college (College?) - Linked college (if converted)
  └── activities (LeadActivity[]) - Activity history

College
  ├── assignedTo (User?) - Sales person assigned
  ├── assignedTrainerDetails (Trainer?) - Primary trainer
  ├── trainers (CollegeTrainer[]) - All assigned trainers
  ├── leads (Lead[]) - Associated leads
  ├── trainings (Training[]) - Training history
  └── trainerBookings (TrainerBooking[]) - Trainer bookings

LeadActivity
  └── lead (Lead) - Parent lead

CollegeTrainer
  ├── college (College) - Associated college
  └── trainer (Trainer) - Associated trainer
```

---

## 🔄 Workflows and Use Cases

### Workflow 1: New Lead to Active College

```
1. Public Form Submission
   POST /api/v1/leads (public)
   → Lead created with stage: LEAD_GENERATED
   → Welcome email/WhatsApp sent automatically

2. Sales Person Reviews Lead
   GET /api/v1/leads
   → Views new leads

3. Assign Lead to Sales Person
   PATCH /api/v1/leads/{id}/assign
   → Lead assigned to sales person
   → Activity logged

4. Contact Lead
   PATCH /api/v1/leads/{id}/status
   { stage: "CONTACTED" }
   → Stage updated
   → Activity logged

5. Provide Demo
   PATCH /api/v1/leads/{id}/status
   { stage: "DEMO_GIVEN" }
   → Stage updated

6. Negotiate Terms
   PATCH /api/v1/leads/{id}/status
   { stage: "IN_PROGRESS", notes: "Negotiating pricing" }
   → Stage updated

7. Convert Lead
   PATCH /api/v1/leads/{id}/status
   { stage: "CONVERT" }
   → College auto-created
   → Lead linked to college
   → Status: CONVERTED

8. Assign Trainer to College
   POST /api/v1/college-trainers
   { collegeId, trainerId }
   → Trainer assigned

9. Schedule Training
   POST /api/v1/trainings
   { collegeId, trainerId, startDate }
   → Training scheduled
```

### Workflow 2: Lead Management

```
1. Filter Leads by Status
   GET /api/v1/leads?status=ACTIVE&stage=IN_PROGRESS

2. Search Leads
   GET /api/v1/leads?search=ABC

3. Update Lead Priority
   PATCH /api/v1/leads/{id}/assign
   { priority: "URGENT" }

4. Schedule Follow-up
   PATCH /api/v1/leads/{id}/status
   { nextFollowUp: "2025-11-20T10:00:00Z" }

5. Add Notes
   PATCH /api/v1/leads/{id}/status
   { notes: "Customer interested in Java training" }
```

### Workflow 3: College Management

```
1. View College Details
   GET /api/v1/colleges/{id}
   → Includes leads, trainers, trainings

2. Update College Status
   PUT /api/v1/colleges/{id}
   { status: "ACTIVE" }

3. Assign Multiple Trainers
   POST /api/v1/college-trainers
   → Assign trainer 1
   POST /api/v1/college-trainers
   → Assign trainer 2

4. View Training History
   GET /api/v1/colleges/{id}
   → trainings array shows all trainings

5. Track Revenue
   PUT /api/v1/colleges/{id}
   { totalRevenue: 500000 }
```

---

## 🔐 Authentication & Authorization

### Public Endpoints (No Auth Required)
- `POST /api/v1/leads` - Create lead (rate limited)

### Authenticated Endpoints (Require JWT Token)
- All other lead endpoints
- All college endpoints

### Role Requirements
- **Admin**: Full access to all endpoints
- **Sales**: Can view and update leads/colleges assigned to them

---

## 📊 Statistics and Reporting

### Lead Statistics
- Total leads count
- Leads by stage (funnel visualization)
- Leads by source (marketing attribution)
- Leads by status
- Conversion rate
- Recent leads

### College Statistics
- Total colleges count
- Active partners count
- Total revenue
- Average rating
- Colleges by status
- Colleges by type

---

## 🚀 Key Features Summary

### Leads
✅ Public form submission (no auth required)  
✅ Automatic welcome email/WhatsApp  
✅ Lead assignment to sales team  
✅ Stage and status tracking  
✅ Activity logging  
✅ Follow-up scheduling  
✅ Priority management  
✅ Search and filtering  
✅ Statistics and reporting  
✅ Automatic college conversion  

### Colleges
✅ College creation and management  
✅ Trainer assignment  
✅ Training history tracking  
✅ Lead association  
✅ Revenue tracking  
✅ Rating management  
✅ Search and filtering  
✅ Statistics and reporting  

### Integration
✅ Lead → College automatic conversion  
✅ Activity tracking  
✅ User assignment  
✅ Multi-trainer support  
✅ Training scheduling  

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025  
**Maintained By**: UpSkillWay Development Team


