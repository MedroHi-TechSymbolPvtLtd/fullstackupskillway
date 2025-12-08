# 🔧 Debugging Guide - CourseDetail Dynamic Data

## ✅ Issue Fixed!

### Problem Identified:
The API endpoint was incorrect. It was trying to fetch from `/api/v1/courses/${id}` instead of `/api/v1/cms/courses`.

### Solution Applied:
Updated the `useEffect` in CourseDetail.jsx to:
1. Fetch from the correct endpoint: `http://localhost:3000/api/v1/cms/courses`
2. Find the course by matching `id` or `slug`
3. Merge all course data properly
4. Added console.log statements for debugging

## 🧪 How to Test

### Step 1: Open Browser Console
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Go to the "Console" tab

### Step 2: Navigate to Courses Page
- Go to `http://localhost:5173/courses` (or your dev URL)

### Step 3: Click on a Course
- Click "Enroll Now" on any course
- Example: "Modern JavaScript for Web Development"

### Step 4: Check Console Logs
You should see:
```
Fetching course with ID: 1a171ed1-34ec-4d99-8d9b-c55d19121983
API Response: {success: true, data: Array(4), ...}
Found Course: {id: "1a171ed1...", title: "Modern JavaScript...", ...}
Merged Course: {title: "Modern JavaScript...", projects: Array(1), ...}
```

### Step 5: Verify UI
You should now see:
- ✅ Title: "Modern JavaScript for Web Development" (not "UI UX Design")
- ✅ Description: Actual course description
- ✅ Projects: "Weather Dashboard (API Project)"
- ✅ Mentors: "Sarah Thompson"
- ✅ FAQs: Course-specific questions

## 🐛 If Still Not Working

### Check 1: API Server Running
Make sure your backend API is running on `http://localhost:3000`

Test in browser:
```
http://localhost:3000/api/v1/cms/courses
```

You should see JSON response with courses array.

### Check 2: Console Errors
Look for any errors in the browser console:
- Network errors (API not reachable)
- CORS errors (backend not allowing requests)
- JavaScript errors

### Check 3: Course ID
Make sure the URL has a valid course ID:
- ✅ Good: `/course/1a171ed1-34ec-4d99-8d9b-c55d19121983`
- ✅ Good: `/course/modern-javascript-for-web-development`
- ❌ Bad: `/course/` (no ID)
- ❌ Bad: `/course/invalid-id` (ID not in database)

### Check 4: Data Structure
In console, check if `Found Course` log shows the course data:
```javascript
{
  id: "...",
  title: "...",
  projects: [...],
  mentors: [...],
  faqs: [...]
}
```

If any of these are missing or null, the API data might be incomplete.

## 📝 Debug Checklist

- [ ] Backend API is running on port 3000
- [ ] Can access `http://localhost:3000/api/v1/cms/courses` in browser
- [ ] Frontend dev server is running
- [ ] Browser console shows "Fetching course with ID: ..."
- [ ] Browser console shows "Found Course: ..." with data
- [ ] No red errors in console
- [ ] Course ID in URL matches a course in the API response

## 🎯 Expected Behavior

### For Course: "Modern JavaScript for Web Development"
- **ID**: `1a171ed1-34ec-4d99-8d9b-c55d19121983`
- **Title**: "Modern JavaScript for Web Development"
- **Projects**: 
  - "Weather Dashboard (API Project)"
- **Mentors**: 
  - "Sarah Thompson" - "Senior Frontend Engineer at Google"
- **FAQs**: 
  - "Do I need prior programming experience?"

### For Course: "Full Stack Web Development (MERN)"
- **ID**: `6212cdd9-e23f-4900-adcc-5f87a635af3b`
- **Title**: "Full Stack Web Development (MERN)"
- **Projects**: 
  - "Blog Application: MERN-based CRUD app."
- **Mentors**: 
  - "John Smith" - "Senior Full Stack Developer at Google"
- **FAQs**: 
  - "Do I need prior programming experience?"

## 🚀 Next Steps

1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Test with different courses
4. Check console logs for each course

If you still see issues, share the console logs and I'll help debug further!
