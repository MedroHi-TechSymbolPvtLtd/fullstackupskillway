# Trainer & Trainer Booking Functionality - Complete Flow

## 📋 Table of Contents

1. [Overview](#overview)
2. [Trainer Management](#trainer-management)
3. [Trainer Booking System](#trainer-booking-system)
4. [Data Models](#data-models)
5. [Complete API Endpoints](#complete-api-endpoints)
6. [Workflows](#workflows)
7. [Integration Examples](#integration-examples)

---

## 🎯 Overview

The Trainer and Trainer Booking system manages:
- **Trainer Profiles**: Trainer information, specializations, availability, ratings
- **Trainer Bookings**: Time-based bookings for trainers with college assignments
- **Availability Management**: Real-time availability checking and calendar views
- **Status Tracking**: Automatic status updates based on bookings

### Key Features

1. **Trainer Management**
   - CRUD operations for trainers
   - Specialization and skill tracking
   - Rating and feedback system
   - Status management (AVAILABLE, BOOKED, NOT_AVAILABLE, INACTIVE)
   - College assignments

2. **Trainer Booking**
   - Time-slot based bookings
   - Availability checking
   - College assignment integration
   - Automatic status updates
   - Booking cancellation and completion
   - Calendar view

3. **Availability System**
   - Real-time availability checking
   - Overlap detection
   - Calendar integration
   - Auto-expiration of bookings

---

## 👨‍🏫 Trainer Management

### Trainer Data Model

```typescript
{
  id: string (UUID)
  name: string
  email: string (unique)
  phone: string?
  specialization: string[]  // e.g., ["Java", "Python", "React"]
  experience: number?       // Years of experience
  rating: number?           // Average rating (0-5)
  totalSessions: number     // Total sessions conducted
  nextSlot: DateTime?       // Next available slot
  location: string?
  trainingMode: TrainingMode[]  // [ONLINE, OFFLINE, HYBRID]
  languages: string[]       // Languages trainer can teach in
  feedbackScore: number?    // Overall feedback score
  status: TrainerStatus     // AVAILABLE, BOOKED, NOT_AVAILABLE, INACTIVE
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  colleges: CollegeTrainer[]  // Assigned colleges
  bookings: TrainerBooking[]  // All bookings
  trainings: Training[]       // Training sessions
}
```

### Trainer Status Enum

```typescript
enum TrainerStatus {
  AVAILABLE      // Trainer is available for booking
  BOOKED         // Trainer has active bookings
  NOT_AVAILABLE  // Trainer is temporarily unavailable
  INACTIVE       // Trainer is inactive/deactivated
}
```

### Training Mode Enum

```typescript
enum TrainingMode {
  ONLINE   // Online training
  OFFLINE  // In-person training
  HYBRID   // Combination of online and offline
}
```

---

## 📅 Trainer Booking System

### Booking Data Model

```typescript
{
  id: string (UUID)
  trainerId: string (UUID)      // Required
  collegeId: string? (UUID)      // Optional college assignment
  bookedBy: string? (UUID)       // User who created booking (optional)
  startTime: DateTime            // Required
  endTime: DateTime              // Required
  title: string                  // Required
  description: string?
  status: BookingStatus          // ACTIVE, CANCELLED, COMPLETED
  createdAt: DateTime
  updatedAt: DateTime
  
  // Relations
  trainer: Trainer               // Trainer details
  bookedByUser: User?            // User who booked
  college: College?              // Assigned college
}
```

### Booking Status Enum

```typescript
enum BookingStatus {
  ACTIVE     // Booking is active
  CANCELLED  // Booking was cancelled
  COMPLETED  // Booking is completed
}
```

---

## 🔄 Complete Workflows

### Workflow 1: Create Trainer

```
┌─────────────────────────────────────┐
│  Admin Creates Trainer Profile      │
│  POST /api/v1/trainers              │
│  {                                   │
│    name: "John Doe",                │
│    email: "john@example.com",       │
│    specialization: ["Java", "React"]│
│    trainingMode: ["ONLINE", "HYBRID"]│
│    status: "AVAILABLE"              │
│  }                                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Validates:                  │
│  - Email uniqueness                 │
│  - Required fields                  │
│  - Data format                      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Trainer Created                    │
│  - Default status: AVAILABLE        │
│  - totalSessions: 0                 │
│  - Returns trainer object           │
└─────────────────────────────────────┘
```

### Workflow 2: Book Trainer (Standard)

```
┌─────────────────────────────────────┐
│  User Checks Availability           │
│  GET /api/v1/trainer-bookings/      │
│       availability?                  │
│       trainerId=xxx&                │
│       startTime=2025-11-15T10:00&   │
│       endTime=2025-11-15T12:00      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Checks:                     │
│  ✓ Trainer exists                   │
│  ✓ Trainer status is AVAILABLE      │
│  ✓ No overlapping bookings          │
│  ✓ Time is in future                │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Create Booking                     │
│  POST /api/v1/trainer-bookings      │
│  {                                   │
│    trainerId: "uuid",               │
│    startTime: "2025-11-15T10:00",  │
│    endTime: "2025-11-15T12:00",     │
│    title: "Java Training Session",  │
│    collegeId: "uuid" (optional)     │
│  }                                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Actions:                    │
│  1. Create booking record           │
│  2. Update trainer status → BOOKED  │
│  3. Return booking with details     │
└─────────────────────────────────────┘
```

### Workflow 3: Admin Booking with College Assignment

```
┌─────────────────────────────────────┐
│  Admin Creates Booking               │
│  POST /api/v1/trainer-bookings/admin │
│  {                                   │
│    trainerId: "uuid",               │
│    collegeName: "ABC College",      │
│    startTime: "2025-11-15T10:00",   │
│    endTime: "2025-11-15T12:00",     │
│    title: "Training Session",        │
│    bookedBy: "user-uuid" (optional) │
│  }                                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Actions:                    │
│  1. Check trainer availability      │
│  2. Resolve collegeName → collegeId  │
│  3. Verify college exists            │
│  4. Create booking with college     │
│  5. Update trainer status → BOOKED  │
└─────────────────────────────────────┘
```

### Workflow 4: Cancel Booking

```
┌─────────────────────────────────────┐
│  Cancel Booking                     │
│  PATCH /api/v1/trainer-bookings/    │
│       {id}/cancel                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Actions:                    │
│  1. Update booking status → CANCELLED│
│  2. Check trainer's other bookings  │
│  3. If no active bookings:          │
│     → Set trainer status → AVAILABLE│
└─────────────────────────────────────┘
```

### Workflow 5: Auto-Complete Expired Bookings

```
┌─────────────────────────────────────┐
│  Cron Job / Manual Trigger          │
│  PATCH /api/v1/trainer-bookings/    │
│       expired                        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  System Finds:                      │
│  - All ACTIVE bookings              │
│  - Where endTime < now              │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  For Each Expired Booking:          │
│  1. Update status → COMPLETED        │
│  2. Check trainer's other bookings  │
│  3. If no active bookings:          │
│     → Set trainer status → AVAILABLE│
└─────────────────────────────────────┘
```

---

## 📡 Complete API Endpoints

### Trainer Endpoints

#### 1. Get All Trainers
```http
GET /api/v1/trainers?page=1&limit=10&search=Java&status=AVAILABLE&specialization=React
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)
- `search` (string) - Search in name, email, location, specialization
- `status` (TrainerStatus) - Filter by status
- `specialization` (string) - Filter by specialization

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "specialization": ["Java", "React", "Node.js"],
      "experience": 5,
      "rating": 4.5,
      "totalSessions": 120,
      "nextSlot": "2025-11-15T10:00:00Z",
      "location": "Mumbai",
      "trainingMode": ["ONLINE", "HYBRID"],
      "languages": ["English", "Hindi"],
      "feedbackScore": 4.3,
      "status": "AVAILABLE",
      "colleges": [
        {
          "college": {
            "id": "college-uuid",
            "name": "ABC College",
            "location": "Mumbai"
          }
        }
      ],
      "_count": {
        "trainings": 25
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

#### 2. Get Trainer by ID
```http
GET /api/v1/trainers/{trainerId}
Authorization: Bearer <token>
```

**Response includes:**
- Trainer details
- Assigned colleges
- Recent trainings (last 10)
- All bookings

#### 3. Create Trainer
```http
POST /api/v1/trainers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "specialization": ["Java", "React"],
  "experience": 5,
  "location": "Mumbai",
  "trainingMode": ["ONLINE", "HYBRID"],
  "languages": ["English", "Hindi"],
  "status": "AVAILABLE"
}
```

**Required Fields:**
- `name`
- `email` (must be unique)

**Response:** `201 Created`

#### 4. Update Trainer
```http
PUT /api/v1/trainers/{trainerId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "specialization": ["Java", "React", "Node.js"],
  "rating": 4.7,
  "status": "AVAILABLE"
}
```

#### 5. Delete Trainer
```http
DELETE /api/v1/trainers/{trainerId}
Authorization: Bearer <token>
```

**Note:** Cannot delete trainer with active trainings (SCHEDULED or IN_PROGRESS)

#### 6. Get Trainer Statistics
```http
GET /api/v1/trainers/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTrainers": 50,
    "activeTrainers": 35,
    "avgRating": 4.3,
    "totalSessions": 1500,
    "trainersByStatus": [
      { "status": "AVAILABLE", "count": 25 },
      { "status": "BOOKED", "count": 10 }
    ],
    "trainersBySpecialization": [...],
    "topRatedTrainers": [...]
  }
}
```

---

### Trainer Booking Endpoints

#### 1. Check Trainer Availability
```http
GET /api/v1/trainer-bookings/availability?trainerId={uuid}&startTime=2025-11-15T10:00:00Z&endTime=2025-11-15T12:00:00Z
Authorization: Bearer <token>
```

**Response (Available):**
```json
{
  "success": true,
  "data": {
    "isAvailable": true,
    "reason": "Trainer is available",
    "trainer": {
      "id": "uuid",
      "name": "John Doe",
      "status": "AVAILABLE"
    }
  }
}
```

**Response (Not Available):**
```json
{
  "success": true,
  "data": {
    "isAvailable": false,
    "reason": "Trainer has overlapping bookings",
    "overlappingBookings": [
      {
        "id": "booking-uuid",
        "title": "Existing Booking",
        "startTime": "2025-11-15T09:00:00Z",
        "endTime": "2025-11-15T11:00:00Z"
      }
    ],
    "trainer": {
      "id": "uuid",
      "name": "John Doe",
      "status": "BOOKED"
    }
  }
}
```

#### 2. Create Trainer Booking
```http
POST /api/v1/trainer-bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "trainerId": "trainer-uuid",
  "collegeId": "college-uuid",  // Optional
  "startTime": "2025-11-15T10:00:00Z",
  "endTime": "2025-11-15T12:00:00Z",
  "title": "Java Training Session",
  "description": "Introduction to Java programming"
}
```

**Required Fields:**
- `trainerId`
- `startTime` (must be in future)
- `endTime` (must be after startTime)
- `title`

**Response:** `201 Created`

**Auto Actions:**
- Trainer status updated to `BOOKED`
- Booking created with status `ACTIVE`

#### 3. Admin Create Booking (with College Assignment)
```http
POST /api/v1/trainer-bookings/admin
Authorization: Bearer <token>
Content-Type: application/json

{
  "trainerId": "trainer-uuid",
  "collegeName": "ABC College",  // Alternative to collegeId
  "collegeId": "college-uuid",   // Alternative to collegeName
  "bookedBy": "user-uuid",       // Optional, defaults to admin
  "startTime": "2025-11-15T10:00:00Z",
  "endTime": "2025-11-15T12:00:00Z",
  "title": "Training Session",
  "description": "Optional description"
}
```

**Features:**
- Can use `collegeName` instead of `collegeId`
- System resolves college name to ID
- Can assign booking to any user via `bookedBy`

#### 4. Get All Bookings
```http
GET /api/v1/trainer-bookings?page=1&limit=10&trainerId={uuid}&collegeId={uuid}&status=ACTIVE&startDate=2025-11-01&endDate=2025-11-30
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`, `limit`
- `trainerId` - Filter by trainer
- `collegeId` - Filter by college
- `collegeName` - Filter by college name (case-insensitive)
- `status` - Filter by booking status
- `startDate` - Filter bookings starting from date
- `endDate` - Filter bookings ending before date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "booking-uuid",
      "trainerId": "trainer-uuid",
      "collegeId": "college-uuid",
      "bookedBy": "user-uuid",
      "startTime": "2025-11-15T10:00:00Z",
      "endTime": "2025-11-15T12:00:00Z",
      "title": "Java Training Session",
      "description": "Introduction to Java",
      "status": "ACTIVE",
      "trainer": {
        "id": "trainer-uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "specialization": ["Java", "React"]
      },
      "bookedByUser": {
        "id": "user-uuid",
        "name": "Admin User",
        "email": "admin@upskillway.com"
      },
      "college": {
        "id": "college-uuid",
        "name": "ABC College",
        "location": "Mumbai"
      }
    }
  ],
  "pagination": {...}
}
```

#### 5. Get Booking by ID
```http
GET /api/v1/trainer-bookings/{bookingId}
Authorization: Bearer <token>
```

#### 6. Update Booking
```http
PUT /api/v1/trainer-bookings/{bookingId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "2025-11-15T11:00:00Z",  // Optional
  "endTime": "2025-11-15T13:00:00Z",    // Optional
  "title": "Updated Title",             // Optional
  "description": "Updated description", // Optional
  "collegeId": "new-college-uuid",      // Optional
  "status": "ACTIVE"                    // Optional
}
```

**Note:** If updating time, system checks for conflicts with other bookings

#### 7. Cancel Booking
```http
PATCH /api/v1/trainer-bookings/{bookingId}/cancel
Authorization: Bearer <token>
```

**Auto Actions:**
- Booking status → `CANCELLED`
- If trainer has no other active bookings → Trainer status → `AVAILABLE`

#### 8. Get Trainer Availability Calendar
```http
GET /api/v1/trainer-bookings/trainer/{trainerId}/calendar?startDate=2025-11-01T00:00:00Z&endDate=2025-11-30T23:59:59Z
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trainer": {
      "id": "trainer-uuid",
      "name": "John Doe",
      "status": "BOOKED"
    },
    "bookings": [
      {
        "id": "booking-uuid",
        "title": "Java Training",
        "startTime": "2025-11-15T10:00:00Z",
        "endTime": "2025-11-15T12:00:00Z",
        "description": "Training session"
      }
    ],
    "availability": "unavailable"
  }
}
```

#### 9. Update Trainer Status Manually
```http
PATCH /api/v1/trainer-bookings/trainer/{trainerId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "NOT_AVAILABLE",
  "notes": "Trainer on leave"
}
```

**Validation:**
- Cannot set to `AVAILABLE` if trainer has active bookings

#### 10. Update Expired Bookings (Admin)
```http
PATCH /api/v1/trainer-bookings/expired
Authorization: Bearer <token>
```

**Action:**
- Finds all ACTIVE bookings where `endTime < now`
- Updates them to `COMPLETED`
- Sets trainer status to `AVAILABLE` if no other active bookings

#### 11. Get Booking Statistics
```http
GET /api/v1/trainer-bookings/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "activeBookings": 25,
    "cancelledBookings": 10,
    "completedBookings": 115,
    "bookingsByStatus": [
      { "status": "ACTIVE", "count": 25 },
      { "status": "COMPLETED", "count": 115 },
      { "status": "CANCELLED", "count": 10 }
    ],
    "trainersByStatus": [
      { "status": "AVAILABLE", "count": 20 },
      { "status": "BOOKED", "count": 15 }
    ]
  }
}
```

---

## 🔄 Status Management Flow

### Trainer Status Transitions

```
AVAILABLE
    │
    ├──→ BOOKED (when booking created)
    │
    ├──→ NOT_AVAILABLE (manual update)
    │
    └──→ INACTIVE (manual update)

BOOKED
    │
    ├──→ AVAILABLE (when all bookings cancelled/completed)
    │
    └──→ NOT_AVAILABLE (manual override)

NOT_AVAILABLE
    │
    └──→ AVAILABLE (manual update)

INACTIVE
    │
    └──→ AVAILABLE (manual reactivation)
```

### Booking Status Transitions

```
ACTIVE
    │
    ├──→ CANCELLED (manual cancellation)
    │
    └──→ COMPLETED (auto when endTime < now)

CANCELLED (final state)
COMPLETED (final state)
```

---

## 🎯 Use Cases

### Use Case 1: Book Trainer for College Training

1. **Search Available Trainers**
   ```
   GET /api/v1/trainers?specialization=Java&status=AVAILABLE
   ```

2. **Check Trainer Availability**
   ```
   GET /api/v1/trainer-bookings/availability?trainerId=xxx&startTime=...&endTime=...
   ```

3. **Create Booking with College**
   ```
   POST /api/v1/trainer-bookings/admin
   {
     "trainerId": "xxx",
     "collegeName": "ABC College",
     "startTime": "2025-11-15T10:00:00Z",
     "endTime": "2025-11-15T12:00:00Z",
     "title": "Java Training Session"
   }
   ```

### Use Case 2: View Trainer Calendar

1. **Get Trainer Calendar**
   ```
   GET /api/v1/trainer-bookings/trainer/{trainerId}/calendar?startDate=2025-11-01&endDate=2025-11-30
   ```

2. **Display in Calendar UI**
   - Show all bookings for the month
   - Highlight available slots
   - Show trainer status

### Use Case 3: Cancel and Reschedule

1. **Cancel Existing Booking**
   ```
   PATCH /api/v1/trainer-bookings/{bookingId}/cancel
   ```

2. **Create New Booking**
   ```
   POST /api/v1/trainer-bookings
   {
     "trainerId": "xxx",
     "startTime": "2025-11-20T10:00:00Z",  // New time
     "endTime": "2025-11-20T12:00:00Z",
     "title": "Rescheduled Training"
   }
   ```

---

## 🔗 Integration with Other Systems

### College Integration

- **College Assignment**: Bookings can be assigned to colleges
- **College Trainer Assignment**: Trainers can be pre-assigned to colleges via `CollegeTrainer` table
- **College Filtering**: Filter bookings by college ID or name

### User Integration

- **Booked By**: Track which user created the booking
- **Optional Assignment**: `bookedBy` is optional for admin bookings

### Training Integration

- **Training Records**: Trainers have related `Training` records
- **Session Tracking**: `totalSessions` tracks completed trainings

---

## 📊 Key Features

### 1. Availability Checking

- **Real-time Validation**: Checks trainer status and overlapping bookings
- **Conflict Detection**: Prevents double-booking
- **Future Time Validation**: Ensures bookings are in the future

### 2. Automatic Status Management

- **Auto-Book**: Trainer status → `BOOKED` when booking created
- **Auto-Available**: Trainer status → `AVAILABLE` when all bookings end/cancel
- **Auto-Complete**: Bookings → `COMPLETED` when `endTime` passes

### 3. College Assignment

- **Flexible Assignment**: Can assign by `collegeId` or `collegeName`
- **Name Resolution**: System resolves college names to IDs
- **Optional Assignment**: Bookings can exist without college assignment

### 4. Search and Filtering

- **Multi-criteria Search**: Search by name, email, location, specialization
- **Status Filtering**: Filter by trainer or booking status
- **Date Range Filtering**: Filter bookings by date range
- **College Filtering**: Filter by college ID or name

---

## 🚨 Error Handling

### Common Errors

1. **Trainer Not Found** (404)
   ```
   { "error": "NOT_FOUND", "message": "Trainer not found" }
   ```

2. **Trainer Not Available** (409)
   ```
   { "error": "CONFLICT", "message": "Cannot book trainer: Trainer has overlapping bookings" }
   ```

3. **Invalid Time Range** (400)
   ```
   { "error": "BAD_REQUEST", "message": "End time must be after start time" }
   ```

4. **Past Time** (400)
   ```
   { "error": "BAD_REQUEST", "message": "Start time must be in the future" }
   ```

5. **Cannot Delete Trainer** (409)
   ```
   { "error": "CONFLICT", "message": "Cannot delete trainer with active trainings" }
   ```

---

## 📝 Notes

1. **Email Uniqueness**: Trainer email must be unique
2. **Status Validation**: Cannot set trainer to `AVAILABLE` if they have active bookings
3. **Time Validation**: `endTime` must be after `startTime`, and `startTime` must be in future
4. **College Name Resolution**: Case-insensitive college name matching
5. **Auto-Expiration**: Run `PATCH /trainer-bookings/expired` periodically (cron job) to auto-complete expired bookings
6. **Optional Fields**: `collegeId`, `bookedBy` are optional in bookings
7. **Transaction Safety**: Booking creation and cancellation use database transactions

---

## 🎯 Frontend Integration Checklist

- [ ] Trainer list with search and filters
- [ ] Trainer detail view with bookings and colleges
- [ ] Availability checking before booking
- [ ] Booking creation form with time picker
- [ ] Calendar view for trainer availability
- [ ] Booking list with filters
- [ ] Booking cancellation
- [ ] Booking update/reschedule
- [ ] Trainer status management
- [ ] Statistics dashboard

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025

