# CMS Module - Blog Management

This module provides a complete blog management system for the UpSkillWay dashboard.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete blog posts
- ✅ **Rich Content Management**: Title, slug, excerpt, content, featured image, tags
- ✅ **Status Management**: Draft, Published, Archived states
- ✅ **Search & Filter**: Search by title/content, filter by status
- ✅ **Bulk Operations**: Select and delete multiple posts
- ✅ **Preview Mode**: Preview posts before publishing
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Real-time Updates**: Automatic refresh after operations

## API Integration

The module integrates with the following API endpoints:

### Blog Endpoints
- `POST /api/v1/blogs` - Create new blog post
- `GET /api/v1/blogs` - Get all blogs with pagination and filters
- `GET /api/v1/blogs/:id` - Get blog by ID
- `PUT /api/v1/blogs/:id` - Update blog post
- `DELETE /api/v1/blogs/:id` - Delete blog post

### Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

## Components

### 1. Blog (Main Component)
The main component that manages all blog-related views and state.

```jsx
import { Blog } from '../cms';

function Dashboard() {
  return (
    <div>
      <Blog />
    </div>
  );
}
```

### 2. BlogList
Displays a list of all blog posts with search, filter, and bulk operations.

### 3. BlogForm
Form component for creating and editing blog posts with validation and preview.

### 4. BlogView
Read-only view for displaying blog post details.

### 5. blogService
Service class that handles all API communications.

## Usage in Dashboard

The blog functionality is integrated into the dashboard under the CMS section:

1. Navigate to Dashboard
2. Click on "CMS" in the sidebar
3. Select "Blogs" from the submenu
4. Use the interface to manage blog posts

## Data Structure

### Blog Post Object
```javascript
{
  id: "uuid",
  title: "Blog Post Title",
  slug: "blog-post-title",
  excerpt: "Brief description...",
  content: "Full blog content...",
  imageUrl: "https://example.com/image.jpg",
  tags: ["tag1", "tag2"],
  status: "published", // draft, published, archived
  createdBy: "user-id",
  createdAt: "2025-01-12T08:00:00.000Z",
  updatedAt: "2025-01-12T08:00:00.000Z",
  creator: {
    name: "Author Name"
  }
}
```

### API Response Format
```javascript
{
  success: true,
  message: "Operation successful",
  data: {}, // Blog object or array
  pagination: { // For list endpoints
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrev: false
  },
  timestamp: "2025-01-12T08:00:00.000Z"
}
```

## Styling

The module uses Tailwind CSS for styling with custom CSS for enhanced typography and blog-specific styles. The styles are imported in `src/index.css`.

## Error Handling

- Form validation with real-time error display
- API error handling with user-friendly messages
- Loading states for all async operations
- Confirmation dialogs for destructive actions

## Future Enhancements

- Rich text editor integration
- Image upload functionality
- SEO metadata management
- Comment system
- Category management
- Advanced search with filters
- Export/Import functionality
- Version history
- Scheduled publishing