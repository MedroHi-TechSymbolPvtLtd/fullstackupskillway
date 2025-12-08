import React, { useState, useEffect } from 'react';
import config from '../../config/env';

const TrainingPrograms = ({ apiUrl = `${config.apiBaseUrl}/cms/short-courses`, title = 'Our Training Programs' }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [apiUrl]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSyllabus = (syllabus) => {
    if (!syllabus) return [];
    return syllabus.split('\n').filter(item => item.trim()).slice(0, 4);
  };

  const formatPrice = (price) => {
    return price ? `$${price}` : 'Free';
  };

  if (loading) {
    return (
      <div className="mt-25 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="absolute -mt-20 w-[605px] h-[69px] opacity-100 font-['Plus_Jakarta_Sans'] font-bold text-[55px] leading-[100%] tracking-[0]">
              Our <span className="text-yellow-500">Training</span> Programs
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="p-8">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="space-y-3 mb-8">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-25 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Error loading courses: {error}</p>
              <button 
                onClick={fetchCourses}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-25 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="absolute -mt-20 w-[605px] h-[69px] opacity-100 font-['Plus_Jakarta_Sans'] font-bold text-[55px] leading-[100%] tracking-[0]">
            Our <span className="text-yellow-500">Training</span> Programs
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-4">
          {courses.length > 0 ? (
            courses.map((course) => {
              const syllabusItems = formatSyllabus(course.syllabus);
              
              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {course.imageUrl && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">{course.title}</h3>
                      <span className="text-lg font-bold text-[#FBB11F] ml-4">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {course.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {syllabusItems.length > 0 ? (
                        syllabusItems.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))
                      ) : (
                        // Fallback content if no syllabus
                        <>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Comprehensive curriculum</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Hands-on practical experience</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Industry best practices</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-700">Expert guidance</span>
                          </div>
                        </>
                      )}
                    </div>

                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {course.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <button className="flex-1 bg-[#FBB11F] hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-semibold transition-colors">
                        Learn More
                      </button>
                      {course.videoDemoUrl && (
                        <a 
                          href={course.videoDemoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-3 border-2 border-[#FBB11F] text-[#FBB11F] hover:bg-[#FBB11F] hover:text-gray-900 rounded-full font-semibold transition-colors"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;