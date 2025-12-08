# Frontend Lead Stages Guide - Required vs Optional

## ❌ **NO, it's NOT compulsory to use all stage fields on the frontend!**

The backend supports all 14 lead stages, but your frontend can use a **simplified workflow** with only the essential stages.

---

## 📋 Required vs Optional Fields

### ✅ **Required Fields (Public Lead Creation)**

When creating a lead via public form, **ONLY email is required**:

```typescript
{
  email: string  // ✅ REQUIRED - Only this field is mandatory
}
```

**All other fields are optional:**
- `name` - Optional
- `organization` - Optional
- `phone` - Optional
- `requirement` - Optional
- `source` - Optional
- `stage` - **Auto-set to `LEAD_GENERATED`** (don't send this)
- `status` - **Auto-set to `ACTIVE`** (don't send this)
- `priority` - **Auto-set to `MEDIUM`** (don't send this)

### ✅ **Default Values (Auto-Set by Backend)**

When a lead is created, the backend automatically sets:
- `stage: LEAD_GENERATED` (default)
- `status: ACTIVE` (default)
- `priority: MEDIUM` (default)
- `createdAt: <current timestamp>`

**You don't need to send these fields!**

---

## 🎯 Recommended Minimal Frontend Workflow

### **Option 1: Simplified 5-Stage Workflow** (Recommended)

You can use just **5 essential stages** for a simple workflow:

```typescript
const SIMPLIFIED_STAGES = {
  NEW: 'LEAD_GENERATED',           // Lead just created
  CONTACTED: 'CONTACTED',          // Sales contacted them
  IN_PROGRESS: 'IN_PROGRESS',      // Working on it
  CONVERTED: 'CONVERT',            // Ready to convert (triggers college creation)
  DENIED: 'DENIED'                 // Rejected
};
```

**Frontend Implementation:**
```typescript
// Create lead - only send email (required)
POST /api/v1/leads
{
  "email": "lead@example.com",
  "name": "John Doe",              // Optional
  "organization": "ABC College"     // Optional
}

// Update lead stage - use simplified stages
PATCH /api/v1/leads/{id}/status
{
  "stage": "CONTACTED"              // Use one of your 5 stages
}
```

### **Option 2: Standard 7-Stage Workflow**

For a more detailed workflow, use these **7 stages**:

```typescript
const STANDARD_STAGES = {
  NEW: 'LEAD_GENERATED',
  CONTACTED: 'CONTACTED',
  DEMO: 'DEMO_GIVEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'CLOSED_WON',
  CONVERTED: 'CONVERT',            // Triggers college creation
  DENIED: 'DENIED'
};
```

### **Option 3: Full 14-Stage Workflow** (Advanced)

Only use all 14 stages if you need detailed tracking:

```typescript
const FULL_STAGES = {
  LEAD_GENERATED,
  CONTACTED,
  DEMO_GIVEN,
  TRAINING_BOOKED,
  START,
  IN_CONVERSATION,
  EMAIL_WHATSAPP,
  PENDING,
  IN_PROGRESS,
  CLOSED_WON,
  FEEDBACK_COLLECTED,
  CONVERT,
  CONVERTED,
  DENIED
};
```

---

## 🔄 Essential Stages for Conversion Flow

### **Critical Stages (Must Handle)**

These stages are **important for the conversion flow**:

1. **`LEAD_GENERATED`** - Auto-set on creation (don't send)
2. **`CONVERT`** - **REQUIRED** to trigger college creation
3. **`CONVERTED`** - Auto-set after conversion (don't send)

### **Conversion Flow (Minimal)**

```typescript
// Step 1: Create lead (public form)
POST /api/v1/leads
{
  "email": "contact@college.edu",
  "organization": "ABC College"  // Important for conversion
}

// Step 2: Work on lead (optional stages)
PATCH /api/v1/leads/{id}/status
{
  "stage": "CONTACTED"  // Optional - can skip intermediate stages
}

// Step 3: Convert lead (REQUIRED for college creation)
PATCH /api/v1/leads/{id}/status
{
  "stage": "CONVERT"  // ✅ This triggers college creation
}
```

---

## 📊 Frontend Implementation Examples

### **Minimal Lead Creation Form**

```typescript
// Frontend form - only email required
interface LeadForm {
  email: string;           // ✅ Required
  name?: string;            // Optional
  organization?: string;    // Optional (but recommended for conversion)
  phone?: string;           // Optional
  requirement?: string;     // Optional
}

// API call
const createLead = async (data: LeadForm) => {
  return await fetch('/api/v1/leads', {
    method: 'POST',
    body: JSON.stringify(data)  // Backend auto-sets stage, status, priority
  });
};
```

### **Simplified Stage Update**

```typescript
// Frontend stage selector - only show essential stages
const STAGE_OPTIONS = [
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CONVERT', label: 'Convert to College' },  // Important!
  { value: 'DENIED', label: 'Denied' }
];

// Update stage
const updateLeadStage = async (leadId: string, stage: string) => {
  return await fetch(`/api/v1/leads/${leadId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ stage })
  });
};
```

---

## ✅ What You MUST Handle on Frontend

### **1. Lead Creation**
- ✅ **Email field** (required)
- ✅ Optional: name, organization, phone, requirement, source
- ❌ **Don't send**: stage, status, priority (auto-set)

### **2. Stage Updates**
- ✅ **Stage field** (required when updating)
- ✅ Use simplified stages (5-7 stages recommended)
- ✅ **Must include `CONVERT`** stage for college creation
- ❌ **Don't need all 14 stages**

### **3. Status Updates**
- ✅ **Status is optional** (can be auto-set based on stage)
- ✅ Common statuses: `ACTIVE`, `CONVERTED`, `DENIED`

### **4. Priority**
- ✅ **Priority is optional** (defaults to `MEDIUM`)
- ✅ Can be set when assigning: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

---

## 🎨 Recommended Frontend UI Flow

### **Simple Lead Management UI**

```
┌─────────────────────────────────────┐
│  Lead List                          │
│  - Filter by: Stage, Status         │
│  - Search by: Name, Email, Org      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Lead Detail View                    │
│  - Basic Info (name, email, org)     │
│  - Stage Dropdown (5-7 options)      │
│  - Status Badge                      │
│  - Priority Selector                 │
│  - Notes Field                       │
│  - [Convert to College] Button       │
└─────────────────────────────────────┘
```

### **Stage Dropdown (Simplified)**

```typescript
<select onChange={(e) => updateStage(leadId, e.target.value)}>
  <option value="LEAD_GENERATED">New Lead</option>
  <option value="CONTACTED">Contacted</option>
  <option value="IN_PROGRESS">In Progress</option>
  <option value="CONVERT">Convert to College</option>  {/* Important! */}
  <option value="DENIED">Denied</option>
</select>
```

---

## 🚫 What You DON'T Need to Handle

### **❌ Don't Send These Fields:**

1. **On Lead Creation:**
   - `stage` - Auto-set to `LEAD_GENERATED`
   - `status` - Auto-set to `ACTIVE`
   - `priority` - Auto-set to `MEDIUM`
   - `id` - Auto-generated
   - `createdAt` - Auto-set
   - `updatedAt` - Auto-updated
   - `convertedAt` - Set on conversion
   - `lastContactAt` - Auto-updated on stage change

2. **On Stage Update:**
   - `convertedAt` - Auto-set when converting
   - `lastContactAt` - Auto-updated
   - `collegeId` - Auto-set on conversion

3. **All 14 Stages:**
   - You can use only 5-7 essential stages
   - Backend accepts all, but frontend doesn't need to show all

---

## 📝 API Examples

### **Example 1: Minimal Lead Creation**

```http
POST /api/v1/leads
Content-Type: application/json

{
  "email": "contact@college.edu"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "contact@college.edu",
    "stage": "LEAD_GENERATED",      // Auto-set
    "status": "ACTIVE",              // Auto-set
    "priority": "MEDIUM",             // Auto-set
    "createdAt": "2025-11-13T..."
  }
}
```

### **Example 2: Update Stage (Simplified)**

```http
PATCH /api/v1/leads/{id}/status
Content-Type: application/json

