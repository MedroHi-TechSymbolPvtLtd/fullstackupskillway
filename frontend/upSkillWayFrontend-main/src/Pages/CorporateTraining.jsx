import { useEffect, useState } from "react";
import config from '../config/env';
import CorporateFallback from "../assets/Images/Corprate.png";
import CorporateConsultation from "../assets/Images/Corporate1.png";
import Form from "../components/Corporate/Form";
import CorporateTestimonials from "../components/Corporate/CorporateTestimonials";
import User1 from "../assets/Images/User1.png";
import CollegeV3 from "../assets/Images/CollegeV3.png";
import CollegeV4 from "../assets/Images/CollegeV4.png";

const COMPANY_LOGOS = [
  "Google",
  "Microsoft",
  "Meta",
  "LinkedIn",
  "Instagram",
  "Apple",
];

const HERO_HIGHLIGHTS = [
  "Measurable Impact",
  "Expert-Led Training",
  "ROI Focused",
  "Customized Solutions",
];

const DEFAULT_DATA = {
  title: "Upskill your Workforce in High-Demand Technologies",
  description:
    "Explore how our tailored learning solutions deliver real results, turning your workforce into a skilled and innovative team.",

  placementRate: 95,
  successMetric: "95% participant satisfaction rate",
  cardImageUrl: CorporateFallback,
  tags: ["leadership", "management", "corporate", "executive"],
  curriculum: [
    { title: "Leadership Excellence Accelerator", hours: 40 },
    { title: "Strategic Management", hours: 35 },
    { title: "Team Building & Communication", hours: 30 },
    { title: "Change Management", hours: 25 },
    { title: "Project Management", hours: 20 },
  ],
  testimonials: [
    {
      studentName: "Riya Sharma",
      studentRole: "Learning & Development Head",
      testimonialText:
        "The corporate programs helped our teams adapt faster and deliver measurable ROI. We loved the instructor-led approach.",
      rating: 5,
      studentImageUrl: "",
    },
  ],
  faqs: [
    {
      question: "What is the duration of the program?",
      answer:
        "The program is 3 months long with 200 hours of comprehensive training.",
    },
    {
      question: "Is certification provided?",
      answer:
        "Yes, participants receive a certificate upon successful completion.",
    },
  ],
  price: 50000,
  durationMonths: 3,
  durationHours: 200,
  videoDemoUrl: "",
};

const CATEGORIES_DATA = {
  GenAI: {
    name: "GenAI",
    icon: "🤖",
    skills: [
      "Prompt Engineering",
      "LLM Applications",
      "AI Models",
      "Deep Learning",
      "Machine Learning",
      "Ethics of AI & Many More",
      "Neural Network",
    ],
    tools: [
      { name: "GitHub Copilot", emoji: "🐙" },
      { name: "ChatGPT", emoji: "💬" },
      { name: "LangChain", emoji: "🦜" },
      { name: "python", emoji: "🐍" },
    ],
  },
  "Data Science and Analytics": {
    name: "Data Science and Analytics",
    icon: "📊",
    skills: [
      "Statistical Analysis",
      "Data Visualization",
      "Predictive Modeling",
      "Big Data Processing",
      "Machine Learning",
      "Data Mining",
      "Business Intelligence",
    ],
    tools: [
      { name: "Python", emoji: "🐍" },
      { name: "R", emoji: "📈" },
      { name: "Tableau", emoji: "📊" },
      { name: "SQL", emoji: "🗄️" },
      { name: "Apache Spark", emoji: "⚡" },
    ],
  },
  "Cloud & DevOps": {
    name: "Cloud & DevOps",
    icon: "☁️",
    skills: [
      "Cloud Architecture",
      "Containerization",
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Monitoring & Logging",
      "Cloud Security",
      "Automation",
    ],
    tools: [
      { name: "AWS", emoji: "☁️" },
      { name: "Docker", emoji: "🐳" },
      { name: "Kubernetes", emoji: "⚓" },
      { name: "Jenkins", emoji: "🔧" },
      { name: "Terraform", emoji: "🏗️" },
    ],
  },
  Cybersecurity: {
    name: "Cybersecurity",
    icon: "🔒",
    skills: [
      "Network Security",
      "Ethical Hacking",
      "Risk Assessment",
      "Incident Response",
      "Security Auditing",
      "Cryptography",
      "Compliance & Governance",
    ],
    tools: [
      { name: "Wireshark", emoji: "🦈" },
      { name: "Metasploit", emoji: "💣" },
      { name: "Burp Suite", emoji: "🔍" },
      { name: "Nmap", emoji: "🗺️" },
      { name: "OWASP", emoji: "🛡️" },
    ],
  },
  "Software Engineering": {
    name: "Software Engineering",
    icon: "💻",
    skills: [
      "Full-Stack Development",
      "System Design",
      "Agile Methodologies",
      "Code Review & Testing",
      "API Development",
      "Database Design",
      "Performance Optimization",
    ],
    tools: [
      { name: "JavaScript", emoji: "📜" },
      { name: "React", emoji: "⚛️" },
      { name: "Node.js", emoji: "🟢" },
      { name: "Git", emoji: "📦" },
      { name: "PostgreSQL", emoji: "🐘" },
    ],
  },
  "Industry Certifications": {
    name: "Industry Certifications",
    icon: "🎓",
    skills: [
      "AWS Certification",
      "Azure Certification",
      "Google Cloud Certification",
      "PMP Certification",
      "CISSP Certification",
      "Scrum Master",
      "ITIL Foundation",
    ],
    tools: [
      { name: "AWS", emoji: "☁️" },
      { name: "Microsoft Azure", emoji: "🔷" },
      { name: "Google Cloud", emoji: "☁️" },
      { name: "PMI", emoji: "📋" },
      { name: "ISACA", emoji: "🎯" },
    ],
  },
  "Digital Business": {
    name: "Digital Business",
    icon: "🚀",
    skills: [
      "Digital Transformation",
      "E-commerce Strategy",
      "Digital Marketing",
      "Business Analytics",
      "Customer Experience",
      "Innovation Management",
      "Agile Business Practices",
    ],
    tools: [
      { name: "Salesforce", emoji: "☁️" },
      { name: "HubSpot", emoji: "🎯" },
      { name: "Google Analytics", emoji: "📊" },
      { name: "Shopify", emoji: "🛒" },
      { name: "Slack", emoji: "💬" },
    ],
  },
};

