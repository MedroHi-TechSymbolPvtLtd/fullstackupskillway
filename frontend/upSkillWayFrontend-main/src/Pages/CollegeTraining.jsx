import React from "react";
import {
  TrendingUpIcon,
  Star,
  Target,
  Users,
  Briefcase,
  TrendingUp,
  Rocket,
  Award,
  UserCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Shield,
  UserCircle,
  FileText,
  Lightbulb,
  Calendar,
  Phone,
  GraduationCap,
  Zap,
} from "lucide-react";
import User1 from "../assets/Images/User1.png";
import CollegeV1 from "../assets/Images/CollegeV1.png";
import CollegeV2 from "../assets/Images/CollegeV2.png";



import College from "../assets/Images/college.png";
import College1 from "../assets/Images/college1.png";
import College2 from "../assets/Images/XY.png";
import GetInTouch from "../assets/Images/GetInTouch.png";
import CollegeTestimonials from "../components/College/CollegeTestimonials";
import config from '../config/env';





const UpskillWayLanding = () => {
  const [programs, setPrograms] = React.useState([]);
const [programsLoading, setProgramsLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: "",
    mobile: "",
    college: "",
    email: "",
    message: "",
  });
   
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState({
    type: "",
    message: "",
  });

  // NEW: leads + loading state and fetch
  const [leads, setLeads] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Testimonial carousel states
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const [currentTestimonial2, setCurrentTestimonial2] = React.useState(0);

  // Testimonials data for first section
  const testimonials = [
    {
      id: 1,
      quote: "Upskillway's programs transformed our confidence and placement readiness. The hands-on projects and mentoring helped me land my first job at a top MNC.",
      author: "Priya Sharma",
      designation: "B.Tech CSE",
      college: "Mount Caramel College"
    },
    {
      id: 2,
      quote: "Upskillway's programs have enhanced our students' creativity and digital confidence — the energy in our classrooms is remarkable!",
      author: "Neha Kapoor",
      designation: "Academic Director",
      college: "Maple Leaf Public School"
    },
    {
      id: 3,
      quote: "The industry-relevant curriculum and expert mentorship from Upskillway helped our students secure placements in top tech companies. Highly recommended!",
      author: "Rajesh Kumar",
      designation: "Placement Officer",
      college: "St. Xavier's College"
    }
  ];

  // Testimonials data for second section
  const testimonials2 = [
    {
      id: 1,
      quote: "Upskillway's programs transformed our placement results within one semester.",
      author: "Priya Sharma",
      designation: "B.Tech CSE",
      college: "Mount Caramel College"
    },
    {
      id: 2,
      quote: "The practical approach and industry connections provided by Upskillway have significantly improved our students' employability and confidence.",
      author: "Dr. Amit Verma",
      designation: "Dean of Placements",
      college: "Delhi Technical University"
    },
    {
      id: 3,
      quote: "Our partnership with Upskillway has been transformative. The placement rate increased by 40% and students are now getting offers from Fortune 500 companies.",
      author: "Sunita Reddy",
      designation: "Principal",
      college: "Bangalore Institute of Technology"
    }
  ];

  // Testimonial navigation functions for first carousel
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Testimonial navigation functions for second carousel
  const nextTestimonial2 = () => {
    setCurrentTestimonial2((prev) => (prev + 1) % testimonials2.length);
  };

  const prevTestimonial2 = () => {
    setCurrentTestimonial2((prev) => (prev - 1 + testimonials2.length) % testimonials2.length);
  };

  // Add this useEffect after your existing leads useEffect
