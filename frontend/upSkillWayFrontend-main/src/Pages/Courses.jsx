import React, { useState , useEffect } from 'react';
import { Search, Star, Users, TrendingUp, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import anime from '../assets/Images/anime.mp4';
import { Check } from 'lucide-react';
import * as Lucide from 'lucide-react';
import ScheduleAnime from '../assets/Images/ScheduleAnime.mp4';
import Grid from "../components/Courses/Grid";
import Pagination from './Pagination'; // Add this import
import { useNavigate } from 'react-router-dom';
import config from '../config/env';



const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
const navigate = useNavigate();

  // Function to fetch courses from API
  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
  const response = await fetch(`${config.apiBaseUrl}/cms/courses?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
        setPagination(data.pagination);
        setError(null);
        // Smooth scroll to courses section
        window.scrollTo({ top: 800, behavior: 'smooth' });
      } else {
        throw new Error(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to get course card color based on index
  const getCardColor = (index) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
    ];
    return colors[index % colors.length];
  };

  // Function to get badge text based on course data
  

  // Function to generate mock rating and reviews (since API doesn't provide them)
  const getMockRating = (courseId) => {
    const hash = courseId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const rating = (4.0 + (Math.abs(hash) % 10) / 10).toFixed(1);
    const reviews = 150 + (Math.abs(hash) % 500);
    return { rating, reviews };
  };

  // Function to extract instructor name or use default
  const getInstructorName = (course) => {
    return course.creator?.name || 'Expert Instructor';
  };

  // Function to render stars for rating
  const renderStars = (rating) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(numRating)
            ? "fill-current text-amber-500"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = course.title?.toLowerCase().includes(searchLower);
    const descriptionMatch = course.description?.toLowerCase().includes(searchLower);
    const tagsMatch = course.tags?.some(tag => 
      tag.toLowerCase().includes(searchLower)
    );
    const categoryMatch = course.category?.toLowerCase().includes(searchLower);
    
    return titleMatch || descriptionMatch || tagsMatch || categoryMatch;
  });

  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-10 md:py-14 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-5 items-center">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              <div className="w-full">
                <h1 
                  className="font-bold text-black leading-none w-full" 
                  style={{
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontSize: 'clamp(2rem, 6vw, 3.625rem)',
                    lineHeight: '1.14',
                    letterSpacing: '0px',
                    fontWeight: 700
                  }}
                >
                  Transform Your 
                  <span className="bg-[#FCB11F] to-red-500 bg-clip-text text-transparent ml-2">
                  Career
                  </span>
                  <br />
                  with Our Courses
                </h1>
                
                <div className="relative w-full mt-4 sm:mt-5 md:mt-6">
                  <p 
                    className="text-sm sm:text-base md:text-lg w-full max-w-full lg:max-w-md"
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 400,
                      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                      lineHeight: '1.5',
                      letterSpacing: '0px',
                      color: '#52525B',
                      opacity: 1
                    }}
                  >Industry-aligned curriculum, expert instructors, and hands-on projects to help you master in-demand skills
                  </p>
                </div>
                <div 
                  className="relative hidden sm:block"
                  style={{
                    width: '24px',
                    height: '18px', 
                    top: '0px',
                    left: '100px',
                  }}
                  
                >
                  
                </div>
                
                <button 
                  className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3 mt-6 sm:mt-7 md:mt-8 lg:mt-10 text-sm sm:text-base font-semibold rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  onClick={() => navigate("/contact")}
                >
                  Join with us
                </button>
              </div>
              
              {/* Stats */}
              <div className="w-full">
                <div className="space-y-3 sm:space-y-4 w-full max-w-sm">
                  {/* Students Trained Card */}
                  <div 
                    className="shadow-lg w-full h-auto min-h-[70px] sm:min-h-[75px] md:min-h-[83px] rounded-2xl bg-white border border-gray-200"
                    style={{
                      boxShadow: '-2px 5px 100px 0px #0000003B'
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 h-full p-3 sm:p-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-500 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">50,000+</div>
                        <div className="text-gray-400 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">Students Trained</div>
                      </div>
                    </div>
                  </div>

                  {/* Hiring Partners Card */}
                  <div 
                    className="shadow-lg w-full h-auto min-h-[70px] sm:min-h-[75px] md:min-h-[83px] rounded-2xl bg-white border border-gray-200 sm:ml-5 md:ml-10 lg:ml-[70px]"
                    style={{
                      boxShadow: '-2px 5px 100px 0px #0000003B'
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 h-full p-3 sm:p-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-500 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">400+</div>
                        <div className="text-gray-400 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">Hiring Partners</div>
                      </div>
                    </div>
                  </div>

                  {/* Placement Rate Card */}
                  <div 
                    className="shadow-lg w-full h-auto min-h-[70px] sm:min-h-[75px] md:min-h-[83px] rounded-2xl bg-white border border-gray-200 sm:ml-5 md:ml-10 lg:ml-[70px]"
                    style={{
                      boxShadow: '-2px 5px 100px 0px #0000003B'
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 h-full p-3 sm:p-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-500 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-gray-900  font-['Plus_Jakarta_Sans']">92%</div>
                        <div className="text-gray-400 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">Placement Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Avg Salary Hike Card */}
                  <div 
                    className="shadow-lg w-full h-auto min-h-[70px] sm:min-h-[75px] md:min-h-[83px] rounded-2xl bg-white border border-gray-200"
                    style={{
                      boxShadow: '-2px 5px 100px 0px #0000003B'
                    }}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 h-full p-3 sm:p-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-500 sm:w-4 sm:h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 font-['Plus_Jakarta_Sans'] ">250%</div>
                        <div className="text-gray-400 text-xs sm:text-sm font-['Plus_Jakarta_Sans']">Avg. Salary Hike</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
            {/* Right Content - Illustration */}
            <Grid />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 sm:py-10 md:py-14 lg:py-20 px-4 sm:px-6 bg-white -mt-10 sm:-mt-12 md:-mt-16 lg:-mt-25">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Search Container with Gradient Border */}
            <div 
              className="relative w-full h-[50px] sm:h-[55px] md:h-[61px] rounded-full bg-white"
              style={{
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(180deg, #6941C6 0%, #439A02 25%, #FE5910 50%, #FCB11F 100%)',
                backgroundClip: 'padding-box, border-box',
                backgroundOrigin: 'border-box',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Search Icon */}
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" 
                size={18}
              />
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search for Courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full h-full rounded-full pl-12 sm:pl-12 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base ${
                  searchTerm ? 'pr-20 sm:pr-24' : 'pr-4'
                }`}
              />
              
              {/* Cancel Button */}
              {searchTerm && (
                <button 
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 font-medium text-[#0A84FF] hover:text-orange-500 transition-colors text-sm sm:text-base z-10"
                  onClick={() => setSearchTerm('')}
                  type="button"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid Section */}
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 bg-white min-h-screen -mt-10 sm:-mt-12 md:-mt-16 lg:-mt-25">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Courses</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive collection of courses designed to help you master new skills and advance your career.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Lucide.Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading courses...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Lucide.AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Error loading courses: {error}</p>
                <button 
                  onClick={() => fetchCourses()}
                  className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State - No courses */}
          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-20">
              <Lucide.BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No courses available at the moment.</p>
            </div>
          )}

          {/* Empty State - Search results */}
          {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && searchTerm && (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">No courses found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="text-[#0A84FF] hover:text-orange-500 transition-colors text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <>
              {/* Search Results Count */}
              {searchTerm && (
                <div className="mb-6 text-center sm:text-left">
                  <p className="text-base text-gray-600">
                    Found <span className="font-semibold text-gray-900">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} matching <span className="font-semibold text-gray-900">"{searchTerm}"</span>
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 sm:mb-12">
                {filteredCourses.map((course) => {
                  const mockData = getMockRating(course.id);
                  return (
                    <div
                      key={course.id}
                      className="w-full h-[455px] flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_15px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition"
                    >
                      <div className="relative w-full max-w-[278px] h-[190px] mx-auto mt-5">
                        <img
                          src={course.bannerImageUrl || "https://placehold.co/300x200/gray/white"}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-t-2xl"
                        />
                      </div>

                      <div className="p-5 flex flex-col gap-4 flex-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {course.category && (
                            <span className="px-3 py-1 bg-[#FDB11F] text-black rounded-full">
                              {course.category}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            {course.originalPrice && (
                              <span className="text-black line-through text-[10px] text-xl">
                                {course.originalPrice}
                              </span>
                            )}
                            {course.price && (
                              <span className="text-[#FF302F] text-xl">
                                {course.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2">
                          {course.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                              {getInstructorName(course).charAt(0).toUpperCase()}
                            </div>
                            <span>{getInstructorName(course)}</span>
                          </div>

                          <div className="flex items-center gap-1 text-amber-500">
                            {renderStars(parseFloat(mockData.rating))}
                            <span className="text-gray-500 ml-1">{mockData.reviews}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="mt-auto w-[103px] py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition mx-auto"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination Component - Only show when not searching */}
              {!searchTerm && pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    hasNext={pagination.hasNext}
                    hasPrev={pagination.hasPrev}
                    onPageChange={(page) => fetchCourses(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Consultation Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight text-black font-['Plus_Jakarta_Sans']">
                Not sure which course to choose?
              </h2>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-full lg:max-w-[431px] font-['Plus_Jakarta_Sans']">
                Schedule a free consultation with our career advisors to find the perfect course for you.
              </p>
              <div className="pt-4 sm:pt-6">
                <div className="relative inline-block group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <button className="relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl h-auto flex items-center justify-center p-4 sm:p-6">
                <div className="text-center w-full">
                  <video 
                    src={ScheduleAnime}
                    className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[598px] h-auto rounded-[20px] sm:rounded-[28px] md:rounded-[35px] mx-auto"
                    style={{
                      transform: 'rotate(0deg)',
                      opacity: 1
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Courses;
