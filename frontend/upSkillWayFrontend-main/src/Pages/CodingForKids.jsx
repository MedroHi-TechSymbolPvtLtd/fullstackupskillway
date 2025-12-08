import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonial from "../components/CodingForKIds/Testimonial";
import FAQSection from "../components/CodingForKIds/Faq";
import { api, endpoints } from "../utils/api";
import Coding from "../assets/Images/Coding.png";
import Coding1 from "../assets/Images/coding1.png";
import Coding2 from "../assets/Images/coding2.png";
import Coding5 from "../assets/Images/Coding5.png";
import User1 from "../assets/Images/User1.png";
import Clock1 from "../assets/Images/Clock1.png";
import BookOpen1 from "../assets/Images/BookOpen1.png";
import Award1 from "../assets/Images/Award1.png";
import Laptopn1 from "../assets/Images/Laptopn1.png";
import Hand1 from "../assets/Images/Hand1.png";
import quote1 from "../assets/Images/quote1.png";
import quote2 from "../assets/Images/quote2.png";
import Lgt from "../assets/Images/Lgt.png";
import Vec from "../assets/Images/Vec.png";
import Vec2 from "../assets/Images/Vec2.png";
import Vec3 from "../assets/Images/Vec3.png";
import School from "../assets/Images/school.png";



import {
  BookOpen,
  Brain,
  Lightbulb,
  Award,
  Play,
  Code,
  Gamepad2,
  Smartphone,
  GraduationCap,
  Users,
  Building,
  Briefcase,
  HeadphonesIcon,
  Trophy,
  Zap,
  Target,
  Rocket,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Star,
  Box,
  Cpu,
  Clock,
  Package,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Monitor,
  Handshake,
  FileEdit,
} from "lucide-react";

