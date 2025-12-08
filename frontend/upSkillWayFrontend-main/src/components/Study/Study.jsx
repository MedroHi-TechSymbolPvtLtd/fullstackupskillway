import { useState, useEffect } from 'react';
import config from '../../config/env';

const StudyAbroad = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/cms/study-abroad`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setCourses(result.data || []);
          setPagination(result.pagination);
        } else {
          throw new Error(result.message || 'Failed to fetch study abroad records');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching study abroad records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleLearnMore = (course) => {
    console.log('Learn more about:', course.title);
    // Example: navigate to course detail page
    // window.location.href = `/study-abroad/${course.slug || course.id}`;
  };

  const formatPrice = (price) => {
    if (!price) return 'Contact for Price';
    return `$${parseFloat(price).toLocaleString()}`;
  };

  

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading study abroad programs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">Error loading programs</p>
              <p className="text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 -mt-22">
      
       
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Programs Available</h3>
            <p className="text-gray-600 mb-6">
              We're currently updating our study abroad programs. Please check back soon for exciting opportunities!
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div 
                key={course.id || index} 
                className="w-[356px] h-[426px]  bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                
                  <div className="bg-gradient-to-br flex items-center justify-center overflow-hidden rounded-[16px]">
                    {course.imageUrl && course.imageUrl.startsWith('http') ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.city || course.title || 'Study Abroad Program'}
                        className="w-[308px] h-[242px] object-cover rounded-[16px]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                  </div>
                  
                  {/* City Badge */}
                  <div className='relative'>
                           <div className="w-[147px] h-[34px] absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg ml-5">
                    <span className="w-[107px] h-[18px] text-purple-600 font-bold text-[14px] text-lg lowercase ml-7">
                      {course.city || course.country || 'united states'}
                    </span>
                  </div>
                  </div>
         
                
                
                <div className="w-[257px] h-[78px]  ml-10 mt-5 ">
                  {/* Universities Count */}
                  <div className="flex justify-between items-center mb-1 -ml-5">
                    <span className="text-gray-700 font-medium text-[14px]">Universities</span>
                    <span className="text-gray-900 font-bold text-[14px]">
                      {course.universities || '200+'}
                    </span>
                  </div>

                  {/* Average Tuition */}
                  <div className="flex justify-between items-center mb-1 -ml-5">
                    <span className="text-gray-700 font-medium text-[14px]">Avg. Tuition</span>
                    <span className="text-gray-900 font-bold text-[14px]">
                      ${course.avgTuition ? `${parseFloat(course.avgTuition).toLocaleString()}/year` : '20,000/year'}
                    </span>
                  </div>

                  {/* Living Cost */}
                  <div className="flex justify-between items-center mb-6 -ml-5">
                    <span className="text-gray-700 font-medium text-[14px]">Living Cost</span>
                    <span className="text-gray-900 font-bold text-[14px]">
                      ${course.livingCost ? `${parseFloat(course.livingCost).toLocaleString()}/month` : '1,200/month'}
                    </span>
                  </div>
                  
                  {/* Learn More Button */}
                  <button 
                    onClick={() => handleLearnMore(course)}
                    className="w-[228px] h-[41px] bg-[#FBB11F] text-gray-900 py-4 rounded-2xl font-bold text-lg hover:from-orange-500 hover:to-yellow-500 transition-all duration-200 flex items-center justify-center gap-2 ml-5"
                  >
                    Learn More
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M10 6l4 4-4 4M6 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing {courses.length} of {pagination.total} programs
            </p>
            <div className="flex justify-center space-x-2">
              {pagination.hasPrev && (
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Previous
                </button>
              )}
              <span className="px-4 py-2 bg-orange-500 text-white rounded-md">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.hasNext && (
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyAbroad;