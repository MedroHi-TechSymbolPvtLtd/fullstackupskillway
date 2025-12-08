# Lead to College Conversion Flow

## Overview
This document explains the automatic lead-to-college conversion flow implemented in the UpSkillWay CMS.

## Flow Description

### Step 1: Lead Conversion
When an admin or sales person marks a lead as **CONVERTED**, the system automatically:

1. **Creates a College record** from the lead data (if organization name exists)
2. **Links the lead** to the newly created college
3. **Keeps the lead** in the database with status "CONVERTED" and a reference to the college

### Step 2: Data Mapping

When a lead is converted, the following data is mapped to the college:

| Lead Field | College Field |
|------------|---------------|
| `organization` | `name` (required) |
| `name` | `contactPerson` |
| `email` | `contactEmail` |
| `phone` | `contactPhone` |
| - | `status` = "PROSPECTIVE" |
| - | `assignedToId` = null (to be assigned manually) |

### Step 3: Manual Trainer Assignment

After the college is created:
- The college appears in the colleges list with status "PROSPECTIVE"
- Admin/Sales person can manually assign a trainer to the college
- This is done via the "Assign Trainer" endpoint or UI

## API Endpoints

### Convert a Lead

**Endpoint:** `PUT /api/v1/leads/:id/status`

**Request Body:**
```json
{
  "stage": "CONVERT",
  "notes": "Lead successfully converted to college"
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
    "email": "john@example.com",
    "organization": "ABC College",
    "stage": "CONVERTED",
    "status": "CONVERTED",
    "convertedAt": "2025-11-08T10:00:00.000Z",
    "collegeId": "college-uuid",
    "college": {
      "id": "college-uuid",
      "name": "ABC College",
      "status": "PROSPECTIVE"
    }
  }
}
```

### Create College Manually (Optional)

**Endpoint:** `POST /api/v1/colleges`

**Request Body:**
```json
{
  "name": "XYZ College",
  "city": "Mumbai",
  "state": "Maharashtra",
  "contactPerson": "Jane Smith",
  "contactEmail": "jane@xyzcollege.com",
  "contactPhone": "+919876543210"
}
```

**Note:** `assignedToId` is **optional** and can be omitted during creation.

### Assign Trainer to College

**Endpoint:** `POST /api/v1/colleges/:id/assign-trainer`

**Request Body:**
```json
{
  "trainerId": "trainer-uuid"
}
```

## Who Can Convert Leads?

Both **Admin** and **Sales** roles can convert leads.

## Conversion Triggers

A college is automatically created when:
- Lead `stage` is changed to "CONVERT" OR "CONVERTED"
- Lead `status` is changed to "CONVERTED"

## Important Notes

1. **No Duplicate Colleges**: If a college with the same name already exists, the lead will be linked to the existing college instead of creating a new one.

2. **Organization Name Required**: The lead must have an `organization` field filled in to create a college. If missing, the lead will be marked as converted but no college will be created.

3. **assignedToId is Optional**: Colleges created from converted leads will have `assignedToId = null`. This allows manual assignment later.

4. **Lead Preservation**: Converted leads are NOT deleted. They remain in the database with:
   - `status` = "CONVERTED"
   - `stage` = "CONVERTED"
   - `collegeId` = reference to the created/linked college
   - `convertedAt` = timestamp of conversion

5. **Activity Logs**: All conversions are logged in the lead activities for audit trail.

## Example Workflow

1. **Sales person receives a lead:**
   ```
   Name: John Doe
   Email: john@abccollege.edu
   Organization: ABC College
   Phone: +919876543210
   ```

2. **Sales person updates lead stage to "CONVERT":**
   - System automatically creates "ABC College" in colleges table
   - College has no assigned trainer yet
   - Lead is marked as CONVERTED and linked to the college

3. **Admin assigns a trainer:**
   - Admin goes to colleges list
   - Finds "ABC College" (status: PROSPECTIVE)
   - Assigns a trainer manually

4. **College is now ready for training:**
   - College has assigned trainer
   - Can schedule training sessions
   - Can track progress

## Testing the Flow

### Test Case 1: Convert Lead with Organization

```bash
# Step 1: Create a lead
POST /api/v1/leads
{
  "name": "Test User",
  "email": "test@testcollege.com",
  "organization": "Test College",
  "phone": "+919999999999"
}

# Step 2: Convert the lead
PUT /api/v1/leads/{lead-id}/status
{
  "stage": "CONVERT",
  "notes": "Test conversion"
}

# Step 3: Verify college was created
GET /api/v1/colleges?search=Test College

# Step 4: Assign trainer to college
POST /api/v1/colleges/{college-id}/assign-trainer
{
  "trainerId": "{trainer-id}"
}
```

### Test Case 2: Convert Lead without Organization

```bash
# Step 1: Create a lead without organization
POST /api/v1/leads
{
  "name": "Test User 2",
  "email": "test2@example.com",
  "phone": "+919999999998"
}

# Step 2: Try to convert
PUT /api/v1/leads/{lead-id}/status
{
  "stage": "CONVERT"
}

# Result: Lead will be marked as CONVERTED but no college will be created
```

## Database Schema Changes

No schema changes were required. The existing schema already supports:
- Optional `assignedToId` in College model
- `collegeId` reference in Lead model
- All necessary fields for the conversion flow

## Benefits of This Flow

1. **Automation**: Reduces manual data entry
2. **Data Integrity**: Ensures leads and colleges are properly linked
3. **Flexibility**: Allows manual trainer assignment after college creation
4. **Audit Trail**: Maintains complete history of lead conversion
5. **No Data Loss**: Keeps converted leads for reference and reporting
