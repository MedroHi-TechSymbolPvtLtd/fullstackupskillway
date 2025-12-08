# API Utility Usage Guide

This guide explains how to use the centralized API utility for making API calls in the application.

## Setup

### 1. Environment Variables

All API configuration is managed through environment variables in the `.env` file:

```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

**Important:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser.

### 2. Configuration

The `src/config/env.js` file manages all environment variables:

```javascript
import config from '../config/env';

console.log(config.apiBaseUrl); // http://localhost:3000/api/v1
```

## Usage

### Basic GET Request

```javascript
import { api, endpoints } from '../utils/api';

// Fetch videos
const fetchVideos = async () => {
  try {
    const data = await api.get(endpoints.cms.videos);
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### POST Request

```javascript
import { api, endpoints } from '../utils/api';

// Submit a lead
const submitLead = async (formData) => {
  try {
    const data = await api.post(endpoints.leads, formData);
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### PUT Request

```javascript
import { api } from '../utils/api';

// Update a resource
const updateResource = async (id, updateData) => {
  try {
    const data = await api.put(`/resource/${id}`, updateData);
    console.log('Updated:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### DELETE Request

```javascript
import { api } from '../utils/api';

// Delete a resource
const deleteResource = async (id) => {
  try {
    const data = await api.delete(`/resource/${id}`);
    console.log('Deleted:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## Available Endpoints

The `endpoints` object contains all predefined API endpoints:

```javascript
endpoints.cms.videos          // /cms/videos
endpoints.cms.courses         // /cms/courses
endpoints.cms.blogs           // /cms/blogs
endpoints.cms.ebooks          // /cms/ebooks
endpoints.cms.studyAbroad     // /cms/study-abroad
endpoints.cms.trainingPrograms // /cms/training-programs
endpoints.leads               // /leads
endpoints.demoRequest         // /demo-request
endpoints.refer.partners      // /refer/partners
```

## Error Handling

The API utility includes built-in error handling:

```javascript
import { api, endpoints } from '../utils/api';

const fetchData = async () => {
  try {
    const data = await api.get(endpoints.cms.videos);
    // Handle success
  } catch (error) {
    // error.message - Error message
    // error.status - HTTP status code
    // error.data - Response data (if available)
    
    if (error.status === 404) {
      console.error('Resource not found');
    } else if (error.status === 500) {
      console.error('Server error');
    } else {
      console.error('Error:', error.message);
    }
  }
};
```

## Custom Headers

You can pass custom headers to any request:

```javascript
const data = await api.get(endpoints.cms.videos, {
  headers: {
    'Authorization': 'Bearer token',
    'Custom-Header': 'value'
  }
});
```

## Query Parameters

For GET requests with query parameters:

```javascript
// Method 1: Include in endpoint
const data = await api.get(`${endpoints.cms.studyAbroad}?page=1&limit=10`);

// Method 2: Use URLSearchParams
const params = new URLSearchParams({
  page: 1,
  limit: 10,
  trainingType: 'college'
});
const data = await api.get(`${endpoints.cms.trainingPrograms}?${params}`);
```

## React Component Example

### Method 1: Using API utility directly

```javascript
import React, { useState, useEffect } from 'react';
import { api, endpoints } from '../utils/api';

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.get(endpoints.cms.videos);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

### Method 2: Using Custom Hooks (Recommended)

```javascript
import React from 'react';
import { useFetch } from '../hooks/useApi';
import { endpoints } from '../utils/api';

const MyComponent = () => {
  const { data, loading, error, refetch } = useFetch(endpoints.cms.videos);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data?.data?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
```

### Method 3: Using POST Hook

```javascript
import React, { useState } from 'react';
import { usePost } from '../hooks/useApi';
import { endpoints } from '../utils/api';

const FormComponent = () => {
  const { mutate, loading, error } = usePost();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await mutate(endpoints.leads, formData);
      console.log('Success:', result);
      // Handle success (e.g., show message, redirect)
    } catch (err) {
      console.error('Error:', err);
      // Error is already set in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
```

## Benefits

1. **Centralized Configuration**: All API URLs are managed in one place
2. **Environment-Based**: Easy to switch between development, staging, and production
3. **Error Handling**: Consistent error handling across the application
4. **Type Safety**: Predefined endpoints reduce typos
5. **Maintainability**: Easy to update API endpoints
6. **Reusability**: DRY principle - don't repeat yourself

## Migration Guide

To migrate existing code:

### Before:
```javascript
const response = await fetch('http://localhost:3000/api/v1/cms/videos');
const data = await response.json();
```

### After:
```javascript
import { api, endpoints } from '../utils/api';

const data = await api.get(endpoints.cms.videos);
```

## Production Deployment

For production, update the `.env` file:

```env
VITE_API_BASE_URL="https://api.yourdomain.com/api/v1"
```

The application will automatically use the production API URL.