const CorporateTrainingPage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [masteredTools, setMasteredTools] = useState([]);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // Use default data directly
  const resolvedData = DEFAULT_DATA;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    companyName: "",
    locations: "",
    industry: "",
    workIndustry: "",
    programType: "",
    numberOfParticipants: "",
    preferredStartDate: "",
    requirement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  // Category tabs state - will be set to first program from API or fallback to first category
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(CATEGORIES_DATA)[0] || null
  );

  // Load Inter font
  useEffect(() => {
    // Check if Inter font is already loaded
    const existingLink = document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=Inter"]'
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
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  }, []);

  // Fetch Training Programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setProgramsLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}/cms/training-programs?page=1&limit=10&trainingType=corporate`
        );
        const data = await response.json();

        if (data.success && data.data && data.data.length > 0) {
          setPrograms(data.data);

          // Extract testimonials from all programs
          const allTestimonials = data.data.flatMap(
            (program) => program.testimonials || []
          );
          // Map testimonials to match UI field names
          const mappedTestimonials = allTestimonials.map((t) => ({
            id: t.id,
            name: t.studentName || t.name,
            role: t.studentRole || t.role,
            feedback: t.testimonialText || t.feedback,
            rating: t.rating || 5,
            imageUrl: t.studentImageUrl || t.imageUrl || "",
            company: t.company || "",
          }));
          setTestimonials(mappedTestimonials);

          // Extract FAQs from all programs
          const allFaqs = data.data.flatMap((program) => program.faqs || []);
          setFaqs(allFaqs);

          // Extract all mastered tools from all programs
          const allTools = data.data.flatMap((program) =>
            (program.masteredTools || []).map((tool) => ({
              ...tool,
              programId: program.id,
              programTitle:
                program.title || program.programName || program.programTitle,
            }))
          );
          // Remove duplicates based on URL and name
          const uniqueTools = allTools.filter(
            (tool, index, self) =>
              index ===
              self.findIndex((t) => t.url === tool.url && t.name === tool.name)
          );
          setMasteredTools(uniqueTools);

          // Set first program as selected category
          if (data.data.length > 0 && !selectedCategory) {
            setSelectedCategory(data.data[0].id);
          }
        } else {
          setPrograms([]);
          setTestimonials([]);
          setFaqs([]);
          setMasteredTools([]);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        setPrograms([]);
        setTestimonials([]);
        setFaqs([]);
        setMasteredTools([]);
      } finally {
        setProgramsLoading(false);
      }
    };

    fetchPrograms();
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
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
          organization: formData.organization,
          phone: formData.phone,
          requirement: formData.requirement,
          source: "corporate-training-page",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: "Lead submitted successfully!",
        });
        setFormData({
          name: "",
          email: "",
          organization: "",
          phone: "",
          companyName: "",
          locations: "",
          industry: "",
          workIndustry: "",
          programType: "",
          numberOfParticipants: "",
          preferredStartDate: "",
          requirement: "",
        });
        setCurrentStep(1);
      } else {
        throw new Error(data.message || "Failed to submit lead");
      }
    } catch (submitError) {
      setSubmitStatus({
        type: "error",
        message: submitError.message || "Failed to submit. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div>
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-30 px-4 sm:px-6">
            <div className="ml-0 sm:ml-4 md:ml-8 lg:ml-16 space-y-4 sm:space-y-5 md:space-y-6 max-w-full lg:w-[945px]">
              <div className="inline-block bg-purple-100 text-purple-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
                Corporate Training
              </div>

              <h1 className="max-w-full lg:max-w-[945px] font-['Plus_Jakarta_Sans'] font-bold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[110%] sm:leading-[105%] md:leading-[102%] lg:leading-[100%] tracking-[0%]">
                Upskill your{" "}
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[28px] sm:text-[36px] md:text-[48px] lg:text-[64px] leading-[110%] sm:leading-[105%] md:leading-[102%] lg:leading-[100%] tracking-[0%] text-[#FDB11F]">
                  Workforce
                </span>{" "}
                in High-Demand Technologies
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-full sm:max-w-lg md:max-w-xl">
                Close skill gaps, improve productivity, and accelerate digital
                transformation with job-ready corporate training — tailored to
                your business goals.
              </p>

            
            </div>

            <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start mb-5">
              {/* Feature Badges */}
              <div className="ml-0 sm:ml-4 md:ml-8 lg:ml-16 space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full" />
                      </div>
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                        100% Industry-aligned Skills
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        Qualified Expert Trainers
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        ROI Focused
                      </span>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        Customized Learning Pathways
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button
                  onClick={() => {
                    const element = document.getElementById('corporate-training-form');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full sm:w-[240px] md:w-[263px] h-[48px] sm:h-[52px] md:h-[55px] rounded-[80px] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  style={{
                    background:
                      "linear-gradient(270deg, #5835D2 0%, #FDB11F 100%)",
                  }}
                >
                  Schedule Consultation
                </button>
                <button
                  className="w-full sm:w-[220px] md:w-[239px] h-[48px] sm:h-[52px] md:h-[55px] rounded-[80px] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  style={{
                    background:
                      "linear-gradient(270deg, #5D38DE 0%, #FDB11F 100%)",
                  }}
                >
                  Download Brochure
                </button>
              </div>

                {resolvedData.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {resolvedData.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs sm:text-sm font-semibold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* <div className="mt-10">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
                    Trusted by leading organizations
                  </p>
                  <div className="flex flex-wrap items-center gap-6 grayscale opacity-70 text-sm font-semibold text-gray-600">
                    {COMPANY_LOGOS.map((logo) => (
                      <span key={logo}>{logo}</span>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* Right Section - Student Image with Purple Circle */}
              <div className="relative flex justify-center items-center min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] mt-0 sm:-mt-20 md:-mt-40 lg:-mt-[300px]">
                {/* Large Purple Circle Background */}
                <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[420px] md:h-[420px] lg:w-[489px] lg:h-[489px] bg-[#6742E1] rounded-full mt-20 sm:mt-40 md:mt-60 lg:mt-90"></div>
                {/* Student Image - Positioned in front of circle */}
                <div className="relative z-10">
                  <img
                    src={resolvedData.cardImageUrl || CorporateFallback}
                    alt="Professional student"
                    className="w-[250px] h-[320px] sm:w-[300px] sm:h-[380px] md:w-[350px] md:h-[420px] lg:w-[400px] lg:h-[500px] object-cover object-top mt-6 sm:mt-8 md:mt-10"
                    style={{ objectPosition: "center 20%" }}
                    onError={(event) => {
                      if (event.target.src !== CorporateFallback) {
                        event.target.src = CorporateFallback;
                      }
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Floating Stats Card - Top Right */}
                <div className="absolute top-4 sm:top-6 md:top-8 -right-2 sm:-right-3 md:-right-4 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-2 shadow-xl z-20 max-w-[160px] sm:max-w-[180px] md:max-w-[200px] mr-0 sm:mr-[40px] md:mr-[60px] lg:mr-[80px]">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                    <div className="flex -space-x-1.5 sm:-space-x-2">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white overflow-hidden">
                        <img src={User1} alt="Mentor 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-white overflow-hidden">
                        <img src={CollegeV3} alt="Mentor 2" className="w-full h-full object-cover" />
                      </div>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white overflow-hidden">
                        <img src={CollegeV4} alt="Mentor 3" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">2K+</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Learn with expert mentors who are ready to guide & skills
                  </p>
                </div>

                {/* Decorative Star */}
                <div className="absolute top-20 sm:top-30 md:top-40 lg:top-50 left-10 sm:left-15 md:left-20 lg:left-25 text-yellow-400 text-2xl sm:text-3xl md:text-4xl z-20">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-[13px]  bg-[#6742E1]"></div>
        </div>
      </section>

      {/* Trusted By Leading Organizations Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Section - Trusted By */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Trusted By Leading{" "}
              <span className="text-[#FDB11F]">Organizations</span> Worldwide
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Partnering with global enterprises to build future-ready teams
            </p>
          </div>

          {/* Mastered Tools Slider Section */}
          {masteredTools.length > 0 && (
            <div className="w-full relative overflow-hidden mb-16">
              <style>
                {`
                  @keyframes scroll-tools {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .animate-scroll-tools {
                    animation: scroll-tools 25s linear infinite;
                  }
                  .animate-scroll-tools:hover {
                    animation-play-state: paused;
                  }
                `}
              </style>
              <div className="flex animate-scroll-tools">
                {/* First set of tool images */}
                <div className="flex items-center gap-8 sm:gap-12 px-8">
                  {masteredTools.map((tool, index) => (
                    <div
                      key={`tool-1-${index}`}
                      className="flex-shrink-0 flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24  hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                    >
                      {tool.url ? (
                        <img
                          src={tool.url}
                          alt={tool.name || "Tool"}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="hidden items-center justify-center h-full w-full  rounded-lg"
                        style={{ display: tool.url ? "none" : "flex" }}
                      >
                        <span className=" text-xs text-center px-2">
                          {tool.name || "Tool"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center gap-8 sm:gap-12 px-8">
                  {masteredTools.map((tool, index) => (
                    <div
                      key={`tool-2-${index}`}
                      className="flex-shrink-0 flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                    >
                      {tool.url ? (
                        <img
                          src={tool.url}
                          alt={tool.name || "Tool"}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="hidden items-center justify-center h-full w-full bg-gray-100 rounded-lg"
                        style={{ display: tool.url ? "none" : "flex" }}
                      >
                        <span className="text-gray-400 text-xs text-center px-2">
                          {tool.name || "Tool"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Built For Enterprise Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Built For <span className="text-[#FDB11F]">Enterprise</span>.
              Secured For The Fortune 500.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-4xl mx-auto">
              From cybersecurity to scalability — our programs are designed and
              delivered with enterprise-grade governance & compliance.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-9 mb-8 sm:mb-10 md:mb-12">
            {/* Card 1 - Enterprise Security */}
            <div className="bg-white rounded-[12px] p-6 border-[3px] border-transparent [border-image:linear-gradient(to_right,theme(colors.orange.200),transparent)_1] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Enterprise Security
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                SOC 2 Type II, ISO 27001, GDPR compliant, SSO, RBAC, encryption
                everywhere
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  SSO
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  SAML
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  OAuth
                </span>
              </div>
            </div>

            {/* Card 2 - 99.9% Uptime SLA */}
            <div className="bg-white rounded-[12px] p-6 border-[3px] border-transparent [border-image:linear-gradient(to_right,theme(colors.orange.200),transparent)_1] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                99.9% Uptime SLA
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enterprise-grade infrastructure. 24/7 monitoring. Guaranteed
                availability.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  24/7 Support
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  SLA
                </span>
              </div>
            </div>

            {/* Card 3 - Enterprise LMS Integrations */}
            <div className="bg-white rounded-[12px] p-6 border-[3px] border-transparent [border-image:linear-gradient(to_right,theme(colors.orange.200),transparent)_1] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Enterprise LMS Integrations
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                SCORM/xAPI compatibility
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  SCORM
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  xAPI
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  API
                </span>
              </div>
            </div>

            {/* Card 4 - Dedicated Customer Success */}
            <div className="bg-white rounded-[12px] p-6 border-[3px] border-transparent [border-image:linear-gradient(to_right,theme(colors.orange.200),transparent)_1] hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Dedicated Customer Success
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                End-to-end program delivery assurance
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  CSM
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Tech Support
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              Cleared security at: Fortune 50 Banks • Global Healthcare Systems
              • Government Contractors • Tech Unicorns
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <button className="w-full sm:w-auto max-w-[260px] h-[42px] sm:h-[48px] bg-white text-orange-500 font-regular rounded-[8px] border-[2px] border-orange-500 hover:opacity-90 transition-opacity px-4 sm:px-6">
              Download Security Whitepaper
            </button>
          </div>
        </div>
      </section>

      {/* Training That Actually Moves Your KPIs Section */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Heading */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-tight md:leading-tight lg:leading-[36px] tracking-[0] text-gray-900 text-center capitalize align-middle mb-6 sm:mb-8 md:mb-10">
              Training That Actually Moves Your{" "}
              <span className="text-[#FDB11F]">KPIs</span>
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] font-normal text-base sm:text-lg md:text-[20px] leading-[160%] tracking-[0] text-center text-gray-800 mb-3 sm:mb-4 md:mb-[10px]">
              Your competitors are already upskilling. Every day of delay costs
              you market share, innovation speed, and top talent.
            </p>
            <p className="font-['Plus_Jakarta_Sans'] font-normal text-sm sm:text-base md:text-[18px] leading-[160%] tracking-[0] text-center text-gray-800">
              AI is transforming industries, cloud migrations are urgent, and
              cyber threats grow daily. Hiring lags behind—Upskillway closes the
              gap by turning your teams into high performers, fast.
            </p>
          </div>

          {/* Feature Cards Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-12 md:mb-16 mt-8 sm:mt-10 md:mt-12">
            {/* Card 1 - Expert-Led Curriculum */}
            <div className="w-full max-w-full lg:max-w-[389.328125px] h-auto min-h-[180px] sm:min-h-[190px] md:min-h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-base sm:text-lg md:text-[18px] leading-tight sm:leading-tight md:leading-[100%] tracking-[0] text-gray-900 mb-2">
                Expert-Led Curriculum
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-xs sm:text-sm md:text-[14px] leading-relaxed sm:leading-relaxed md:leading-[100%] tracking-[0] text-gray-600">
                Learn from practitioners who've solved the exact challenges your
                teams face — not academics teaching theory.
              </p>
            </div>

            {/* Card 2 - Business-Aligned Learning Paths */}
            <div className="w-[389.328125px] h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[100%] text-gray-900 mb-2">
                Business-Aligned Learning Paths
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[100%] text-gray-600">
                Every course directly impacts your bottom line—mapped to your
                strategic initiatives and OKRs.
              </p>
            </div>

            {/* Card 3 - Flexible Delivery Models */}
            <div className="w-[389.328125px] h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[100%] text-gray-900 mb-2">
                Flexible Delivery Models
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[100%] text-gray-600">
                Choose from live instructor-led, self-paced, hybrid, or blended
                learning formats.
              </p>
            </div>

            {/* Card 4 - Prove ROI to Your Board */}
            <div className="w-[389.328125px] h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[100%] text-gray-900 mb-2">
                Prove ROI to Your Board
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[100%] text-gray-600">
                Executive dashboards show exactly how training drives
                productivity, reduces errors, and accelerates projects.
              </p>
            </div>

            {/* Card 5 - Enterprise-Grade Infrastructure */}
            <div className="w-[389.328125px] h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[100%] text-gray-900 mb-2">
                Enterprise-Grade Infrastructure
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[100%] text-gray-600">
                Secure, scalable platform with 99.9% uptime and full compliance.
              </p>
            </div>

            {/* Card 6 - Measurable Business Impact */}
            <div className="w-[389.328125px] h-[202px] bg-white rounded-[12px] border-[1px] border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[18px] leading-[100%] text-gray-900 mb-2">
                Measurable Business Impact
              </h3>
              <p className="font-['Plus_Jakarta_Sans'] font-normal text-[14px] leading-[100%] text-gray-600">
                Training programs that move the needle on business performance.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Bottom CTA Section */}
      <div className=" w-full h-[259px]  bg-white border-[2px] border-[#E5E7EB]  shadow-lg flex items-center justify-center">
        <div className="text-center">
          <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[48px] leading-[45px] tracking-[0] text-gray-900 capitalize text-center mb-4">
            Every Quarter You Wait, Your Competitors Get Further Ahead
          </h3>
          <p className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-[20px] tracking-[0] text-gray-600 text-center mb-8">
            Skills gaps cost Fortune 500 companies an average of $11M annually
            in lost productivity and delayed innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => {
                const element = document.getElementById('workforce-audit');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-white border-2 border-blue-500 text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Calculate Your Skill Gap Cost
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('training-programs');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-gradient-to-r bg-white text-black px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity border-2"
            >
              See Our Training Programs
            </button>
          </div>
        </div>
      </div>

      {/* Build The Capabilities Section */}
      <section id="training-programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="w-full font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-tight md:leading-[46px] tracking-[0] text-gray-900 capitalize align-middle mb-3 sm:mb-4">
              Build The <span className="text-[#FDB11F]">Capabilities</span>{" "}
              Your Business Strategy Demands
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] text-gray-600 max-w-full mx-auto">
              Stop letting skill gaps slow down your roadmap. We train your
              teams in the exact technologies and leadership skills you need to
              execute.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Categories */}
            <div className="lg:col-span-3">
              <div className="space-y-2">
                {programsLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : programs.length > 0 ? (
                  programs.map((program) => (
                    <button
                      key={program.id}
                      onClick={() => setSelectedCategory(program.id)}
                      className={`w-full text-left px-6 py-4 rounded-lg font-semibold transition-colors ${
                        selectedCategory === program.id
                          ? "bg-gradient-to-r from-blue-500 to-orange-400 text-white"
                          : "hover:bg-gray-100 text-gray-700 font-medium"
                      }`}
                    >
                      {program.title ||
                        program.programName ||
                        program.programTitle ||
                        "Untitled Program"}
                    </button>
                  ))
                ) : (
                  Object.keys(CATEGORIES_DATA).map((categoryName) => (
                    <button
                      key={categoryName}
                      onClick={() => setSelectedCategory(categoryName)}
                      className={`w-full text-left px-6 py-4 rounded-lg font-semibold transition-colors ${
                        selectedCategory === categoryName
                          ? "bg-gradient-to-r from-blue-500 to-orange-400 text-white"
                          : "hover:bg-gray-100 text-gray-700 font-medium"
                      }`}
                    >
                      {categoryName}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-2xl p-8">
                {programsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">
                      Loading program details...
                    </p>
                  </div>
                ) : selectedCategory && programs.length > 0 ? (
                  (() => {
                    const selectedProgram = programs.find(
                      (p) => p.id === selectedCategory
                    );
                    if (!selectedProgram) {
                      // Fallback to CATEGORIES_DATA if program not found
                      const categoryData = CATEGORIES_DATA[selectedCategory];
                      if (categoryData) {
                        return (
                          <>
                            <div className="flex items-center gap-4 mb-8">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">
                                  {categoryData.icon}
                                </span>
                              </div>
                              <h3 className="text-3xl font-bold text-gray-900">
                                {categoryData.name}
                              </h3>
                            </div>
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Skills
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {categoryData.skills.map((skill, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                    <span className="text-gray-700">
                                      {skill}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Tools
                              </h4>
                              <div className="flex flex-wrap gap-6">
                                {categoryData.tools.map((tool, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-2xl">
                                      {tool.emoji}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                      {tool.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      }
                      return null;
                    }
                    return (
                      <>
                        {/* Category Header with Image */}
                        <div className="flex items-center gap-4 mb-8">
                          {selectedProgram.cardImageUrl && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={selectedProgram.cardImageUrl}
                                alt={selectedProgram.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                          {!selectedProgram.cardImageUrl && (
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">📚</span>
                            </div>
                          )}
                          <h3 className="text-3xl font-bold text-gray-900">
                            {selectedProgram.title ||
                              selectedProgram.programName ||
                              selectedProgram.programTitle ||
                              "Untitled Program"}
                          </h3>
                        </div>

                        {/* Skills Section */}
                        {selectedProgram.skills &&
                          selectedProgram.skills.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Skills
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {selectedProgram.skills.map((skill, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                    <span className="text-gray-700">
                                      {skill}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Tools Section */}
                        {selectedProgram.masteredTools &&
                          selectedProgram.masteredTools.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Tools
                              </h4>
                              <div className="flex flex-wrap gap-6">
                                {selectedProgram.masteredTools.map(
                                  (tool, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      {tool.url ? (
                                        <img
                                          src={tool.url}
                                          alt={tool.name}
                                          className="w-8 h-8 object-contain"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                            if (e.target.nextSibling) {
                                              e.target.nextSibling.style.display =
                                                "inline";
                                            }
                                          }}
                                        />
                                      ) : (
                                        <span className="text-2xl">🔧</span>
                                      )}
                                      <span className="font-semibold text-gray-900">
                                        {tool.name}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    );
                  })()
                ) : selectedCategory && CATEGORIES_DATA[selectedCategory] ? (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {CATEGORIES_DATA[selectedCategory].icon}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {CATEGORIES_DATA[selectedCategory].name}
                      </h3>
                    </div>
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Skills
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {CATEGORIES_DATA[selectedCategory].skills.map(
                          (skill, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                              <span className="text-gray-700">{skill}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Tools
                      </h4>
                      <div className="flex flex-wrap gap-6">
                        {CATEGORIES_DATA[selectedCategory].tools.map(
                          (tool, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <span className="text-2xl">{tool.emoji}</span>
                              <span className="font-semibold text-gray-900">
                                {tool.name}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No program selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className=" font-['Plus_Jakarta_Sans'] text-[18px] text-gray-600 mb-6">
              Can't find what you're looking for? We create 100% custom programs
              for your specific tech stack and business needs.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('corporate-training-form');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="font-['Plus_Jakarta_Sans'] text-[16px] bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-4 rounded-lg  hover:opacity-90 transition-opacity shadow-lg"
            >
              Request Custom Program →
            </button>
          </div>
        </div>
      </section>

      {/* Free Workforce Capability Audit Section */}
      <section id="workforce-audit" className="py-20 bg-white -mt-20">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#FDE68A] rounded-2xl shadow-[0px_8px_10px_rgba(0,0,0,0.1),0px_20px_25px_rgba(0,0,0,0.1)] p-8 sm:p-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Content */}
              <div className="lg:col-span-2">
                {/* Badge */}
                <div className="inline-block bg-[#FEF3C7] text-[#92400E] px-4 py-2 rounded-full text-sm font-normal mb-6 font-['Inter']">
                  LIMITED TIME: Q1 2025 PLANNING
                </div>

                {/* Heading */}
                <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] leading-[34px] font-semibold text-gray-900/80 mb-4">
                  Get a Free Workforce Capability Audit (Worth $ 6000)
                </h2>

                {/* Description */}
                <p className="font-['Plus_Jakarta_Sans'] text-base leading-[18px] text-[#374151] mb-6">
                  We'll analyze your team's current skills, identify critical
                  gaps costing you revenue, and deliver a custom 90-day
                  transformation roadmap. Only 10 audits available this quarter.
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth="1.67"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                    <span className="font-['Plus_Jakarta_Sans'] text-base leading-4 text-[#374151]">
                      Comprehensive skills gap analysis across your organization
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth="1.67"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                    <span className="font-['Plus_Jakarta_Sans'] text-base leading-4 text-[#374151]">
                      ROI projections with 12-month impact forecast
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                      strokeWidth="1.67"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      />
                    </svg>
                    <span className="font-['Plus_Jakarta_Sans'] text-base leading-4 text-[#374151]">
                      Custom training roadmap aligned to your business goals
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => {
                    const element = document.getElementById('corporate-training-form');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-[#F59E0B] text-white px-8 py-4 rounded-lg font-normal hover:opacity-90 transition-opacity shadow-lg mb-4 font-['Inter'] text-lg leading-[22px]"
                >
                  Claim Your Free Audit →
                </button>

                {/* Urgency Text */}
                <p className="font-['Plus_Jakarta_Sans'] text-sm leading-[14px] text-[#6B7280]">
                  7 audits claimed this week • Only 3 remaining
                </p>
              </div>

              {/* Right Stats Cards */}
              <div className="lg:col-span-1 space-y-4">
                {/* Savings Card */}
                <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-lg p-6">
                  <div className="text-2xl font-normal text-[#2563EB] mb-2 font-['Inter'] leading-[29px]">
                    $850K
                  </div>
                  <p className="text-sm text-[#4B5563] font-['Inter'] leading-[17px]">
                    Avg. annual savings from skill gap elimination
                  </p>
                </div>

                {/* Timeline Card */}
                <div className="bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-lg p-6">
                  <div className="text-2xl font-normal text-[#16A34A] mb-2 font-['Inter'] leading-[29px]">
                    6 weeks
                  </div>
                  <p className="text-sm text-[#4B5563] font-['Inter'] leading-[17px]">
                    From audit to first cohort training
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CHROs & CTOs Trust Us Section */}
      <section className="py-20 bg-white -mt-20">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[48px] leading-[46px] font-bold text-black capitalize mb-4">
              Why <span className="text-[#FDB11F]">CHROs & CTOs</span> Trust Us
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] leading-[32px] text-[#38393E] max-w-1xl mx-auto">
              When failure isn't an option and your board is watching, you need
              a partner who guarantees results. Here's what sets us apart.
            </p>
          </div>

          {/* Features Grid - Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-lg leading-[23px] font-normal text-black mb-2">
                Built for Your Reality, Not Generic Content
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                We customize everything—from your tech stack to your
                processes—so learning transfers immediately to production work.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-lg leading-[23px] font-normal text-black mb-2">
                Guaranteed Business Outcomes
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                40% faster project delivery. 60% fewer production errors. 35%
                better retention. These aren't goals—they're our averages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                SOC 2 Type II certified, GDPR compliant, and ISO 27001 certified
                with enterprise-level security and SSO integration.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Seamless LMS Integration
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Integrate with all major LMS platforms including Cornerstone,
                Workday Learning, SAP SuccessFactors, and more.
              </p>
            </div>
          </div>

          {/* Features Grid - Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Feature 5 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Expert Instructors
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Learn from industry practitioners with real-world experience,
                not just academic credentials.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Dedicated Support
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Your dedicated Customer Success Manager ensures smooth
                implementation, ongoing optimization, and measurable ROI.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Scalable for Global Teams
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Train 10 or 10,000 employees with multi-language support and
                timezone-flexible delivery.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-6">
              <div className="w-10 h-10 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#FDB11F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.33"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Advanced Analytics
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Track learner progress, completion rates, and business impact
                with comprehensive dashboards.
              </p>
            </div>
          </div>

          {/* Bottom CTA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - For CHROs */}
            <div className=" border-l-[2px] border-[#FDE68A] bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-7">
              <div className="font-['Inter'] text-sm leading-[17px] font-normal text-[#FDB11F] mb-2">
                FOR CHROS & L&D LEADERS
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Prove Training ROI to Your Board
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Executive dashboards with productivity metrics, completion
                rates, and business impact tied directly to your OKRs.
              </p>
            </div>

            {/* Card 2 - For CTOs */}
            <div className="border-l-[2px] border-[#FDE68A] bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-7">
              <div className="font-['Inter'] text-sm leading-[17px] font-normal text-[#FFA800] opacity-[0.82] mb-2">
                FOR CTOS & VPS OF ENGINEERING
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Stop Bleeding $300K/Year on Contractors
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Transform your existing teams into experts. Cut contractor
                dependency 50-80% within 6 months.
              </p>
            </div>

            {/* Card 3 - For Innovation Leaders */}
            <div className="border-l-[2px] border-[#FDE68A] bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] p-7">
              <div className="font-['Inter'] text-sm leading-[17px] font-normal text-[#FDB11F] mb-2">
                FOR INNOVATION LEADERS
              </div>
              <h3 className="font-['Inter'] text-lg leading-[22px] font-normal text-black mb-2">
                Ship AI/ML Products This Quarter
              </h3>
              <p className="font-['Inter'] text-sm leading-[17px] text-[#4B5563]">
                Don't wait 18 months to hire unicorns. Train your product teams
                to build with AI in 90 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From Day One To Business Impact Section */}
      <section className="py-20 bg-white -mt-20">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-[38px] leading-tight sm:leading-tight md:leading-[46px] font-bold text-black capitalize mb-3 sm:mb-4">
              From Day One To{" "}
              <span className="text-[#FDB11F]">Business Impact</span> In Under 6
              Weeks
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-relaxed md:leading-[32px] text-[#38393E] max-w-full sm:max-w-2xl md:max-w-1xl mx-auto">
              No six-month pilots. No endless planning. Your teams start
              learning—and applying skills—within weeks. Here's exactly how.
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-8">
            {/* Step 1 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FDB11F] rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] text-2xl leading-[29px] font-normal text-white">
                      1
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-2xl leading-6 font-normal text-[#111827] mb-3">
                    Discovery & Skills Assessment
                  </h3>
                  <p className="font-['Inter'] text-base leading-4 text-[#4B5563] mb-4">
                    Comprehensive needs analysis to understand your business
                    objectives, current skill gaps, and learning culture.
                    Stakeholder interviews and skills assessments create a
                    detailed capability baseline.
                  </p>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#6B7280]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.33"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-['Inter'] text-sm leading-[14px] text-[#6B7280]">
                      Timeline: 1-2 weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FDB11F] rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] text-2xl leading-[29px] font-normal text-white">
                      2
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-2xl leading-6 font-normal text-[#111827] mb-3">
                    Custom Program Design
                  </h3>
                  <p className="font-['Inter'] text-base leading-4 text-[#4B5563] mb-4">
                    Tailored training program including customized curriculum,
                    learning paths, delivery models, and success metrics.
                    Detailed implementation roadmap and ROI projections
                    provided.
                  </p>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#6B7280]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.33"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-['Inter'] text-sm leading-[14px] text-[#6B7280]">
                      Timeline: 2-3 weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FDB11F] rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] text-2xl leading-[29px] font-normal text-white">
                      3
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-2xl leading-6 font-normal text-[#111827] mb-3">
                    Platform Setup & Integration
                  </h3>
                  <p className="font-['Inter'] text-base leading-4 text-[#4B5563] mb-4">
                    Technical team configures your dedicated training
                    environment, integrates with existing systems (LMS, SSO,
                    HRIS), and sets up analytics dashboards. We handle all
                    technical heavy lifting.
                  </p>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#6B7280]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.33"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-['Inter'] text-sm leading-[14px] text-[#6B7280]">
                      Timeline: 1-2 weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FDB11F] rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] text-2xl leading-[29px] font-normal text-white">
                      4
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-2xl leading-6 font-normal text-[#111827] mb-3">
                    Training Launch & Delivery
                  </h3>
                  <p className="font-['Inter'] text-base leading-4 text-[#4B5563] mb-4">
                    Training begins with comprehensive onboarding for learners
                    and administrators. Your dedicated Customer Success Manager
                    ensures smooth rollout and monitors engagement.
                  </p>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#6B7280]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.33"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-['Inter'] text-sm leading-[14px] text-[#6B7280]">
                      Timeline: Ongoing
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#FDB11F] rounded-full flex items-center justify-center">
                    <span className="font-['Inter'] text-2xl leading-[29px] font-normal text-white">
                      5
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-['Inter'] text-2xl leading-6 font-normal text-[#111827] mb-3">
                    Measurement & Continuous Improvement
                  </h3>
                  <p className="font-['Inter'] text-base leading-4 text-[#4B5563] mb-4">
                    Track progress against defined KPIs, provide regular
                    reporting on training impact, and continuously refine
                    programs based on learner feedback and business outcomes.
                  </p>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[#6B7280]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.33"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-['Inter'] text-sm leading-[14px] text-[#6B7280]">
                      Timeline: Ongoing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-Specific Expertise Section */}
      <section className="py-20 bg-white -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-tight md:leading-tight lg:leading-[46px] font-bold text-black capitalize mb-3 sm:mb-4">
              <span className="text-[#FDB11F]">Industry-Specific</span>{" "}
              Expertise
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-relaxed md:leading-[32px] text-[#38393E] max-w-full sm:max-w-2xl md:max-w-1xl mx-auto">
              We understand your unique compliance, security, and skill
              requirements.
            </p>
          </div>

          {/* Industry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Financial Services */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏦</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Financial Services
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Regulatory compliance & reporting, Data analytics for fraud &
                risk mitigation, AI-driven customer insights
              </p>
              <p className="text-xs text-gray-500">
                PCI-DSS • SOX • FINRA compliant training
              </p>
            </div>

            {/* Healthcare & Life Sciences */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Healthcare & Life Sciences
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                HIPAA compliance, clinical AI, healthcare data analytics, Secure
                data handling & privacy, AI-assisted diagnostics
              </p>
              <p className="text-xs text-gray-500">
                BAA available • PHI-safe environment
              </p>
            </div>

            {/* Technology & SaaS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Technology & SaaS
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Platform engineering, DevOps, AI/ ML product development
              </p>
              <p className="text-xs text-gray-500">
                Latest tech stacks • Continuous updates
              </p>
            </div>

            {/* Manufacturing & Industrial */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Manufacturing & Industrial
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                IIoT, predictive maintenance, supply chain optimization
              </p>
              <p className="text-xs text-gray-500">
                Industry 4.0 ready • OT security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section with Animated Scroll */}
      <CorporateTestimonials
        testimonials={testimonials}
        title="Success Stories Powered by Strong Partnerships"
        subtitle="See how enterprises are improving productivity, accelerating digital adoption, and closing capability gaps with Upskillway."
      />

      {/* Multi-Step Corporate Training Registration Form */}

      {/* Pricing & Details Strip */}
      {/* <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-3xl shadow-xl px-6 py-8">
            <StatCard
              label="Program Pricing"
              value={formatCurrency(resolvedData.price)}
            />
            <StatCard
              label="Program Duration"
              value={`${resolvedData.durationMonths || 0} Months`}
              helperText={`${resolvedData.durationHours || 0} Hours`}
            />
            <StatCard
              label="Placement Success"
              value={`${resolvedData.placementRate || 92}%`}
            />
            <StatCard
              label="Trusted Partners"
              value="200+"
              helperText="Colleges & Universities"
            />
          </div>
        </div>
      </section> */}

      {/* Institution Benefits */}
  {faqs.length > 0 ? (
        <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-white">
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-bold text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              Frequently asked Questions
            </h2>

            <div className=" max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id || index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{faq.question}</span>
                    </h3>
                    <button
                      className={`p-2 rounded-full transition-colors ${
                        expandedFAQ === (faq.id || index)
                          ? "text-red-500 hover:bg-red-50"
                          : "text-blue-500 hover:bg-blue-50"
                      }`}
                      onClick={() =>
                        setExpandedFAQ(
                          expandedFAQ === (faq.id || index)
                            ? null
                            : faq.id || index
                        )
                      }
                    >
                      <span className="text-xl font-bold">
                        {expandedFAQ === (faq.id || index) ? "×" : "+"}
                      </span>
                    </button>
                  </div>
                  {expandedFAQ === (faq.id || index) && (
                    <div className="mt-4 pl-11 text-gray-600">
                      <p>{faq.answer}</p>
                      {faq.category && (
                        <div className="mt-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center p-4 sm:p-8 md:p-12 lg:p-16">
              <button className="relative text-white text-base sm:text-lg lg:text-[20px] bg-[#FCB11F] w-full sm:w-[200px] lg:w-[220px] h-[48px] sm:h-[52px] lg:h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px] flex items-center justify-center mx-auto">
                View More
                <svg
                  className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px] absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 bg-[#FCB11F] text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      ) : null}


      {/* Multi-Step Corporate Training Registration Form */}
      <section id="corporate-training-form" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-1xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-5 items-start">
              <div className="flex flex-col justify-center">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[48px] leading-[46px] font-bold text-black capitalize mb-4">
                  Register for <br></br>
                  <span className="font-['Plus_Jakarta_Sans'] text-[#FDB11F]">
                    Corporate Training
                  </span>
                </h2>
          
              </div>
              <div className="relative bg-white rounded-3xl  p-8">
             

                {submitStatus.message && (
                  <div
                    className={`p-4 rounded-lg mb-4 text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-purple-100 rounded-full mb-4">
                        <span className="text-2xl font-bold text-gray-700">1</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Upskillway"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="retail">Retail</option>
                        <option value="consulting">Consulting</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-purple-100 rounded-full mb-4">
                        <span className="text-2xl font-bold text-gray-700">2</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Dinesh"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="dinesh@upskillway.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9413477263"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Program Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-100 to-purple-100 rounded-full mb-4">
                        <span className="text-2xl font-bold text-gray-700">3</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program Type
                      </label>
                      <select
                        name="programType"
                        value={formData.programType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">select Program Type</option>
                        {resolvedData.curriculum?.map((module, index) => (
                          <option key={index} value={module.title}>
                            {module.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Participants
                      </label>
                      <input
                        type="number"
                        name="numberOfParticipants"
                        placeholder="200"
                        value={formData.numberOfParticipants}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Start Date
                      </label>
                      <input
                        type="text"
                        name="preferredStartDate"
                        placeholder="dd-mm-yyyy"
                        value={formData.preferredStartDate}
                        onChange={handleInputChange}
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = 'text';
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      type="button"
                      className="flex-1 py-3 rounded-full font-semibold text-white transition-all duration-300 text-base"
                      style={{
                        background: 'linear-gradient(90deg, #FFA726 0%, #7E57C2 100%)'
                      }}
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      onClick={nextStep}
                      type="button"
                      className="flex-1 py-3 rounded-full font-semibold text-white transition-all duration-300 text-base"
                      style={{
                        background: 'linear-gradient(90deg, #FFA726 0%, #7E57C2 100%)'
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      type="button"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-full font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                      style={{
                        background: 'linear-gradient(90deg, #FFA726 0%, #7E57C2 100%)'
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Schedule Consultation Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-2 sm:px-6">
          <div className="max-w-[1182px] mx-auto">
            <div className="bg-black rounded-[30px] p-6 sm:p-10 text-white">
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                {/* Testimonials Section - API Integrated */}

                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    Schedule a Consultation
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Speak with our corporate training specialists to design the
                    perfect partnership model for your institution.
                  </p>
                  <Form />
                </div>
                <div className="relative flex justify-center">
                  <img
                    src={CorporateConsultation}
                    alt="Schedule consultation"
                    className="w-full h-[260px] sm:h-[320px] md:h-[380px] object-cover rounded-2xl"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-lg max-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
                        HM
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Harry Maguire
                        </div>
                        <div className="text-xs text-gray-600">
                          CEO, GrowthCorp
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Demo Footer CTA */}

      {/* Video Modal */}
      {isVideoModalOpen && resolvedData.videoDemoUrl && (
        <VideoModal
          url={resolvedData.videoDemoUrl}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CorporateTrainingPage;

/* -------------------------------------------------------------------------- */
/*                                    UI                                     */
/* -------------------------------------------------------------------------- */

const StatCard = ({ label, value, helperText }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition">
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
    {helperText && (
      <div className="text-xs text-gray-400 mt-1">{helperText}</div>
    )}
  </div>
);

const ProgramCard = ({ title, image, duration, level, topics }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
    <div className="relative">
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
        loading="lazy"
        onError={(event) => {
          event.target.src = "/api/placeholder/300/200";
        }}
      />
      <div className="absolute top-3 left-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
        {level}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
        <span>{duration}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {topics?.map((topic, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-gray-600"
          >
            <span className="mt-1 inline-block w-1.5 h-1.5 bg-gray-400 rounded-full" />
            {topic}
          </li>
        ))}
      </ul>
      <button className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2.5 rounded-full font-semibold hover:shadow-lg transition">
        Explore →
      </button>
    </div>
  </div>
);

const BenefitCard = ({ title, description }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md hover:-translate-y-1 hover:shadow-xl transition">
    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg font-bold mb-4">
      ✦
    </div>
    <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const TestimonialCard = ({
  studentName,
  studentRole,
  testimonialText,
  rating,
  studentImageUrl,
}) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition">
    <div className="flex items-center gap-4 mb-4">
      <img
        src={studentImageUrl || "/api/placeholder/60/60"}
        alt={studentName}
        className="w-14 h-14 rounded-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.target.src = "/api/placeholder/60/60";
        }}
      />
      <div>
        <div className="font-semibold text-gray-900">{studentName}</div>
        <div className="text-sm text-gray-500">{studentRole}</div>
      </div>
      <div className="ml-auto flex items-center gap-1 text-yellow-400">
        {Array.from({ length: rating || 5 }).map((_, index) => (
          <span key={index}>★</span>
        ))}
      </div>
    </div>
    <p className="text-gray-600 italic leading-relaxed">"{testimonialText}"</p>
  </div>
);

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
      required
    >
      <option value="">Select {label}</option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={3}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
    />
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <span className="text-xl text-gray-500">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="px-6 pb-5 text-gray-600">{answer}</div>}
    </div>
  );
};

const ContactForm = () => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (event) => {
    setContactData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    try {
  await fetch(`${config.apiBaseUrl}/demo-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });
      setStatus("success");
      setContactData({ name: "", email: "", phone: "", college: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Name"
        name="name"
        value={contactData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        required
      />
      <InputField
        label="Email"
        name="email"
        type="email"
        value={contactData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />
      <InputField
        label="Phone"
        name="phone"
        value={contactData.phone}
        onChange={handleChange}
        placeholder="Enter your phone"
        required
      />
      <InputField
        label="College Name"
        name="college"
        value={contactData.college}
        onChange={handleChange}
        placeholder="Enter your college name"
        required
      />
      <button
        type="submit"
        className="w-full bg-[#FDB11F] text-black font-semibold py-3 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Request a Demo"}
      </button>
      {status === "success" && (
        <p className="text-sm text-green-300">
          Thank you! We will contact you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-300">
          Submission failed. Please try again.
        </p>
      )}
    </form>
  );
};

const VideoModal = ({ url, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-black rounded-3xl overflow-hidden max-w-3xl w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
        aria-label="Close video modal"
      >
        ×
      </button>
      <video
        src={url}
        controls
        autoPlay
        className="w-full h-[360px] sm:h-[420px] object-cover"
      />
    </div>
  </div>
);

const CorporateTrainingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-gray-300 rounded-full" />
            <div className="h-16 w-full bg-gray-300 rounded-xl" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-10 bg-gray-300 rounded-full w-48" />
          </div>
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-100 h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
