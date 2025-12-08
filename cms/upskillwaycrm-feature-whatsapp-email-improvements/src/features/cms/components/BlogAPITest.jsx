import { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader } from 'lucide-react';
import { API_BASE_URL } from '../../../utils/constants';

const BlogAPITest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      console.log('Testing direct API call...');
      
      // Get token for testing
      const token = localStorage.getItem('access_token');
      console.log('Using token for test:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      // Test direct fetch with and without auth
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
  const response = await fetch(`${API_BASE_URL}/api/v1/cms/blogs?page=1&limit=10`, {
        method: 'GET',
        headers
      });

      console.log('Direct API response status:', response.status);
      
      const data = await response.json();
      console.log('Direct API response data:', data);

      if (response.ok) {
        setTestResult({
          success: true,
          message: `API call successful ${token ? '(with auth)' : '(no auth)'}`,
          data: data,
          blogsCount: data.data ? data.data.length : 0,
          usedAuth: !!token
        });
      } else {
        setTestResult({
          success: false,
          message: `API call failed: ${response.status} ${token ? '(with auth)' : '(no auth)'}`,
          data: data,
          usedAuth: !!token
        });
      }
    } catch (error) {
      console.error('Direct API test error:', error);
      setTestResult({
        success: false,
        message: `Network error: ${error.message}`,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Blog API Test</h3>
        <button
          onClick={testAPI}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          Test API
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg ${
          testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
            )}
            <span className={`font-medium ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.message}
            </span>
          </div>

          {testResult.success && testResult.data && (
            <div className="text-sm text-green-700 space-y-1">
              <div>Blogs found: {testResult.blogsCount}</div>
              <div>Success: {testResult.data.success ? 'Yes' : 'No'}</div>
              <div>Message: {testResult.data.message}</div>
              <div>Used Auth: {testResult.usedAuth ? 'Yes' : 'No'}</div>
              {testResult.data.pagination && (
                <div>Total: {testResult.data.pagination.total}</div>
              )}
            </div>
          )}

          {!testResult.success && (
            <div className="text-sm text-red-700 mt-2">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(testResult.data || testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>This test makes a direct API call to verify the blog endpoint is working.</p>
  <p className="mt-1">URL: <code className="bg-gray-100 px-1 rounded">GET {`${API_BASE_URL}/api/v1/cms/blogs?page=1&limit=10`}</code></p>
      </div>
    </div>
  );
};

export default BlogAPITest;