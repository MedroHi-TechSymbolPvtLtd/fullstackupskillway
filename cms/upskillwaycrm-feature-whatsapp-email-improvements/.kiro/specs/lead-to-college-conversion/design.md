# Design Document: Lead to College Conversion

## Overview

This feature implements an automated workflow that creates college entries when leads are converted to "converted" status. The system will leverage the existing CRM and CMS infrastructure to establish a seamless transition from lead management to educational institution onboarding.

## Architecture

### High-Level Flow
```
Lead Status Update → Conversion Detection → College Creation/Linking → Notification → Audit Logging
```

### System Components
- **Lead Management Service** (existing CRM service)
- **College Management Service** (existing CMS/College API)
- **Conversion Service** (new component)
- **Notification Service** (enhancement to existing)
- **Audit Service** (new component for tracking)

## Components and Interfaces

### 1. Lead Conversion Service

**Purpose**: Orchestrates the lead-to-college conversion process

**Location**: `src/services/leadConversionService.js`

**Key Methods**:
```javascript
class LeadConversionService {
  async handleLeadStatusUpdate(leadId, newStatus, oldStatus)
  async convertLeadToCollege(lead)
  async findExistingCollege(organizationName)
  async createCollegeFromLead(lead)
  async linkLeadToCollege(leadId, collegeId)
  async notifyConversionSuccess(lead, college, isNewCollege)
  async logConversionActivity(leadId, collegeId, action, details)
}
```

### 2. Enhanced CRM Service

**Modifications**: Add conversion hooks to existing lead update methods

**New Methods**:
```javascript
// In existing crmService.js
async updateLeadStatus(leadId, newStatus) {
  // Existing update logic
  // + Call conversion service if status changed to 'converted'
}

async updateLead(leadId, updateData) {
  // Existing update logic  
  // + Check for status changes and trigger conversion
}
```

### 3. College Creation Interface

**Data Mapping**: Lead fields → College fields
```javascript
const collegeMapping = {
  name: lead.organization || lead.name,
  contactEmail: lead.email,
  contactPhone: lead.phone,
  description: lead.requirement,
  status: 'ACTIVE',
  type: 'EDUCATIONAL_INSTITUTION',
  sourceLeadId: lead.id,
  createdAt: new Date().toISOString(),
  notes: `Created from converted lead: ${lead.name}`
}
```

### 4. Duplicate Detection Algorithm

**Strategy**: Multi-level matching to prevent duplicates

```javascript
async findExistingCollege(organizationName) {
  // Level 1: Exact match (case-insensitive, trimmed)
  // Level 2: Fuzzy matching for similar names
  // Level 3: Check for common variations (Inc, Corp, Ltd, etc.)
}
```

### 5. Notification System

**Enhancement**: Extend existing notification patterns

**Types**:
- Success notifications (college created/linked)
- Error notifications (conversion failed)
- Info notifications (duplicate found, linked to existing)

## Data Models

### Lead Model (existing)
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  organization: string, // Key field for college creation
  status: string, // 'new' | 'qualified' | 'converted'
  requirement: string,
  source: string,
  createdAt: string,
  updatedAt: string,
  // New fields
  linkedCollegeId: number | null,
  conversionDate: string | null
}
```

### College Model (existing + enhancements)
```javascript
{
  id: number,
  name: string,
  contactEmail: string,
  contactPhone: string,
  description: string,
  status: 'ACTIVE' | 'INACTIVE',
  type: string,
  // New fields for conversion tracking
  sourceLeadId: number | null,
  conversionDate: string | null,
  createdAt: string,
  updatedAt: string
}
```

### Conversion Audit Model (new)
```javascript
{
  id: number,
  leadId: number,
  collegeId: number,
  action: 'CREATED' | 'LINKED' | 'FAILED',
  details: object,
  timestamp: string,
  userId: number | null
}
```

## Error Handling

### Error Scenarios and Responses

1. **Missing Organization Name**
   - Fallback: Use lead name as college name
   - Log: Warning level audit entry

2. **API Failures**
   - College creation fails: Retry once, then log error
   - Lead update fails: Rollback college creation if applicable

3. **Duplicate Detection Failures**
   - Fallback: Create new college with suffix "(2)"
   - Log: Warning with duplicate detection failure details

4. **Network/Connectivity Issues**
   - Queue conversion for retry
   - Notify user of delayed processing

### Error Recovery
```javascript
async handleConversionError(lead, error) {
  // Log detailed error information
  // Attempt recovery based on error type
  // Notify relevant stakeholders
  // Queue for manual review if needed
}
```

## Testing Strategy

### Unit Tests
- Lead conversion service methods
- Duplicate detection algorithm
- Data mapping functions
- Error handling scenarios

### Integration Tests
- End-to-end conversion flow
- API interaction with college service
- Database transaction integrity
- Notification delivery

### Test Data Requirements
- Leads with various organization name formats
- Existing colleges for duplicate testing
- Edge cases (empty fields, special characters)
- Error simulation scenarios

### Test Coverage Goals
- 90%+ coverage for conversion service
- 100% coverage for critical path (lead status update → college creation)
- Error scenario coverage for all identified failure points

## Performance Considerations

### Optimization Strategies
1. **Batch Processing**: Handle multiple conversions efficiently
2. **Caching**: Cache college name lookups for duplicate detection
3. **Async Processing**: Non-blocking conversion for better UX
4. **Database Indexing**: Optimize college name searches

### Monitoring
- Conversion success/failure rates
- Processing time metrics
- Duplicate detection accuracy
- API response times

## Security Considerations

### Data Protection
- Validate all input data before processing
- Sanitize organization names for SQL injection prevention
- Ensure proper authentication for API calls

### Access Control
- Verify user permissions for lead status updates
- Log all conversion activities for audit trail
- Implement rate limiting for conversion requests

## Implementation Phases

### Phase 1: Core Conversion Logic
- Implement basic lead-to-college conversion
- Add duplicate detection
- Create audit logging

### Phase 2: Enhanced Features
- Advanced duplicate matching
- Batch conversion capabilities
- Enhanced error recovery

### Phase 3: Monitoring & Analytics
- Conversion metrics dashboard
- Performance optimization
- Advanced reporting features

## API Endpoints

### New Endpoints
```javascript
// Lead conversion endpoints
POST /api/v1/leads/{id}/convert-to-college
GET /api/v1/leads/{id}/conversion-status
GET /api/v1/conversions/audit-log

// College relationship endpoints  
GET /api/v1/colleges/{id}/source-lead
GET /api/v1/leads/{id}/linked-college
```

### Enhanced Endpoints
```javascript
// Enhanced lead update to trigger conversion
PUT /api/v1/leads/{id} // Now includes conversion logic
PATCH /api/v1/leads/{id}/status // Triggers conversion on 'converted' status
```

## Configuration

### Environment Variables
```javascript
// Conversion feature toggles
ENABLE_LEAD_CONVERSION=true
CONVERSION_RETRY_ATTEMPTS=3
DUPLICATE_DETECTION_THRESHOLD=0.8

// Notification settings
NOTIFY_CONVERSION_SUCCESS=true
NOTIFY_CONVERSION_ERRORS=true
```

### Feature Flags
- `leadConversionEnabled`: Master toggle for the feature
- `duplicateDetectionEnabled`: Toggle duplicate checking
- `conversionNotificationsEnabled`: Toggle user notifications