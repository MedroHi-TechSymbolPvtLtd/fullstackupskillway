import { useState, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import config from '../../config/env';
import Certified1 from "../../assets/Images/Certified1.png"; 
import Certified from '../../assets/Images/certified2.png';
import Certified3 from "../../assets/Images/certified3.png";

const CertifiedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/cms/certified-courses`);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched courses:", data.data);
        setCourses(data.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      setError("Error fetching courses: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data for demonstration when API returns empty array
  const fallbackCourses = [
    {
      id: 1,
      title: "The Complete Graphic Design for Beginners",
      landingCardImageUrl: "https://placehold.co/300x200/mint/white",
      badgeLabel: "Design",
      price: 0,
      originalPrice: 20,
      instructor: "Wilson",
      profileImageUrl: null,
      averageRating: 4.5,
      landingShortText:
        "Master graphic design from scratch with hands-on projects",
      category: "Design",
      categoryColor: "red",
      level: "Beginner",
      type: "Crash Course",
      rating: 4.5,
      reviews: "4.5 Reviews",
      image: "https://placehold.co/300x200/mint/white",
      badge: "AI",
    },
    {
      id: 2,
      title: "Learning JavaScript With Imagination",
      landingCardImageUrl: "https://placehold.co/300x200/purple/white",
      badgeLabel: "Development",
      price: 0,
      originalPrice: null,
      instructor: "Warren",
      profileImageUrl: null,
      averageRating: 4.8,
      landingShortText: "Learn JavaScript through creative and fun projects",
      category: "Development",
      categoryColor: "purple",
      level: "Pro Expert",
      type: null,
      rating: 4.8,
      reviews: "4.8 Reviews",
      image: "https://placehold.co/300x200/purple/white",
      badge: "JS",
    },
    {
      id: 3,
      title: "Financial Analyst Training & Investing Course",
      landingCardImageUrl: "https://placehold.co/300x200/blue/white",
      badgeLabel: "Business",
      price: 499,
      originalPrice: 999,
      instructor: "Robert Fox",
      profileImageUrl: null,
      averageRating: 4.2,
      landingShortText:
        "Become a certified financial analyst with real-world skills",
      category: "Business",
      categoryColor: "blue",
      level: "Financial",
      type: "Crash Course",
      rating: 4.2,
      reviews: "4.2 Reviews",
      image: "https://placehold.co/300x200/blue/white",
      badge: "$",
    },
    {
      id: 4,
      title: "Advanced React Development",
      landingCardImageUrl: "https://placehold.co/300x200/green/white",
      badgeLabel: "Development",
      price: 1499,
      originalPrice: 2999,
      instructor: "Sarah Johnson",
      profileImageUrl: null,
      averageRating: 4.7,
      landingShortText:
        "Build production-ready React applications with best practices",
      category: "Development",
      categoryColor: "green",
      level: "Advanced",
      type: "Full Course",
      rating: 4.7,
      reviews: "4.7 Reviews",
      image: "https://placehold.co/300x200/green/white",
      badge: "React",
    },
  ];

  const displayCourses = courses.length > 0 ? courses : fallbackCourses;

  if (loading) {
    return (
      <section className="py-16 bg-white mt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white mt-70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchCourses}
              className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white -mt-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-black text-white font-medium rounded-full ">
            Certificate
            <span className="mr-2 w-3 h-3 bg-red-500 rounded-full ml-2"></span>
            Programs
          </span>
        </div>

        <div className="text-center -mt-10">
          <h2 className="text-[55px] font-medium    text-[#000000] mb-4">
            Every <span className="text-amber-500">Big Journey</span> Starts
            with a Small Step <span className=" text-amber-500"></span>
          </h2>
          <p className="w-[989px]  h-[36px] text-[#7F7E97] text-[32px]  ml-30">
            Not sure which program to choose? Take our Free Masterclass
          </p>
        </div>

        {/* Three Action Cards */}
        <div className="flex justify-center items-center gap-6 my-12 ">
          {/* Card 1 - Explore different fields */}
          <div className="bg-white rounded-2xl  hover:shadow-lg transition-all duration-300 px-8 py-6 flex items-center gap-4 min-w-[280px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
            <div>
                 <img 
                  src={Certified1} 
                  alt="Upskillway Logo" 
                  />
            </div>
            <span className="text-gray-900 font-medium text-lg">
              Explore different fields
            </span>
          </div>

          {/* Card 2 - Test your skills & interests */}
          <div className="bg-white rounded-2xl shadow-[0_0_150px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 px-8 py-6 flex items-center gap-4 min-w-[280px]">
               <div>
                 <img 
                  src={Certified} 
                  alt="Upskillway Logo" 
                  />
            </div>
            <span className="text-gray-900 font-medium text-lg">
              Test your skills & interests
            </span>
          </div>

          {/* Card 3 - Get a certificate of participation */}
          <div className="bg-white rounded-2xl shadow-[0_0_150px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 px-8 py-6 flex items-center gap-4 min-w-[280px]">
            <div>
                 <img 
                  src={Certified3} 
                  alt="Upskillway Logo" 
                  />
            </div>
            <span className="text-gray-900 font-medium text-lg">
              Get a certificate of participation
            </span>
          </div>
        </div>

        {/* Course Cards Section */}
        <section className="w-full py-10 bg-white -mt-10">
          <div className="w-full ">
            {displayCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No certified courses available at the moment.
                </p>
                <button
                  onClick={fetchCourses}
                  className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayCourses.map((course) => {
                  // Debug log for each course
                  console.log("Rendering course:", {
                    title: course.title,
                    instructor: course.instructor,
                    profileImageUrl: course.profileImageUrl,
                    landingCardImageUrl: course.landingCardImageUrl,
                  });

                  return (
                    <div
                      key={course.id}
                      className="w-[330px] h-[455px] flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_15px_45px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition"
                    >
                      {/* Card Image with Badge */}
                      <div className="relative w-[278px] h-[190px] mx-auto mt-5 bg-gradient-to-br from-purple-100 to-orange-100 rounded-2xl">
                        <img
                          src={
                            course.landingCardImageUrl ||
                            course.image ||
                            `https://via.placeholder.com/278x190/34D399/FFFFFF?text=${encodeURIComponent(
                              course.title?.substring(0, 20) || "Course"
                            )}`
                          }
                          alt={course.title || "Course"}
                          className="w-full h-full object-cover rounded-2xl "
                          onError={(e) => {
                            console.log("Image failed to load:", e.target.src);
                            // Better fallback with category-based colors
                            const fallbackColor =
                              course.badgeLabel === "Design"
                                ? "34D399"
                                : course.badgeLabel === "Development"
                                ? "A78BFA"
                                : course.badgeLabel === "Business"
                                ? "60A5FA"
                                : "FB923C";
                            e.target.src = `https://via.placeholder.com/278x190/${fallbackColor}/FFFFFF?text=${encodeURIComponent(
                              course.title?.substring(0, 25) || "Course"
                            )}`;
                          }}
                        />

                        {/* Badge Label - positioned on image */}
                        {course.badgeLabel && (
                          <div className="absolute top-3 left-3 mt-48">
                            <span className="px-3 py-1 bg-[#FDB11F] text-black rounded-full text-xs font-medium">
                              {course.badgeLabel}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex flex-col gap-4 flex-1 ">
                        {/* Price Section */}
                        <div className="flex items-center justify-between ml-50">
                          {course.price !== undefined &&
                            course.price !== null && (
                              <div className="flex items-center gap-2">
                                {course.originalPrice && (
                                  <span className="text-gray-400 line-through text-sm">
                                    ₹{course.originalPrice}
                                  </span>
                                )}
                                <span className="text-[#FF302F] text-xl font-bold">
                                  {course.price === 0
                                    ? "₹0"
                                    : `₹${course.price}`}
                                </span>
                              </div>
                            )}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg text-gray-900 leading-snug line-clamp-2">
                          {course.title}
                        </h3>

                        {/* Landing Short Text (Name/Description) */}
                        {course.landingShortText && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {course.landingShortText}
                          </p>
                        )}

                        {/* Instructor and Rating Section */}
                        <div className="flex items-center justify-between mt-auto">
                          {/* Profile Image and Instructor Name */}
                          <div className="flex items-center gap-2">
                            {course.profileImageUrl ? (
                              <img
                                src={course.profileImageUrl}
                                alt={course.instructor || "Instructor"}
                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                onError={(e) => {
                                  // Hide image and show fallback on error
                                  e.target.style.display = "none";
                                  const fallback = e.target.nextElementSibling;
                                  if (fallback) {
                                    fallback.style.display = "flex";
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center font-bold text-white text-sm"
                              style={{
                                display: course.profileImageUrl
                                  ? "none"
                                  : "flex",
                              }}
                            >
                              {course.instructor
                                ? course.instructor.charAt(0).toUpperCase()
                                : "I"}
                            </div>
                            <span className="text-sm text-gray-900 font-medium">
                              {course.instructor || "Instructor"}
                            </span>
                          </div>

                          {/* Average Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {course.averageRating
                                ? course.averageRating.toFixed(1)
                                : course.rating
                                ? course.rating.toFixed(1)
                                : "0.0"}
                            </span>
                          </div>
                        </div>

                        {/* Enroll Button */}
                        <button className="mt-4 w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <a
                href="#"
                className=" bg-[#FDB11F] w-[265px]  h-[50px] rounded-4xl  inline-flex items-center text-white font-semibold hover:text-amber-500 transition-colors"
              >
                <span className="ml-3">View All Certificate Programs</span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default CertifiedCourses;
