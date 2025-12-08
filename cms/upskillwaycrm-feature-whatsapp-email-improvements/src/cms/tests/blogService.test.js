// Simple test file for blog service
// This is a basic test to verify the service structure

import blogService from '../services/blogService.js';

// Test data
const testBlogData = {
  title: "Test Blog Post",
  slug: "test-blog-post",
  excerpt: "This is a test blog post excerpt",
  content: "This is the full content of the test blog post...",
  imageUrl: "https://example.com/test-image.jpg",
  tags: ["test", "blog"],
  status: "draft"
};

// Mock localStorage for testing
const mockLocalStorage = {
  getItem: (key) => {
    if (key === 'access_token') {
      return 'mock-token-123';
    }
    return null;
  }
};

// Replace localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test functions
export const testBlogService = {
  // Test auth token retrieval
  testGetAuthToken() {
    const token = blogService.getAuthToken();
    console.log('Auth token test:', token === 'mock-token-123' ? 'PASS' : 'FAIL');
    return token === 'mock-token-123';
  },

  // Test auth headers
  testGetAuthHeaders() {
    const headers = blogService.getAuthHeaders();
    const expectedHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-token-123'
    };
    
    const isValid = headers['Content-Type'] === expectedHeaders['Content-Type'] &&
                   headers['Authorization'] === expectedHeaders['Authorization'];
    
    console.log('Auth headers test:', isValid ? 'PASS' : 'FAIL');
    return isValid;
  },

  // Test blog data validation
  testBlogDataStructure() {
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'status'];
    const hasAllFields = requiredFields.every(field => testBlogData.hasOwnProperty(field));
    
    console.log('Blog data structure test:', hasAllFields ? 'PASS' : 'FAIL');
    return hasAllFields;
  },

  // Run all tests
  runAllTests() {
    console.log('Running Blog Service Tests...');
    console.log('================================');
    
    const results = {
      authToken: this.testGetAuthToken(),
      authHeaders: this.testGetAuthHeaders(),
      dataStructure: this.testBlogDataStructure()
    };
    
    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('================================');
    console.log('Overall result:', allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');
    
    return results;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testBlogService = testBlogService;
}

export default testBlogService;