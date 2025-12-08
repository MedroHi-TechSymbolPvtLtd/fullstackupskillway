# Quick API Reference Card

## 🚀 Quick Start

### 1. Import
```javascript
import { api, endpoints } from '../utils/api';
// OR for hooks
import { useFetch, usePost } from '../hooks/useApi';
```

### 2. Use
```javascript
// Direct API call
const data = await api.get(endpoints.cms.videos);

// With custom hook
const { data, loading, error } = useFetch(endpoints.cms.videos);
```

## 📋 Available Endpoints

```javascript
// CMS
endpoints.cms.videos              // Videos
endpoints.cms.courses             // Courses
endpoints.cms.blogs               // Blogs
endpoints.cms.ebooks              // Ebooks
endpoints.cms.studyAbroad         // Study Abroad
endpoints.cms.trainingPrograms    // Training Programs

// Other
endpoints.leads                   // Leads
endpoints.demoRequest             // Demo Requests
endpoints.refer.partners          // Referral Partners
```

## 🔧 API Methods

### GET
```javascript
const data = await api.get(endpoints.cms.videos);
```

### POST
```javascript
const data = await api.post(endpoints.leads, { name: 'John', email: 'john@example.com' });
```

### PUT
```javascript
const data = await api.put('/resource/123', { name: 'Updated' });
```

### DELETE
```javascript
const data = await api.delete('/resource/123');
```

## 🎣 Custom Hooks

### useFetch (GET)
```javascript
const { data, loading, error, refetch } = useFetch(endpoints.cms.videos);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
return <div>{data?.data?.map(...)}</div>;
```

### usePost
```javascript
const { mutate, loading, error } = usePost();

const handleSubmit = async (formData) => {
  try {
    await mutate(endpoints.leads, formData);
    // Success
  } catch (err) {
    // Error handled by hook
  }
};
```

## 🔍 Query Parameters

```javascript
// Method 1: String concatenation
const data = await api.get(`${endpoints.cms.studyAbroad}?page=1&limit=10`);

// Method 2: URLSearchParams
const params = new URLSearchParams({ page: 1, limit: 10 });
const data = await api.get(`${endpoints.cms.studyAbroad}?${params}`);
```

## ⚠️ Error Handling

```javascript
try {
  const data = await api.get(endpoints.cms.videos);
} catch (error) {
  console.error(error.message);  // Error message
  console.error(error.status);   // HTTP status code
  console.error(error.data);     // Response data
}
```

## 🌍 Environment Setup

### .env file
```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

### Change for production
```env
VITE_API_BASE_URL="https://api.yourdomain.com/api/v1"
```

## 📝 Migration Pattern

### Before
```javascript
const response = await fetch('http://localhost:3000/api/v1/cms/videos');
const data = await response.json();
```

### After
```javascript
import { api, endpoints } from '../utils/api';
const data = await api.get(endpoints.cms.videos);
```

## 💡 Pro Tips

1. ✅ Always use `endpoints` object instead of hardcoded strings
2. ✅ Use custom hooks for cleaner component code
3. ✅ Handle errors with try-catch or hook error state
4. ✅ Use `refetch` from `useFetch` to reload data
5. ✅ Restart dev server after changing `.env` file

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| API not working | Check `.env` has `VITE_API_BASE_URL` |
| Undefined variable | Ensure variable starts with `VITE_` |
| CORS error | Check backend CORS config |
| 404 error | Verify endpoint path is correct |

## 📚 Full Documentation

See `src/utils/API_USAGE.md` for complete documentation.
