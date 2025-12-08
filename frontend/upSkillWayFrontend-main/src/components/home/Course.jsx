import { useState, useEffect } from 'react';
import config from '../../config/env';
import { BookOpen, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";




// Mock data to simulate API response (remove this when you have real API)

const mockCourses = [
    {
      id: 1,
      title: "Data Science with Specialization",
      description: "Master data science fundamentals with hands-on projects",
      price: 299,
      rating: 4.8,
      reviews: 6,
      duration: "8 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-01-15T00:00:00Z",
      tags: ["Popular"],
      videoDemoUrl: "#"
    },
    {
      id: 2,
      title: "Multi Cloud Architecture",
      description: "Learn cloud architecture across multiple platforms",
      price: 399,
      rating: 4.8,
      reviews: 6,
      duration: "6 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-01-20T00:00:00Z",
      tags: ["Developer"],
      videoDemoUrl: "#"
    },
    {
      id: 3,
      title: "Full Stack Development",
      description: "Complete web development from frontend to backend",
      price: 349,
      rating: 4.8,
      reviews: 6,
      duration: "10 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-02-01T00:00:00Z",
      tags: ["Developer"],
      videoDemoUrl: "#"
    },
    {
      id: 4,
      title: "UI/UX Design Mastery",
      description: "Design beautiful and functional user interfaces",
      price: 249,
      rating: 4.8,
      reviews: 6,
      duration: "5 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-01-25T00:00:00Z",
      tags: ["Designer"],
      videoDemoUrl: "#"
    },
    {
      id: 5,
      title: "Digital Marketing Pro",
      description: "Master digital marketing strategies and tools",
      price: 199,
      rating: 4.8,
      reviews: 6,
      duration: "4 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-02-10T00:00:00Z",
      tags: ["Marketing"],
      videoDemoUrl: "#"
    },
    {
      id: 6,
      title: "Project Management",
      description: "Lead projects successfully with proven methodologies",
      price: 279,
      rating: 4.8,
      reviews: 6,
      duration: "6 Months",
      thumbnailUrl: null,
      status: "Active",
      createdAt: "2024-01-30T00:00:00Z",
      tags: ["Project Manager"],
      videoDemoUrl: "#"
    }
];

const Course = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
  // Try to fetch from API first
  const response = await fetch(`${config.apiBaseUrl}/cms/courses`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          // Process API data and add missing fields with defaults
          const processedCourses = data.data.map(course => ({
            ...course,
            rating: course.rating || 4.8,
            reviews: course.reviews || 6,
            duration: course.duration || "8 Months"
          }));
          setCourses(processedCourses);
        } else {
          throw new Error("Invalid API response format");
        }
        
      } catch (err) {
        console.error("API fetch failed:", err);
        // Fallback to mock data if API fails
        console.log("Using mock data as fallback");
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleRetry = () => {
    setError(null);
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setCourses(mockCourses);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error fetching courses: " + err.message);
        setLoading(false);
      }
    };
    fetchCourses();
  };

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, courses.length - itemsPerPage);
  const visibleCourses = courses.slice(currentIndex, currentIndex + itemsPerPage);
  const canNavigate = courses.length > itemsPerPage;

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  // Create course illustration component
  const CourseIllustration = ({ title, color = "blue", bannerImageUrl }) => {
    const colorMap = {
      blue: "#3B82F6",
      green: "#10B981",
      purple: "#8B5CF6",
      orange: "#F97316",
      pink: "#EC4899",
      indigo: "#6366F1"
    };

    const bgColorMap = {
      blue: "#EFF6FF",
      green: "#ECFDF5",
      purple: "#F5F3FF",
      orange: "#FFF7ED",
      pink: "#FDF2F8",
      indigo: "#EEF2FF"
    };
   
    return (
      <div 
        className="h-[125px] p-8 rounded-t-2xl flex flex-col items-start justify-between relative overflow-hidden"
        style={{ backgroundColor: bannerImageUrl ? 'transparent' : bgColorMap[color] }}
      >
        {/* Banner Image from API */}
        {bannerImageUrl && (
          <img 
            src={bannerImageUrl} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-0"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        
        {/* Overlay for better text readability */}
        {bannerImageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-[1] -"></div>
        )}
        
        {/* Top Section - Text */}
        <div className="text-left z-10 relative">
          <div className={`text-sm font-medium mb-1 ${bannerImageUrl ? 'text-white' : 'text-gray-500'}`}>
            Courses
          </div>
          <div className={`text-sm font-medium mb-2 ${bannerImageUrl ? 'text-white' : 'text-gray-500'}`}>
            to Learn
          </div>
          <div className={`text-2xl font-bold leading-tight ${bannerImageUrl ? 'text-white' : 'text-gray-900'}`}>
            {title.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>

        {/* Bottom Right - Laptop Illustration (only show if no banner image) */}
        {!bannerImageUrl && (
          <div className="absolute bottom-4 right-4 z-10 ">
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
              {/* Laptop screen */}
              <rect x="15" y="10" width="90" height="60" rx="4" fill={colorMap[color]} opacity="0.2"/>
              <rect x="20" y="15" width="80" height="50" rx="2" fill="white"/>
              
              {/* Screen content */}
              <rect x="30" y="25" width="30" height="4" rx="2" fill={colorMap[color]} opacity="0.3"/>
              <rect x="30" y="33" width="40" height="4" rx="2" fill={colorMap[color]} opacity="0.3"/>
              <rect x="30" y="41" width="35" height="4" rx="2" fill={colorMap[color]} opacity="0.3"/>
              
              {/* Chart/Graph illustration */}
              <circle cx="80" cy="35" r="8" fill={colorMap[color]} opacity="0.4"/>
              <rect x="75" y="45" width="3" height="10" rx="1.5" fill={colorMap[color]} opacity="0.4"/>
              <rect x="80" y="40" width="3" height="15" rx="1.5" fill={colorMap[color]} opacity="0.4"/>
              <rect x="85" y="43" width="3" height="12" rx="1.5" fill={colorMap[color]} opacity="0.4"/>
              
              {/* Laptop base */}
              <path d="M10 70 L5 75 L115 75 L110 70 Z" fill={colorMap[color]} opacity="0.3"/>
              <rect x="15" y="68" width="90" height="2" fill={colorMap[color]} opacity="0.4"/>
            </svg>
          </div>
        )}
        
        {/* Top Right - Star decoration (only show if no banner image) */}
        {!bannerImageUrl && (
          <div className="absolute top-4 right-4 z-10 ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill={colorMap[color]} opacity="0.3">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white py-8 sm:py-12 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Explore Our <span className="text-amber-500">Programs</span>
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4 -mb-12 sm:-mb-16 md:-mb-18 lg:-mb-20">
              Find the best Program for your Growth and boosts your
              Confidence 10x!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Course Cards */}
          <div className="w-full">
            {loading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse mx-auto w-full sm:w-[340px] md:w-[360px] lg:w-[398px]"
                  >
                    <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-300"></div>
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-red-500 mb-6">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <p className="text-lg sm:text-xl font-semibold">Failed to load courses</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">{error}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="bg-amber-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            ) : courses.length === 0 ? (
              // No courses state
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="text-gray-500">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
                  <p className="text-lg sm:text-xl font-semibold">No courses available</p>
                  <p className="text-xs sm:text-sm mt-2">Check back later for new courses!</p>
                </div>
              </div>
            ) : (
              // Display courses
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCourses.map((course, index) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];
                  const absoluteIndex = currentIndex + index;
                  const courseColor = colors[absoluteIndex % colors.length];
                  
                  return (
                    <div
                      key={course.id}
                      className="w-full sm:w-[340px] md:w-[360px] lg:w-[398px] h-auto sm:h-[320px] md:h-[330px] lg:h-[338px] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 mx-auto"
                    >
                      {/* Course Illustration */}
                      <CourseIllustration 
                        title={course.title} 
                        color={courseColor} 
                        bannerImageUrl={course.bannerImageUrl}
                      />
                      
                      <div className="p-4 sm:p-5 md:p-6">
                        {/* Rating */}
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-current" />
                          <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1">
                            {course.rating} ({course.reviews})
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-center text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 px-2">
                          {course.title}
                        </h3>
                        
                        {/* Duration */}
                        <p className="text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                          Duration: {course.duration}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                          <button 
                            className="w-[110px] sm:w-[120px] md:w-[134px] h-[24px] sm:h-[26px] text-[10px] sm:text-[11px] md:text-[12px] border-1 rounded-xl text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            onClick={() => {
                              // Handle download brochure
                              console.log('Download brochure for:', course.title);
                            }}
                          >
                            Download Brochure
                          </button>
                          <button
                            className="w-[110px] sm:w-[120px] md:w-[134px] h-[24px] sm:h-[26px] text-[10px] sm:text-[11px] md:text-[12px] border-1 rounded-xl text-[black] hover:text-black-800 font-bold transition-colors"
                            onClick={() => {
                              if (course.videoDemoUrl && course.videoDemoUrl !== '#') {
                                window.open(course.videoDemoUrl, "_blank");
                              } else {
                                console.log('View program for:', course.title);
                              }
                            }}
                          >
                            View Program
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

           

            
              {/* Navigation & View All */}
          {courses.length > 0 && (
            <div className="mt-6 sm:mt-8 mb-8 sm:mb-10 pb-8 sm:pb-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 sm:gap-8 md:gap-12 lg:gap-100">
                <button
                  onClick={prevSlide}
                  disabled={!canNavigate || currentIndex === 0}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => navigate("/courses")}
                  className="bg-white border-2 border-[#FFE6A1] text-sm sm:text-base md:text-lg lg:text-[20px] text-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-4xl font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 sm:gap-3 md:gap-4"
                >
                  View All
                  <span className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center border-2 rounded-3xl bg-[#FCB11F] text-white">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={nextSlide}
                  disabled={!canNavigate || currentIndex >= maxIndex}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              {canNavigate && (
                <div className="text-xs sm:text-sm text-gray-600">
                  {currentIndex + 1} - {Math.min(currentIndex + itemsPerPage, courses.length)} of {courses.length}
                </div>
              )}
            </div>
          )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;