import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  BookOpen,
  Video,
  HelpCircle,
  Star,
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  User,
  GraduationCap,
  Building2,
  Award,
  BookMarked,
  Globe
} from 'lucide-react';
import cmsService from '../../services/cmsService';

const CMSDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, draft: 0 },
    ebooks: { total: 0, published: 0, draft: 0 },
    courses: { total: 0, published: 0, draft: 0 },
    faqs: { total: 0, published: 0, draft: 0 },
    videos: { total: 0, published: 0, draft: 0 },
    testimonials: { total: 0, published: 0, draft: 0 },
    collegeTraining: { total: 0, published: 0, draft: 0 },
    corporateTraining: { total: 0, published: 0, draft: 0 },
    shortCourses: { total: 0, published: 0, draft: 0 },
    certifiedCourses: { total: 0, published: 0, draft: 0 },
    studyAbroad: { total: 0, published: 0, draft: 0 }
  });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentFilter, setContentFilter] = useState('all');

  const fetchCmsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching CMS data...');
      
      const [statsResponse, contentResponse] = await Promise.all([
        cmsService.getStats(),
        cmsService.getContent({ limit: 5, type: contentFilter !== 'all' ? contentFilter : undefined })
      ]);
      
      console.log('Stats response:', statsResponse);
      console.log('Content response:', contentResponse);
      
      if (statsResponse.success) {
        setStats(statsResponse.data.byType);
        console.log('Stats set:', statsResponse.data.byType);
      } else {
        console.error('Stats response failed:', statsResponse);
        setError('Failed to load statistics');
      }
      
      if (contentResponse.success) {
        setRecentContent(contentResponse.data);
        console.log('Recent content set:', contentResponse.data);
      } else {
        console.error('Content response failed:', contentResponse);
        setError('Failed to load recent content');
      }
    } catch (error) {
      console.error('Error fetching CMS data:', error);
      setError('Failed to load CMS data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [contentFilter]);

  useEffect(() => {
    fetchCmsData();
  }, [fetchCmsData]);

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'blog': return FileText;
      case 'course': return BookOpen;
      case 'ebook': return BookOpen;
      case 'video': return Video;
      case 'faq': return HelpCircle;
      case 'testimonial': return Star;
      case 'collegeTraining': return GraduationCap;
      case 'corporateTraining': return Building2;
      case 'shortCourses': return Award;
      case 'certifiedCourses': return BookMarked;
      case 'studyAbroad': return Globe;
      default: return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CMS data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching real data from APIs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard Overview</h1>
          <p className="text-gray-600">Manage and monitor your content management system</p>
          {stats.blog?.total > 0 && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">Real data loaded</span>
            </div>
          )}
          {stats.blog?.total === 0 && !loading && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-600">Using fallback data - Check API connection</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={contentFilter}
            onChange={(e) => {
              setContentFilter(e.target.value);
              fetchCmsData();
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Content</option>
            <option value="blogs">Blogs</option>
            <option value="courses">Courses</option>
            <option value="ebooks">eBooks</option>
            <option value="videos">Coding for Kids</option>
            <option value="faqs">FAQs</option>
            <option value="testimonials">Testimonials</option>
            <option value="collegeTraining">College Training</option>
            <option value="corporateTraining">Corporate Training</option>
            <option value="shortCourses">Short Courses</option>
            <option value="certifiedCourses">Certified Courses</option>
            <option value="studyAbroad">Study Abroad</option>
          </select>
          <button 
            onClick={() => {
              // Clear localStorage and reinitialize data
              localStorage.removeItem('cms-data');
              window.location.reload();
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <span>Reset Data</span>
          </button>
          <button 
            onClick={fetchCmsData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => {
              console.log('🔍 CMS Dashboard Debug Info:');
              console.log('Stats:', stats);
              console.log('Recent Content:', recentContent);
              console.log('Content Filter:', contentFilter);
              console.log('Loading:', loading);
              console.log('Error:', error);
              
              // Test CMS service directly
              cmsService.getCMSStats().then(result => {
                console.log('🔍 Direct CMS Stats Test:', result);
              }).catch(err => {
                console.error('❌ Direct CMS Stats Test Error:', err);
              });
              
              cmsService.getRecentContent(5).then(result => {
                console.log('🔍 Direct Recent Content Test:', result);
              }).catch(err => {
                console.error('❌ Direct Recent Content Test Error:', err);
              });

              // Test all APIs individually
              cmsService.testAllAPIs().then(results => {
                console.log('🧪 Individual API Test Results:', results);
              }).catch(err => {
                console.error('❌ API Test Error:', err);
              });

              // Test the new getStats method
              cmsService.getStats().then(result => {
                console.log('🎯 Dashboard Stats Test:', result);
                console.log('🎯 Dashboard Stats Data:', result.data?.byType);
              }).catch(err => {
                console.error('❌ Dashboard Stats Test Error:', err);
              });
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Debug CMS Data"
          >
            <span>Debug</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/blogs/create')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Content</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
            <button 
              onClick={fetchCmsData}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {Object.entries(stats).map(([type, data]) => {
          // Format display name
          const displayName = type === 'collegeTraining' ? 'College Training' 
            : type === 'corporateTraining' ? 'Corporate Training'
            : type === 'shortCourses' ? 'Short Courses'
            : type === 'certifiedCourses' ? 'Certified Courses'
            : type === 'studyAbroad' ? 'Study Abroad'
            : type.charAt(0).toUpperCase() + type.slice(1);
          
          // Get navigation path for each type
          const getNavigationPath = (contentType) => {
            switch(contentType) {
              case 'blog': return '/dashboard/content/blogs';
              case 'course': return '/dashboard/content/courses';
              case 'ebook': return '/dashboard/content/ebooks';
              case 'video': return '/dashboard/content/videos';
              case 'faq': return '/dashboard/content/faqs';
              case 'testimonial': return '/dashboard/content/testimonials';
              case 'collegeTraining': return '/dashboard/cms/colleges';
              case 'corporateTraining': return '/dashboard/cms/corporate-training';
              case 'shortCourses': return '/dashboard/content/short-courses';
              case 'certifiedCourses': return '/dashboard/content/certified-courses';
              case 'studyAbroad': return '/dashboard/content/study-abroad';
              default: return '/dashboard/cms';
            }
          };
          
          return (
            <div 
              key={type} 
              onClick={() => navigate(getNavigationPath(type))}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{displayName}</p>
                  <p className="text-2xl font-bold text-gray-900">{data.total}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-green-600">{data.published} published</span>
                    <span className="text-xs text-yellow-600">{data.draft} draft</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  {React.createElement(getContentTypeIcon(type), { className: "w-6 h-6 text-blue-600" })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <button 
            onClick={() => navigate('/dashboard/content/blogs/create')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Add Blog</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/courses/create')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Add Course</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/faqs/create')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Add FAQ</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/cms/colleges')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <GraduationCap className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">College</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/cms/corporate-training')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Corporate</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/short-courses')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Award className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Short Courses</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/certified-courses')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <BookMarked className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Certified</span>
          </button>
          <button 
            onClick={() => navigate('/dashboard/content/study-abroad')}
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600 text-sm">Study Abroad</span>
          </button>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recently Added Content</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentContent.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent content found</p>
              <button 
                onClick={fetchCmsData}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Refresh to load data
              </button>
            </div>
          ) : (
            recentContent.map((item) => {
              const IconComponent = getContentTypeIcon(item.type);
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.type} • {item.author} • {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Content Management Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Status Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Status Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Published Content</span>
              <span className="text-sm font-medium text-green-600">
                {Object.values(stats).reduce((sum, type) => sum + type.published, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Draft Content</span>
              <span className="text-sm font-medium text-yellow-600">
                {Object.values(stats).reduce((sum, type) => sum + type.draft, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Content</span>
              <span className="text-sm font-medium text-gray-900">
                {Object.values(stats).reduce((sum, type) => sum + type.total, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-gray-700">New blog post published</p>
              <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-sm text-gray-700">Course content updated</p>
              <span className="text-xs text-gray-500 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <p className="text-sm text-gray-700">FAQ draft created</p>
              <span className="text-xs text-gray-500 ml-auto">10 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDashboard;
