# Email API Implementation Summary

## Overview
Successfully integrated the email sending API (`/api/v1/email/sendAuthorization`) into the Email Manager component for sending emails to single persons.

## API Endpoint Details

### Send Email Endpoint
```
POST http://localhost:3000/api/v1/email/sendAuthorization
```

### Email History Endpoint
```
GET http://localhost:3000/api/v1/email/history
```

### Authentication
```
Authorization: Bearer <access_token>
```

### Request Payload
```json
{
  "to": "recipient@example.com",
  "toName": "Recipient Name",
  "subject": "Email Subject",
  "html": "<h1>HTML Content</h1><p>Email body</p>",
  "text": "Plain text version of email",
  "from": {
    "name": "UpSkillWay",
    "email": "info@upskillway.com"
  },
  "transport": "api",
  "queue": false
}
```

### Send Email Response
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "success": true,
    "messageId": "<unique-message-id>",
    "status": "sent",
    "method": "api",
    "logId": "uuid",
    "timestamp": "2025-11-29T06:47:56.790Z"
  },
  "timestamp": "2025-11-29T06:47:56.805Z"
}
```

### Email History Request Parameters
```
?page=1&limit=10&status=sent&search=keyword
```

### Email History Response
```json
{
  "success": true,
  "data": [
    {
      "id": "log-id",
      "to": "recipient@example.com",
      "from": {
        "name": "UpSkillWay",
        "email": "info@upskillway.com"
      },
      "subject": "Email Subject",
      "text": "Plain text content",
      "html": "<p>HTML content</p>",
      "status": "sent",
      "messageId": "<unique-message-id>",
      "method": "api",
      "timestamp": "2025-11-29T06:47:56.790Z",
      "createdAt": "2025-11-29T06:47:56.790Z"
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

## Files Created/Modified

### 1. New File: `src/services/api/emailApi.js`
Created a comprehensive email API service with the following methods:

#### `sendEmail(emailData)`
- Sends email to a single person
- Validates required fields (to, subject, content)
- Automatically converts text to HTML and vice versa
- Uses default sender info if not provided
- Returns API response with success status

**Parameters:**
- `to` (required): Recipient email address
- `toName` (optional): Recipient name
- `subject` (required): Email subject
- `html` (optional): HTML content
- `text` (optional): Plain text content
- `from` (optional): Sender info {name, email}
- `transport` (optional): 'api' or 'smtp' (default: 'api')
- `queue` (optional): Queue email (default: false)

#### `sendBulkEmails(recipients, subject, html, text, from)`
- Sends emails to multiple recipients
- Queues emails for better performance
- Returns results for each recipient

#### `sendTemplateEmail(emailData)`
- Sends email using predefined templates
- Supports template variables

#### `getEmailHistory(params)`
- Fetches email sending history from `/api/v1/email/history`
- Supports pagination (page, limit)
- Supports filtering (status, search)
- Includes cache busting
- Returns transformed email data

#### `getEmailStats()`
- Gets email statistics
- Includes cache busting

### 2. Modified: `src/components/sales/EmailManager.jsx`

#### Updated `fetchEmails` Function
- Integrated real API call using `emailApi.getEmailHistory()`
- Fetches email history from backend
- Transforms API response to component format
- Supports pagination, filtering, and search
- Handles folder filtering on client side
- Shows loading state and error handling

#### Updated `handleSendEmail` Function
- Integrated real API call using `emailApi.sendEmail()`
- Formats email body with HTML styling
- Adds sent email to local state
- Shows success/error toasts
- Logs API responses for debugging

#### Updated `handleReply` Function
- Integrated real API call for replies
- Includes original message in reply
- Updates email status to 'replied'
- Adds reply to sent folder
- Shows success/error toasts

#### Added Import
```javascript
import emailApi from '../../services/api/emailApi';
```

#### Added useEffect Hook
```javascript
useEffect(() => {
  fetchEmails();
}, [fetchEmails]);
```

## Features Implemented

### ✅ Email History Loading
- Fetches real email history from API
- Displays sent emails with details
- Supports pagination
- Supports status filtering
- Supports search functionality
- Transforms API data to UI format

### ✅ Single Email Sending
- Send email to one recipient
- Custom subject and body
- HTML and plain text versions
- Default sender information
- Real-time success/error feedback

### ✅ Email Reply
- Reply to received emails
- Includes original message
- Updates email status
- Tracks in sent folder

### ✅ Error Handling
- Validates required fields
- Catches API errors
- Shows user-friendly error messages
- Logs detailed error information

### ✅ Authentication
- Automatic token injection
- Handles token expiration
- Redirects to login on 401

### ✅ Logging & Debugging
- Request logging with full details
- Response logging
- Error logging with context
- Console emojis for easy identification

## Usage Example

### Fetch Email History
```javascript
const response = await emailApi.getEmailHistory({
  page: 1,
  limit: 10,
  status: 'sent',
  search: 'welcome'
});

// Response contains:
// - data: Array of email objects
// - pagination: Pagination info
```

### Send Single Email
```javascript
const response = await emailApi.sendEmail({
  to: 'customer@example.com',
  toName: 'John Doe',
  subject: 'Welcome to UpSkillWay',
  html: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
  text: 'Welcome! Thank you for joining us.',
  from: {
    name: 'UpSkillWay',
    email: 'info@upskillway.com'
  },
  transport: 'api',
  queue: false
});
```

### Send Reply
```javascript
const response = await emailApi.sendEmail({
  to: originalEmail.from,
  toName: originalEmail.fromName,
  subject: `Re: ${originalEmail.subject}`,
  html: '<p>Your reply message</p>',
  text: 'Your reply message',
  from: {
    name: 'UpSkillWay',
    email: 'info@upskillway.com'
  },
  transport: 'api',
  queue: false
});
```

## Testing

### Test the Implementation
1. Navigate to Email Manager in the dashboard
2. Click "New Email" button
3. Fill in:
   - To: recipient email
   - Subject: test subject
   - Message: test message
4. Click "Send Email"
5. Check console for API logs
6. Verify success toast appears
7. Check sent folder for the email

### Test Reply Function
1. Click on an email in inbox
2. Click "Reply" button
3. Type your reply message
4. Click "Send Reply"
5. Verify success toast
6. Check email status changes to "replied"
7. Check sent folder for the reply

## API Response Handling

### Success Response
```javascript
{
  success: true,
  message: "Email sent successfully",
  data: {
    messageId: "<unique-id>",
    status: "sent",
    method: "api",
    logId: "uuid",
    timestamp: "ISO-8601"
  }
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error message",
  error: "Detailed error"
}
```

## Security Features

1. **Token Authentication**: All requests include Bearer token
2. **Token Expiration Handling**: Automatic redirect on 401
3. **Input Validation**: Validates required fields before API call
4. **Error Sanitization**: User-friendly error messages

## Performance Optimizations

1. **Cache Busting**: Added to GET requests
2. **Timeout**: 30 seconds for email sending
3. **Queue Support**: Option to queue bulk emails
4. **Async/Await**: Non-blocking operations

## Future Enhancements

### Potential Additions:
1. **Email Templates**: Pre-defined email templates
2. **Attachments**: File upload support
3. **Scheduling**: Schedule emails for later
4. **Tracking**: Open and click tracking
5. **Bulk Operations**: Send to multiple recipients
6. **Draft Saving**: Save emails as drafts
7. **Email History**: View sent email history
8. **Statistics**: Email performance metrics

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if token is valid
   - Verify token in localStorage
   - Try logging in again

2. **Email Not Sending**
   - Check console logs
   - Verify API endpoint is running
   - Check network tab in browser
   - Verify email format

3. **Missing Fields Error**
   - Ensure to, subject, and body are filled
   - Check for empty strings

4. **Timeout Error**
   - Check API server status
   - Verify network connection
   - Increase timeout if needed

## Console Logs

The implementation includes detailed console logging:

- 📧 Email API Request
- ✅ Email API Response Success
- ❌ Email API Response Error
- 📧 Sending email via API...
- ✅ Email sent: {response}
- ❌ Error sending email: {error}

## Conclusion

The email API has been successfully integrated into the Email Manager component. Users can now send real emails to single recipients through the UI, with proper error handling, authentication, and user feedback.
