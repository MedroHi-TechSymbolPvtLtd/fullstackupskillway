# Training Programs Services - Testing Guide

## 🧪 Quick Start

### **Run Tests in Browser Console**

1. Open your browser's developer console (F12)
2. Navigate to the CMS section of your application
3. Run the following commands:

```javascript
// Run all unit tests
window.testTrainingProgramsServices.runAllUnitTests();

// Run all tests including integration (requires backend)
await window.testTrainingProgramsServices.runAllTests();

// Run individual tests
window.testTrainingProgramsServices.testCollegeServiceAuthToken();
window.testTrainingProgramsServices.testCorporateServiceIntegration();
```

---

## 📋 Test Coverage

### **Unit Tests (No Backend Required)**

✅ **Authentication Tests**
- College Service auth token retrieval
- Corporate Service auth token retrieval
- Auth headers generation for both services

✅ **Data Structure Tests**
- College training data structure validation
- Corporate training data structure validation

✅ **Service Structure Tests**
- Endpoint structure verification
- Method existence verification
- TrainingType enforcement logic

### **Integration Tests (Requires Backend)**

✅ **API Integration Tests**
- College Service GET request
- Corporate Service GET request
- Error handling
- Network error handling

---

## 🔍 Manual Testing Steps

### **1. Test College Training Service**

```javascript
// In browser console
import collegeService from './src/cms/services/collegeService.js';

// Test GET request
const programs = await collegeService.getColleges({ page: 1, limit: 10 });
console.log('College Programs:', programs);

// Test GET by ID (replace with actual ID)
const program = await collegeService.getCollegeById('program-id');
console.log('College Program:', program);
```

### **2. Test Corporate Training Service**

```javascript
// In browser console
import corporateTrainingService from './src/cms/services/corporateTrainingService.js';

// Test GET request
const programs = await corporateTrainingService.getTrainingPrograms({ page: 1, limit: 10 });
console.log('Corporate Programs:', programs);

// Test GET by ID (replace with actual ID)
const program = await corporateTrainingService.getTrainingProgramById('program-id');
console.log('Corporate Program:', program);
```

### **3. Verify TrainingType Enforcement**

```javascript
// Test that trainingType is automatically set
const testData = {
  title: "Test Program",
  slug: "test-program",
  description: "Test description",
  price: 1000
};

// College Service - should add trainingType='college'
const collegeResult = await collegeService.createCollege(testData);
// Check network tab - request body should have trainingType: "college"

// Corporate Service - should add trainingType='corporate'
const corporateResult = await corporateTrainingService.createTrainingProgram(testData);
// Check network tab - request body should have trainingType: "corporate"
```

---

## 🐛 Debugging

### **Check Network Requests**

1. Open browser DevTools → Network tab
2. Filter by "training-programs"
3. Verify:
   - **GET requests** include `?trainingType=college` or `?trainingType=corporate`
   - **POST/PUT requests** include `"trainingType": "college"` or `"trainingType": "corporate"` in body
   - **Authorization header** is present: `Bearer <token>`

### **Common Issues**

#### **Issue: 404 Not Found**
- **Cause:** Backend route not implemented
- **Solution:** Implement backend routes (see `BACKEND_TRAINING_PROGRAMS_IMPLEMENTATION.md`)

#### **Issue: 401 Unauthorized**
- **Cause:** Missing or invalid auth token
- **Solution:** Check localStorage for `access_token` or `upskillway_access_token`

#### **Issue: 400 Bad Request**
- **Cause:** Invalid request data or missing required fields
- **Solution:** Verify request body includes all required fields (title, slug, description, price)

#### **Issue: Wrong TrainingType**
- **Cause:** Service not enforcing trainingType
- **Solution:** Verify service code sets trainingType automatically

---

## ✅ Expected Test Results

### **Unit Tests**
All unit tests should pass:
```
✅ College Service Auth Token Test: PASS
✅ Corporate Service Auth Token Test: PASS
✅ College Service Auth Headers Test: PASS
✅ Corporate Service Auth Headers Test: PASS
✅ College Training Data Structure Test: PASS
✅ Corporate Training Data Structure Test: PASS
✅ College Service Endpoint Structure Test: PASS
✅ Corporate Service Endpoint Structure Test: PASS
✅ College Service TrainingType Enforcement Test: PASS
✅ Corporate Service TrainingType Enforcement Test: PASS
```

### **Integration Tests**
Integration tests require backend to be running:
```
✅ College Service Integration Test: PASS (if backend running)
✅ Corporate Service Integration Test: PASS (if backend running)
```

---

## 📊 Test Results Interpretation

### **All Tests Pass**
✅ Services are correctly implemented and ready for use

### **Unit Tests Pass, Integration Tests Fail**
⚠️ Services are correctly implemented, but backend API is not available or not working

### **Some Unit Tests Fail**
❌ Service implementation needs review - check the failing test for details

---

## 🔄 Continuous Testing

For development, run tests after:
- Making changes to service files
- Updating API endpoints
- Modifying authentication logic
- Changing data structures

---

**Last Updated:** January 15, 2025