{
  "stage": "IN_PROGRESS"
}
```

### **Example 3: Convert Lead (Essential)**

```http
PATCH /api/v1/leads/{id}/status
Content-Type: application/json

{
  "stage": "CONVERT",
  "notes": "Ready to convert"
}
```

**Response includes auto-created college:**
```json
{
  "success": true,
  "data": {
    "id": "lead-uuid",
    "stage": "CONVERTED",            // Auto-updated
    "status": "CONVERTED",            // Auto-updated
    "convertedAt": "2025-11-13T...", // Auto-set
    "collegeId": "college-uuid",     // Auto-set
    "college": {
      "id": "college-uuid",
      "name": "ABC College",
      "status": "PROSPECTIVE"
    }
  }
}
```

---

## 🎯 Summary: What Frontend Needs

### ✅ **Required:**
- Email field (for lead creation)
- Stage field (for status updates)
- `CONVERT` stage option (for college creation)

### ✅ **Recommended:**
- 5-7 simplified stages (instead of all 14)
- Organization field (helps with conversion)
- Notes field (for tracking)

### ❌ **Not Required:**
- All 14 lead stages
- Status field (can be auto-set)
- Priority field (defaults to MEDIUM)
- All optional fields
- Auto-generated fields

---

## 💡 Best Practices

1. **Start Simple**: Use 5-7 essential stages initially
2. **Add Complexity Later**: Add more stages as needed
3. **Focus on Conversion**: Ensure `CONVERT` stage is easily accessible
4. **Auto-Hide Fields**: Don't show auto-generated fields to users
5. **Smart Defaults**: Let backend handle defaults

---

## 🔄 Migration Path

If you want to start simple and add more stages later:

```typescript
// Phase 1: Simple (5 stages)
const stages = ['LEAD_GENERATED', 'CONTACTED', 'IN_PROGRESS', 'CONVERT', 'DENIED'];

// Phase 2: Standard (7 stages)
const stages = ['LEAD_GENERATED', 'CONTACTED', 'DEMO_GIVEN', 'IN_PROGRESS', 'CLOSED_WON', 'CONVERT', 'DENIED'];

// Phase 3: Full (14 stages) - Only if needed
const stages = [/* all 14 stages */];
```

The backend supports all stages, so you can add more to your frontend later without backend changes!

---

**Bottom Line**: You only need to handle **email** for creation and **stage** for updates. Use a simplified 5-7 stage workflow. The backend handles all the rest automatically! 🎉


