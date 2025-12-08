# Trainer Functionality - Complete Overview & Flow

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Core Components](#core-components)
3. [Trainer Management](#trainer-management)
4. [Booking System](#booking-system)
5. [Assignment System](#assignment-system)
6. [Availability Management](#availability-management)
7. [Complete Workflows](#complete-workflows)
8. [API Endpoints](#api-endpoints)
9. [Data Flow Diagrams](#data-flow-diagrams)

---

## 🏗️ System Architecture

The trainer functionality is built on a modular architecture with three main systems:

### 1. **Trainer Management System**
- Manages trainer profiles, specializations, and status
- Handles trainer CRUD operations
- Tracks trainer availability and status

### 2. **Booking System**
- Manages time-based trainer bookings
- Handles scheduling and calendar management
- Supports both regular and admin bookings (with college assignment)

### 3. **Assignment System**
- Manages long-term trainer-to-college assignments
- Tracks assignment history and statistics
- Separate from bookings (assignments are ongoing relationships)

---

## 🧩 Core Components

### **Frontend Components**

#### 1. **Trainer Management Pages**
- `TrainerList.jsx` - List all trainers with filters
- `TrainerForm.jsx` - Create/Edit trainer profiles
- `TrainerView.jsx` - View trainer details
- `TrainerManagement.jsx` - Main trainer management dashboard

#### 2. **Booking Pages**
- `TrainerBookingList.jsx` - List all bookings
- `TrainerBookingForm.jsx` - Create/Edit regular bookings
- `AdminTrainerBookingForm.jsx` - Create admin bookings with college assignment
- `TrainerBookingView.jsx` - View booking details
- `TrainerBookingDashboard.jsx` - Main booking dashboard with stats

#### 3. **Assignment Components**
- `CollegeTrainerAssignment.jsx` - Manage trainer-to-college assignments
- Handles assignment creation, removal, and statistics

#### 4. **Supporting Components**
- `TrainerAvailabilityChecker.jsx` - Check trainer availability for time slots
- `TrainerCalendar.jsx` - Display trainer's calendar with bookings
- `TrainerStatusManager.jsx` - Manage trainer status (AVAILABLE, BUSY, etc.)
- `TrainerBookingCard.jsx` - Display booking card in lists
- `TrainerAvailabilityManager.jsx` - Manage trainer availability settings

### **Backend API Services**

#### 1. **Trainer API** (`trainerApi.js`)
- Base URL: `http://localhost:3000/api/v1`
- Handles trainer CRUD operations
- Manages trainer status and availability

#### 2. **Trainer Bookings API** (`trainerBookingsApi.js`)
- Base URL: `http://localhost:3000/api/v1`
- Handles booking CRUD operations
- Manages availability checking
- Supports admin bookings with college assignment

#### 3. **College Trainer API** (`collegeTrainerApi.js`)
- Base URL: `http://localhost:3000/api/v1`
- Handles trainer-to-college assignments
- Manages assignment history and statistics

---

## 👥 Trainer Management

### **Trainer Data Model**
```javascript
{
  id: UUID,
  name: String,
  email: String,
  phone: String,
  specialization: Array<String>,
  experience: Number,
  location: String,
  status: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE',
  rating: Number,
  hourlyRate: Number,
  trainingMode: 'ONLINE' | 'OFFLINE' | 'HYBRID',
  availability: Object,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### **Key Features**
1. **Trainer CRUD Operations**
   - Create, Read, Update, Delete trainers
   - Search and filter trainers
   - View trainer statistics

2. **Trainer Status Management**
   - Status types: `AVAILABLE`, `BUSY`, `NOT_AVAILABLE`
   - Real-time status updates
   - Status affects booking availability

3. **Trainer Search & Filtering**
   - Search by name, email, specialization
   - Filter by:
     - Specialization
     - Location
     - Experience level
     - Training mode
     - Availability status
     - Hourly rate range

### **API Endpoints**
- `GET /api/v1/trainers` - Get all trainers
- `GET /api/v1/trainers/:id` - Get trainer by ID
- `POST /api/v1/trainers` - Create trainer
- `PUT /api/v1/trainers/:id` - Update trainer
- `DELETE /api/v1/trainers/:id` - Delete trainer
- `PATCH /api/v1/trainers/:id/status` - Update trainer status
- `GET /api/v1/trainers/available` - Get available trainers
- `GET /api/v1/trainers/search` - Search trainers
- `GET /api/v1/trainers/stats` - Get trainer statistics

---

## 📅 Booking System

### **Booking Types**

#### 1. **Regular Booking** (`TrainerBookingForm.jsx`)
- Created by any user
- Requires: trainer, start time, end time, title, description
- Optional: `bookedBy` (user ID)
- Status: `ACTIVE`, `PENDING`, `COMPLETED`, `CANCELLED`

#### 2. **Admin Booking** (`AdminTrainerBookingForm.jsx`)
- Created by admins only
- Includes college assignment
- Can assign to college by:
  - College Name (`collegeName`)
  - College ID (`collegeId`)
- Optional: `bookedBy` (user UUID)
- Automatically links trainer to college for the booking period

### **Booking Data Model**
```javascript
{
  id: UUID,
  trainerId: UUID,
  bookedBy: UUID (optional),
  startTime: DateTime (ISO),
  endTime: DateTime (ISO),
  title: String,
  description: String,
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED',
  collegeId: UUID (optional, for admin bookings),
  collegeName: String (optional, for admin bookings),
  trainer: Trainer Object,
  bookedByUser: User Object,
  college: College Object (if assigned),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### **Booking Flow**

#### **Step 1: Select Trainer**
- User selects a trainer from the list
- System validates trainer exists and is active

#### **Step 2: Check Availability**
- User selects start and end time
- System calls `checkTrainerAvailability(trainerId, startTime, endTime)`
- Availability check considers:
  - Trainer's current status
  - Existing bookings in the time slot
  - Trainer's availability settings
- Returns: `{ isAvailable: boolean, reason: string }`

#### **Step 3: Create Booking**
- User fills in booking details (title, description)
- For admin bookings: select college (by name or ID)
- System validates:
  - Trainer is available
  - Time slot is valid (endTime > startTime)
  - Required fields are filled
- Creates booking via:
  - Regular: `POST /api/v1/trainer-bookings`
  - Admin: `POST /api/v1/trainer-bookings/admin`

#### **Step 4: Booking Confirmation**
- Booking is created with status `ACTIVE` or `PENDING`
- If admin booking with college: trainer is linked to college
- User receives confirmation

### **Booking Management Features**
1. **View Bookings**
   - List all bookings with filters
   - Filter by status, trainer, date range
   - Search by title, trainer name, user name

2. **Update Bookings**
   - Edit booking details
   - Change time slots (with availability check)
   - Update status

3. **Cancel Bookings**
   - Cancel bookings (status → `CANCELLED`)
   - Frees up trainer's time slot

4. **Booking Statistics**
   - Total bookings
   - Active bookings
   - Pending bookings
   - Completed bookings
   - Cancelled bookings

### **API Endpoints**
- `GET /api/v1/trainer-bookings` - Get all bookings
- `GET /api/v1/trainer-bookings/:id` - Get booking by ID
- `POST /api/v1/trainer-bookings` - Create regular booking
- `POST /api/v1/trainer-bookings/admin` - Create admin booking
- `PUT /api/v1/trainer-bookings/:id` - Update booking
- `PATCH /api/v1/trainer-bookings/:id/cancel` - Cancel booking
- `GET /api/v1/trainer-bookings/trainer/:trainerId` - Get bookings by trainer
- `GET /api/v1/trainer-bookings/user/:userId` - Get bookings by user
- `GET /api/v1/trainer-bookings/stats` - Get booking statistics
- `GET /api/v1/trainer-bookings/availability` - Check trainer availability
- `GET /api/v1/trainer-bookings/trainer/:trainerId/calendar` - Get trainer calendar

---

## 🏫 Assignment System

### **Assignment vs Booking**

**Assignment** (Long-term relationship):
- Ongoing relationship between trainer and college
- Not time-bound
- Managed separately from bookings
- Used for general trainer-college partnerships

**Booking** (Time-bound session):
- Specific time slot for training
- Has start and end time
- Can include college assignment (admin bookings)
- Temporary relationship for specific sessions

### **Assignment Data Model**
```javascript
{
  id: UUID,
  collegeId: UUID,
  trainerId: UUID,
  status: 'active' | 'inactive',
  notes: String,
  assignedAt: DateTime,
  unassignedAt: DateTime (optional),
  college: College Object,
  trainer: Trainer Object
}
```

### **Assignment Flow**

#### **Step 1: View Available Trainers**
- System fetches available trainers
- Filters by specialization, location, experience
- Shows trainer details: name, email, rating, experience, status

#### **Step 2: Select Trainer & College**
- User selects a trainer from available list
- User selects/enters college (by name or ID)
- Optional: Add assignment notes

#### **Step 3: Create Assignment**
- System calls `POST /api/v1/college-trainers/college/:collegeId`
- Payload: `{ trainerId, notes }`
- Creates assignment with status `active`
- Updates statistics

#### **Step 4: Assignment Management**
- View all assignments
- Filter by college, trainer, status
- Unassign trainer from college
- View assignment history

### **Assignment Features**
1. **Current Assignments Tab**
   - List all active assignments
   - Shows college, trainer, status, assignment date
   - Unassign functionality

2. **Available Trainers Tab**
   - List available trainers for assignment
   - Filter by specialization, location, experience
   - Assign trainer to college

3. **Statistics Tab**
   - Total colleges
   - Colleges with trainers
   - Available trainers
   - Assignment rate
   - Assignment status breakdown
   - Trainer utilization

### **API Endpoints**
- `GET /api/v1/college-trainers/available` - Get available trainers
- `POST /api/v1/college-trainers/college/:collegeId` - Assign trainer to college
- `DELETE /api/v1/college-trainers/college/:collegeId` - Unassign trainer
- `GET /api/v1/college-trainers/college/:collegeId` - Get college with trainer
- `GET /api/v1/college-trainers/assignments` - Get all assignments
- `GET /api/v1/college-trainers/trainer/:trainerId/colleges` - Get trainer's colleges
- `GET /api/v1/college-trainers/college/:collegeId/history` - Get assignment history
- `GET /api/v1/college-trainers/stats` - Get assignment statistics

---

## ⏰ Availability Management

### **Availability Checking**

The system checks trainer availability before creating bookings:

1. **Trainer Status Check**
   - Trainer must be `AVAILABLE` (not `BUSY` or `NOT_AVAILABLE`)

2. **Time Slot Conflict Check**
   - No existing bookings in the requested time slot
   - Checks for overlapping bookings

3. **Availability Settings Check**
   - Trainer's availability settings (if configured)
   - Working hours
   - Recurring patterns

### **Availability Check Flow**

```javascript
// User selects trainer and time slot
const availability = await trainerBookingsApi.checkTrainerAvailability(
  trainerId,
  startTime,  // ISO format
  endTime     // ISO format
);

// Response:
{
  success: true,
  data: {
    isAvailable: boolean,
    reason: string,  // If not available, explains why
    trainer: Trainer Object,
    conflictingBookings: Array  // If conflicts exist
  }
}
```

### **Availability Status Types**
- `AVAILABLE` - Trainer is available for booking
- `BUSY` - Trainer is currently busy
- `NOT_AVAILABLE` - Trainer is not available (may have set availability)

### **Real-time Availability Updates**
- When booking is created → trainer status may update
- When booking is cancelled → trainer becomes available
- Status can be manually updated via `TrainerStatusManager`

---

## 🔄 Complete Workflows

### **Workflow 1: Regular Booking (User)**

```
1. User navigates to "Create Booking"
2. Selects trainer from dropdown
3. Selects start time and end time
4. Clicks "Check Availability"
   → System checks trainer availability
   → Shows availability status
5. If available:
   → Fills in title and description
   → Optionally selects user (bookedBy)
   → Submits booking
   → System creates booking
   → Booking appears in list
6. If not available:
   → Shows reason
   → User can select different time slot
```

### **Workflow 2: Admin Booking with College Assignment**

```
1. Admin navigates to "Create Admin Booking"
2. Selects trainer from dropdown
3. Selects college (by name or ID)
4. Selects start time and end time
5. Clicks "Check Availability"
   → System checks trainer availability
6. If available:
   → Fills in title and description
   → Optionally sets bookedBy (user UUID)
   → Submits booking
   → System creates admin booking
   → Trainer is linked to college for booking period
   → Booking appears in list with college info
```

### **Workflow 3: Assign Trainer to College**

```
1. Admin navigates to "College-Trainer Assignments"
2. Clicks "Available Trainers" tab
3. Filters trainers (optional):
   → By specialization
   → By location
   → By experience
4. Clicks "Assign" on a trainer
5. Enters college name/ID
6. Adds notes (optional)
7. Clicks "Assign Trainer"
   → System creates assignment
   → Assignment appears in "Current Assignments"
   → Statistics update
```

### **Workflow 4: View Trainer Calendar**

```
1. Admin navigates to "Trainer Booking Dashboard"
2. Selects a trainer from trainer list
3. Clicks "Calendar" button
4. System fetches trainer's calendar:
   → All bookings for the trainer
   → Organized by date
   → Shows booking details
5. Admin can click on bookings to view details
```

### **Workflow 5: Cancel Booking**

```
1. User/Admin views booking list
2. Clicks "Cancel" on a booking
3. Confirmation modal appears
4. User confirms cancellation
5. System:
   → Updates booking status to CANCELLED
   → Frees up trainer's time slot
   → Updates statistics
   → Shows success message
```

---

## 📊 Data Flow Diagrams

### **Booking Creation Flow**

```
User Input
    ↓
[TrainerBookingForm]
    ↓
[TrainerAvailabilityChecker]
    ↓
API: checkTrainerAvailability()
    ↓
Backend: Validates availability
    ↓
Response: { isAvailable, reason }
    ↓
If Available:
    ↓
API: createBooking() or createAdminBooking()
    ↓
Backend: Creates booking
    ↓
If Admin Booking with College:
    → Links trainer to college
    ↓
Response: Booking created
    ↓
UI: Shows success, redirects to list
```

### **Assignment Creation Flow**

```
User Input
    ↓
[CollegeTrainerAssignment]
    ↓
User selects trainer & college
    ↓
API: assignTrainerToCollege(collegeId, { trainerId, notes })
    ↓
Backend: Creates assignment
    ↓
Response: Assignment created
    ↓
UI: Refreshes assignments list
    ↓
Statistics update
```

### **Availability Check Flow**

```
User selects trainer & time slot
    ↓
[TrainerAvailabilityChecker]
    ↓
API: checkTrainerAvailability(trainerId, startTime, endTime)
    ↓
Backend:
    1. Check trainer status
    2. Check existing bookings
    3. Check availability settings
    ↓
Response: { isAvailable, reason, trainer, conflictingBookings }
    ↓
UI: Shows availability status
    ↓
If available: Enable booking creation
If not: Show reason, disable booking
```

---

## 🔐 Authentication & Authorization

### **Authentication**
- All API calls require Bearer token
- Token stored in `localStorage` as `access_token` or `upskillway_access_token`
- Token automatically added to request headers via interceptors

### **Authorization Levels**

1. **Regular Users**
   - Can create regular bookings
   - Can view their own bookings
   - Cannot create admin bookings
   - Cannot manage assignments

2. **Admins**
   - Can create regular bookings
   - Can create admin bookings with college assignment
   - Can manage trainer-to-college assignments
   - Can view all bookings
   - Can cancel any booking
   - Can manage trainer status

---

## 🎨 UI/UX Features

### **Dashboard Features**
- Statistics cards (total, active, pending, completed, cancelled)
- Recent bookings list
- Upcoming sessions list
- Trainer management section
- Calendar view for selected trainer
- Status management
- Assignment management

### **Filtering & Search**
- Search by title, trainer name, user name
- Filter by status
- Filter by date range
- Filter trainers by specialization, location, experience

### **Real-time Updates**
- Booking status updates
- Trainer status updates
- Availability updates
- Statistics refresh

---

## 🐛 Error Handling

### **Common Error Scenarios**

1. **Trainer Not Available**
   - Shows reason (busy, already booked, not available)
   - Prevents booking creation
   - Suggests alternative time slots

2. **Invalid Time Slot**
   - Validates endTime > startTime
   - Validates future dates
   - Shows validation errors

3. **Authentication Errors**
   - 401: Redirects to login
   - Token refresh (if implemented)
   - Shows error message

4. **Rate Limiting**
   - 429: Shows "Server busy" message
   - Auto-retry after delay
   - User-friendly error message

---

## 📝 Key Files Reference

### **API Services**
- `src/services/api/trainerApi.js` - Trainer CRUD operations
- `src/services/api/trainerBookingsApi.js` - Booking operations
- `src/services/api/collegeTrainerApi.js` - Assignment operations
- `src/services/api/trainersApi.js` - Alternative trainer API (uses authApi)

### **Pages**
- `src/pages/crm/trainers/` - Trainer management pages
- `src/pages/crm/trainer-bookings/` - Booking pages

### **Components**
- `src/components/crm/CollegeTrainerAssignment.jsx` - Assignment management
- `src/components/crm/TrainerAvailabilityChecker.jsx` - Availability checking
- `src/components/crm/TrainerCalendar.jsx` - Calendar view
- `src/components/crm/TrainerStatusManager.jsx` - Status management

---

## 🚀 Future Enhancements (Potential)

1. **Recurring Bookings**
   - Support for weekly/monthly recurring sessions
   - Automatic booking creation

2. **Booking Reminders**
   - Email/SMS reminders before sessions
   - Notification system

3. **Trainer Ratings & Reviews**
   - Post-session ratings
   - Review system

4. **Advanced Availability**
   - Working hours configuration
   - Time zone support
   - Holiday management

5. **Integration with Calendar Systems**
   - Google Calendar sync
   - Outlook integration

6. **Reporting & Analytics**
   - Booking trends
   - Trainer utilization reports
   - Revenue tracking

---

## 📞 Support & Troubleshooting

### **Common Issues**

1. **Availability Check Fails**
   - Verify trainer ID is valid UUID
   - Check date/time format (ISO)
   - Verify authentication token

2. **Booking Creation Fails**
   - Check all required fields
   - Verify trainer availability
   - Check network connection

3. **Assignment Not Showing**
   - Refresh assignments list
   - Check college ID/name is correct
   - Verify trainer is available

---

## 📚 Summary

The trainer functionality is a comprehensive system that manages:
- **Trainers**: Profile management, status, availability
- **Bookings**: Time-based training sessions with availability checking
- **Assignments**: Long-term trainer-college relationships
- **Availability**: Real-time availability checking and management

The system supports both regular users (bookings) and admins (bookings + assignments), with robust error handling, filtering, and statistics tracking.