React.useEffect(() => {
  let mounted = true;
  const url = `${config.apiBaseUrl}/cms/training-programs?page=1&limit=10&trainingType=college`;

  async function loadPrograms() {
    setProgramsLoading(true);
    try {
      const res = await fetch(url);
      const json = await res.json();
      console.log("programs response:", json);

      const items = Array.isArray(json?.data) ? json.data : [];

      if (!mounted) return;
      setPrograms(items);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
      if (mounted) setPrograms([]);
    } finally {
      if (mounted) setProgramsLoading(false);
    }
  }

  loadPrograms();
  return () => {
    mounted = false;
  };
}, []);


  React.useEffect(() => {
    let mounted = true;
    const url = `${config.apiBaseUrl}/cms/training-programs?page=1&limit=10&trainingType=college`;

    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(url);
        const json = await res.json();
        console.log("training-programs response:", json);

        // extract array from common API shapes
        const items = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.results)
          ? json.results
          : [];

        // normalize masteredTools: ensure each tool has logoUrl and name
        const normalized = items.map((item) => ({
          ...item,
          masteredTools: Array.isArray(item.masteredTools)
            ? item.masteredTools.map((t) => ({
                ...t,
                logoUrl: t.url ?? t.logoUrl ?? "",
                name: t.name ?? t.title ?? "",
              }))
            : [],
        }));

        if (!mounted) return;
        setLeads(normalized);
      } catch (err) {
        console.error("Failed to fetch training programs:", err);
        if (mounted) setLeads([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          organization: formData.college,
          requirement: formData.message,
          source: "college-training-contact-form",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! We'll get back to you soon.",
        });
        setFormData({
          name: "",
          mobile: "",
          college: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 mb-4 sm:mb-6 md:mb-7">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 ml-0 sm:ml-10 md:ml-20 lg:ml-25">
              <div className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-100 px-2 sm:px-3 py-1 rounded-full inline-block mt-5">
                College Training
              </div>

              <h1 className="w-full max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[722px] h-auto font-['Plus_Jakarta_Sans'] font-bold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[120%] tracking-[0%] border border-transparent -mt-4 sm:-mt-6 md:-mt-8 ">
                "Transform Your Campus with{" "}
                <span className="text-[#FDB11F] underline decoration-[#FDB11F] ">
                  Industry-Ready Skills Programs
                </span>
                "
              </h1>

              <br className="hidden lg:block" />

              <p className="w-full max-w-full sm:max-w-[600px] md:max-w-[680px] lg:max-w-[722px] h-auto font-plusJakarta font-normal not-italic text-base sm:text-lg md:text-[20px] leading-relaxed sm:leading-relaxed md:leading-[100%] tracking-[0%] -mt-6 sm:-mt-10 md:-mt-12 lg:-mt-10">
                Partner with Upskillway to integrate globally
                recognized,hands-on programs designed by industry experts.
                Empower your students, upskill your faculty, and strengthen your
                placement outcomes.
              </p>

              <div className="flex items-center space-x-3 sm:space-x-4 -mt-4 sm:-mt-6 md:-mt-9 w-auto max-w-[259px] h-auto lg:mt-3">
                <div className="flex -space-x-1.5 sm:-space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white overflow-hidden">
                    <img src={User1} alt="Student 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white overflow-hidden">
                    <img src={CollegeV1} alt="Student 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white overflow-hidden">
                    <img src={CollegeV2} alt="Student 3" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">4.9K Reviews</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-white -mt-3 sm:-mt-5">
                <button
                  className="w-full sm:w-[180px] md:w-[202px] h-[52px] sm:h-[56px] md:h-[58px] opacity-100 rounded-[80px] 
            px-4 sm:px-6 md:px-8 py-3 sm:py-4 gap-[10px] 
            bg-gradient-to-r from-[#5835D2] to-[#FDB11F] font-bold text-sm sm:text-base"
                >
                  Download Brochure
                </button>
                <button
                  onClick={() => {
                    const element = document.getElementById('get-in-touch');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full sm:w-[180px] md:w-[202px] h-[52px] sm:h-[56px] md:h-[58px] opacity-100 
            rounded-[80px] px-4 sm:px-6 md:px-8 py-3 sm:py-4 gap-[10px] font-bold text-sm sm:text-base
            bg-gradient-to-r from-[#5D38DE] to-[#FDB11F]"
                >
                  Start Partnership
                </button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <div>
                  <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[690px] h-auto text-white p-4 sm:p-6 md:p-8 rounded-2xl mx-auto lg:mx-0">
                    <img
                      src={College}
                      alt=""
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="w-full max-w-[227px] h-auto min-h-[83px] opacity-100 rounded-[20px] bg-white border border-[rgba(228,228,231,1)] shadow-[-2px_3px_100px_0px_#0000003B] p-4 mx-auto sm:mx-0">
              <div className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl md:text-[20px] leading-[28px] tracking-[-0.2px] mb-2">
                50,000+
              </div>
              <div className="text-gray-600 font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base md:text-[20px] leading-[28px] tracking-[-0.2px]">
                Students Trained
              </div>
            </div>
            <div className="w-full max-w-[227px] h-auto min-h-[83px] opacity-100 rounded-[20px] bg-white border border-[rgba(228,228,231,1)] shadow-[-2px_5px_100px_0px_#0000003B] p-4 mx-auto sm:mx-0">
              <div className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl md:text-[20px] leading-[28px] tracking-[-0.2px] mb-2">
                400+
              </div>
              <div className="text-gray-600 font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base md:text-[20px] leading-[28px] tracking-[-0.2px]">
                Partner Colleges
              </div>
            </div>
            <div className="w-full max-w-[227px] h-auto min-h-[83px] opacity-100 rounded-[20px] bg-white border border-[rgba(228,228,231,1)] shadow-[-2px_5px_100px_0px_#0000003B] p-4 mx-auto sm:mx-0">
              <div className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl md:text-[20px] leading-[28px] tracking-[-0.2px] mb-2">
                92%
              </div>
              <div className="text-gray-600 font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base md:text-[20px] leading-[28px] tracking-[-0.2px]">
                Placement Rate
              </div>
            </div>
            <div className="w-full max-w-[227px] h-auto min-h-[83px] opacity-100 rounded-[20px] bg-white border border-[rgba(228,228,231,1)] shadow-[-2px_5px_100px_0px_#0000003B] p-4 mx-auto sm:mx-0">
              <div className="font-['Plus_Jakarta_Sans'] font-semibold text-lg sm:text-xl md:text-[20px] leading-[28px] tracking-[-0.2px] mb-2">
                200+
              </div>
              <div className="text-gray-600 font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base md:text-[20px] leading-[28px] tracking-[-0.2px]">
                Corporate Partners
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Leading Organizations Section */}
      <section className="py-20 bg-white ">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section - Trusted By */}
          <div className="text-center mb-8 sm:mb-10 md:mb-[40px]">
            <h2 className="text-lg sm:text-xl md:text-[20px] text-gray-900">
              Trusted by Leading Institutions
            </h2>
          </div>

          {/* Company Logos - Animated Slider */}
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
                  {isLoading ? (
                    <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
                      Loading...
                    </div>
                  ) : leads.length > 0 &&
                    leads.some((v) => v.masteredTools) ? (
                    leads
                      .filter((lead) => lead.masteredTools)
                      .flatMap((lead) =>
                        Array.isArray(lead.masteredTools)
                          ? lead.masteredTools
                          : [lead.masteredTools]
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

          {/* Download Button */}
        </div>
      </section>

      {/* What We Do for Colleges & Institutions Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white -mt-20 sm:-mt-32 md:-mt-40 lg:-mt-[150px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-['Plus_Jakarta_Sans'] font-bold text-[#141219] mb-3 sm:mb-4">
              What We Do for{" "}
              <span className="text-[#FDB11F]">Colleges & Institutions</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-[20px] text-[#38393E] w-full max-w-full lg:max-w-[1150px]">
              Upskillway partners with colleges and institutions to design and
              deliver industry-aligned programs that enhance student
              employability, faculty engagement, and institutional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {/* Card 1 - Custom Skill Development Plans */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Custom Skill Development Plans
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tailored programs for each department to build core and emerging
                skills.
              </p>
            </div>

            {/* Card 2 - Faculty & Student Engagement */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Faculty & Student Engagement
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Workshops and mentoring sessions to boost learning outcomes.
              </p>
            </div>

            {/* Card 3 - Hands-on Projects */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Hands-on Projects
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-world assignments to develop practical, job-ready skills.
              </p>
            </div>

            {/* Card 4 - Placement & Internship Support */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 shadow-[0_0_150px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Placement & Internship Support
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Corporate tie-ups for internships and placement opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Students Gain Section */}
      <section className="py-20 bg-white -mt-[110px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#141219] mb-4">
              What <span className="text-[#FDB11F]">Students Gain</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-[20px] text-[#38393E] w-full max-w-full lg:max-w-[1209px]">
              Empower your students with the technical and professional
              competencies required to succeed in today's job market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16">
            {/* Card 1 - Industry-Ready Skills */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Industry-Ready Skills
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hands-on training in high-demand tools and technologies.
              </p>
            </div>

            {/* Card 2 - Recognized Certifications */}
            <div className="w-full max-w-[280px] h-auto min-h-[220px] sm:min-h-[236px] bg-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)] mx-auto sm:mx-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-[20px] font-bold text-[#111827] leading-tight sm:leading-[20px] -mt-2 sm:-mt-4 mb-2">
                Recognized Certifications
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Earn co-branded certificates valued by recruiters and employers.
              </p>
            </div>

            {/* Card 3 - Career Mentorship */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-[20px] font-bold text-[#111827] leading-[20px] -mt-4 mb-2">
                Career Mentorship
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Personalized guidance from experts to help students define and
                achieve career goals.
              </p>
            </div>

            {/* Card 4 - Guaranteed Interview Opportunities */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-[20px] font-bold text-[#111827] leading-[20px] -mt-4 mb-2">
                Guaranteed Interview Opportunities
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Direct access to 200+ hiring companies through our corporate
                network.
              </p>
            </div>
          </div>

          {/* Testimonial Carousel */}
          <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 px-4 sm:px-0">
            <div
              className="rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg transition-all duration-500"
              style={{
                background: "#FEF9F8",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Purple line accent */}
              <div className="w-16 h-1 bg-[#FEF9F8] rounded-full mx-auto mb-6 sm:mb-8"></div>

              <blockquote className="text-center">
                <p className="w-full max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl font-['Plus_Jakarta_Sans'] font-semibold text-[#374151] mb-4 sm:mb-6 px-4 sm:px-0 min-h-[120px] sm:min-h-[100px] flex items-center justify-center">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <footer className="text-gray-600">
                  <div className="font-medium text-sm sm:text-base text-gray-900">
                    — {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].designation}
                  </div>
                  <div className="text-xs sm:text-sm mt-1">{testimonials[currentTestimonial].college}</div>
                </footer>
              </blockquote>

            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-orange-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What Colleges & Institutions Gain Section */}
      <section className="py-20 bg-white  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-[100px]">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-[#141219] font-['Plus_Jakarta_Sans'] mb-4">
              What{" "}
              <span className="text-[#FDB11F]">
                Colleges & Institutions Gain
              </span>
            </h2>
            <p className="text-[20px] text-[#38393E] max-w-[1268px]">
              Our partnership goes beyond training — it strengthens your
              placement ecosystem and enhances your institutional reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Card 1 - Zero Infrastructure Cost */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Zero Infrastructure Cost
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No setup investment required from your college
              </p>
            </div>

            {/* Card 2 - No Faculty Burden */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Faculty Burden
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our expert trainers handle everything
              </p>
            </div>

            {/* Card 3 - Enhanced College Reputation */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Enhanced College Reputation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Boost rankings with higher placement rates
              </p>
            </div>

            {/* Card 4 - Transparent Progress Reports */}
            <div className="w-[280px] h-[236px] bg-white rounded-2xl p-8  hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Transparent Progress Reports
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monthly analytics on student performance
              </p>
            </div>
          </div>

          {/* Testimonial Carousel 2 */}
          <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 px-4 sm:px-0">
            <div
              className="rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg transition-all duration-500"
              style={{
                background: "#FEF9F8",
                border: "1px solid #E5E7EB",
              }}
            >
              {/* Purple line accent */}
              <div className="w-16 h-1 bg-[#FEF9F8] rounded-full mx-auto mb-6 sm:mb-8"></div>

              <blockquote className="text-center">
                <p className="w-full max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl font-['Plus_Jakarta_Sans'] font-semibold text-[#374151] mb-4 sm:mb-6 px-4 sm:px-0 min-h-[120px] sm:min-h-[100px] flex items-center justify-center">
                  "{testimonials2[currentTestimonial2].quote}"
                </p>
                <footer className="text-gray-600">
                  <div className="font-medium text-sm sm:text-base font-['Plus_Jakarta_Sans'] text-gray-900">
                    — {testimonials2[currentTestimonial2].author}, {testimonials2[currentTestimonial2].designation}
                  </div>
                  <div className="text-xs sm:text-sm mt-1">{testimonials2[currentTestimonial2].college}</div>
                </footer>
              </blockquote>

            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button 
                onClick={prevTestimonial2}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="flex gap-2">
                {testimonials2.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial2(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial2 
                        ? 'bg-orange-500 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial2}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs We Offer for Your Campus Section */}
      <section className="mt-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="w-full text-3xl sm:text-4xl md:text-5xl text-center font-bold font-['Plus_Jakarta_Sans'] text-[#111827] mb-4 px-4">
              Programs We Offer for Your{" "}
              <span className="text-[#FDB11F]">Campus</span>
            </h2>
            <p className="text-base sm:text-lg text-[#374151] max-w-4xl text-center mx-auto px-4">
              Designed to upskill students, boost placement outcomes, and
              enhance institutional performance.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {programsLoading ? (
    <div className="col-span-4 text-center py-12">
      <p className="text-gray-600">Loading programs...</p>
    </div>
  ) : programs.length > 0 ? (
    programs.map((program, index) => (
      <div
        key={program.id}
        className="w-[280px] h-[625px] font-['Plus_Jakarta_Sans'] bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-shadow relative"
      >
        {index === 3 && (
          <div className="absolute top-0 right-4 ">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full -ml-60 ">
              POPULAR
            </span>
          </div>
        )}

        <h3 className="w-full lg:w-[200px] text-lg sm:text-xl lg:text-[24px] font-bold text-[#111827] mb-4">
          {program.title}
        </h3>

        <div className="mb-4">
          <span className="border-3 border-[#E8E8E8] rounded-xl text-purple-600 font-semibold text-sm p-2">
            {program.durationMonths} months | {program.durationHours} hours
          </span>
        </div>

        <ul className="space-y-3 mb-6">
          {program.description.split('.').slice(0, 4).filter(item => item.trim()).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <svg
                className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>

        <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded-xl">
          <p className="text-sm font-semibold text-gray-900">
            {program.successMetric}% {program.placementRate ? 'placement rate' : 'success rate'}
          </p>
          <p className="text-xs text-gray-600">
            {program.skills && program.skills.length > 0 ? program.skills.join(', ') : 'All streams'}
          </p>
        </div>

        <button className="w-full bg-gradient-to-r from-[#FDB11F] to-[#5D38DE] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Learn More →
        </button>
      </div>
    ))
  ) : (
    <div className="col-span-4 text-center py-12">
      <p className="text-gray-600">No programs available</p>
    </div>
  )}
</div>

         
        </div>
      </section>

      {/* Why Colleges & Institutions Choose Upskillway Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#141219] mb-3 sm:mb-4 px-4 sm:px-0">
              Why Colleges & Institutions{" "}
              <span className="text-[#FDB11F]">Choose Upskillway</span>
            </h2>
            <p className="text-base sm:text-lg text-[#38393E] max-w-3xl mx-auto px-4 sm:px-0">
              Join 400+ colleges that have partnered with Upskillway to make
              their students job-ready.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {/* Card 1 - Industry-Aligned Curriculum */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Industry-Aligned Curriculum
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Designed with industry experts to build job-ready talent.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1 hidden sm:block"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-2 sm:p-3 rounded-xl text-xs sm:text-sm text-gray-500 italic">
                      Updated quarterly based on industry feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Expert Trainers from Top Companies */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Expert Trainers from Top Companies
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Delivered by professionals with 10+ years corporate
                    experience from Google, Microsoft, Amazon.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1 hidden sm:block"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-2 sm:p-3 rounded-xl text-xs sm:text-sm text-gray-500 italic">
                      Not academic professors - actual industry practitioners
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Guaranteed Interview Opportunities */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Guaranteed Interview Opportunities
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Real job connections with 200+ corporate partners. Not just
                    training - actual placement assistance.
                  </p>
                  <div className="flex items-start gap-2">
                    <p className="bg-white border-l-4 border-[#5D38DE] p-2 sm:p-3 rounded-xl text-xs sm:text-sm text-gray-500 italic">
                      Direct recruiter connections, not job board listings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 - Post-Placement Support */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Post-Placement Support
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    Continuous mentorship for 6 months after placement to ensure
                    student success and retention.
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-full bg-purple-500 rounded-full mt-1 hidden sm:block"></div>
                    <p className="bg-white border-l-4 border-[#5D38DE] p-2 sm:p-3 rounded-xl text-xs sm:text-sm text-gray-500 italic">
                      We care about long-term career growth, not just placement
                      numbers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-[#FDB11F] border-b-white mb-8 sm:mb-10 md:mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  50k+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  Students Trained
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  400+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Colleges</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  92%
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Placement Rate</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2">
                  200+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">
                  Corporate Partners
                </div>
              </div>
            </div>
          </div>

          {/* MoU Partnership Benefits */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block bg-[#EA580C] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              MoU PARTNERSHIP BENEFITS
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[50px] font-['Plus_Jakarta_Sans'] font-bold text-gray-900 mb-3 sm:mb-4 px-4 max-w-5xl mx-auto">
              Why Signing an MoU with Upskillway is a Smart Choice for Your
              College
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl w-full max-w-4xl text-[#374151] mx-auto px-4">
              Risk-free, transparent partnerships designed with college
              administrators in mind. Experience measurable impact with zero
              infrastructure investment.
            </p>
          </div>

          {/* MoU Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            {/* Zero Risk Partnership */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Zero Risk Partnership
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                No liability until placement delivered. Pilot program option
                available.
              </p>
            </div>

            {/* Dedicated Account Manager */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Dedicated Account Manager
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                24/7 support with a single point of contact for all your needs.
              </p>
            </div>

            {/* Long-term Institutional Branding */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Long-term Institutional Branding
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Position your college as an industry-preferred recruitment
                destination.
              </p>
            </div>

            {/* Co-branded Certificates */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 outline-[#E9E9E9] outline-offset-[-2px] shadow-[0_0_150px_rgba(0,0,0,0.1)]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Co-branded Certificates
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Joint certification programs that add value to student
                credentials.
              </p>
            </div>

            {/* Transparent MoU Terms */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Transparent MoU Terms
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Clear, flexible agreements with no hidden costs or surprise
                fees.
              </p>
            </div>

            {/* Joint Industry Events */}
            <div className="w-full bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FDB11F] rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h4 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Joint Industry Events
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Access to corporate seminars, hackathons, and networking
                opportunities.
              </p>
            </div>
          </div>

          {/* Bottom Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 border-2 border-orange-200  border-t-white text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">0</div>
              <div className="text-gray-600 font-medium">Setup Cost</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 border-t-white text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Dedicated Support</div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 border-t-white text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600 font-medium">Transparency</div>
            </div>
          </div>

          {/* Special Pilot Program Offer */}
          <div className="w-full max-w-6xl mx-auto bg-white border-l-4 border-[#FFEDD5] p-4 sm:p-6 mb-4 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.10),0_10px_15px_rgba(0,0,0,0.10)]">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Special Pilot Program Offer
                </h4>
                <p className="text-gray-700 text-base sm:text-lg">
                  Not sure? Start with a single batch pilot program. See the
                  results firsthand before committing to a full partnership.
                  Zero risk, maximum flexibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Made Easy Section */}
      <section className="py-20 bg-white -mt-19 font-['Plus_Jakarta_Sans'] -mb-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mx-auto px-4">
              Partnership Made Easy — Let's Connect Today
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto px-4">
              We understand that every college has unique needs — that's why our
              MoU process is built to be flexible and result-oriented. From the
              first conversation to student placements, we're with you at every
              step.
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Step 1 - Connect With Us */}
            <div className="w-[280px] h-[416px] bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
              <div className=" w-14 h-14 border-l-4 bg-gradient-to-br from-[#FDB11F] to-[#976A13] rounded-xl flex items-center justify-center mb-6 ml-20 ">
                <Phone className="w-7 h-7 text-white item-center " />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Connect With Us
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Schedule a quick consultation call with our team to discuss your
                college's needs and goals.
              </p>
              <div className="border-l-4 border-orange-500 pl-4 p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                <p className="text-sm text-gray-500 italic">
                  No long paperwork, just a quick discussion to understand your
                  campus vision.
                </p>
              </div>
            </div>
                 {/* <p className="bg-white border-l-4 border-[#5D38DE] p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                    Regularly updated to match global education trends.
                    </p> */}

            {/* Step 2 - Custom Proposal & MoU */}
            <div className="w-[280px] h-[416px] bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FDB11F] to-[#976A13] rounded-xl flex items-center justify-center mb-6 ml-20">
                <FileText className="w-7 h-7  text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Custom Proposal & MoU
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                We prepare a tailored MoU and program structure that fits your
                students' aspirations and department needs.
              </p>
              <div className="border-l-4 border-orange-500 pl-4 p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                <p className="text-sm text-gray-500 italic">
                  Completely customizable — we align programs with your
                  curriculum.
                </p>
              </div>
            </div>

            {/* Step 3 - Training Implementation */}
            <div className="w-[280px] h-[416px] bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow ">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FDB11F] to-[#976A13] rounded-xl flex items-center justify-center mb-6 ml-20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Training Implementation
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Our expert trainers deliver interactive, hands-on sessions —
                online or on-campus — focusing on technical and soft skills.
              </p>
              <div className="border-l-4 border-orange-500 pl-4 p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                <p className="text-sm text-gray-500 italic">
                  Students learn from real industry professionals.
                </p>
              </div>
            </div>

            {/* Step 4 - Placement & Continuous Support */}
            <div className="w-[280px] h-[416px] bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FDB11F] to-[#976A13] rounded-xl flex items-center justify-center mb-6 ml-20">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Placement & Continuous Support
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                After training, students receive dedicated placement assistance
                and job mentorship.
              </p>
              <div className="border-l-4 border-orange-500 pl-4 p-3 mb-4 rounded-xl text-sm text-gray-500 italic">
                <p className="text-sm text-gray-500 italic">
                  Your college's success is our success — we celebrate every
                  placement with you.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-8 font-medium">
              One partnership can boost placements — let's get your students
              industry-ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const element = document.getElementById('get-in-touch');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Sign MoU with Upskillway
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('get-in-touch');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <CollegeTestimonials />

      {/* CTA Section - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block flex-1 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Student Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-[450px] h-[350px] bg-white rounded-3xl ">
                <img
                  src={College1}
                  alt="Student 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Content */}
            <div className="text-center space-y-6">
              <h2 className="font-bold text-4xl lg:text-5xl leading-tight text-black max-w-xl mx-auto">
                Ready to Transform Your Campus?
              </h2>
              <p className="text-lg text-gray-700 max-w-md mx-auto">
                Join hundreds of leading institutions that have partnered with
                us to create industry-ready professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => {
                    const element = document.getElementById('get-in-touch');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-gradient-to-r from-[#FDB11F] to-[#5D38DE] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Partner With Us
                </button>
                
                <button 
                  onClick={() => {
                    const element = document.getElementById('get-in-touch');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-gradient-to-r from-[#5D38DE] to-[#FDB11F] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Request Demo
                </button>
              </div>
            </div>

            {/* Right Student Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-[280px] h-[350px] bg-white rounded-3xl ml-20 overflow-hidden">
                <img
                  src={College2}
                  alt="Student 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get In Touch Section */}
      <section id="get-in-touch" className="py-12 sm:py-16 md:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Form */}
              <div className="p-6 sm:p-8 md:p-12 lg:p-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 sm:mb-8">
                  Get In Touch
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Enter your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="hello"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Mobile Number Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Enter your mobile number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="+91"
                        disabled
                        className="w-12 sm:w-16 px-2 sm:px-3 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-100 text-center"
                      />
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9413477263"
                        required
                        pattern="[0-9]{10}"
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* College/Institution Name Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      College / Institution Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      placeholder="AICE"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Official Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Prateeksharma7263@gmail.com"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="hi there,"
                      required
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Schedule a Demo"}
                  </button>

                  {/* Status Message */}
                  {submitStatus.message && (
                    <div
                      className={`p-4 rounded-lg text-center ${
                        submitStatus.type === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side - Illustration (Hidden on mobile) */}
              <div className="hidden lg:flex p-8 lg:p-12 xl:p-16 items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={GetInTouch}
                    alt="Get In Touch Illustration"
                    className="w-full h-auto object-contain max-w-lg"
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

export default UpskillWayLanding;