const CodingForKids = () => {
  const navigate = useNavigate();
  
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgeTab, setSelectedAgeTab] = useState("all");
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Function to extract YouTube thumbnail from video URL
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    
    // Extract video ID from various YouTube URL formats
    let videoId = null;
    
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }
    
    // Format: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }
    
    // Format: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }
    
    // Return high quality thumbnail if video ID found
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    return null;
  };

  // Fetch coding courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.get(endpoints.cms.videos);

        if (data.success && data.data) {
          setVideos(data.data); // Store original data with testimonials
          
          // Extract testimonials from all videos
          const allTestimonials = data.data
            .filter(video => video.testimonial)
            .map(video => ({
              text: video.testimonial,
              authorName: video.title, // Using title as author name
              role: "Course Student",
              videoUrl: video.videoUrl,
              status: "approved"
            }));
          setTestimonials(allTestimonials);
          
          // Extract FAQs from all videos
          const allFaqs = data.data
            .filter(video => video.faqs && Array.isArray(video.faqs))
            .flatMap(video => video.faqs.map(faq => ({
              ...faq,
              id: `${video.slug}-${faq.question}` // Create unique ID
            })));
          setFaqs(allFaqs);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Error fetching courses: " + err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const existingLink = document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=Rubik"]'
    );

    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://fonts.googleapis.com";
      document.head.appendChild(link);

      const link2 = document.createElement("link");
      link2.rel = "preconnect";
      link2.href = "https://fonts.gstatic.com";
      link2.crossOrigin = "anonymous";
      document.head.appendChild(link2);

      const fontLink = document.createElement("link");
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);

  

  

  

  

  // Age group tabs configuration (max 6 tabs)
  const ageTabs = [
    { id: "all", label: "All Ages" },
    { id: "6-8", label: "6-8 Years" },
    { id: "9-11", label: "9-11 Years" },
    { id: "12-14", label: "12-14 Years" },
    { id: "15-17", label: "15-17 Years" },
    { id: "18+", label: "18+ Years" },
  ];

  // Filter videos based on selected age tab
  

  

  

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 sm:pt-16 md:pt-20 pb-6 sm:pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-left relative">
              <h1 className="w-full max-w-full sm:max-w-[500px] md:max-w-[580px] lg:max-w-[630px] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Welcome To The World Of{" "}
                <span className="text-[#FF9500]">Coding </span>
                Fun!
              </h1>
              <p className="w-full max-w-full sm:max-w-[400px] md:max-w-[450px] lg:max-w-[483px] text-lg sm:text-xl md:text-[22px] lg:text-[24px] text-gray-700 mb-4 sm:mb-6 md:mb-8 font-semibold">
                Where imagination meets technology — and every child becomes a creator!
              </p>
              <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  At Upskillway, kids don't just play games — they create them!
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  We make learning to code easy, exciting, and full of creativity.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  From building stories and animations to making real games and apps coding has never been this much fun!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 relative z-10">
                <button
                  onClick={() => {
                    const element = document.getElementById('coding-courses');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-gray-900 text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Start Learning Today
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-[#FF9500] text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-[#FF8500] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Book Free Trial
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="w-full mt-4 sm:mt-5 md:mt-6">
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-center">
                  {[
                    { value: "200+", label: "Futuristic Schools" },
                    { value: "40+", label: "Countries' Learners" },
                    { value: "1,00,000+", label: "Student Coders" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 py-3 sm:py-4 px-2 sm:px-4"
                    >
                      <div className="font-['Plus_Jakarta_Sans'] font-semibold text-base sm:text-lg text-gray-900">
                        {stat.value}
                      </div>
                      <div className="font-['Plus_Jakarta_Sans'] font-medium text-xs sm:text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[700px] mt-6 lg:mt-0">
              {/* Large Purple Circular Background */}
              <div className="flex items-center justify-center h-full">
                {/* Coding Image Inside Circle */}
                <div className="flex items-center justify-center">
                  <img
                    src={Coding5}
                    alt="Kids coding together"
                    className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[624px] h-auto object-contain"
                  />
                </div>
              </div>

              {/* Floating Icons and Labels */}
              {/* Code Tags Icon - Top Left */}
              

              {/* Lightbulb Icon - Top Right */}
             

             


            

              {/* Small Circular Shapes - Top Right Corner */}
              <div className="absolute top-4 right-4 z-20">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-pink-300 rounded-full opacity-70"></div>
                  <div className="w-4 h-4 bg-orange-300 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="-mt-10 sm:-mt-12 md:-mt-16 lg:-mt-20 bg-white w-full">
        <div className="w-full">
          <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8 font-medium">
            Trusted By
          </p>
          <div className="w-full relative overflow-hidden mb-16">
            <style>
              {`
                @keyframes scroll-left {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-scroll {
                  animation: scroll-left 40s linear infinite;
                }
              `}
            </style>
            <div className="flex animate-scroll">
              {/* Render content multiple times for infinite effect */}
              {[...Array(4)].map((_, setIndex) => (
                <div
                  key={`set-${setIndex}`}
                  className="flex items-center gap-12 sm:gap-16 px-8"
                >
                  {loading ? (
                    <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                      Loading...
                    </div>
                  ) : videos.length > 0 &&
                    videos.some((v) => v.masteredTools) ? (
                    videos
                      .filter((video) => video.masteredTools)
                      .flatMap((video) =>
                        Array.isArray(video.masteredTools)
                          ? video.masteredTools
                          : [video.masteredTools]
                      )
                      .map((tool, index) => (
                        <div
                          key={`${setIndex}-${index}`}
                          className="flex flex-col items-center gap-3 min-w-[200px]"
                        >
                          {typeof tool === "object" && tool.logoUrl ? (
                            <>
                              <img
                                src={tool.logoUrl}
                                alt={tool.name || "Tool logo"}
                                className="h-16 w-auto object-contain"
                              />
                              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                {tool.name}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                              {typeof tool === "object" ? tool.name : tool}
                            </span>
                          )}
                        </div>
                      ))
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                        Google+
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                        ■ Microsoft
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                        Ⓐ MetalLB
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                        Linked⬛in
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold italic whitespace-nowrap">
                        Instagram
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                        🍎 Pay
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Empowerment Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 sm:mb-16">
            Empowering <span className="text-[#FF9500]">Young Minds</span>{" "}
            through Coding Education
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 mb-8">
            {[
              { icon: Star, title: "Hands-On Learning" },
              { icon: Box, title: "STEM Focus" },
              { icon: Cpu, title: "Coding Basics" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#A3A3F5] rounded-full flex items-center justify-center flex-shrink-0">
                  <item.icon
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                    strokeWidth={2}
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
          {/* Bottom Separator Line */}
          <div className="w-full max-w-6xl mx-auto border-t border-gray-300 mb-[-70px]"></div>
        </div>
      </section>

      {/* Popular Coding Courses Section */}
      <section id="coding-courses" className="py-12 sm:py-16 md:py-20 mt-[-10px] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Explore Our <span className="text-[#FFB84D]">Popular</span> Coding
            Courses for Kids
          </h2>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Find the perfect starting point for your child’s journey. Our curriculum is tailored by age and interest, ensuring 
          maximum engagement and skill development.
          </p>

          {/* Age Group Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {ageTabs.map((tab) => (
              <button
                
                key={tab.id}
                onClick={() => setSelectedAgeTab(tab.id)}
                className={`w-[170px] h-[40px] px-4 sm:px-6 py-2 sm:py-1 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  selectedAgeTab === tab.id
                    ? "text-[#FFB84D] shadow-lg scale-105"
                    : "border-4 border-gray-100  text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {videos.map((course) => {
                // Debug log
                console.log('Course data:', {
                  title: course.title,
                  imageUrl: course.imageUrl,
                  videoUrl: course.videoUrl
                });

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {/* Try YouTube thumbnail first, then imageUrl, then fallback */}
                      {(() => {
                        const youtubeThumbnail = getYouTubeThumbnail(course.videoUrl);
                        const thumbnailUrl = youtubeThumbnail || course.imageUrl;
                        
                        return thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('Image failed to load:', thumbnailUrl);
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.fallback-bg');
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null;
                      })()}
                      
                      {/* Fallback gradient background */}
                      <div
                        className="fallback-bg absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-400 to-orange-400"
                        style={{ display: (getYouTubeThumbnail(course.videoUrl) || course.imageUrl) ? 'none' : 'flex' }}
                      >
                        <Code className="w-16 h-16 text-white" />
                      </div>

                      {/* Play button overlay - only if videoUrl exists */}
                      {course.videoUrl && course.videoUrl !== '#' && (
                        <a
                          href={course.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 z-10"
                        >
                          <div className="bg-white rounded-full p-3 shadow-lg">
                            <Play className="w-8 h-8 text-red-600" fill="currentColor" />
                          </div>
                        </a>
                      )}
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-3">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {course.tags &&
                          course.tags.length > 0 &&
                          course.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        {course.level && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded capitalize">
                            {course.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12 -mb-20">
            <button className="bg-gradient-to-r from-purple-600 to-[#FFB84D] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-[35px] font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity duration-300">
              Explore All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Captivating Coding Programs Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-5 mb-8 sm:mb-12">
            <h2 className="w-full font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[46px] leading-[140%] text-center text-[#101218]">
              Explore Our <span className="text-[#FF9500]">Captivating Coding Programs</span> for Kids
            </h2>
            <p className="w-full font-['Plus_Jakarta_Sans'] font-normal text-lg sm:text-xl md:text-[18px] leading-[160%] text-center text-[#38393E] max-w-3xl mx-auto">
              Choose the perfect learning path that fits your child's schedule and learning goals.
            </p>
          </div>
          
          {/* Program Type Cards */}
          <div className="w-full mb-12 sm:mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
              {[
                { name: 'Online Courses', icon: Laptop, color: '#A3A3F5' },
                { name: 'Virtual Programs', icon: Monitor, color: '#FF9500' },
                { name: 'School Partnership Programs', icon: Building, color: '#10B981' },
                { name: 'Teacher Training Programs', icon: GraduationCap, color: '#8B5CF6' },
                { name: 'In-School Curriculum Integration', icon: BookOpen, color: '#F59E0B' }
              ].map((program, index) => {
                const IconComponent = program.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate('/courses')}
                    className="w-full max-w-[270px] bg-white border border-gray-200 hover:border-[#FF9500] rounded-[16px] px-5 py-5 flex items-center gap-3 cursor-pointer transition-all duration-300 shadow-[0px_6px_30px_rgba(0,0,0,0.05)] hover:shadow-[0px_15px_40px_rgba(0,0,0,0.12)] min-h-[60px]"
                  >
                    <div 
                      className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: program.color }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm sm:text-base text-[#18181B] leading-[14px]">
                      {program.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Program Cards */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* For Schools Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
              <div className="h-64 sm:h-80 overflow-hidden">
                <img 
                  src={Coding1} 
                  alt="School coding classroom" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  For <span className="text-[#FF9500]">Schools</span>
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our school-focused coding curriculum seamlessly integrates into classroom learning — replacing outdated computer science textbooks with a modern, interactive, and engaging approach.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Designed for grades 1-10, aligned with STEM standards',
                    'Hands-on coding projects with real-world applications',
                    'Simplified integration into your existing curriculum',
                    'Certified instructors with child-focused teaching expertise',
                    'Blended learning options – available both online and in-school',
                    'Coding upskilling programs for school teachers',
                    'Fun, gamified coding sessions',
                    'Assessments, certificates & competitions'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CheckCircle className="w-5 h-5 text-[#FF9500] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-[#FF9500] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#FF8500] transition-colors duration-300 ml-45"
                >
                  Start Partnership
                </button>
              </div>
            </div>

            {/* For Individual Students Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
              <div className="h-64 sm:h-80 overflow-hidden">
                <img 
                  src={Coding2} 
                  alt="Individual student learning coding" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  For <span className="text-[#FF9500]">Individual Students</span>
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our personalized online coding programs allow kids to learn from the comfort of home with live instructor-led sessions.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Live, interactive classes with expert mentors',
                    'Personalized learning paths based on age and skill level',
                    'Fun, game-based projects to build logic and creativity',
                    'Flexible schedules – learn at your own pace',
                    'Small group or one-on-one sessions available',
                    'Progress tracking and performance feedback',
                    'Certification on course completion',
                    'Real-world mini projects to apply coding concepts'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <CheckCircle className="w-5 h-5 text-[#FF9500] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-[#FF9500] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#FF8500] transition-colors duration-300 ml-45 mt-10"
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wrapper Container with Border for All Sections */}
      <div className="w-full max-w-[1437px] mx-auto my-8 sm:my-12 px-2 sm:px-4 md:px-8 border border-[#FDB11F] rounded-[20px]">


      {/* Bring Coding to Your School Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-4">
            <img src={School} alt="School" className="w-[70px] h-[70px] object-contain" />            
          </div>
          
          {/* Sub-heading */}
          <p className="text-center text-[#FDB11F] font-['Rubik'] font-medium uppercase text-xl sm:text-2xl mb-4 tracking-normal leading-tight">
            FOR SCHOOLS & INSTITUTIONS
          </p>
          
          {/* Main Heading */}
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[56px] leading-[140%] text-center text-[#101218] mb-4">
            Bring <span className="text-[#FF9500]">Coding</span> to Your School
          </h2>
          
          {/* Introductory Text */}
          <p className="text-center text-[#0D0D0D] font-['Plus_Jakarta_Sans'] font-normal text-lg sm:text-xl mb-3 max-w-3xl mx-auto leading-[160%]">
            Partner with Upskillway to equip your students with tomorrow's tech skills
          </p>
          <p className="text-center text-[rgba(56,57,62,0.8)] font-['Plus_Jakarta_Sans'] font-normal text-lg sm:text-xl mb-12 sm:mb-16 max-w-5xl mx-auto leading-[160%]">
            Join 100+ schools that have transformed their STEM programs with our comprehensive, easy-to-implement coding curriculum. No technical expertise required.
          </p>
          
          {/* Value Proposition Cards - 8 cards in 2 rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* First Row - 4 cards */}
            {[
              { label: '100+', text: 'Partner Schools' },
              { label: '90%', text: 'School Satisfaction' },
              { label: '', text: 'Certified Expert Instructors' },
              { label: '', text: 'Hands-on Project-Based Learning' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[20px] h-[85px] p-4 flex items-center gap-3 border border-gray-400">
                <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" strokeWidth={2} />
                <div className="flex flex-col">
                  {item.label && (
                    <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[20px] leading-[28px] tracking-[-0.2px] text-[#18181B]">
                      {item.label}
                    </span>
                  )}
                  <span className="font-['Plus_Jakarta_Sans'] font-medium text-[18px] leading-[28px] tracking-[-0.2px] text-[rgba(24,24,27,0.7)]">
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second Row - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { text: 'Teacher Upskilling Programs' },
              { text: 'Flexible Online & Offline Models' },
              { text: 'Digital Certificates for Students' },
              { text: 'Hackathons & Tech Events' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[20px] h-[85px] p-4 flex items-center gap-3 border border-gray-400">
                <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" strokeWidth={2}  />
                <span className="font-['Plus_Jakarta_Sans'] font-medium text-[18px] leading-[28px] tracking-[-0.2px] text-[rgba(24,24,27,0.7)]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Coding for Kids Section */}
      <section className="py-12 sm:py-16 md:py-20 -mt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[48px] leading-[142%] text-center text-black mb-12 sm:mb-16s capitalize sm:mt-20">
            Benefits Of <span className="text-[#FF9500]">Coding</span> For Kids
          </h2>
          
          {/* Layout with illustration in center and cards on sides */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 -mt-[65px]">
            {/* Left Column - 3 Benefit Cards */}
            <div className="flex flex-col gap-6 w-[310px] h-[50]    ">
              <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2 ">
                <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                <img src={User1} alt="User" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Boosts Logical Thinking & Problem-Solving</span>
              </div>
              <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2">
                <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                  <img src={BookOpen1} alt="BookOpen" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Improves Academic Performance</span>
              </div>
              <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2">
                <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                  <img src={Clock1} alt="Clock" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Make Kids Future Ready</span>
              </div>
            </div>

            {/* Center Illustration */}
            <div className="w-full max-w-md lg:max-w-lg flex-shrink-0 order-first lg:order-none">
              <div className="relative bg-white rounded-lg p-4 sm:p-8 flex items-center justify-center">
                {/* Using Coding.png as illustration */}
                <img 
                  src={Coding} 
                  alt="Boy coding illustration" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Right Column - 3 Benefit Cards */}
            <div className="flex flex-col gap-6 sm:gap-8 w-full lg:w-auto lg:max-w-xs">
            <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2">
            <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                <img src={Laptopn1} alt="Laptopn1" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Enhances Coding Quotient</span>
              </div>
              <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2">
                <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                  <img src={Award1} alt="Award" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Develops Creativity & Imagination</span>
              </div>
              <div className="border-2 border-[rgba(93,56,222,0.5)] rounded-[15px] bg-white flex items-center gap-2">
                <div className="w-[87.44px] h-[90px] bg-[rgba(93,56,222,0.5)] rounded-[15px] flex items-center justify-center flex-shrink-0">
                  <img src={Hand1} alt="Hand1" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
                </div>
                <span className="font-['Open_Sans'] font-normal text-base leading-[16px] text-[#0062C9]">Builds Collaboration Skills</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do for Schools & Institutions Section */}
      <section className="py-12 sm:py-16 md:py-20 -mt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[42px] leading-[63px] text-left text-[#141219] mb-3   -mt-10">
            What We Do for <span className="text-[#FF9500]">Schools & Institutions</span>
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base lg:text-[16px] text-left text-[#38393E] mb-8 sm:mb-10 lg:mb-14 leading-relaxed lg:leading-[160%] whitespace-normal lg:whitespace-nowrap">
            Upskillway partners with schools and institutions to design and deliver modern, skill-based coding programs that foster digital <br className="hidden lg:block" /> literacy, creativity, and innovation in students.
          </p>
          <div className="font-['Plus_Jakarta_Sans'] font-normal text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { 
                icon: Target, 
                title: 'Customized Coding Curriculum',
                description: 'Tailored learning paths aligned with your school\'s grade structure and learning outcomes.'
              },
              { 
                icon: Users, 
                title: 'Teacher & Faculty Enablement',
                description: 'Provide comprehensive training and continuous support to help teachers deliver coding confidently.'
              },
              { 
                icon: Briefcase, 
                title: 'Hands-on Projects',
                description: 'Project-based lessons that turn theory into practice through games, animations, and real-life applications.'
              },
              { 
                icon: TrendingUp, 
                title: 'School Branding & Growth Support',
                description: 'Co-branded certifications, competitions, and events that position your school as a future-ready institution.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[16px] p-6 sm:p-8 border-2 border-[#E9E9E9] shadow-[0px_0px_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300">
                {/* Icon in yellow square with rounded corners */}
                <div className="w-14 h-14 bg-[#FDB11F] rounded-[12px] flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-white" strokeWidth={2.33} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl leading-[20px] text-[#111827] mb-3 text-left">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] font-Regular text-base leading-[16px] text-[#374151] text-left">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Students Gain Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white -mt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[50px] leading-[63px] text-left text-[#141219] mb-2">
            What <span className="text-[#FF9500]">Students Gain</span>
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-base sm:text-lg lg:text-xl text-left text-[#38393E] mb-6 sm:mb-8 lg:mb-12 leading-relaxed lg:leading-[160%] whitespace-normal lg:whitespace-nowrap">
            Empower your students with essential coding and problem-solving skills that prepare them for the digital future.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { 
                icon: Rocket, 
                title: 'Future-Ready Skills',
                description: 'Students learn logic, design, and coding through fun, interactive sessions.'
              },
              { 
                icon: Award, 
                title: 'Recognized Certifications',
                description: 'Earn Upskillway-School co-branded certificates that add value to their academic profile.'
              },
              { 
                icon: TrendingUp, 
                title: 'Creative Thinking & Collaboration',
                description: 'Kids develop innovation, teamwork, and presentation skills through project-based learning.'
              },
              { 
                icon: Briefcase, 
                title: 'Confidence & Curiosity',
                description: 'Hands-on practice builds self-belief and interest in STEM subjects from an early age.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[16px] p-6 sm:p-8 border-2 border-[#E5E5E5] shadow-[0px_0px_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300">
                {/* Icon in yellow square with rounded corners */}
                <div className="w-14 h-14 bg-[#FDB11F] rounded-[12px] flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-white" strokeWidth={2.33} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl leading-[25px] text-[#111827] mb-3 text-left">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-[19px] text-[#374151] text-left">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div>
            <img src={quote1} alt="quote1 align center" className="mx-auto -mt-30" />
          </div>
      </section>

      {/* What Schools & Institutions Gain Section */}
      <section className="py-12 sm:py-16 md:py-20 -mt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[50px] leading-[63px] text-left text-[#141219]">
            What <span className="text-[#FFB84D]">Schools & Institutions</span> Gain
          </h2>
          <p className="text-left text-gray-600 mb-8 sm:mb-12 lg:mb-16 whitespace-normal lg:whitespace-nowrap leading-relaxed">
          Our partnerships go beyond coding classes — they enhance your academic value, teacher capacity, and institutional reputation.          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Award, title: 'Zero Infrastructure Cost', description: 'No setup investment required from your college' },
              { icon: Users, title: 'No Faculty Burden', description: 'Our expert trainers handle everything' },
              { icon: TrendingUp, title: 'Enhanced College Reputation', description: 'Boost rankings with higher placement rates' },
              { icon: Building, title: 'Transparent Progress Reports', description: 'Monthly analytics on student performance' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[16px] p-6 sm:p-8 border-2 border-[#E5E5E5] shadow-[0px_0px_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="w-14 h-14 bg-[#FDB11F] rounded-[12px] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" strokeWidth={2.33} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl leading-[20px] text-[#111827] mb-2">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-[16px] text-[#374151]">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <img src={quote2} alt="quote1 align center" className="mx-auto" />
            </div>
        </div>
      </section>

      {/* Choose Your Partnership Model Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white -mt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Choose Your <span className="text-[#FFB84D]">Partnership Model</span>
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 lg:mb-16 whitespace-normal lg:whitespace-nowrap leading-relaxed px-4 lg:px-0 max-w-4xl mx-auto">
          Flexible collaboration options tailored to your school’s goals and teaching framework. Select a <br className="hidden lg:block"></br> model that fits your academic structure, schedule, and student needs.          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12 px-4 lg:px-0">
            {[
              { title: 'School Franchise / Long-Term Collaboration Model', subtitle: 'Become a certified Upskillway partner school with long-term educational benefits.', features: ['Exclusive partnership rights', 'Access to all Upskillway learning modules', 'Joint branding and marketing opportunities','Continuous educator support and content updates'] },
              { title: 'Coding Bootcamps for Schools', subtitle: 'Short-term intensive programs focused on mastering specific coding skills.', features: ['2–4 week bootcamp format', 'Focused on topics like Python, AI, or Game Design', 'Real-world project development','Certificates of completion for participants'] },
              { title: 'Virtual/Hybrid Lab Mode', subtitle: 'State-of-the-art online platform enabling flexible delivery for any situation.', features: ['Live instructor sessions', 'Self-paced modules available', 'Real-time progress tracking', 'Works with any device'] },
              { title: 'Custom Curriculum Partnership', subtitle: 'Tailor Upskillway’s curriculum to align with your school’s academic goals.', features: ['Choose topics, duration, and delivery style', 'Combine online + offline modes', 'Multi-grade learning plans', 'Custom branding for partner schools'] },
              { title: 'Teacher Certification Programs', subtitle: 'Empower your existing faculty to teach coding with confidence and expertise.', features: ['40-hour certification course', 'Ongoing mentorship support', 'Teaching resource library','Annual refresher workshops'] },
              { title: 'Corporate School Partnership Model', subtitle: 'Ideal for large school chains and educational groups seeking a scalable model.', features: ['Centralized training for all branches', 'Cross-branch competition support','Unified reporting and dashboard', 'Co-branding and national recognition'] }
            ].map((model, index) => (
              <div key={index} className="w-full lg:w-[511px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-xl mx-auto">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  index === 0 ? 'bg-blue-100' : 
                  index === 1 ? 'bg-orange-100' : 
                  index === 2 ? 'bg-green-100' : 
                  index === 3 ? 'bg-purple-100' : 
                  index === 4 ? 'bg-indigo-100' : 'bg-pink-100'
                }`}>
                  {index === 0 && <Handshake className="w-8 h-8 text-blue-600" />}
                  {index === 1 && <Zap className="w-8 h-8 text-orange-600" />}
                  {index === 2 && <Monitor className="w-8 h-8 text-green-600" />}
                  {index === 3 && <FileEdit className="w-8 h-8 text-purple-600" />}
                  {index === 4 && <GraduationCap className="w-8 h-8 text-indigo-600" />}
                  {index === 5 && <Building className="w-8 h-8 text-pink-600" />}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{model.title}</h3>
                {model.subtitle && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{model.subtitle}</p>
                )}
                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  {model.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-600 text-xs sm:text-sm">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-[#FFB84D] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#FF9500] transition-colors duration-300 mx-auto block w-full sm:w-auto"
                >
                  View More
                </button> 
              </div>
            ))}
          </div>
          <div className="w-full sm:w-auto sm:max-w-[652px] h-auto sm:h-[30px] rounded-2xl sm:rounded-3xl text-center font-semibold text-black-600 mb-8 sm:mb-12 lg:mb-16 py-2 sm:py-1 whitespace-normal sm:whitespace-nowrap bg-[#FFDE6B] mx-auto block px-4 sm:px-6">
          Not sure which model is right for your school? Let us help you decide.
                      </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-[#FFB84D] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-4xl font-semibold text-base sm:text-lg hover:bg-[#FF9500] transition-colors duration-300"
            >
              Become a Partner
            </button>
            <button 
              onClick={() => navigate('/contact')}
              className="bg-gray-900 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-4xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Why Partner With Us? Section */}
      <section className="py-12 sm:py-16 md:py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[55px] leading-[69px] text-left text-[#141219] mb-4">
            Why <span className="text-[#FFB84D]">Partner</span> With Us?
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-left sm:text-xl text-center text-[#38393E] mb-12 sm:mb-16 max-w-4xl leading-[160%]">
            Discover the key advantages of partnering with Upskillway for your institution.
          </p>
          
          {/* Feature Cards Grid - 2x2 layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Top Row */}
            <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#F3E8FF] shadow-[0px_0px_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#FDB11F] rounded-[16px] flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-2">
                    Curriculum Aligned with Future Skills
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] font-normal text-lg leading-[18px] text-[#374151] mb-3">
                    Students gain critical thinking, creativity, and problem-solving skills aligned with modern education standards.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                    Regularly updated to match global education trends.
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#F3E8FF] shadow-[0px_2px_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#FDB11F] rounded-[16px] flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-2">
                    Certified Trainers & Mentors
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans']font-normal text-lg leading-[18px] text-[#374151] mb-3">
                    Experienced instructors make coding engaging and easy to understand for every grade level.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                    Hands-on training by certified experts. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Bottom Row */}
            <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#F3E8FF] shadow-[0px_0px_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#FDB11F] rounded-[16px] flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-2">
                    Project-Based Learning Approach
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans']font-normal text-lg leading-[18px] text-[#374151] mb-3">
                    Through hands-on projects like games and animations, kids turn ideas into real creations.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                    Kids create, build, and explore. </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#F3E8FF] shadow-[0px_0px_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#FDB11F] rounded-[16px] flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-2">
                    Continuous Support & Assessment
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] font-normal text-lg leading-[18px] text-[#374151] mb-3">
                    Continuous mentorship for 6 months after placement to ensure student success and retention.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                    We track each child's progress and provide continuous support to keep them motivated and confident. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white -mt-30">
       {/* Wrapper Container with Border for All Sections */}
      <div className="w-full max-w-[1437px] mx-auto my-8 sm:my-12 px-2 sm:px-4 md:px-8 border border-[#FDB11F] rounded-[20px] border-b-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[16px] p-8 sm:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              {[
                { number: '50K+', label: 'Students Trained' },
                { number: '400+', label: 'Colleges' },
                { number: '92%', label: 'Placement Rate' },
                { number: '200+', label: 'Corporate Partners' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[48px] leading-[60px] text-black mb-2">{stat.number}</div>
                  <div className="font-['Inter'] font-normal text-lg leading-[22px] text-[rgba(0,0,0,0.7)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* What Signing an MoU Means Section */}
      <section className="py-12 sm:py-16 md:py-20 -mt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="flex justify-center mb-4 -mt-15">
            <div className="bg-[#EA580C] rounded-full px-4 py-2">
              <span className="font-['Inter'] font-bold text-sm leading-[17px] text-white -">MoU PARTNERSHIP BENEFITS</span>
            </div>
          </div>
          
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[55px] leading-[48px] text-center text-[#111827] mb-6">
            What Signing an <span className="text-[#FFB84D]">MoU</span> Means for Your School
          </h2>
          <p className="font-['Inter'] font-normal text-lg sm:text-xl text-center text-[#374151] mb-12 sm:mb-16 max-w-4xl mx-auto leading-[20px]">
            Experience a transparent, value-driven partnership that brings coding and innovation to your classrooms — with zero setup cost and complete institutional support.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {[
              { icon: BookOpen, title: 'Zero Risk Partnership', description: 'No liability until placement delivered. Pilot program option available.' },
              { icon: Users, title: 'Dedicated Academic Manager', description: '24/7 support with a single point of contact for all your needs.' },
              { icon: Award, title: 'Institutional Branding & Recognition', description: 'Position your school as a future-ready, tech-driven institution.' },
              { icon: HeadphonesIcon, title: 'Co-branded Certificates', description: 'Joint certification programs that add value to student credentials.' },
              { icon: Building, title: 'Transparent MoU Terms', description: 'Clear, flexible agreements with no hidden costs or surprise fees.' },
              { icon: Trophy, title: 'Exclusive School Events & Competitions', description: 'Join inter-school coding and innovation events.' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-[16px] p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-[#FDB11F] rounded-[16px] flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl leading-[24px] text-[#111827] mb-3">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-[19px] text-[#374151]">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { title: '0', desc: 'Setup Cost' },
              { title: '24/7', desc: 'Dedicated Support' },
              { title: '100%', desc: 'Transparency' }
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-[16px] p-8 text-center  border-1 border-[#FDB11F] rounded-[25px] border-t-white ">
                <div className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[48px] leading-[60px] text-black mb-2">{metric.title}</div>
                <div className="font-['Plus_Jakarta_Sans'] font-normal text-lg leading-[18px] text-[#636363]">{metric.desc}</div>
              </div>
            ))}
          </div>
          
          {/* Pilot Batch Notice */}
          <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)]">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#FFEDD5] rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-[#EA580C]" strokeWidth={2.67} />
              </div>
              <div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-2">
                  Not ready for a full rollout? Start with a pilot batch.
                </h3>
                <p className="font-['Plus_Jakarta_Sans']font-normal text-lg leading-[18px] text-[#374151]">
                  Evaluate real classroom outcomes before expanding across grades — no risk, complete flexibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnering with Upskillway Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 mb-12 -mt-15">
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[55px] leading-[59px] text-center text-[#1E242C]">
              Partnering with Upskillway is Simple, Strategic, and<span className="text-[#FFB84D]"> School-Focused</span>
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] font-normal text-lg sm:text-xl text-center text-[#374151] max-w-5xl mx-auto leading-[20px]">
              We tailor every partnership to align with your school's academic goals. From planning to implementation, Upskillway ensures a seamless integration that enhances your students' learning experience and your institution's reputation.
            </p>
          </div>
          
          {/* 4-Step Process Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
            {[
              { 
                icon: Users, 
                title: 'Connect With Us',
                description: 'Schedule a quick consultation with our academic partnership team to understand your school\'s goals and student learning objectives.',
                note: 'Simple, quick, and fully guided — no lengthy paperwork.'
              },
              { 
                icon: Briefcase, 
                title: 'Custom Proposal & MoU',
                description: 'We design a customized MoU and curriculum plan aligned with your academic calendar, grade levels, and learning priorities.',
                note: 'Flexible partnership options — perfectly suited to your school\'s structure.'
              },
              { 
                icon: Rocket, 
                title: 'Training Implementation',
                description: 'Our expert trainers conduct engaging, hands-on coding sessions — either on-campus or online — integrated seamlessly into your timetable.',
                note: 'Led by certified instructors using project-based learning methods.'
              },
              { 
                icon: TrendingUp, 
                title: 'Ongoing Support & Growth',
                description: 'We provide continuous academic and technical support, student progress reports, and regular curriculum updates to ensure long-term success.',
                note: 'Your school\'s success is our shared achievement.'
              }
            ].map((item, index) => (
              <div key={index} className="w-[280px] h-[516px] bg-white rounded-[16px] p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-b from-[#FDB11F] to-[#976A13] rounded-[16px] flex items-center justify-center mb-14 mx-auto">
                  <item.icon className="w-8 h-8 text-white" strokeWidth={2.67} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl leading-[24px] text-[#111827] mb-13 text-center">
                  {item.title}
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-[19px] text-[#374151] mb-14 text-left px-7">
                  {item.description}
                </p>
                <div className="bg-gradient-to-r from-[#FAF5FF] to-[#FFF7ED] rounded-xl p-4 border-l-4 border-[#F97316]">
                  <p className="font-['Plus_Jakarta_Sans'] font-medium text-sm leading-[14px] text-[#374151] text-center">
                    {item.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Banner */}
          <div>
          <div className="w-full sm:w-auto sm:max-w-[652px] h-auto sm:h-[30px] rounded-2xl sm:rounded-3xl text-center text-sm sm:text-base font-semibold text-black-600 mb-8 sm:mb-12 lg:mb-16 py-2 sm:py-1 whitespace-normal sm:whitespace-nowrap bg-[#FEF9F8] mx-auto block px-4 sm:px-6">
          One partnership can boost placements — let’s get your students industry-ready.                      </div>
            </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button 
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-[#9333EA] to-[#7E22CE] text-white px-8 sm:px-12 py-4 sm:py-[15px] rounded-full font-['Inter'] font-semibold text-lg leading-[22px] shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity duration-300"
              >
                Sign MoU with Upskillway
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-8 sm:px-12 py-4 sm:py-[15px] rounded-full font-['Inter'] font-semibold text-lg leading-[22px] shadow-[0px_4px_6px_rgba(0,0,0,0.1),0px_10px_15px_rgba(0,0,0,0.1)] hover:opacity-90 transition-opacity duration-300"
              >
                Request a Demo
              </button>
            </div>
        </div>
        <div className="pt-[100px]">
        <Testimonial testimonials={testimonials} />
            </div>
      </section>

      {/* Ready for Partnership CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 relative -mt-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-[rgba(255,255,255,0.1)] border border-[rgba(253,177,31,0.5)] rounded-[24px] p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Decorative Images */}
            <div className="absolute right-8 bottom-[-5px] opacity-100 hidden lg:block rotate-[360deg]">
              <img src={Vec} alt="Vec right bottom" className="w-[323px] h-[102px] object-contain"/>
            </div>
            <div className="absolute -left-35 -top-1 rotate-[120deg] opacity-100 hidden lg:block rotate-[360deg] scale-110">
              <img src={Vec2} alt="Vec2 left top" className="w-[323px] h-[102px] object-contain"/>
            </div>
            <div className="absolute right-16 -top-6 rotate-[-171.73deg] opacity-100 hidden lg:block rotate-[360deg]">
              <img src={Vec3} alt="Vec3 right top" className="w-[341px] h-[138px] object-contain"/>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
              {/* Left Content */}
              <div className="flex flex-col gap-4">
               <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-4xl sm:text-5xl md:text-[42px] leading-[48px] text-left text-[#111827] mb-4">
                Ready for <span className="text-[#FFB84D]">Partnership</span>?
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] font-normal text-lg sm:text-xl md:text-2xl lg:text-[32px] leading-[160%] text-[#0D0D0D]">
                Join the Growing Community of Schools transforming educations
                </p>
                <span className="font-['Plus_Jakarta_Sans'] leading-[160%]">
                  Connect with our team to discuss collobration <br></br> opportunities and bring coding to your classrooms.</span>
                  <div className="grid grid-cols-2 mt-10">
                  <button 
                  onClick={() => navigate('/contact')}
                  className="bg-[#FDB11F] text-white px-3 sm:px-4 py-3 sm:py-2 rounded-[80px] font-['Plus_Jakarta_Sans'] font-bold text-[16px] leading-[23px] hover:bg-[#FF9500] transition-colors duration-300 w-[217px] h-[49] flex items-center gap-2"                >
                  Talk to Our Team
                  <ArrowRight className="w-5 h-5" />
                  </button>

                  <button 
                  onClick={() => navigate('/contact')}
                  className="bg-[#FDB11F] text-white px-3 sm:px-4 py-3 sm:py-2 rounded-[80px] font-['Plus_Jakarta_Sans'] font-bold text-[16px] leading-[23px] hover:bg-[#FF9500] transition-colors duration-300 w-[217px] h-[49] flex items-center gap-2"
                >
                  Join Our Partnership
                  <ArrowRight className="w-5 h-5" />
                  </button>
                  </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[307px] rounded-lg flex items-center justify-center overflow-hidden">
                <img src={Lgt} alt="lgt" />
                </div>
              </div>
            </div>

            {/* Special Launch Offer Banner */}
            <div className="w-[776px] h-[117px] mt-5 sm:mt-5 bg-[rgba(253,177,31,0.1)] rounded-[20px] p-6 sm:p-8 text-center">
              <p className="font-['Plus_Jakarta_Sans'] font-bold text-base sm:text-lg leading-[14px] text-black mb-4 tracking-[0.01em]">
                Special Launch Offer: First 20 schools get 30% off implementation costs Free
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-[#5D38DE] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-['Plus_Jakarta_Sans'] font-medium text-base sm:text-lg leading-[14px] hover:bg-[#4A2BB8] transition-colors duration-300"
              >
                Claim Your School's Spot
              </button>
            </div>
          </div>
        </div>
      </section>
      
      </div>
      {/* End of Wrapper Container */}

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />
      
    </div>
  );
};

export default CodingForKids;
