import React, { useEffect, useState, useMemo } from 'react';
import { SpinningText } from "@/components/ui/spinning-text" 
import Testimonial from "../components/Courses/Testimonial";
import sitting from "../assets/Images/sitting.png";
import popUp from "../assets/Images/pop_main.png";
import FAQ from "../components/Courses/FAQ";
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Users, 
  Star, 
  Clock, 
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Trophy,
  BookOpen,
  Code,
  Briefcase,
  Award,
  Laptop,
  Globe,
  Shield,
  Zap,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';

import Share from '../components/Courses/Share';
import config from '../config/env';


const CourseDetail = () => {
  const { id } = useParams();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCurriculumTab, setActiveCurriculumTab] = useState('Fundamentals');
  const [expandedModule, setExpandedModule] = useState(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollStep, setEnrollStep] = useState(1);
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    email: '',
    phone: '',
    background: '',
    courseType: ''
  });
  
  // Default course data with structured curriculum for different tabs
  const defaultCourse = useMemo(() => ({
    id: id || '1',
    _id: id || '1',
    title: 'UI UX Design',
    programName: 'UI UX Design Course',
    description: 'Accelerate your journey in UI/UX Design by learning design theory, tools, and prototyping. Gain hands-on experience that can help you deliver engaging digital experiences and thrive in this creative field.',
    shortDescription: 'Accelerate your journey in UI/UX Design',
    bannerImageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
    aboutSectionImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    // Structured curriculum by tabs
    curriculumByTab: {
      'Fundamentals': [
        {
          moduleTitle: 'Introduction to Design',
          topics: [
            'Design Principles and Theory',
            'Color Theory and Typography',
            'User Psychology Basics',
            'Design Thinking Process',
            'Introduction to UI/UX'
          ]
        },
        {
          moduleTitle: 'Design Fundamentals',
          topics: [
            'Visual Hierarchy',
            'Layout and Composition',
            'Spacing and Grid Systems',
            'Design Patterns',
            'Accessibility Basics'
          ]
        }
      ],
      'Web Development': [
        {
          moduleTitle: 'HTML5 and CSS3',
          topics: [
            'HTML5 Fundamentals',
            'CSS3 Advanced Features',
            'Responsive Web Design',
            'CSS Grid and Flexbox',
            'Modern CSS Techniques'
          ]
        },
        {
          moduleTitle: 'JavaScript Basics',
          topics: [
            'JavaScript Fundamentals',
            'DOM Manipulation',
            'Event Handling',
            'ES6+ Features',
            'Async Programming'
          ]
        }
      ],
      'Data Structures and Algorithms': [
        {
          moduleTitle: 'Introduction to Algorithms',
          topics: [
            'Algorithm Basics',
            'Time and Space Complexity',
            'Sorting Algorithms',
            'Searching Algorithms',
            'Problem Solving Techniques'
          ]
        },
        {
          moduleTitle: 'Data Structures',
          topics: [
            'Arrays and Linked Lists',
            'Stacks and Queues',
            'Trees and Graphs',
            'Hash Tables',
            'Advanced Data Structures'
          ]
        }
      ],
      'Frontend Development': [
        {
          moduleTitle: 'React Fundamentals',
          topics: [
            'React Components and Props',
            'State Management',
            'React Hooks',
            'React Router',
            'Context API'
          ]
        },
        {
          moduleTitle: 'Advanced Frontend',
          topics: [
            'State Management with Redux',
            'Performance Optimization',
            'Testing React Applications',
            'Build Tools and Bundlers',
            'Deployment Strategies'
          ]
        }
      ],
      'Databases': [
        {
          moduleTitle: 'Database Fundamentals',
          topics: [
            'SQL Basics',
            'Database Design',
            'Normalization',
            'Query Optimization',
            'Database Relationships'
          ]
        },
        {
          moduleTitle: 'NoSQL Databases',
          topics: [
            'MongoDB Fundamentals',
            'Document Modeling',
            'Mongoose ODM',
            'Database Operations',
            'Advanced Queries'
          ]
        }
      ]
    },
    // Default curriculum (for backward compatibility)
    curriculum: [
      {
        moduleTitle: 'Introduction to Web Development',
        topics: [
          'HTML5 and CSS3 Fundamentals',
          'JavaScript Basics and ES6+',
          'Responsive Web Design',
          'Git and Version Control',
          'Development Environment Setup'
        ]
      }
    ],
    trainingOptions: [
      {
        name: 'Self-Paced',
        price: 299,
        currency: 'USD',
        descriptionPoints: [
          'Lifetime access to course materials',
          'Self-paced learning',
          'Certificate of completion',
          'Community support',
          'Project-based assignments'
        ]
      },
      {
        name: 'Live Classes',
        price: 499,
        currency: 'USD',
        descriptionPoints: [
          'Live interactive sessions',
          'Real-time doubt clearing',
          'Personalized mentorship',
          'Certificate of completion',
          'Job placement assistance',
          'Industry projects'
        ]
      },
      {
        name: 'Corporate Training',
        price: 999,
        currency: 'USD',
        descriptionPoints: [
          'Customized curriculum',
          'On-site or online training',
          'Dedicated trainer',
          'Team assessments',
          'Post-training support',
          'Bulk pricing available'
        ]
      }
    ],
    projects: [
      {
        title: 'AI-powered code Generator',
        description: 'Build an AI-powered code generation tool',
        imageUrl: 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/55570f55-ca1d-428e-afeb-e3ab5784e8db.png'
      },
      {
        title: 'Hotel booking application',
        description: 'Create a complete hotel booking system',
        imageUrl: 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/bf8a576e-58c4-4308-bead-92dc10e97934.png'
      },
      {
        title: 'AI-powered object detection application',
        description: 'Develop an AI object detection system',
        imageUrl: 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b4f057c7-d0a0-41a5-ac50-a40e0cb7df19.png'
      }
    ],
    mentors: [
      {
        name: 'Christina Rosetti',
        title: 'Chief Financial Officer',
        bio: 'Our CFO brings strategic vision and financial expertise',
        imageUrl: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/EOMQz7JxAF.png'
      },
      {
        name: 'Edgar Davids',
        title: 'Chief Executive Officer',
        bio: 'Our CEO leads with vision and dedication, driving innovation.',
        imageUrl: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/Qe0awkiE5U.png'
      }
    ],
    faqs: [
      {
        question: 'What prerequisites do I need for this course?',
        answer: 'Basic knowledge of HTML, CSS, and JavaScript is recommended. However, we cover fundamentals in the first module, so beginners can also join.'
      },
      {
        question: 'How long does it take to complete the course?',
        answer: 'The self-paced version can be completed in 3-6 months depending on your schedule. Live classes typically run for 12 weeks with 2-3 sessions per week.'
      },
      {
        question: 'Will I get a certificate upon completion?',
        answer: 'Yes, you will receive a certificate of completion that you can add to your LinkedIn profile and resume.'
      }
    ]
  }), [id]);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
  // Fetch from the correct CMS API endpoint
  const response = await fetch(`${config.apiBaseUrl}/cms/courses`);
        
        if (response.ok) {
          const result = await response.json();
          console.log('📡 API Response:', result);
          
          if (result.success && result.data) {
            console.log('📡 All courses:', result.data.map(c => ({ id: c.id, slug: c.slug, title: c.title })));
            console.log('📡 Looking for course with id:', id);
            
            // Find the course by ID or slug
            const foundCourse = result.data.find(c => c.id === id || c.slug === id || c._id === id);
            
            if (foundCourse) {
              // Map testimonials to the expected format
              const mappedTestimonials = (foundCourse.testimonials || []).map(t => ({
                id: t.id || t._id,
                authorName: t.authorName || t.name || t.author || 'Anonymous',
                role: t.role || t.designation || t.position || 'Student',
                text: t.text || t.testimonial || t.content || t.message || '',
                avatarUrl: t.avatarUrl || t.imageUrl || t.profileImage || t.image || null,
                videoUrl: t.videoUrl || t.video || null,
                status: t.status || 'approved'
              }));
              
              console.log('📚 Found course from API:', foundCourse.title);
              console.log('📚 API Curriculum data:', foundCourse.curriculum);
              console.log('📚 Number of curriculum modules:', foundCourse.curriculum?.length);
              
              const mergedCourse = {
                ...defaultCourse,
                ...foundCourse,
                bannerImageUrl: foundCourse.bannerImageUrl || defaultCourse.bannerImageUrl,
                aboutSectionImageUrl: foundCourse.aboutSectionImageUrl || defaultCourse.aboutSectionImageUrl,
                title: foundCourse.title || defaultCourse.title,
                description: foundCourse.description || defaultCourse.description,
                shortDescription: foundCourse.shortDescription || foundCourse.description || defaultCourse.shortDescription,
                curriculum: foundCourse.curriculum || defaultCourse.curriculum,
                trainingOptions: foundCourse.trainingOptions || defaultCourse.trainingOptions,
                projects: foundCourse.projects || defaultCourse.projects,
                mentors: foundCourse.mentors || defaultCourse.mentors,
                faqs: foundCourse.faqs || defaultCourse.faqs,
                testimonials: mappedTestimonials,
                masteredTools: foundCourse.masteredTools || [],
                careerRoles: foundCourse.careerRoles || [],
                durationMonths: foundCourse.durationMonths,
                durationHours: foundCourse.durationHours,
                price: foundCourse.price,
                programName: foundCourse.programName || foundCourse.title,
                deliveryModes: foundCourse.deliveryModes || [],
                language: foundCourse.language,
                curriculumByTab: foundCourse.curriculumByTab || defaultCourse.curriculumByTab
              };
              
              console.log('📚 Merged course curriculum:', mergedCourse.curriculum);
              setCourse(mergedCourse);
            } else {
              setCourse(defaultCourse);
            }
          } else {
            setCourse(defaultCourse);
          }
        } else {
          setCourse(defaultCourse);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setCourse(defaultCourse);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    } else {
      setCourse(defaultCourse);
      setLoading(false);
    }
  }, [defaultCourse, id]);

  

  

  // Curriculum tabs
  const curriculumTabs = ['Fundamentals', 'Web Development', 'Data Structures and Algorithms', 'Frontend Development', 'Databases'];

  // Get current curriculum based on active tab
  const getCurrentCurriculum = () => {
    // First check if API has curriculum data (not from default)
    if (course?.curriculum && course.curriculum !== defaultCourse.curriculum && course.curriculum.length > 0) {
      console.log('✅ Using curriculum from API:', course.curriculum);
      console.log('Number of modules:', course.curriculum.length);
      return course.curriculum;
    }
    
    // Then check for tab-based curriculum
    if (course?.curriculumByTab && course.curriculumByTab[activeCurriculumTab]) {
      console.log('✅ Using curriculumByTab for:', activeCurriculumTab);
      console.log('Curriculum data:', course.curriculumByTab[activeCurriculumTab]);
      return course.curriculumByTab[activeCurriculumTab];
    }
    
    // Fallback to default
    console.log('� ️ Using default curriculum');
    return defaultCourse.curriculum;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Failed to Load Course</h1>
          <p className="text-gray-600 mb-8">{error || 'Course not found'}</p>
          <button
            onClick={() => {
              setCourse(defaultCourse);
              setError(null);
            }}
            className="bg-gradient-to-r from-[#FF9500] to-[#FFB84D] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Button component with hover effect
  const ButtonWithHover = ({ children, onClick, className = '', variant = 'primary' }) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform';
    const variants = {
      primary: 'bg-[#FD661F] text-white hover:bg-[#FF9500] hover:scale-105 hover:shadow-lg',
      secondary: 'bg-white text-[#FD661F] border-2 border-[#FD661F] hover:bg-[#FD661F] hover:text-white hover:scale-105',
      outline: 'bg-transparent text-[#FD661F] border-2 border-[#FD661F] hover:bg-[#FD661F] hover:text-white hover:scale-105',
      download: 'bg-[#fcb11f] text-white hover:bg-[#FF9500] hover:scale-105 hover:shadow-lg'
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

    

  
  

  return (
    <div className="main-container w-full max-w-full sm:max-w-full md:max-w-full lg:max-w-[1512px] bg-[#fff] relative overflow-hidden mx-auto my-0 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="w-full lg:w-[1789px] h-auto lg:h-[497px] relative z-[140] mt-[200px] sm:mt-[400px] md:mt-[600px] lg:mt-[1057px] mr-0 mb-0 ml-0 lg:ml-[-319px]">
        <div className="w-full lg:w-[1549px] h-auto lg:h-[40px] bg-[rgba(0,0,0,0)] relative lg:absolute top-0 left-0 z-[140]">
          <div className="w-full lg:w-[723px] h-auto lg:h-[39px] font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] relative lg:absolute top-0 left-0 lg:left-[426px] text-center whitespace-normal lg:whitespace-nowrap z-[142] px-4 lg:px-0">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] text-[#3d3d3d] relative text-center">
              About{" "}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] text-[#fdb11f] relative text-center">
              {course?.title || 'UI UX Design'}
            </span>
            <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] text-[#3d3d3d] relative text-center">
              {" "}
              Course
            </span>
          </div>          <div className="hidden lg:block w-[427.234px] h-[40px] bg-[rgba(0,0,0,0)] absolute top-0 left-[426.375px] z-[141]" />
        </div>
        <div className="w-full lg:w-[1440px] h-auto lg:h-[497px] bg-[rgba(0,0,0,0)] relative lg:absolute top-0 left-0 lg:left-[349px] z-[138] mt-8 lg:mt-0">
          <div className="w-full lg:w-[1280px] h-auto lg:h-[497px] bg-[rgba(0,0,0,0)] relative z-[139] mt-0 mr-0 mb-0 ml-0 lg:ml-[80px]">
            <div className="w-full lg:w-[1280px] h-auto lg:h-[401px] bg-[rgba(0,0,0,0)] relative z-[143] mt-8 lg:mt-[96px] mr-0 mb-0 ml-0">
              <div className="w-full lg:w-[628px] h-auto lg:h-[401px] bg-[rgba(0,0,0,0)] relative lg:absolute top-0 left-0 z-[144]">
                <div className="w-full lg:w-[628px] h-auto lg:h-[66px] bg-[rgba(0,0,0,0)] relative z-[145] mt-0 mr-0 mb-0 ml-0">
                  <span className="flex w-full lg:w-[623px] h-auto lg:h-[46px] justify-start items-start font-['Plus_Jakarta_Sans'] text-sm sm:text-base md:text-lg lg:text-[18px] font-medium leading-relaxed lg:leading-[19px] text-[rgba(0,0,0,0.9)] relative lg:absolute top-0 lg:top-[8px] left-0 text-left z-[146]">
                    {course?.shortDescription || course?.description || 'Accelerate your journey in UI/UX Design by learning design theory, tools, and prototyping. Gain hands-on experience that can help you deliver engaging digital experiences and thrive in this creative field.'}
                  </span>
                </div>
                <div className="w-full lg:w-[628px] h-auto lg:h-[311px] bg-[rgba(0,0,0,0)] relative z-[147] mt-6 lg:mt-[24px] mr-0 mb-0 ml-0">
                  <div className="w-full lg:w-[628px] h-auto lg:h-[311px] bg-[rgba(0,0,0,0)] relative lg:absolute top-0 left-0 z-[148]">
                    <div className="flex flex-col sm:flex-row w-full lg:w-[628px] h-auto lg:h-[93px] justify-between items-start sm:items-center gap-4 sm:gap-0 relative z-[155] mt-0 mr-0 mb-0 ml-0">
                      <div className="w-full sm:w-[280px] md:w-[300px] lg:w-[302px] h-auto lg:h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[149]">
                        <div className="w-full lg:w-[286px] h-auto lg:h-[25px] bg-[rgba(0,0,0,0)] relative z-[150] mt-2 lg:mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[20px] sm:w-[24px] h-[20px] sm:h-[25px] justify-center items-center flex-nowrap relative lg:absolute top-0 left-0 z-[151]">
                            <div className="w-[20px] sm:w-[24px] h-[20px] sm:h-[25px] shrink-0 rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[152]" />
                          </div>
                          <span className="flex h-auto lg:h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-sm sm:text-base lg:text-[17px] font-normal leading-relaxed lg:leading-[16px] text-[#000] relative lg:absolute top-0 lg:top-[2px] left-0 lg:left-[32px] text-left whitespace-normal lg:whitespace-nowrap z-[153] pl-7 lg:pl-0">
                            Live Interactive Sessions
                          </span>
                        </div>
                        <span className="block h-auto lg:h-[19px] font-['Plus_Jakarta_Sans'] text-xs sm:text-sm lg:text-[14px] font-normal leading-relaxed lg:leading-[14px] text-[#757575] relative text-left whitespace-normal lg:whitespace-wrap z-[154] mt-2 lg:mt-[13px] mr-0 mb-0 ml-0">
                          Learn directly from industry mentors in live classes.
                        </span>
                      </div>
                      <div className="w-full sm:w-[280px] md:w-[300px] lg:w-[302px] h-auto lg:h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[155]">
                        <div className="w-[286px] h-[25px] bg-[rgba(0,0,0,0)] relative z-[156] mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[24px] h-[25px] justify-center items-center flex-nowrap absolute top-0 left-0 z-[157]">
                            <div className="w-[24px] h-[25px] shrink-0 rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[158]" />
                          </div>
                          <span className="flex h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[17px] font-normal leading-[16px] text-[#000] absolute top-[2px] left-[32px] text-left whitespace-nowrap z-[159]">
                            Project Portfolio
                          </span>
                        </div>
                        <span className="block h-[19px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] text-[#757575] relative text-left whitespace-wrap z-[160] mt-[13px] mr-0 mb-0 ml-0">
                          Start creating a job-ready portfolio with real- world
                          projects.
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[628px] h-[93px] justify-between items-center relative z-[167] mt-[16px] mr-0 mb-0 ml-0">
                      <div className="w-[302px] h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[161]">
                        <div className="w-[286px] h-[25px] bg-[rgba(0,0,0,0)] relative z-[162] mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[24px] h-[25px] justify-center items-center flex-nowrap absolute top-0 left-0 z-[163]">
                            <div className="w-[24px] h-[25px] shrink-0 rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[164]" />
                          </div>
                          <span className="flex h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[17px] font-normal leading-[16px] text-[#000] absolute top-[2px] left-[32px] text-left whitespace-nowrap z-[165]">
                            Career Assistance
                          </span>
                        </div>
                        <span className="block h-[19px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] text-[#757575] relative text-left whitespace-wrap z-[166] mt-[13px] mr-0 mb-0 ml-0">
                          Prepare for interviews with guidance and opportunities
                          to showcase skills
                        </span>
                      </div>
                      <div className="w-[302px] h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[167]">
                        <div className="w-[286px] h-[25px] bg-[rgba(0,0,0,0)] relative z-[168] mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[24px] h-[25px] justify-center items-center flex-nowrap absolute top-0 left-0 z-[169]">
                            <div className="w-[24px] h-[25px] shrink-0 rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[170]" />
                          </div>
                          <span className="flex h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[17px] font-normal leading-[16px] text-[#000] absolute top-[1.5px] left-[32px] text-left whitespace-nowrap z-[171]">
                            Dedicated Peer Network
                          </span>
                        </div>
                        <span className="block h-[19px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] text-[#757575] relative text-left whitespace-wrap z-[172] mt-[13px] mr-0 mb-0 ml-0">
                          Build connections with like-minded learners to
                          exchange ideas and experiences.
                        </span>
                      </div>
                    </div>
                    <div className="flex w-[628px] h-[93px] justify-between items-center relative z-[179] mt-[16px] mr-0 mb-0 ml-0">
                      <div className="w-[302px] h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[173]">
                        <div className="w-[251px] h-[25px] bg-[rgba(0,0,0,0)] relative z-[174] mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[24px] h-[25px] justify-center items-center flex-nowrap absolute top-0 left-0 z-[175]">
                            <div className="w-[24px] h-[25px] shrink-0 rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[176]" />
                          </div>
                          <span className="flex h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[17px] font-normal leading-[16px] text-[#000] absolute top-[2px] left-[32px] text-left whitespace-nowrap z-[177]">
                            Learn Creative Skills
                          </span>
                        </div>
                        <span className="block h-[19px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] text-[#757575] relative text-left whitespace-wrap z-[178] mt-[13px] mr-0 mb-0 ml-0">
                          Understand practical uses of user research,
                          prototyping, and design tools.
                        </span>
                      </div>
                      <div className="w-[302px] h-[93px] shrink-0 bg-[rgba(0,0,0,0)] relative z-[179]">
                        <div className="w-[286px] h-[25px] bg-[rgba(0,0,0,0)] relative z-[180] mt-[8px] mr-0 mb-0 ml-0">
                          <div className="flex w-[24px] h-[25px] justify-center items-center flex-nowrap absolute top-0 left-0 z-[181]">
                            <div className="w-[24px] h-[25px] shrink-0  rounded-full bg-[url(https://cdn-icons-png.flaticon.com/512/4436/4436481.png)] bg-cover bg-no-repeat relative overflow-hidden z-[182]" />
                          </div>
                          <span className="flex h-[22px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[17px] font-normal leading-[16px] text-[#000] absolute top-[2px] left-[32px] text-left whitespace-nowrap z-[183]">
                            Certification
                          </span>
                        </div>
                        <span className="block h-[19px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] text-[#757575] relative text-left whitespace-wrap z-[184] mt-[13px] mr-0 mb-0 ml-0">
                          Attain your certificate upon course completion to
                          showcase your capabilities.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-[526px] h-auto lg:h-[372px] bg-[rgba(0,0,0,0)] relative lg:absolute top-0 lg:top-[14.5px] left-0 lg:left-[754px] z-[185] mt-8 lg:mt-0">
                <img 
                  src={course?.aboutSectionImageUrl || 'https://images.unsplash.com/photo-1555949963-aa79dcee981d'} 
                  alt={`About ${course?.title || 'Course'}`}
                  className="w-full lg:w-[526px] h-auto lg:h-[372px] object-cover rounded-[12px] relative lg:absolute top-0 left-0 z-[186]"
                  onError={(e) => {
                    console.log('Image failed to load, using fallback');
                    e.target.src = 'https://images.unsplash.com/photo-1555949963-aa79dcee981d';
                  }}
                />
              </div>
              <div className="hidden lg:block w-[239.478px] h-[72.383px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/UjmStk50oD.png)] bg-cover bg-no-repeat absolute top-[315.82px] left-[435.555px] overflow-hidden z-[64]">
                <div className="w-[239.478px] h-[72.383px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/yMMm9NKdAr.png)] bg-cover bg-no-repeat absolute top-0 left-0 overflow-hidden z-[65]">
                  <div className="w-[239.478px] h-[72.383px] absolute top-0 left-0 overflow-hidden z-[66]">
                    <div className="w-[239.478px] h-[72.383px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/kopm3217TV.png)] bg-cover bg-no-repeat relative overflow-hidden z-[67] mt-[-14.359px] mr-0 mb-0 ml-[-0.89px]" />
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-[641.746px] h-[46.14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/hO218Z7JDd.png)] bg-cover bg-no-repeat absolute top-[340.58px] left-[328.66px] overflow-hidden z-[59]">
                <div className="w-[641.746px] h-[46.14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/kqxZdZLUmv.png)] bg-cover bg-no-repeat absolute top-0 left-0 overflow-hidden z-[60]">
                  <div className="w-[641.746px] h-[46.14px] absolute top-0 left-0 overflow-hidden z-[61]">
                    <div className="w-[641.746px] h-[46.14px] relative overflow-hidden z-[62] mt-[21.16px] mr-0 mb-0 ml-[1.32px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[779px] h-auto lg:h-[39px] font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] relative text-center lg:text-left whitespace-normal lg:whitespace-nowrap z-[187] mt-12 sm:mt-16 md:mt-20 lg:mt-[76px] mr-0 mb-0 ml-0 lg:ml-[136px] px-4 lg:px-0">
        <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] text-[#fbb11f] relative text-center lg:text-left">
          Exclusive
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold leading-tight lg:leading-[32px] text-[#3d3d3d] relative text-center lg:text-left">
          {" "}
          Course Offerings
        </span>
      </div>
      <div className="w-full lg:w-[1120px] h-auto lg:h-[306px] relative z-[189] mt-8 sm:mt-10 md:mt-12 lg:mt-[58px] mr-0 mb-0 ml-0 lg:ml-[197px] px-4 lg:px-0">
        <div className="hidden lg:block w-[96.904px] h-[17.37px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/zGFx902Bsu.png)] bg-cover bg-no-repeat relative overflow-hidden z-[69] mt-[85.59px] mr-0 mb-0 ml-[426.584px]">
          <div className="w-[96.904px] h-[17.37px] absolute top-0 left-0 overflow-hidden z-[70]">
            <div className="w-[96.904px] h-[17.37px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/10kzt304u1.png)] bg-cover bg-no-repeat relative overflow-hidden z-[71] mt-[11.18px] mr-0 mb-0 ml-[3.168px]" />
            <div className="w-[96.904px] h-[17.37px] absolute top-0 left-0 overflow-hidden z-[72]">
              <div className="w-[96.904px] h-[17.37px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/tFMMAygNN0.png)] bg-cover bg-no-repeat relative overflow-hidden z-[73] mt-[11.18px] mr-0 mb-0 ml-[3.168px]" />
            </div>
          </div>
        </div>
        <div className="flex w-full lg:w-[1120px] h-auto lg:h-[306px] flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-[60px] items-start flex-nowrap relative lg:absolute top-0 left-0 z-[189]">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[50px] items-start self-stretch shrink-0 flex-nowrap relative z-[190]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-[26px] items-center self-stretch shrink-0 relative z-[191]">
              <div className="w-full lg:w-[356px] h-auto lg:h-[128px] shrink-0 bg-[#f7f7f7] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] relative overflow-hidden z-[192] p-4 sm:p-5 lg:p-0">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[193]">
                  <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[194] mt-[4px] mr-0 mb-0 ml-[4px]">
                    <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/e8bdc807-3891-4e58-a7ce-b3e393068372.png)] bg-cover bg-no-repeat relative overflow-hidden z-[195]" />
                  </div>
                </div>
                <div className="flex w-[122px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[37px] left-[128px] z-[196]">
                  <span className="flex w-[201px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[197]">
                    Industry-Oriented Curriculum
                  </span>
                </div>
              </div>
              <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[198]">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[199]">
                  <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[200] mt-[4px] mr-0 mb-0 ml-[4px]">
                    <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1ff21f50-9ab8-4973-b8be-53cf85e79fd4.png)] bg-cover bg-no-repeat relative overflow-hidden z-[201]" />
                  </div>
                </div>
                <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[37px] left-[128px] z-[202]">
                  <span className="flex w-[207px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[203]">
                    Career Guidance & Interview Preparation
                  </span>
                </div>
              </div>
              <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[204]">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[205]">
                  <div className="w-[72px] h-[72px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/0dcb5a75-360f-4857-9a5a-b1464889d534.png)] bg-cover bg-no-repeat relative overflow-hidden z-[206] mt-[4px] mr-0 mb-0 ml-[4px]" />
                </div>
                <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[35px] left-[128px] z-[207]">
                  <span className="flex w-[107px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[208]">
                    Peer Networking
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-[26px] items-center self-stretch shrink-0 flex-nowrap relative z-[209]">
              <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[210]">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[211]">
                  <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[212] mt-0 mr-0 mb-0 ml-[4px]">
                    <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/f450bb81-282c-42b3-893f-b1f9f681d0f2.png)] bg-cover bg-no-repeat relative overflow-hidden z-[213]" />
                  </div>
                </div>
                <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[35px] left-[128px] z-[214]">
                  <span className="flex w-[103px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[215]">
                    Live Sessions
                  </span>
                </div>
              </div>
              <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[216]">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[217]">
                  <div className="w-[72px] h-[72px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/e51a2677-bb70-4c4b-9d4c-7977b345c79f.png)] bg-cover bg-no-repeat absolute top-[4px] left-[4px] z-[219]" />
                  <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/958ebe56-5a67-432b-8b95-4a08f5b12c8e.png)] bg-cover bg-no-repeat absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-[218]" />
                </div>
                <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[35px] left-[128px] z-[220]">
                  <span className="flex w-[154px] h-[46px] justify-start items-start self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[221]">
                    1:1 Mentor Guidance
                  </span>
                </div>
              </div>
              <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[222]">
                <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[223]">
                  <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[224] mt-0 mr-0 mb-0 ml-[4px]">
                    <div className="w-[72px] h-[72px] shrink-0 relative overflow-hidden z-[225]">
                      <div className="w-[46.51%] h-[57.78%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/KRD27Rt6sy.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[13.8%] left-[26.27%] z-[229]" />
                      <div className="w-[48.72%] h-[53.69%] opacity-80 absolute top-[17.76%] left-[24.17%] z-[227]">
                        <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/af621e15-0e2c-475b-b099-97d9fbc50de3.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[228]" />
                      </div>
                      <div className="w-[34.5%] h-[23.19%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d7a4fad7-e5a5-4d80-b4c6-10b8ee1b4e0c.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[23.72%] left-[32.49%] z-[231]" />
                      <div className="w-[59.32%] h-[49.21%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/f5cbfdb0-ace6-4cb5-8591-9672f43f111e.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[36.9%] left-[20.35%] z-[226]" />
                      <div className="w-[59.31%] h-[40.71%] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7765a68c-3b3b-47f0-9a7b-fd3ea83c6000.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[45.4%] left-[20.35%] z-[230]" />
                    </div>
                  </div>
                </div>
                <div className="flex w-[154px] h-[69px] flex-col gap-[8px] items-start flex-nowrap absolute top-[35px] left-[128px] z-[232]">
                  <span className="flex w-[154px] h-[69px] justify-start items-start self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[233]">
                    Comprehensive Learning Content
                    <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[1120px] flex-col gap-[60px] items-start flex-nowrap relative z-[234] mt-[42px] mr-0 mb-0 ml-[197px]">
        <div className="flex flex-col gap-[50px] items-start self-stretch shrink-0 flex-nowrap relative z-[235]">
          <div className="flex gap-[26px] items-center self-stretch shrink-0 flex-nowrap relative z-[236]">
            <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[237]">
              <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[238]">
                <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[239] mt-[4px] mr-0 mb-0 ml-[4px]">
                  <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d853a76d-fd2f-4fa4-83cc-fcac286b812d.png)] bg-cover bg-no-repeat relative overflow-hidden z-[240]" />
                </div>
              </div>
              <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[37px] left-[128px] z-[241]">
                <span className="flex w-[112px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[242]">
                  Capstone Project
                </span>
              </div>
            </div>
            <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[243]">
              <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[244]">
                <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[245] mt-[4px] mr-0 mb-0 ml-[4px]">
                  <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/08423682-236e-422f-962f-89e6869a7ff5.png)] bg-cover bg-no-repeat relative overflow-hidden z-[246]" />
                </div>
              </div>
              <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[37px] left-[128px] z-[247]">
                <span className="flex w-[204px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[248]">
                  Doubt-Clearing Sessions
                </span>
              </div>
            </div>
            <div className="w-[356px] h-[128px] shrink-0 bg-[#f7f7f7] rounded-[24px] relative overflow-hidden z-[249]">
              <div className="w-[80px] h-[80px] bg-[#fff] rounded-[16px] absolute top-[24px] left-[24px] overflow-hidden z-[250]">
                <div className="flex w-[72px] h-[72px] justify-center items-center flex-nowrap relative z-[251] mt-[4px] mr-0 mb-0 ml-[4px]">
                  <div className="w-[72px] h-[72px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/696ec30e-a708-4e72-92bc-46109ae3918f.png)] bg-cover bg-no-repeat relative overflow-hidden z-[252]" />
                </div>
              </div>
              <div className="flex w-[154px] h-[46px] flex-col gap-[8px] items-start flex-nowrap absolute top-[35px] left-[128px] z-[253]">
                <span className="flex w-[85px] h-[46px] justify-start items-start shrink-0 font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#141219] relative text-left z-[254]">
                  Email Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1456px] h-[709px] relative z-[358] mt-[165px] mr-0 mb-0 ml-[37px]">
        <div className="w-[1440px] h-[396px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[255]">
          <div className="w-[1440px] h-[396px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[256]">
            <div className="w-[779px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[275] mt-0 mr-0 mb-0 ml-[90px]">
              <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fbb11f] relative text-left">
                Master{" "}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#000] relative text-left">
                These tools
              </span>
            </div>
            <div className="w-[251.849px] h-[61.601px] relative z-[357] mt-[296px] mr-0 mb-0 ml-[1016.15px]">
              <div className="w-[36px] h-[36px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/Erzp7QjZmA.png)] bg-cover bg-no-repeat absolute top-0 left-[215.849px] z-[290]" />
              <SpinningText className= "mt-117 text-3xl font-bold text-yellow-500 mr-10"> You write the vision and we will make it plain vision creation. *</SpinningText>
            </div>
          </div>
        </div>
        <div className="w-[1366px] h-[104px] absolute top-[108px] left-[90px] overflow-x-auto overflow-y-hidden z-[257] scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="flex gap-[96px] items-center flex-nowrap relative z-[258] mt-[32px] mr-0 mb-0 ml-0 animate-scroll">
            {/* First set of tools */}
            {course?.masteredTools && course.masteredTools.length > 0 ? (
              course.masteredTools.map((tool, index) => (
                <div key={`tool-${index}`} className="flex flex-col items-center gap-2 shrink-0">
                  <img 
                    src={tool.logoUrl} 
                    alt={tool.name}
                    className="h-[40px] w-auto object-contain"
                    onError={(e) => {
                      console.log(`Tool image failed to load: ${tool.name}`);
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{tool.name}</span>
                </div>
              ))
            ) : (
              // Fallback default tools if API doesn't return any
              <>
                <div className="w-[139.231px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7ab69396-76ef-4bdf-94d0-f4bb2d9c8cfc.png)] bg-cover bg-no-repeat relative overflow-hidden z-[260]" />
                <div className="w-[163.849px] h-[35px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b540051e-ce81-45bd-856f-b0158ccc9230.png)] bg-cover bg-no-repeat relative overflow-hidden z-[261]" />
                <div className="w-[119.485px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/494a92ba-0e67-42f2-8024-8265426b8046.png)] bg-cover bg-no-repeat relative overflow-hidden z-[262]" />
                <div className="w-[160px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/89db73b9-7ff8-430a-8fc2-a82a95a927c2.png)] bg-cover bg-no-repeat relative overflow-hidden z-[263]" />
                <div className="w-[141.236px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/48c0406f-f58a-4a8d-be6a-1d5323702be7.png)] bg-cover bg-no-repeat relative z-[264]" />
                <div className="w-[97.358px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/38f96823-fcd8-4efc-b4c4-fbf4e70ab9fc.png)] bg-cover bg-no-repeat relative z-[265]" />
                <div className="w-[130.612px] h-[40px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/2f75dbe1-5fdd-4e9c-a8e3-464101987950.png)] bg-cover bg-no-repeat relative overflow-hidden z-[266]" />
              </>
            )}
            {/* Duplicate set for seamless loop */}
            {course?.masteredTools && course.masteredTools.length > 0 && (
              course.masteredTools.map((tool, index) => (
                <div key={`tool-duplicate-${index}`} className="flex flex-col items-center gap-2 shrink-0">
                  <img 
                    src={tool.logoUrl} 
                    alt={tool.name}
                    className="h-[40px] w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{tool.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
          
            
        <div className="w-[402px] h-[402px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/bEiyMAjJdV.png)] bg-cover bg-no-repeat absolute top-[307px] left-[926px] z-[294]" />      
        <div className="w-[400px] h-[400px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/E9DScS2Qpk.png)] bg-cover bg-no-repeat rounded-[50%] absolute top-1/2 left-[922.999px] translate-x-0 translate-y-[-11.63%] z-[287]" />
        <div className="w-[400px] h-[400px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/bKMst9zWqQ.png)] bg-cover bg-no-repeat rounded-[50%] absolute top-1/2 left-[923px] translate-x-0 translate-y-[-11.63%] z-[358]" />
        <span className="flex h-[36.87px] justify-start items-start font-['Neue_Machina'] text-[29.083425521850586px] font-extrabold leading-[28.066px] text-[#fdb11f] absolute top-[368.66px] left-[1209.061px] text-left rotate-[39.38deg] whitespace-nowrap z-[302]">
        </span>
        
        <span className="flex h-[31.16px] justify-start items-start font-['Neue_Machina'] text-[29.083425521850586px] font-extrabold leading-[28.066px] text-[#fdb11f] absolute top-[375.273px] left-[1003.43px] text-left rotate-[-39.38deg] whitespace-nowrap z-[351]">
        </span>
        <div className="flex w-[521px] h-[259px] flex-col gap-[40px] items-start flex-nowrap absolute top-[382px] left-[90px] z-[277]">
          <div className="flex flex-col gap-[8px] items-start self-stretch shrink-0 flex-nowrap relative z-[278]">
            <div className="flex flex-col gap-[48px] items-start self-stretch shrink-0 flex-nowrap relative z-[279]">
              <div className="flex flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative z-[280]">
                <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative z-[281]">
                  <div className="w-[521px] self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[48px] font-bold leading-[60.48px] relative text-left whitespace-nowrap z-[282]">
                    <span className="font-['Oregano'] text-[75px] font-normal leading-[74px] text-[#ffb600] relative text-left">
                      Hurry{" "}
                    </span>
                    <span className="font-['Oregano'] text-[75px] font-normal leading-[74px] text-[#000] relative text-left">
                      up!
                    </span>
                  </div>
                  <span className="h-[74px] self-stretch shrink-0 basis-auto font-['Oregano'] text-[40px] font-normal leading-[74px] text-[rgba(0,0,0,0.6)] relative text-left whitespace-nowrap z-[283]">
                    Grab your FREE Trial Class
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            
            onClick={() => setIsEnrollModalOpen(true)}
            className="bg-[#5D38DE] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-['Plus_Jakarta_Sans'] font-medium text-base sm:text-lg leading-[14px] hover:bg-[#4A2BB8] transition-colors duration-300"
          >
            <span className="font-['Plus_Jakarta_Sans'] text-[18px] text-white font-bold ">
              Register now
            </span>
          </button>
        </div>
        __
      </div>
      <div className="w-[28px] h-[28px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/d9cYJxRWQ4.png)] bg-cover bg-no-repeat relative z-[289] mt-[35px] mr-0 mb-0 ml-[1244.999px]" />
      <div className="w-[1839px] h-[705px] relative z-[948] mt-px mr-0 mb-0 ml-[-358px]">
        <div className="w-[1440px] h-[705px] bg-[#fff] absolute top-0 left-[399px] z-[945]">
          <div className="w-[1440px] h-[705px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[946]">
            <div className="w-[1280px] h-[593px] bg-[rgba(0,0,0,0)] relative z-[947] mt-[56px] mr-0 mb-0 ml-[80px]">
              <div className="w-[798px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[950] mt-[15px] mr-0 mb-0 ml-[13px]">
                <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left ">
                  Course{" "}
                </span>
                <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fdb11f] relative text-left">
                  Curriculum
                </span>
              </div>
              <div className="w-[1280px] h-[493px] bg-[rgba(0,0,0,0)] relative z-[951] mt-[46px] mr-0 mb-0 ml-0">
                <div className="w-[1280px] h-[365px] bg-[rgba(0,0,0,0)] relative z-[952] mt-0 mr-0 mb-0 ml-0">
                  {/* Only show tabs if using curriculumByTab (not API curriculum) */}
                  {course?.curriculumByTab && (!course?.curriculum || course.curriculum === defaultCourse.curriculum) && (
                    <div className="w-[1280px] h-[52px] bg-[rgba(0,0,0,0)] relative z-[953] mt-0 mr-0 mb-0 ml-0">
                      <div className="flex gap-2 overflow-x-auto pb-2 z-[954]">
                        {curriculumTabs.map((tab) => {
                          const isActive = activeCurriculumTab === tab;
                          const tabWidths = {
                            'Fundamentals': 'w-[191.703px]',
                            'Web Development': 'w-[227.094px]',
                            'Data Structures and Algorithms': 'w-[322.016px]',
                            'Frontend Development': 'w-[258.141px]',
                            'Databases': 'w-[167.172px]'
                          };
                          return (
                            <button
                              key={tab}
                              onClick={() => setActiveCurriculumTab(tab)}
                              className={`${tabWidths[tab] || 'w-auto'} h-[52px] rounded-[4px] px-4 transition-all duration-300 ${
                                isActive 
                                  ? 'bg-[#a5b4fc] text-white' 
                                  : 'bg-[#fff] text-[#1b2124] border border-[#efefef] hover:bg-[#f5f5f5]'
                              }`}
                            >
                              <span className="font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] whitespace-nowrap">
                                {tab}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="w-[1280px] min-h-[289px] bg-[#fff] relative z-[979] mt-[24px] mr-0 mb-0 ml-0">
                    <div className="grid grid-cols-2 gap-0">
                      {/* Left side - Modules List */}
                      <div className="w-full">
                        {getCurrentCurriculum().map((module, moduleIndex) => (
                          <div 
                            key={moduleIndex}
                            className={`w-full h-auto min-h-[80px] bg-[#fff] relative cursor-pointer hover:bg-gray-50 transition-colors ${
                              expandedModule === moduleIndex ? 'bg-gray-50' : ''
                            }`}
                            onClick={() => setExpandedModule(expandedModule === moduleIndex ? null : moduleIndex)}
                          >
                            <div className="w-[2px] h-full bg-[#000] absolute left-0 top-0" />
                            <div className="pl-[30px] pr-[60px] py-4">
                              <span className="block text-[12px] font-['Nunito_Sans'] text-[#000] mb-2">
                                Module{moduleIndex + 1}
                              </span>
                              <span className="block text-[18px] font-['Nunito_Sans'] text-[#000]">
                                {module.moduleTitle}
                              </span>
                            </div>
                            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                              {expandedModule === moduleIndex ? (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Right side - Topics List */}
                      <div className="w-full">
                        <div className="w-full min-h-[257px] rounded-[4px] border border-[#d9dce1] m-4 p-4">
                          {expandedModule !== null && getCurrentCurriculum()[expandedModule] ? (
                            <div className="space-y-0">
                              {getCurrentCurriculum()[expandedModule].topics.map((topic, topicIndex) => (
                                <div 
                                  key={topicIndex}
                                  className="w-full min-h-[64px] bg-[#fff] border-t border-[#efefef] first:border-t-0 flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-['Nunito_Sans'] text-[16px] text-[#3d3d3d]">
                                    Lecture {topicIndex + 1} : {topic}
                                  </span>
                                  <div className="w-[28px] h-[28px] bg-[#eaecef] rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-gray-600" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              <p className="font-['Nunito_Sans'] text-[16px]">Select a module to view topics</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[296px] h-[56px] relative z-[1031] mt-[95px] mr-0 mb-0 ml-[504px] ">
                  <ButtonWithHover
                    variant="download"
                    onClick={() => console.log('Download Curriculum')}
                    className="w-[272px] h-[56px] rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px] flex items-center justify-center whitespace-nowrap"
                  >
                    <span className="font-['Plus_Jakarta_Sans'] text-[20px] font-medium">
                      Download Curriculum
                    </span>
                    
                  </ButtonWithHover>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[1280px] h-[40px] bg-[rgba(0,0,0,0)] absolute top-[71px] left-0 z-[948]">
          <div className="w-[296.063px] h-[40px] bg-[rgba(0,0,0,0)] relative z-[949] mt-0 mr-0 mb-0 ml-[491.969px]" />
        </div>
      </div>
      <div className="w-[779px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[276] mt-[63px] mr-0 mb-0 ml-[146px]">
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fbb11f] relative text-left">
          Training{" "}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#000] relative text-left">
          Options
        </span>
      </div>
      <div className="w-auto h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 px-40">
        {course?.trainingOptions && course.trainingOptions.length > 0 ? (
          course.trainingOptions.map((option, index) => {
            const icons = [
              'https://cdn-icons-png.flaticon.com/512/3626/3626523.png',
              'https://cdn-icons-png.flaticon.com/512/613/613167.png',
              'https://cdn-icons-png.flaticon.com/512/17366/17366375.png'
            ];
            
            return (
              <div key={index} className="w-[340px] h-auto min-h-[525px] font-['Plus_Jakarta_Sans'] bg-white rounded-2xl p-6 shadow-md border-2 border-[#000080] hover:shadow-xl transition-shadow mx-auto">
                <div 
                  className="w-[40px] h-[40px] bg-cover bg-center flex items-center mx-auto mb-5"
                  style={{ backgroundImage: `url(${icons[index % icons.length]})` }}
                />
                <h3 className="text-[26px] font-bold text-blue-950 mb-4 text-center">
                  {option.name}
                </h3>
                
                <div className="mb-4 text-left">
                  <span className="text-blue-950 font-bold text-3xl">
                    {option.currency === 'INR' ? '₹' : option.currency === 'USD' ? '$' : option.currency}
                    {option.price?.toLocaleString()}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {option.descriptionPoints && option.descriptionPoints.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2 text-sm text-gray-700">
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
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-blue-950 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-auto">
                  Enroll Now
                </button>
              </div>
            );
          })
        ) : (
          // Fallback if no training options from API
          <div className="col-span-full text-center text-gray-500 py-10">
            <p>No training options available at the moment.</p>
          </div>
        )}
      </div>  

      <div className="w-[798px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[359] mt-[75px] mr-0 mb-0 ml-[165px]">
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left">
          Build{" "}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fdb11f] relative text-left">
          projects
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left">
          {" "}
          from scratch
        </span>
      </div>
      <div className="flex w-[1240px] pt-[40px] pr-[40px] pb-[40px] pl-[40px] flex-col gap-[10px] items-start flex-nowrap bg-[#fff] rounded-[40px] relative overflow-hidden shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] z-[917] mt-[115px] mr-0 mb-0 ml-[176px]">
        <div className="flex flex-col gap-[40px] items-start self-stretch shrink-0 flex-nowrap relative z-[918]">
          {course?.projects && course.projects.length > 0 ? (
            course.projects.map((project, index) => (
              <div key={index} className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[919]">
                <div className="flex w-[376px] h-[237px] flex-col gap-[24px] items-start shrink-0 flex-nowrap relative z-[920]">
                  <div className={`flex w-[84px] h-[84px] gap-[10px] items-start shrink-0 flex-nowrap rounded-[40px] relative z-[921] ${index % 2 === 1 ? 'bg-[#fdb11f]' : 'bg-[#fff] border-solid border border-[rgba(19,19,19,0.1)]'}`}>
                    <span className={`flex w-[24px] h-[27px] justify-start items-center shrink-0 basis-auto font-['General_Sans'] text-[20px] font-semibold leading-[27px] absolute top-[calc(50%-14px)] left-[calc(50%-11px)] text-left whitespace-nowrap z-[922] ${index % 2 === 1 ? 'text-[#fff]' : 'text-[#131313]'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="flex w-[376px] h-[79px] justify-start items-center self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[32px] font-semibold opacity-80 leading-[40.32px] text-[#131313] relative text-left z-[923]">
                    {project.title}
                  </span>
                </div>
                <div className="flex w-[552px] h-[237px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start shrink-0 flex-nowrap bg-cover bg-no-repeat rounded-[40px] relative z-[924]" style={{backgroundImage: `url(${project.imageUrl})`}} />
              </div>
            ))
          ) : (
            <>
              <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[919]">
                <div className="flex w-[376px] h-[237px] flex-col gap-[24px] items-start shrink-0 flex-nowrap relative z-[920]">
                  <div className="flex w-[84px] h-[84px] gap-[10px] items-start shrink-0 flex-nowrap bg-[#fff] rounded-[40px] border-solid border border-[rgba(19,19,19,0.1)] relative z-[921]">
                    <span className="flex w-[20px] h-[27px] justify-start items-center shrink-0 basis-auto font-['General_Sans'] text-[20px] font-semibold leading-[27px] text-[#131313] absolute top-[calc(50%-14px)] left-[calc(50%-11px)] text-left whitespace-nowrap z-[922]">
                      01
                    </span>
                  </div>
                  <span className="flex w-[376px] h-[79px] justify-start items-center self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[32px] font-semibold opacity-80 leading-[40.32px] text-[#131313] relative text-left z-[923]">
                    AI- powered code Generator
                  </span>
                </div>
                <div className="flex w-[552px] h-[237px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/55570f55-ca1d-428e-afeb-e3ab5784e8db.png)] bg-cover bg-no-repeat rounded-[40px] relative z-[924]" />
              </div>
              <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[925]">
                <div className="flex w-[376px] flex-col gap-[24px] items-start shrink-0 flex-nowrap relative z-[926]">
                  <div className="flex w-[84px] h-[84px] gap-[10px] items-start shrink-0 flex-nowrap bg-[#131313] rounded-[40px] relative z-[927]">
                    <span className="flex w-[24px] h-[24px] justify-start items-center shrink-0 basis-auto font-['General_Sans'] text-[20px] font-semibold leading-[24px] text-[#fff] absolute top-[calc(50%-13px)] left-[calc(50%-12px)] text-left whitespace-nowrap z-[928]">
                      02
                    </span>
                  </div>
                  <span className="flex w-[376px] h-[111px] justify-start items-center self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[32px] font-semibold opacity-80 leading-[40.32px] text-[#131313] relative text-left z-[929]">
                    Hotel booking application
                  </span>
                </div>
                <div className="flex w-[552px] h-[237px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/bf8a576e-58c4-4308-bead-92dc10e97934.png)] bg-cover bg-no-repeat rounded-[40px] relative z-[930]" />
              </div>
              <div className="flex justify-between items-center self-stretch shrink-0 flex-nowrap relative z-[931]">
                <div className="flex w-[376px] flex-col gap-[24px] items-start shrink-0 flex-nowrap relative z-[932]">
                  <div className="flex w-[84px] h-[84px] gap-[10px] items-start shrink-0 flex-nowrap bg-[#fff] rounded-[40px] border-solid border border-[rgba(19,19,19,0.1)] relative z-[933]">
                    <span className="flex w-[24px] h-[27px] justify-start items-center shrink-0 basis-auto font-['General_Sans'] text-[20px] font-semibold leading-[27px] text-[#131313] absolute top-[calc(50%-14px)] left-[calc(50%-13px)] text-left whitespace-nowrap z-[934]">
                      03
                    </span>
                  </div>
                  <span className="flex w-[376px] h-[129px] justify-start items-center self-stretch shrink-0 font-['Plus_Jakarta_Sans'] text-[32px] font-semibold opacity-80 leading-[40.32px] text-[#131313] relative text-left z-[935]">
                    AI- powered object detection application
                  </span>
                </div>
                <div className="flex w-[552px] h-[237px] pt-[10px] pr-[10px] pb-[10px] pl-[10px] gap-[10px] items-start shrink-0 flex-nowrap bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b4f057c7-d0a0-41a5-ac50-a40e0cb7df19.png)] bg-cover bg-no-repeat rounded-[40px] relative z-[936]" />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-[475px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[389] mt-[97px] mr-0 mb-0 ml-[165px]">
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left">
          Meet our{" "}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fdb11f] relative text-left">
          mentors
        </span>
      </div>
      <span className="flex w-[1120px] h-[23px] justify-center items-start font-['Plus_Jakarta_Sans'] text-[18px] font-normal leading-[22.68px] text-[rgba(0,0,0,0.4)] relative text-center whitespace-nowrap z-[388] mt-[7px] mr-0 mb-0 ml-[-196px]">
        Passionate about enhancing user engagement
      </span>
      <div className="flex w-[1120px] flex-col gap-[60px] items-start flex-nowrap relative z-[360] mt-[56px] mr-0 mb-0 ml-[232px]">
        <div className="flex gap-[48px] items-center self-stretch shrink-0 flex-wrap relative z-[361]">
          {course?.mentors && course.mentors.length > 0 ? (
            course.mentors.map((mentor, index) => (
              <div key={index} className="w-[536px] h-[287px] shrink-0 bg-[rgba(0,0,0,0.08)] rounded-[24px] relative overflow-hidden z-[362]">
                <div className="flex max-w-[200px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center flex-nowrap bg-[rgba(0,0,0,0.08)] rounded-[40px] relative overflow-hidden z-[363] mt-[24px] mr-0 mb-0 ml-[24px]">
                  <span className="h-[18px] shrink-0 basis-auto font-['Outfit'] text-[14px] font-normal leading-[17.64px] text-[#000] relative text-left whitespace-nowrap z-[364]">
                    {mentor.title}
                  </span>
                </div>
                <div className="w-[264px] h-[237px] bg-cover bg-no-repeat absolute top-[50px] left-1/2 translate-x-[-1.52%] translate-y-0 z-[374]" style={{backgroundImage: `url(${mentor.imageUrl})`}} />
                <div className="flex w-[255px] h-[71px] flex-col gap-[8px] items-start flex-nowrap absolute top-[108px] left-[24px] z-[365]">
                  <span className="h-[23px] self-stretch shrink-0 basis-auto font-['Outfit'] text-[18px] font-medium leading-[22.68px] text-[#000] relative text-left whitespace-nowrap z-[366]">
                    {mentor.name}
                  </span>
                  <span className="flex w-[255px] h-[40px] justify-start items-start self-stretch shrink-0 font-['Outfit'] text-[16px] font-normal leading-[20.16px] text-[rgba(0,0,0,0.4)] relative text-left z-[367]">
                    {mentor.bio}
                  </span>
                </div>
                <div className="flex w-[144px] h-[60px] gap-[16px] items-center flex-nowrap absolute top-[203px] left-[24px] z-[368]">
                  <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[369]">
                    <div className="w-[24px] h-[24px] shrink-0 relative overflow-hidden z-[370]">
                      <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4b81beff-6ed8-4db8-b235-129ae621dfd5.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[371]" />
                    </div>
                  </div>
                  <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[372]">
                    <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1853c158-c6f6-4c3a-9e8c-71c1151f600a.png)] bg-cover bg-no-repeat relative z-[373]" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="w-[536px] h-[287px] shrink-0 bg-[rgba(0,0,0,0.08)] rounded-[24px] relative overflow-hidden z-[362]">
                <div className="flex w-[171px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center flex-nowrap bg-[rgba(0,0,0,0.08)] rounded-[40px] relative overflow-hidden z-[363] mt-[24px] mr-0 mb-0 ml-[24px]">
                  <span className="h-[18px] shrink-0 basis-auto font-['Outfit'] text-[14px] font-normal leading-[17.64px] text-[#000] relative text-left whitespace-nowrap z-[364]">
                    Chief Financial Officer
                  </span>
                </div>
                <div className="w-[264px] h-[237px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/EOMQz7JxAF.png)] bg-cover bg-no-repeat absolute top-[50px] left-1/2 translate-x-[-1.52%] translate-y-0 z-[374]" />
                <div className="flex w-[255px] h-[71px] flex-col gap-[8px] items-start flex-nowrap absolute top-[108px] left-[24px] z-[365]">
                  <span className="h-[23px] self-stretch shrink-0 basis-auto font-['Outfit'] text-[18px] font-medium leading-[22.68px] text-[#000] relative text-left whitespace-nowrap z-[366]">
                    Christina Rosetti
                  </span>
                  <span className="flex w-[255px] h-[40px] justify-start items-start self-stretch shrink-0 font-['Outfit'] text-[16px] font-normal leading-[20.16px] text-[rgba(0,0,0,0.4)] relative text-left z-[367]">
                    Our CFO brings strategic vision and financial expertise
                  </span>
                </div>
                <div className="flex w-[144px] h-[60px] gap-[16px] items-center flex-nowrap absolute top-[203px] left-[24px] z-[368]">
                  <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[369]">
                    <div className="w-[24px] h-[24px] shrink-0 relative overflow-hidden z-[370]">
                      <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4b81beff-6ed8-4db8-b235-129ae621dfd5.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[371]" />
                    </div>
                  </div>
                  <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[372]">
                    <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1853c158-c6f6-4c3a-9e8c-71c1151f600a.png)] bg-cover bg-no-repeat relative z-[373]" />
                  </div>
                </div>
              </div>
              <div className="w-[536px] h-[287px] shrink-0 bg-[rgba(0,0,0,0.08)] rounded-[24px] relative overflow-hidden z-[375]">
                <div className="w-[216px] h-[239px] absolute top-[24px] left-[24px] z-[382]">
                  <div className="flex w-[175px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[10px] justify-center items-center flex-nowrap bg-[rgba(0,0,0,0.08)] rounded-[40px] relative overflow-hidden z-[376] mt-0 mr-0 mb-0 ml-0">
                    <span className="h-[18px] shrink-0 basis-auto font-['Outfit'] text-[14px] font-normal leading-[17.64px] text-[#000] relative text-left whitespace-nowrap z-[377]">
                      Chief Executive Officer
                    </span>
                  </div>
                  <div className="flex w-[216px] flex-col gap-[8px] items-start flex-nowrap relative z-[379] mt-[50px] mr-0 mb-0 ml-0">
                    <span className="h-[23px] self-stretch shrink-0 basis-auto font-['Outfit'] text-[18px] font-medium leading-[22.68px] text-[#000] relative text-left whitespace-nowrap z-[380]">
                      Edgar Davids
                    </span>
                    <span className="flex w-[216px] h-[40px] justify-start items-start self-stretch shrink-0 font-['Outfit'] text-[16px] font-normal leading-[20.16px] text-[rgba(0,0,0,0.4)] relative text-left z-[381]">
                      Our CEO leads with vision and dedication, driving innovation.
                    </span>
                  </div>
                  <div className="flex w-[144px] gap-[16px] items-center flex-nowrap relative z-[382] mt-[24px] mr-0 mb-0 ml-0">
                    <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[383]">
                      <div className="w-[24px] h-[24px] shrink-0 relative overflow-hidden z-[384]">
                        <div className="w-full h-full bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/8c80423e-9ba1-4253-b4f3-e80d373ac6ac.png)] bg-[length:100%_100%] bg-no-repeat absolute top-0 left-0 z-[385]" />
                      </div>
                    </div>
                    <div className="flex w-[60px] h-[60px] pt-[18px] pr-[18px] pb-[18px] pl-[18px] gap-[10px] items-center shrink-0 flex-nowrap rounded-[30px] border-solid border border-[rgba(0,0,0,0.08)] relative z-[386]">
                      <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4f42f5d1-24ca-47ab-9a6a-c37da97e73a1.png)] bg-cover bg-no-repeat relative z-[387]" />
                    </div>
                  </div>
                </div>
                <div className="flex w-[314px] h-[255px] items-start bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/Qe0awkiE5U.png)] bg-cover bg-no-repeat absolute top-[32px] left-1/2 translate-x-[-14.65%] translate-y-0 z-[-Infinity]" />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="w-[926px] h-[45px] relative z-[394] mt-[81px] mr-0 mb-0 ml-[460px]">
        <div className="w-[673px] h-[45px] bg-[#ffde6b] rounded-[20px] absolute top-0 left-1/2 translate-x-[-68.8%] translate-y-0 z-[391]">
          <div className="w-[191px] h-[37px] bg-[#fff] rounded-[40px] absolute top-[4px] left-[470px] z-[393]" />
          <span className="flex h-[14px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[20px] font-medium leading-[14px] text-[#1b2124] absolute top-[16px] left-[37px] text-left whitespace-nowrap z-[392]">
            Still Confused? Let us clear all your queries
          </span>
        </div>
        <button 
          onClick={() => console.log('Get call back')}
          className="flex h-[14px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[20px] font-medium leading-[14px] text-[#000] absolute top-[16px] left-[499px] text-left whitespace-nowrap z-[394] hover:text-[#FD661F] hover:scale-105 transition-all duration-300 transform"
        >
          Get call back
        </button>
      </div>
      <div className="w-[1116px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] relative text-left whitespace-nowrap z-[390] mt-[97px] mr-0 mb-0 ml-[168px]">
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left">
          What{" "}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fdb11f] relative text-left">
          role
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#3d3d3d] relative text-left">
          {" "}
          does a Data Scientist play?
        </span>
      </div>
      <div className="flex w-[1113px] h-[136px] justify-between items-center relative z-[411] mt-[56px] mr-0 mb-0 ml-[211px]">
            <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>
                  </div>
              
          </div>
        
        <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>

                  </div>
            </div>

            <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>

                  </div>
            </div>
      </div>
      <div className="flex w-[1113px] h-[136px] justify-between items-center relative z-[415] mt-[33px] mr-0 mb-0 ml-[211px]">
      <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>

                  </div>
            </div>

            <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>

                  </div>
            </div>

            <div className="w-[331px] h-[136px] p-[2px] rounded-[16px] 
                    bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">

                  <div className="w-full h-full bg-white rounded-[14px] 
                      shadow-[0_0_60px_0_rgba(0,0,0,0.06)] flex flex-col justify-center">

                    <span className="font-['Plus_Jakarta_Sans'] text-[22px] font-semibold leading-[27.72px] text-[#141219] mb-2 ml-5">
                      Data Scientist
                    </span>

                    <span className="w-[292px] ml-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[15.12px] text-[rgba(20,18,25,0.6)] mt-[4px]">
                      design and implement applications using AI and ML algorithms
                    </span>

                  </div>
            </div>
            
        </div>

      <div className="w-[1440px] h-[614px] bg-[rgba(0,0,0,0)] relative z-[419] mt-[62px] mr-0 mb-0 ml-[68px]">
        <div className="w-[1324px] h-[444px] relative z-[424] mt-[58px] mr-0 mb-0 ml-[37px]">
          <div className="w-[1280px] h-[68px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[420]">
            <div className="flex w-[40px] h-[68px] justify-center items-center flex-nowrap absolute top-0 left-[416px] z-[421]">
              <div className="w-[62px] h-[51px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/XDQyyhQrLw.png)] bg-cover bg-no-repeat relative overflow-hidden z-[422]" />
            </div>
            <div className="w-[447px] h-[39px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] absolute top-[14px] left-[44px] text-left whitespace-nowrap z-[423]">
              <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#1b2124] relative text-left">
                Get{" "}
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[32px] text-[#fdb11f] relative text-left">
                Certified
              </span>
            </div>
          </div>
          <div className="w-[1280px] h-[410px] bg-[rgba(0,0,0,0)] absolute top-[34px] left-[44px] z-[424] ">
            <div className="w-[488px] h-[345px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/f7a07ac8-4fc3-443e-b93f-2cd29158193e.png)] bg-cover bg-no-repeat absolute top-0 left-[757px] z-[448]" />
            <div className="w-[490px] h-[339px] absolute top-[70px] left-[788px] z-[447]" />
            <div className="w-[720px] h-[262px] bg-[rgba(0,0,0,0)] absolute top-[74px] left-0 z-[425]">
              <div className="w-[720px] h-[262px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[426]">
                <div className="w-[720px] h-[262px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[427]">
                  <div className="w-[720px] h-[188px] bg-[rgba(0,0,0,0)] relative z-[434] mt-[74px] mr-0 mb-0 ml-0">
                    <div className="w-[9px] h-[9px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/17cb13fe-08c7-4184-a237-60e61e95a39e.png)] bg-cover bg-no-repeat rounded-[50%] relative z-[444] mt-[52px] mr-0 mb-0 ml-[10px]" />
                    <div className="w-[720px] h-[96px] bg-[rgba(0,0,0,0)] relative z-[435] mt-[31px] mr-0 mb-0 ml-0">
                      <div className="w-[704px] h-[96px] bg-[rgba(0,0,0,0)] relative z-[436] mt-0 mr-0 mb-0 ml-[4px]">
                        <div className="w-[704px] h-[24px] bg-[rgba(0,0,0,0)] relative z-[437] mt-[24px] mr-0 mb-0 ml-0" />
                        <div className="w-[704px] h-[48px] text-[0px] bg-[rgba(0,0,0,0)] relative z-[438]  mr-0 mb-0 ml-0 mt-20">
                          <span className="block h-[22px] font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#757575] relative text-left whitespace-nowrap z-[439] mt-px mr-0 mb-0 ml-0">
                            The above criteria is only for getting the course
                            completion certificate. For details regarding Job
                          </span>
                          <span className="block h-[22px] font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#757575] relative text-left whitespace-nowrap z-[440] mt-[2px] mr-0 mb-0 ml-0">
                            Assistance criteria, please refer to the FAQs
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="flex h-[22px] justify-start items-start font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#757575] absolute top-[15px] left-[23px] text-left whitespace-nowrap z-[441]">
                      After completing 70% in Quiz & Assignment
                    </span>
                    <div className="w-[9px] h-[9px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/84c81fe8-c3a1-432c-94cd-912f52038017.png)] bg-cover bg-no-repeat rounded-[50%] absolute top-[22px] left-[10px] z-[445]" />
                  </div>
                  <div className="w-[720px] h-[50px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 overflow-hidden z-[428]">
                    <div className="w-[720px] h-[26px] bg-[rgba(0,0,0,0)] relative z-[429] mt-0 mr-0 mb-0 ml-0">
                      <div className="w-[360px] h-[26px] bg-[rgba(0,0,0,0)] relative z-[430] mt-0 mr-0 mb-0 ml-0">
                        <div className="w-[328.188px] h-[26px] bg-[rgba(0,0,0,0)] rounded-[6px] relative z-[431] mt-0 mr-0 mb-0 ml-0">
                          <span className="flex w-[329px] h-[24px] justify-center items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#1b2124] absolute top-px left-0 text-center underline whitespace-nowrap z-[432] -ml-9">
                            {course?.programName || course?.title || 'Full Stack Development with AI Course'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-[720px] h-px bg-[rgba(0,0,0,0)] relative z-[433] mt-[24px] mr-0 mb-0 ml-0" />
                  </div>
                  <span className="flex h-[24px] justify-start items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#757575] absolute top-[39px] left-[6px] text-left whitespace-nowrap z-[446] mb-20">
                    You will be able to generate the certificate for course of
                    completion:
                  </span>
                </div>
              </div>
            </div>
            <div className="w-[704px] h-[24px] bg-[rgba(0,0,0,0)] absolute top-[193px] left-[23px] z-[442]  ">
              <span className="flex h-[22px] justify-start items-start font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#757575] absolute top-px -mt-13   left-0 text-left whitespace-nowrap z-[443]">
                After watching 70% of videos
              </span>
            </div>
          </div>
        </div>
        </div>
        <div>
        <Testimonial 
          testimonials={course?.testimonials && course.testimonials.length > 0 ? course.testimonials : undefined} 
        />
        </div>
        
      <div className="w-[1500px] h-[366px] bg-[#5d38de] rounded-[24px] relative overflow-hidden z-[555] mt-[84px] mr-0 mb-0 ml-[5px]">
        <div className="w-[910.874px] h-[405.457px] absolute top-[-120.457px] left-[-107.874px] z-[564]">
          <div className="flex w-[244px] gap-[16px] items-center flex-nowrap relative z-[561] mt-[350.457px] mr-0 mb-0 ml-[187.874px]">
            <button 
              onClick={() => setIsConsultationModalOpen(true)}
              className="flex w-[244px] pt-[16px] pr-[32px] pb-[16px] pl-[32px] gap-[10px] justify-center items-center shrink-0 flex-nowrap bg-[#fff] rounded-[80px] relative overflow-hidden z-[562] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="h-[23px] shrink-0 basis-auto font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[22.68px] text-[#5d38de] relative text-left whitespace-nowrap z-[563]">
                Get Connected Now
              </span>
            </button>
          </div>

          
          <div className="w-[249.509px] h-[330.538px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/ZjWCG9JCoh.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[559]" />
          <div className="flex w-[723px] h-[60px] flex-col gap-[16px] items-start flex-nowrap absolute top-[200.457px] left-[187.874px] z-[556]">
            <span className="flex w-[588px] h-[60px] justify-start items-start shrink-0 basis-auto font-['Plus_Jakarta_Sans'] text-[48px] font-bold leading-[60px] text-[#fff] relative text-left whitespace-nowrap z-[557]">
              Talk to Our Counsellor
            </span>
          </div>
          <span className="flex h-[14px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-[14px] text-[#fff] absolute top-[282.457px] left-[187.874px] text-left whitespace-nowrap z-[564]">
            Get Expert Advice our Counsellor will reach within� 
            <br />
            24 hour
          </span>
        </div>
        <div className="w-[431.539px] h-[463.11px] absolute top-[-64.486px] left-[879px] z-[560]">
          <div className="w-[330.538px] h-[249.509px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/rUZDGwgTWt.png)] bg-cover bg-no-repeat relative z-[560] mt-0 mr-0 mb-0 ml-[101px]" />
          <div className="z-9999 absolute -right-30 top-16 w-[50%] sm:w-[45%] md:w-[50%] lg:w-[600px] h-full max-h-[366px]  opacity-80 lg:opacity-100 ">
              <img 
                src={sitting}
                alt="Counseling session illustration"
                className="w-full h-full object-cover object-center"
              />
            </div>
          <div className="w-[323px] h-[101.624px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/aAfAn6Nmrc.png)] bg-cover bg-no-repeat relative z-[558] mt-[111.977px] mr-0 mb-0 ml-0" />
        </div>
      </div>
      <span className="block h-[67px] font-['Plus_Jakarta_Sans'] text-[56px] font-semibold leading-[67px] text-[#1e242c] relative text-left whitespace-nowrap z-[566] mt-[83px] mr-0 -mb-20 ml-[163px]">
        Frequently asked Questions
      </span>
                          <FAQ faqs={course?.faqs} /> 
      
      <div className="w-[486px] h-[67px] font-['Plus_Jakarta_Sans'] text-[56px] font-semibold leading-[67px] relative text-left whitespace-nowrap z-[567] mt-[51px] mr-0 mb-0 ml-[163px]">
        <span className="font-['Plus_Jakarta_Sans'] text-[56px] font-semibold leading-[67.2px] text-[#1e242c] relative text-left">
          Related{" "}
        </span>
        <span className="font-['Plus_Jakarta_Sans'] text-[56px] font-semibold leading-[67.2px] text-[#fdb11f] relative text-left">
          Programs
        </span>
      </div>
      {console.log('=== RELATED PROGRAMS DEBUG ===')}
      {console.log('course?.relatedPrograms:', course?.relatedPrograms)}
      
      <div className="w-[1410px] h-auto relative overflow-hidden z-[598] mt-[36px] mr-0 mb-0 ml-[91px]">
        <div className="w-[1410px] h-[1232px] relative z-[822] mt-0 mr-0 mb-0 ml-0">
          <div className="w-[330px] absolute top-0 bottom-[604px] left-0 z-[661]">
            <div className="w-[330px] h-[455.88px] bg-[#fff] rounded-[10px] relative z-[662] mt-0 mr-0 mb-0 ml-0">
              <div className="w-[278px] h-[190px] relative overflow-hidden z-[713] mt-[26px] mr-0 mb-0 ml-[26px]">
                {course?.relatedPrograms && course.relatedPrograms[0] ? (
                  <img 
                    src={course.relatedPrograms[0].imageUrl} 
                    alt={course.relatedPrograms[0].title}
                    className="h-[190px] w-full object-cover rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[714]"
                    onError={(e) => {
                      e.target.src = 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/efc54c5d-431b-4661-9d33-d0ca18de2f00.png';
                    }}
                  />
                ) : (
                  <div className="h-[190px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/efc54c5d-431b-4661-9d33-d0ca18de2f00.png)] bg-cover bg-no-repeat rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[714]" />
                )}
              </div>
              <div className="w-[278.386px] h-[31.5px] relative z-[683] mt-[20px] mr-0 mb-0 ml-[26px]">
                <div className="w-[60.946px] h-[31.5px] absolute top-0 left-[217.44px] z-[677]">
                  <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/87c86a6b-e6fe-42b5-8df0-ac2debe882d4.png)] bg-cover bg-no-repeat absolute top-[8.73px] left-[0.6px] overflow-hidden z-[678]" />
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[679]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/cb341a0c-aa5c-4a4c-b08c-26fbc0fc9997.png)] bg-cover bg-no-repeat relative overflow-hidden z-[680] mt-[17.461px] mr-0 mb-0 ml-[1.202px]" />
                  </div>
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[681]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d985fca9-43c4-41d2-bdaf-9f8cc2f5ee9a.png)] bg-cover bg-no-repeat relative overflow-hidden z-[682] mt-[17.461px] mr-0 mb-0 ml-[1.202px]" />
                  </div>
                </div>
                <span className="flex h-[31.5px] justify-start items-center font-['Inter'] text-[18px] font-semibold leading-[31.5px] text-[#ff302f] absolute top-0 left-[217.44px] text-left whitespace-nowrap z-[683]">
                  {course?.relatedPrograms && course.relatedPrograms[0] ? course.relatedPrograms[0].price : '₹0'}
                </span>
                <div className="w-[69.02px] h-[27px] bg-[#fcb11f] rounded-[50px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] z-[663]">
                  <div className="w-[43.351px] h-[13px] absolute top-[6.5px] left-[13px] z-[664]">
                    <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/94ed29d3-83b2-45a3-a809-1bc02211955d.png)] bg-cover bg-no-repeat absolute top-[1.168px] left-[1.039px] overflow-hidden z-[665]" />
                    <div className="w-[41.05px] h-[12.64px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[666]">
                      <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1dfe6c55-46c7-4383-b6a0-348176678236.png)] bg-cover bg-no-repeat relative overflow-hidden z-[667] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                    <div className="w-[41.05px] h-[12.64px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[668]">
                      <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1783da08-e008-4572-81e8-54cfbc88a40d.png)] bg-cover bg-no-repeat relative overflow-hidden z-[669] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                  </div>
                  <span className="flex h-[13px] justify-start items-center font-['Inter'] text-[13px] font-medium leading-[13px] text-[#000] absolute top-[6.5px] left-[13px] text-left whitespace-nowrap z-[670]">
                    Design
                  </span>
                </div>
                <div className="w-[47.143px] h-[24.5px] absolute top-[3.5px] left-[162.64px] z-[671]">
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/163478e6-35f3-43cc-a56c-8cd2af00aff2.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[672]" />
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/3808e638-3ea1-48d0-b4b4-9040537efca4.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[673]" />
                  <div className="w-[45.91px] h-[10.46px] absolute top-[6.68px] left-0 overflow-hidden z-[674]">
                    <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1013adc0-4df9-404e-a746-45ffc0f9fdd7.png)] bg-cover bg-no-repeat relative overflow-hidden z-[675] mt-[13.359px] mr-0 mb-0 ml-0" />
                  </div>
                </div>
                <div className="w-[47.143px] h-[24.5px] font-['Inter'] text-[14px] font-normal leading-[24.5px] absolute top-[3.5px] left-[162.64px] text-left whitespace-nowrap z-[676]">
                  <span className="font-['Inter'] text-[14px] font-bold leading-[24.5px] text-[#000] relative text-left">
                    ₹
                  </span>
                  <span className="font-['Inter'] text-[14px] font-normal leading-[24.5px] text-[#000] relative text-left">
                    20.00
                  </span>
                </div>
              </div>
              <div className="w-[273.2px] h-[50.4px] relative z-[690] mt-[14.895px] mr-0 mb-0 ml-[26px]">
                <div className="w-[273.2px] h-[50.4px] absolute top-0 left-0 z-[684]">
                  <div className="w-[271.456px] h-[44.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/6a0c44d3-b445-4f3c-806c-b9df568b3aeb.png)] bg-cover bg-no-repeat absolute top-[4.887px] left-[0.38px] overflow-hidden z-[685]" />
                  <div className="w-[271.456px] h-[44.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/74b0c46a-ff3b-4b3c-85c9-71ed4e31c4aa.png)] bg-cover bg-no-repeat absolute top-[4.887px] left-[0.38px] overflow-hidden z-[686]" />
                  <div className="w-[271.456px] h-[44.026px] absolute top-[4.887px] left-[0.38px] overflow-hidden z-[687]">
                    <div className="w-[271.258px] h-[19.026px] relative overflow-hidden z-[688] mt-[9.777px] mr-0 mb-0 ml-[0.95px]" />
                    <div className="w-[119.926px] h-[19.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/cac0f762-ecbb-49a3-bbeb-519aad3cebf4.png)] bg-cover bg-no-repeat relative overflow-hidden z-[689] mt-[5.974px] mr-0 mb-0 ml-[0.76px]" />
                  </div>
                </div>
                <span className="flex w-[273.2px] h-[50.4px] justify-start items-center font-['Poppins'] text-[18px] font-semibold leading-[25.2px] text-[#000] absolute top-0 left-0 text-left overflow-hidden z-[690]">
                  {course?.relatedPrograms && course.relatedPrograms[0] ? course.relatedPrograms[0].title : 'The Complete Graphic Design for Beginners'}
                </span>
              </div>
              <div className="w-[278.345px] h-[32px] relative z-[712] mt-[15.084px] mr-0 mb-0 ml-[26px]">
                <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/96e71c7f-defc-495f-8c5c-233792ae4651.png)] bg-cover bg-no-repeat rounded-[16px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[691]" />
                <div className="w-[47.264px] h-[26.25px] absolute top-[2.246px] left-[42px] z-[692]">
                  <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/347e25ca-22f8-4ad9-a26c-60304600d9ef.png)] bg-cover bg-no-repeat absolute top-[7.75px] left-[0.32px] overflow-hidden z-[693]" />
                  <div className="w-[45.453px] h-[11.42px] absolute top-[7.75px] left-[0.32px] overflow-hidden z-[694]">
                    <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b1fa8710-66fe-43c5-a74d-f40784a28e9f.png)] bg-cover bg-no-repeat relative overflow-hidden z-[695] mt-[15.5px] mr-0 mb-0 ml-[0.64px]" />
                  </div>
                  <div className="w-[45.453px] h-[11.42px] absolute top-[7.75px] left-[0.32px] overflow-hidden z-[696]">
                    <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/ca8f4c11-c04e-4b4b-9f57-9e7bf63e14f6.png)] bg-cover bg-no-repeat relative overflow-hidden z-[697] mt-[15.5px] mr-0 mb-0 ml-[0.64px]" />
                  </div>
                </div>
                <span className="flex h-[26.25px] justify-start items-center font-['Inter'] text-[15px] font-normal leading-[26.25px] text-[#000] absolute top-[2.246px] left-[42px] text-left whitespace-nowrap z-[698]">
                  Wilson
                </span>
                <div className="w-[16.134px] h-[14px] absolute top-[9px] left-[163.8px] z-[699]">
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[700]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/a69d1b41-4db3-4c17-a8ff-00cf1f970515.png)] bg-cover bg-no-repeat relative overflow-hidden z-[701] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[702]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/17a41601-a277-4d8c-8199-246c568de42e.png)] bg-cover bg-no-repeat relative overflow-hidden z-[703] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[704]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/398f59cc-c2b2-4e97-9b83-3fc46a559853.png)] bg-cover bg-no-repeat relative overflow-hidden z-[705] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                </div>
                <div className="w-[16.134px] h-[14px] font-['Font_Awesome_5_Free'] text-[14px] font-black bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7c673af8-935b-47d4-9ea8-89f69801311e.png)] bg-cover bg-no-repeat leading-[14px] absolute top-[9px] left-[163.8px] z-[706]" />
                <div className="w-[93.794px] h-[14px] absolute top-[9px] left-[184.55px] z-[707]">
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1cf6514e-69d5-44d6-9020-f6c8be6d219c.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[708]" />
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b85666b1-de23-4e1e-842f-fecc91f6fbda.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[709]" />
                  <div className="w-[86.512px] h-[13.523px] absolute top-[0.55px] left-[5.429px] overflow-hidden z-[710]">
                    <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/a29c1917-5aba-4941-8b4d-c0b5f19b4ce8.png)] bg-cover bg-no-repeat relative overflow-hidden z-[711] mt-[1.09px] mr-0 mb-0 ml-[10.858px]" />
                  </div>
                </div>
                <span className="flex h-[14px] justify-start items-center font-['Inter'] text-[14px] font-normal leading-[14px] text-[#000] absolute top-[9px] left-[184.55px] text-left whitespace-nowrap z-[712]">
                  {" "}
                  (4.5 Reviews)
                </span>
              </div>
              <div className="w-[103px] h-[26px] bg-[#000] rounded-[50px] relative overflow-hidden z-[715] mt-[29.34px] mr-0 mb-0 ml-[113px]">
                <div className="w-[124.703px] h-[17.92px] absolute top-[4px] left-[-10px] z-[716]">
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7cae6e90-9bc1-454c-963e-b7f5670d5c3a.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[717]" />
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/fc259ee2-e98e-43fe-8b8f-5879bf796195.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[718]" />
                  <div className="w-[80.272px] h-[12.304px] absolute top-[2.887px] left-[22.74px] overflow-hidden z-[719]">
                    <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7f8bec33-2099-4629-b20a-4c4565abe991.png)] bg-cover bg-no-repeat relative overflow-hidden z-[720] mt-[5.777px] mr-0 mb-0 ml-[24.128px]" />
                  </div>
                </div>
                <span className="flex w-[124.703px] h-[17.92px] justify-center items-center font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-[17.92px] text-[#fff] absolute top-[calc(50%-9px)] left-[calc(50%-61.5px)] text-center capitalize whitespace-nowrap z-[721]">
                  Enroll Now
                </span>
                <div className="w-[15px] h-[14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/39845cd3-bc48-45c3-be14-5c082282f71a.png)] bg-cover bg-no-repeat absolute top-1/2 left-[164.32px] translate-x-0 translate-y-[-57.51%] overflow-hidden z-[722]" />
              </div>
            </div>
          </div>
          <div className="w-[330px] absolute top-0 bottom-[604px] left-[360px] z-[599]">
            <div className="w-[330px] h-[455.88px] bg-[#fff] rounded-[10px] relative z-[600] mt-0 mr-0 mb-0 ml-0">
              <div className="w-[278px] h-[190px] relative overflow-hidden z-[651] mt-[26px] mr-0 mb-0 ml-[26px]">
                <div className="h-[190px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/3b822f67-b3a6-4389-b804-cad59f8f993f.png)] bg-cover bg-no-repeat rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[652]" />
              </div>
              <div className="w-[278.386px] h-[31.5px] relative z-[621] mt-[20px] mr-0 mb-0 ml-[26px]">
                <div className="w-[60.946px] h-[31.5px] absolute top-0 left-[217.44px] z-[615]">
                  <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/0b5c5825-7954-4458-b38c-276c731bfa8d.png)] bg-cover bg-no-repeat absolute top-[8.73px] left-[0.6px] overflow-hidden z-[616]" />
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[617]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d1d3de5a-d736-40be-a6fd-3df04bcd3733.png)] bg-cover bg-no-repeat relative overflow-hidden z-[618] mt-[17.461px] mr-0 mb-0 ml-[1.201px]" />
                  </div>
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[619]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/fbc1c25a-7b47-40dd-929f-6d2df1cffb0e.png)] bg-cover bg-no-repeat relative overflow-hidden z-[620] mt-[17.461px] mr-0 mb-0 ml-[1.201px]" />
                  </div>
                </div>
                <span className="flex h-[31.5px] justify-start items-center font-['Inter'] text-[18px] font-semibold leading-[31.5px] text-[#ff302f] absolute top-0 left-[217.44px] text-left whitespace-nowrap z-[621]">
                  ₹0
                </span>
                <div className="w-[69.02px] h-[27px] bg-[#fcb11f] rounded-[50px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] z-[601]">
                  <div className="w-[43.351px] h-[13px] absolute top-[6.5px] left-[13px] z-[602]">
                    <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/530e9688-a7a4-49d9-8935-526049b9b3da.png)] bg-cover bg-no-repeat absolute top-[1.168px] left-[1.039px] overflow-hidden z-[603]" />
                    <div className="w-[41.05px] h-[12.64px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[604]">
                      <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/81ff61a2-48c4-49ad-bd13-73a21cb4d68d.png)] bg-cover bg-no-repeat relative overflow-hidden z-[605] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                    <div className="w-[41.05px] h-[12.64px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[606]">
                      <div className="w-[41.05px] h-[12.64px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/0b8b561a-00e3-4abd-9747-4570f2a806f3.png)] bg-cover bg-no-repeat relative overflow-hidden z-[607] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                  </div>
                  <span className="flex h-[13px] justify-start items-center font-['Inter'] text-[13px] font-medium leading-[13px] text-[#000] absolute top-[6.5px] left-[13px] text-left whitespace-nowrap z-[608]">
                    Design
                  </span>
                </div>
                <div className="w-[47.143px] h-[24.5px] absolute top-[3.5px] left-[162.64px] z-[609]">
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d2f3772d-93c0-41c7-902e-da7433ded230.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[610]" />
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/646bd66e-0958-4d4c-86f6-5e373c510af4.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[611]" />
                  <div className="w-[45.91px] h-[10.46px] absolute top-[6.68px] left-0 overflow-hidden z-[612]">
                    <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4bd4e90f-4671-4ef5-8c58-4372b120bbf8.png)] bg-cover bg-no-repeat relative overflow-hidden z-[613] mt-[13.359px] mr-0 mb-0 ml-0" />
                  </div>
                </div>
                <div className="w-[47.143px] h-[24.5px] font-['Inter'] text-[14px] font-normal leading-[24.5px] absolute top-[3.5px] left-[162.64px] text-left whitespace-nowrap z-[614]">
                  <span className="font-['Inter'] text-[14px] font-bold leading-[24.5px] text-[#000] relative text-left">
                    ₹
                  </span>
                  <span className="font-['Inter'] text-[14px] font-normal leading-[24.5px] text-[#000] relative text-left">
                    20.00
                  </span>
                </div>
              </div>
              <div className="w-[273.2px] h-[50.4px] relative z-[628] mt-[14.895px] mr-0 mb-0 ml-[26px]">
                <div className="w-[273.2px] h-[50.4px] absolute top-0 left-0 z-[622]">
                  <div className="w-[271.456px] h-[44.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/d2b6fc36-1b30-4a34-9145-aa8b337c316f.png)] bg-cover bg-no-repeat absolute top-[4.887px] left-[0.38px] overflow-hidden z-[623]" />
                  <div className="w-[271.456px] h-[44.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/c2258785-1357-4d02-94d3-f8ef7c43045f.png)] bg-cover bg-no-repeat absolute top-[4.887px] left-[0.38px] overflow-hidden z-[624]" />
                  <div className="w-[271.456px] h-[44.026px] absolute top-[4.887px] left-[0.38px] overflow-hidden z-[625]">
                    <div className="w-[271.258px] h-[19.026px] relative overflow-hidden z-[626] mt-[9.777px] mr-0 mb-0 ml-[0.95px]" />
                    <div className="w-[119.926px] h-[19.026px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/03312f5f-025d-4f74-ba9c-7597fcec8f67.png)] bg-cover bg-no-repeat relative overflow-hidden z-[627] mt-[5.974px] mr-0 mb-0 ml-[0.76px]" />
                  </div>
                </div>
                <span className="flex w-[273.2px] h-[50.4px] justify-start items-center font-['Poppins'] text-[18px] font-semibold leading-[25.2px] text-[#000] absolute top-0 left-0 text-left overflow-hidden z-[628]">
                  The Complete Graphic Design
                  <br />
                  for Beginners
                </span>
              </div>
              <div className="w-[278.344px] h-[32px] relative z-[650] mt-[15.084px] mr-0 mb-0 ml-[26px]">
                <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/9ec9022d-9ad9-4d22-842f-184829865110.png)] bg-cover bg-no-repeat rounded-[16px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[629]" />
                <div className="w-[47.264px] h-[26.25px] absolute top-[2.246px] left-[42px] z-[630]">
                  <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/a6abf33b-6c59-420c-aa52-a729972c59ba.png)] bg-cover bg-no-repeat absolute top-[7.75px] left-[0.32px] overflow-hidden z-[631]" />
                  <div className="w-[45.453px] h-[11.42px] absolute top-[7.75px] left-[0.32px] overflow-hidden z-[632]">
                    <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/42e8c1da-09bd-4e83-88e2-413ec8a8b641.png)] bg-cover bg-no-repeat relative overflow-hidden z-[633] mt-[15.5px] mr-0 mb-0 ml-[0.64px]" />
                  </div>
                  <div className="w-[45.453px] h-[11.42px] absolute top-[7.75px] left-[0.32px] overflow-hidden z-[634]">
                    <div className="w-[45.453px] h-[11.42px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/e6092f58-36e8-4b79-be55-07f41ac3716b.png)] bg-cover bg-no-repeat relative overflow-hidden z-[635] mt-[15.5px] mr-0 mb-0 ml-[0.64px]" />
                  </div>
                </div>
                <span className="flex h-[26.25px] justify-start items-center font-['Inter'] text-[15px] font-normal leading-[26.25px] text-[#000] absolute top-[2.246px] left-[42px] text-left whitespace-nowrap z-[636]">
                  Wilson
                </span>
                <div className="w-[16.134px] h-[14px] absolute top-[9px] left-[163.8px] z-[637]">
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[638]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/3e3dc140-57fd-4b2d-84d8-a8846a5890fe.png)] bg-cover bg-no-repeat relative overflow-hidden z-[639] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[640]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7e8598f4-0481-4bbc-8936-a33468e43386.png)] bg-cover bg-no-repeat relative overflow-hidden z-[641] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[642]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/20fa9a29-7455-4f2a-8c76-d61da8e985a1.png)] bg-cover bg-no-repeat relative overflow-hidden z-[643] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                </div>
                <div className="w-[16.134px] h-[14px] font-['Font_Awesome_5_Free'] text-[14px] font-black bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/804a0734-5d2b-46a7-a5ab-94a7dadf9a49.png)] bg-cover bg-no-repeat leading-[14px] absolute top-[9px] left-[163.8px] z-[644]" />
                <div className="w-[93.794px] h-[14px] absolute top-[9px] left-[184.55px] z-[645]">
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/bd498e9c-3c2f-4952-8166-3bdede504a67.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[646]" />
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/cbf7fba8-ab2b-491c-a3a6-6d92f33589d8.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[647]" />
                  <div className="w-[86.512px] h-[13.523px] absolute top-[0.55px] left-[5.429px] overflow-hidden z-[648]">
                    <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/96b9b84d-65d8-4cd7-856c-59f3e2de8770.png)] bg-cover bg-no-repeat relative overflow-hidden z-[649] mt-[1.09px] mr-0 mb-0 ml-[10.858px]" />
                  </div>
                </div>
                <span className="flex h-[14px] justify-start items-center font-['Inter'] text-[14px] font-normal leading-[14px] text-[#000] absolute top-[9px] left-[184.55px] text-left whitespace-nowrap z-[650]">
                  {" "}
                  (4.5 Reviews)
                </span>
              </div>
              <div className="w-[103px] h-[26px] bg-[#000] rounded-[50px] relative overflow-hidden z-[653] mt-[29.34px] mr-0 mb-0 ml-[113px]">
                <div className="w-[124.703px] h-[17.92px] absolute top-[4px] left-[-10px] z-[654]">
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/2a5d493c-7569-4412-8b89-9ead2db134a6.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[655]" />
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/f1551b2a-a23d-4fe8-ad2e-02b1cbac520b.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[656]" />
                  <div className="w-[80.272px] h-[12.304px] absolute top-[2.887px] left-[22.74px] overflow-hidden z-[657]">
                    <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/50e2ddee-0a1f-4505-ae95-f45c1fffe8ca.png)] bg-cover bg-no-repeat relative overflow-hidden z-[658] mt-[5.777px] mr-0 mb-0 ml-[24.128px]" />
                  </div>
                </div>
                <span className="flex w-[124.703px] h-[17.92px] justify-center items-center font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-[17.92px] text-[#fff] absolute top-[calc(50%-9px)] left-[calc(50%-61.5px)] text-center capitalize whitespace-nowrap z-[659]">
                  Enroll Now
                </span>
                <div className="w-[15px] h-[14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/ad6b7449-1e33-4bb3-8421-69516671a35b.png)] bg-cover bg-no-repeat absolute top-1/2 left-[164.32px] translate-x-0 translate-y-[-57.51%] overflow-hidden z-[660]" />
              </div>
            </div>
          </div>
          <div className="w-[330px] absolute top-0 bottom-[606px] left-[720px] z-[723]">
            <div className="w-[330px] h-[455.88px] bg-[#fff] rounded-[10px] border-solid border border-[#fff] relative z-[724] mt-0 mr-0 mb-0 ml-0">
              <div className="w-[278px] h-[190px] relative overflow-hidden z-[768] mt-[26px] mr-0 mb-0 ml-[26px]">
                {course?.relatedPrograms && course.relatedPrograms[1] ? (
                  <img 
                    src={course.relatedPrograms[1].imageUrl} 
                    alt={course.relatedPrograms[1].title}
                    className="h-[190px] w-full object-cover rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[769]"
                    onError={(e) => {
                      e.target.src = 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/92192cea-4ac2-4ab5-a289-3445db24bc7d.png';
                    }}
                  />
                ) : (
                  <div className="h-[190px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/92192cea-4ac2-4ab5-a289-3445db24bc7d.png)] bg-cover bg-no-repeat rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[769]" />
                )}
              </div>
              <div className="w-[278.394px] h-[31.5px] relative z-[775] mt-[21px] mr-0 mb-0 ml-[26px]">
                <div className="w-[63.484px] h-[31.5px] absolute top-0 left-[214.91px] z-[732]">
                  <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1cd894e8-dfa4-4b06-8db5-a85764bcaaf6.png)] bg-cover bg-no-repeat absolute top-[8.73px] left-[0.6px] overflow-hidden z-[733]" />
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[734]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/6bc936c1-bf34-4861-b6bb-77968b817c7b.png)] bg-cover bg-no-repeat relative overflow-hidden z-[735] mt-[17.461px] mr-0 mb-0 ml-[1.202px]" />
                  </div>
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[736]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/898153a3-0d62-4815-be27-3c0180973334.png)] bg-cover bg-no-repeat relative overflow-hidden z-[737] mt-[17.461px] mr-0 mb-0 ml-[1.202px]" />
                  </div>
                </div>
                <span className="flex h-[31.5px] justify-start items-center font-['Inter'] text-[18px] font-semibold leading-[31.5px] text-[#ff302f] absolute top-0 left-[214.91px] text-left whitespace-nowrap z-[738]">
                  {course?.relatedPrograms && course.relatedPrograms[1] ? course.relatedPrograms[1].price : '₹0'}
                </span>
                <div className="w-[107.88px] h-[27px] bg-[#fcb11f] rounded-[50px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] z-[725]">
                  <div className="w-[109px] h-[13px] absolute top-[6.75px] left-[13px] z-[726]">
                    <div className="w-[80.635px] h-[9.997px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/5ef46a21-7b57-4ed3-82da-48641cd14328.png)] bg-cover bg-no-repeat absolute top-[2.16px] left-[1.079px] overflow-hidden z-[727]" />
                    <div className="w-[80.635px] h-[9.997px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/aef3810f-283e-48e1-baa9-d291e7ee2ab8.png)] bg-cover bg-no-repeat absolute top-[2.16px] left-[1.079px] overflow-hidden z-[728]" />
                    <div className="w-[80.635px] h-[9.997px] absolute top-[2.16px] left-[1.079px] overflow-hidden z-[729]">
                      <div className="w-[80.635px] h-[9.997px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/ff2aa3e2-ad25-49a7-bdc6-8df9572a5f03.png)] bg-cover bg-no-repeat relative overflow-hidden z-[730] mt-[4.316px] mr-0 mb-0 ml-[2.158px]" />
                    </div>
                  </div>
                  <span className="flex h-[13px] justify-start items-center font-['Plus_Jakarta_Sans'] text-[13px] font-medium leading-[13px] text-[#fff] absolute top-[6.75px] left-[13px] text-left whitespace-nowrap z-[731]">
                    Data Science
                  </span>
                </div>
                <div className="w-[47.143px] h-[24.5px] absolute top-[3.219px] left-[164px] z-[770]">
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/911c7f87-8422-4242-9a85-c057692e786b.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[771]" />
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/1f6e4e1b-3ac8-40de-ab54-bd1626256d06.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[772]" />
                  <div className="w-[45.91px] h-[10.46px] absolute top-[6.68px] left-0 overflow-hidden z-[773]">
                    <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/647f1ae4-115a-4fe4-b7a7-6761b8cffd62.png)] bg-cover bg-no-repeat relative overflow-hidden z-[774] mt-[13.359px] mr-0 mb-0 ml-0" />
                  </div>
                </div>
                <div className="w-[47.143px] h-[24.5px] font-['Inter'] text-[14px] font-normal leading-[24.5px] absolute top-[3.219px] left-[164px] text-left whitespace-nowrap z-[775]">
                  <span className="font-['Inter'] text-[14px] font-bold leading-[24.5px] text-[#fff] relative text-left">
                    ₹
                  </span>
                  <span className="font-['Inter'] text-[14px] font-normal leading-[24.5px] text-[#fff] relative text-left">
                    20.00
                  </span>
                </div>
              </div>
              <div className="w-[229.65px] h-[50.4px] relative z-[745] mt-[15.895px] mr-0 mb-0 ml-[26px]">
                <div className="w-[229.65px] h-[50.4px] absolute top-0 left-0 z-[739]">
                  <div className="w-[209.072px] h-[42.586px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/252af3f1-ab90-42a4-bab5-9aaea2145ba7.png)] bg-cover bg-no-repeat absolute top-[6.375px] left-[1.386px] overflow-hidden z-[740]" />
                  <div className="w-[209.072px] h-[42.586px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/988e3c47-48aa-41e4-9f03-33361afbc38b.png)] bg-cover bg-no-repeat absolute top-[6.375px] left-[1.386px] overflow-hidden z-[741]" />
                  <div className="w-[209.072px] h-[42.586px] absolute top-[6.375px] left-[1.386px] overflow-hidden z-[742]">
                    <div className="w-[209.072px] h-[17.586px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/da130973-ccd9-4303-835a-a8238e4511ab.png)] bg-cover bg-no-repeat relative overflow-hidden z-[743] mt-[12.746px] mr-0 mb-0 ml-[2.772px]" />
                    <div className="w-[100.475px] h-[17.37px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/52137006-c954-4a87-87da-8ce89f4632b8.png)] bg-cover bg-no-repeat relative overflow-hidden z-[744] mt-[7.633px] mr-0 mb-0 ml-[2.772px]" />
                  </div>
                </div>
                <span className="flex w-[229.65px] h-[50.4px] justify-start items-center font-['Plus_Jakarta_Sans'] text-[18px] font-semibold leading-[25.2px] text-[#000] absolute top-0 left-0 text-left overflow-hidden z-[745]">
                  {course?.relatedPrograms && course.relatedPrograms[1] ? course.relatedPrograms[1].title : 'Learning JavaScript With Imagination'}
                </span>
              </div>
              <div className="w-[278.344px] h-[32px] relative z-[767] mt-[16.084px] mr-0 mb-0 ml-[26px]">
                <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/b67e2043-89a1-43a2-8f65-9dee86fa8e90.png)] bg-cover bg-no-repeat rounded-[16px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[746]" />
                <div className="w-[50.714px] h-[26.25px] absolute top-[2.246px] left-[42px] z-[747]">
                  <div className="w-[49.554px] h-[11.355px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/5357d608-e4d3-499e-b5b6-2ca323cad951.png)] bg-cover bg-no-repeat absolute top-[7.824px] left-[0.16px] overflow-hidden z-[748]" />
                  <div className="w-[49.554px] h-[11.355px] absolute top-[7.824px] left-[0.16px] overflow-hidden z-[749]">
                    <div className="w-[49.554px] h-[11.355px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/14bfb5ee-a85b-4a23-8b51-ad98489a6408.png)] bg-cover bg-no-repeat relative overflow-hidden z-[750] mt-[15.648px] mr-0 mb-0 ml-[0.33px]" />
                  </div>
                  <div className="w-[49.554px] h-[11.355px] absolute top-[7.824px] left-[0.16px] overflow-hidden z-[751]">
                    <div className="w-[49.554px] h-[11.355px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/70eec590-d60c-4fe2-be94-1efd9733708a.png)] bg-cover bg-no-repeat relative overflow-hidden z-[752] mt-[15.648px] mr-0 mb-0 ml-[0.33px]" />
                  </div>
                </div>
                <span className="flex h-[26.25px] justify-start items-center font-['Plus_Jakarta_Sans'] text-[15px] font-normal leading-[26.25px] text-[#000] absolute top-[2.246px] left-[42px] text-left whitespace-nowrap z-[753]">
                  Warren
                </span>
                <div className="w-[16.134px] h-[14px] absolute top-[9px] left-[163.8px] z-[754]">
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[755]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/c2a2903c-59b5-434c-abea-46cd47bf56df.png)] bg-cover bg-no-repeat relative overflow-hidden z-[756] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[757]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/e84d93ee-ed49-47bd-97fd-c7b55249ae6f.png)] bg-cover bg-no-repeat relative overflow-hidden z-[758] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                  <div className="w-[14.621px] h-[14.005px] absolute top-[-0.24px] left-[0.55px] overflow-hidden z-[759]">
                    <div className="w-[14.621px] h-[14.005px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/5d522556-a880-467e-b971-6e209d64d793.png)] bg-cover bg-no-repeat relative overflow-hidden z-[760] mt-[-0.48px] mr-0 mb-0 ml-[1.102px]" />
                  </div>
                </div>
                <div className="w-[16.134px] h-[14px] font-['Font_Awesome_5_Free'] text-[14px] font-black bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/f449c9e8-e663-45ad-a30f-1e75ee990d21.png)] bg-cover bg-no-repeat leading-[14px] absolute top-[9px] left-[163.8px] z-[761]" />
                <div className="w-[93.794px] h-[14px] absolute top-[9px] left-[184.55px] z-[762]">
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/906c4c28-4ad7-431b-b8af-93acd53da0c9.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[763]" />
                  <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/bbeec623-4814-4fff-b60f-c0dd68441f43.png)] bg-cover bg-no-repeat absolute top-[0.55px] left-[5.429px] overflow-hidden z-[764]" />
                  <div className="w-[86.512px] h-[13.523px] absolute top-[0.55px] left-[5.429px] overflow-hidden z-[765]">
                    <div className="w-[86.512px] h-[13.523px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/79598ee2-3233-4b7e-a8fe-763f18eb525e.png)] bg-cover bg-no-repeat relative overflow-hidden z-[766] mt-[1.09px] mr-0 mb-0 ml-[10.858px]" />
                  </div>
                </div>
                <span className="flex h-[14px] justify-start items-center font-['Inter'] text-[14px] font-normal leading-[14px] text-[#fff] absolute top-[9px] left-[184.55px] text-left whitespace-nowrap z-[767]">
                  {" "}
                  (4.8 Reviews)
                </span>
              </div>
              <div className="w-[103px] h-[26px] bg-[#000] rounded-[50px] relative overflow-hidden z-[776] mt-[30.34px] mr-0 mb-0 ml-[113px]">
                <div className="w-[124.703px] h-[17.92px] absolute top-[4px] left-[-10px] z-[777]">
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/2a9508e2-1169-46cf-afe0-1147271b8305.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[778]" />
                  <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/26fc23df-de61-4b24-b2b5-9fccfb70252a.png)] bg-cover bg-no-repeat absolute top-[2.887px] left-[22.74px] overflow-hidden z-[779]" />
                  <div className="w-[80.272px] h-[12.304px] absolute top-[2.887px] left-[22.74px] overflow-hidden z-[780]">
                    <div className="w-[80.272px] h-[12.304px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/6acda3bf-8131-46a9-b0e9-64c9469c58dc.png)] bg-cover bg-no-repeat relative overflow-hidden z-[781] mt-[5.777px] mr-0 mb-0 ml-[24.128px]" />
                  </div>
                </div>
                <span className="flex w-[124.703px] h-[17.92px] justify-center items-center font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-[17.92px] text-[#fff] absolute top-[calc(50%-9px)] left-[calc(50%-61.5px)] text-center capitalize whitespace-nowrap z-[782]">
                  Enroll Now
                </span>
                <div className="w-[15px] h-[14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/880a84ed-b7db-4727-aae1-86c69b9b9c1b.png)] bg-cover bg-no-repeat absolute top-1/2 left-[164.32px] translate-x-0 translate-y-[-57.51%] overflow-hidden z-[783]" />
              </div>
            </div>
          </div>
          <div className="w-[330px] absolute top-0 bottom-[604px] left-[1080px] z-[788]">
            <div className="w-[330px] h-[455.88px] bg-[#fff] rounded-[10px] relative z-[789] mt-0 mr-0 mb-0 ml-0">
              <div className="w-[278px] h-[190px] relative overflow-hidden z-[817] mt-[26px] mr-0 mb-0 ml-[26px]">
                {course?.relatedPrograms && course.relatedPrograms[2] ? (
                  <img 
                    src={course.relatedPrograms[2].imageUrl} 
                    alt={course.relatedPrograms[2].title}
                    className="h-[190px] w-full object-cover rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[818]"
                    onError={(e) => {
                      e.target.src = 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4d684eb4-0bf3-4a7b-9284-d57d140720e8.png';
                    }}
                  />
                ) : (
                  <div className="h-[190px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4d684eb4-0bf3-4a7b-9284-d57d140720e8.png)] bg-cover bg-no-repeat rounded-[6px] absolute top-1/2 left-0 right-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[818]" />
                )}
              </div>
              <div className="w-[278.384px] h-[31.5px] relative z-[810] mt-[20px] mr-0 mb-0 ml-[26px]">
                <div className="w-[60.404px] h-[31.5px] absolute top-0 left-[217.98px] z-[804]">
                  <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/2791b1a6-17fa-4783-a161-cd609af14985.png)] bg-cover bg-no-repeat absolute top-[8.73px] left-[0.6px] overflow-hidden z-[805]" />
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[806]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4e06d113-70ef-4daa-85f6-93769c1c1573.png)] bg-cover bg-no-repeat relative overflow-hidden z-[807] mt-[17.461px] mr-0 mb-0 ml-[1.201px]" />
                  </div>
                  <div className="w-[20.57px] h-[13.519px] absolute top-[8.73px] left-[0.6px] overflow-hidden z-[808]">
                    <div className="w-[20.57px] h-[13.519px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/e210f47f-be95-4934-b020-e05f5ea95cd1.png)] bg-cover bg-no-repeat relative overflow-hidden z-[809] mt-[17.461px] mr-0 mb-0 ml-[1.201px]" />
                  </div>
                </div>
                <span className="flex h-[31.5px] justify-start items-center font-['Inter'] text-[18px] font-semibold leading-[31.5px] text-[#ff302f] absolute top-0 left-[217.98px] text-left whitespace-nowrap z-[810]">
                  {course?.relatedPrograms && course.relatedPrograms[2] ? course.relatedPrograms[2].price : '₹0'}
                </span>
                <div className="w-[81.78px] h-[27px] bg-[#fcb11f] rounded-[50px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] z-[790]">
                  <div className="w-[56.151px] h-[13px] absolute top-[6.5px] left-[13px] z-[791]">
                    <div className="w-[54.155px] h-[9.976px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/6b4f9ab4-4f28-410e-a8f5-93d5d834f0e3.png)] bg-cover bg-no-repeat absolute top-[1.168px] left-[1.039px] overflow-hidden z-[792]" />
                    <div className="w-[54.155px] h-[9.976px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[793]">
                      <div className="w-[54.155px] h-[9.976px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/73e9a9cd-35e8-477c-8f4e-888fd346d274.png)] bg-cover bg-no-repeat relative overflow-hidden z-[794] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                    <div className="w-[54.155px] h-[9.976px] absolute top-[1.168px] left-[1.039px] overflow-hidden z-[795]">
                      <div className="w-[54.155px] h-[9.976px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/21acb1d1-f3df-47bc-9759-3203ac5d58f3.png)] bg-cover bg-no-repeat relative overflow-hidden z-[796] mt-[2.332px] mr-0 mb-0 ml-[2.078px]" />
                    </div>
                  </div>
                  <span className="flex h-[13px] justify-start items-center font-['Inter'] text-[13px] font-medium leading-[13px] text-[#000] absolute top-[6.5px] left-[13px] text-left whitespace-nowrap z-[797]">
                    Business
                  </span>
                </div>
                <div className="w-[47.143px] h-[24.5px] absolute top-[3.5px] left-[163.19px] z-[798]">
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/51a85a91-776f-4e82-a03a-57b80afb9a92.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[799]" />
                  <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/77406dcb-96ec-4d5c-8b40-455605573769.png)] bg-cover bg-no-repeat absolute top-[6.68px] left-0 overflow-hidden z-[800]" />
                  <div className="w-[45.91px] h-[10.46px] absolute top-[6.68px] left-0 overflow-hidden z-[801]">
                    <div className="w-[45.91px] h-[10.46px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/8eeac2e7-b188-40b5-9485-205d0d505c35.png)] bg-cover bg-no-repeat relative overflow-hidden z-[802] mt-[13.359px] mr-0 mb-0 ml-0" />
                  </div>
                </div>
                <div className="w-[47.143px] h-[24.5px] font-['Inter'] text-[14px] font-normal leading-[24.5px] absolute top-[3.5px] left-[163.19px] text-left whitespace-nowrap z-[803]">
                  <span className="font-['Inter'] text-[14px] font-bold leading-[24.5px] text-[#000] relative text-left">
                    ₹
                  </span>
                  <span className="font-['Inter'] text-[14px] font-normal leading-[24.5px] text-[#000] relative text-left">
                    20.00
                  </span>
                </div>
              </div>
              <div className="w-[256.2px] h-[50.4px] relative z-[812] mt-[14.895px] mr-0 mb-0 ml-[26px]">
                <div className="w-[256.2px] h-[50.4px] absolute top-0 left-0 z-[811]" />
                <span className="flex w-[256.2px] h-[50.4px] justify-start items-center font-['Poppins'] text-[18px] font-semibold leading-[25.2px] text-[#000] absolute top-0 left-0 text-left overflow-hidden z-[812]">
                  {course?.relatedPrograms && course.relatedPrograms[2] ? course.relatedPrograms[2].title : 'Financial Analyst Training & Investing Course'}
                </span>
              </div>
              <div className="w-[278.345px] h-[32px] relative z-[816] mt-[15.084px] mr-0 mb-0 ml-[26px]">
                <div className="w-[32px] h-[32px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/4fb91ec1-dd08-4777-bc5a-d72474dee1fd.png)] bg-cover bg-no-repeat rounded-[16px] absolute top-1/2 left-0 translate-x-0 translate-y-[-50%] overflow-hidden z-[813]" />
                <span className="flex h-[26.25px] justify-start items-center font-['Inter'] text-[15px] font-normal leading-[26.25px] text-[#000] absolute top-[2.246px] left-[42px] text-left whitespace-nowrap z-[814]">
                  Robert Fox
                </span>
                <div className="w-[16.134px] h-[14px] font-['Font_Awesome_5_Free'] text-[14px] font-black bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/55f6ebb4-b122-421b-ab26-ea8798793fc2.png)] bg-cover bg-no-repeat leading-[14px] absolute top-[9px] left-[163.64px] z-[815]" />
                <span className="flex h-[14px] justify-start items-center font-['Inter'] text-[14px] font-normal leading-[14px] text-[#000] absolute top-[9px] left-[184.39px] text-left whitespace-nowrap z-[816]">
                  {" "}
                  (4.2 Reviews)
                </span>
              </div>
              <div className="w-[103px] h-[26px] bg-[#000] rounded-[50px] relative overflow-hidden z-[819] mt-[28.34px] mr-0 mb-0 ml-[113px]">
                <span className="flex w-[124.703px] h-[17.92px] justify-center items-center font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-[17.92px] text-[#fff] absolute top-[calc(50%-9px)] left-[calc(50%-61.5px)] text-center capitalize whitespace-nowrap z-[820]">
                  Enroll Now
                </span>
                <div className="w-[15px] h-[14px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/7dac4276-a275-4ce9-bd16-db80d217bfeb.png)] bg-cover bg-no-repeat absolute top-1/2 left-[164.32px] translate-x-0 translate-y-[-57.51%] overflow-hidden z-[821]" />
              </div>
            </div>
          </div>
          <div className="w-[60px] h-[38px] bg-[#fff] rounded-[20px] border-solid border-2 border-[#e7e7e7] absolute top-[498px] left-[310px] rotate-180 z-[785]" />
          <div className="w-[60px] h-[38px] bg-[#fff] rounded-[20px] border-solid border-2 border-[#e7e7e7] absolute top-[500px] left-[1033px] z-[784]" />
          <div className="w-[1.21%] h-[29px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/Xpbujiy75y.png)] bg-cover bg-no-repeat absolute top-1/2 left-[23.55%] translate-x-0 translate-y-[-386.21%] z-[787]" />
          <div className="w-[1.21%] h-[29px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/oviLHsUfdo.png)] bg-cover bg-no-repeat absolute top-1/2 left-[74.75%] translate-x-0 translate-y-[-386.21%] z-[786]" />
          <div className="w-[1240px] h-[648px] text-[0px] bg-[#fff] rounded-[24px] border-solid border border-[#e6e9ea] absolute top-1/2 left-1/2 translate-x-[-51.94%] translate-y-[-4.94%] overflow-hidden shadow-[0_2px_50px_0_rgba(0,0,0,0.1)] z-[822]">
            <span className="block h-[69px] font-['Plus_Jakarta_Sans'] text-[55px] font-bold leading-[69px] text-[rgba(0,0,0,0.7)] relative text-left whitespace-nowrap z-[823] mt-[27px] mr-0 mb-0 ml-[39px]">
              Need help?
            </span>
            <div className="w-[1223px] h-[437px] relative z-[854] mt-[-6px] mr-0 mb-0 ml-[39px]">
              <div className="w-[711px] h-[400px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/01c53605-a1f8-438c-9a29-e110658b694c.png)] bg-cover bg-no-repeat absolute top-0 left-[512px] z-[825]" />
              <span className="flex h-[17px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[20px] font-normal leading-[17px] text-[#3d3d3d] absolute top-[17px] left-0 text-left whitespace-nowrap z-[824]">
                Connect with us & know what's best for you.
              </span>
              <div className="flex w-[45px] h-[45px] pt-[8px] pr-[23px] pb-[8px] pl-[23px] flex-col gap-[10px] justify-center items-center flex-nowrap bg-[#ffa800] rounded-[30px] absolute top-[78px] left-0 z-[847]">
                <span className="h-[30px] shrink-0 basis-auto font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-[30px] text-[#000] relative text-left whitespace-nowrap z-[848]">
                  1
                </span>
              </div>
              <div className="flex w-[45px] h-[45px] pt-[8px] pr-[23px] pb-[8px] pl-[23px] flex-col gap-[10px] justify-center items-center flex-nowrap bg-[rgba(252,177,31,0.26)] rounded-[30px] absolute top-[78px] left-[215px] z-[849]">
                <span className="h-[30px] shrink-0 basis-auto font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-[30px] text-[#000] relative text-left whitespace-nowrap z-[850]">
                  2
                </span>
              </div>
              <div className="flex w-[45px] h-[45px] pt-[8px] pr-[23px] pb-[8px] pl-[23px] flex-col gap-[10px] justify-center items-center flex-nowrap bg-[rgba(252,177,31,0.26)] rounded-[30px] absolute top-[78px] left-[430px] z-[851]">
                <span className="h-[30px] shrink-0 basis-auto font-['Plus_Jakarta_Sans'] text-[24px] font-bold leading-[30px] text-[#000] relative text-left whitespace-nowrap z-[852]">
                  3
                </span>
              </div>
              <div className="w-[147px] h-[1.014px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/WC41T5y7kO.png)] bg-cover bg-no-repeat absolute top-[100px] left-[52px] z-[853]" />
              <div className="w-[147px] h-[1.014px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/BZctQs5OZb.png)] bg-cover bg-no-repeat absolute top-[101px] left-[272px] z-[854]" />
              <div className="flex w-[512px] h-[252px] flex-col gap-[48px] items-start flex-nowrap absolute top-[185px] left-0 z-[826]">
                <div className="flex flex-col gap-[32px] items-start self-stretch shrink-0 flex-nowrap relative z-[827]">
                  <div className="flex flex-col gap-[24px] items-start self-stretch shrink-0 flex-nowrap relative z-[828]">
                    <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[829]">
                      <div className="flex flex-col gap-[6px] items-start self-stretch shrink-0 flex-nowrap relative z-[830]">
                        <div className="flex flex-col gap-[6px] items-start self-stretch shrink-0 flex-nowrap relative z-[831]">
                          <span className="h-[20px] shrink-0 basis-auto font-['Inter'] text-[14px] font-medium leading-[20px] text-[#344053] relative text-left whitespace-nowrap z-[832]">
                            Tell us about your background?
                          </span>
                          <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[8px] border-solid border border-[#cfd4dc] relative overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] z-[833]">
                            <div className="flex gap-[8px] items-center grow shrink-0 basis-0 flex-nowrap relative z-[834]">
                              <span className="h-[24px] grow shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[24px] text-[#667084] relative text-left whitespace-nowrap z-[835]">
                                Upskillway
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative z-[836]">
                      <div className="flex flex-col gap-[6px] items-start self-stretch shrink-0 flex-nowrap relative z-[837]">
                        <div className="flex flex-col gap-[6px] items-start self-stretch shrink-0 flex-nowrap relative z-[838]">
                          <span className="h-[20px] shrink-0 basis-auto font-['Inter'] text-[14px] font-medium leading-[20px] text-[#344053] relative text-left whitespace-nowrap z-[839]">
                            What type of course are you interested in?
                          </span>
                          <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] items-center self-stretch shrink-0 flex-nowrap bg-[#fff] rounded-[8px] border-solid border border-[#cfd4dc] relative overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] z-[840]">
                            <div className="flex gap-[8px] items-center grow shrink-0 basis-0 flex-nowrap relative z-[841]">
                              <span className="h-[24px] grow shrink-0 basis-auto font-['Inter'] text-[16px] font-normal leading-[24px] text-[#667084] relative text-left whitespace-nowrap z-[842]">
                                Select Industry
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative z-[843]">
                    <div className="flex items-start self-stretch shrink-0 flex-nowrap rounded-[40px] relative z-[844]">
                      <div className="flex pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[8px] justify-center items-center grow shrink-0 basis-0 flex-nowrap rounded-[40px] border-solid border border-[#fff] relative overflow-hidden shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] z-[845]">
                        <button className="h-[24px] shrink-0 basis-auto font-['Inter'] text-[16px] font-medium leading-[24px] text-black relative text-left whitespace-nowrap z-[846]">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className="w-[97.42%] h-[914px] absolute top-[23px] left-0 z-[107]">
        <div className="w-[1440px] h-[777px] text-[0px] bg-[rgba(253,238,235,0.35)] rounded-[40px] absolute top-0 left-[33px] z-[1]">
          <span className="flex w-[27px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[0] text-[#fff] relative text-center rotate-[-90deg] z-[18] mt-[777.5px] mr-0 mb-0 ml-[635.083px]">
            {" "}
          </span>

          <span 
          onClick={() => window.history.back()}
          className="flex h-[20px] justify-start items-start  text-[18px] font-medium leading-[20px] text-[#252641] tracking-[0.36px] absolute top-[60px] left-[121px] text-left whitespace-nowrap z-[57]">
            Back
            <br />
          </span>
          <div className="w-[18px] h-[18px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/gsxYtuXqFw.png)] bg-[length:100%_100%] bg-no-repeat absolute top-[60px] left-[102px] z-[55]" />
          <div className="flex w-[222px] h-[41px] pt-[10px] pr-[25px] pb-[10px] pl-[25px] gap-[10px] justify-end items-center flex-nowrap bg-[#fff] rounded-[40px] absolute top-[100px] left-[101px] z-[3] ">
            <span className="h-[21px] shrink-0 basis-auto font-['Raleway'] text-[18px] font-medium leading-[21px] text-[#252641] tracking-[2px] relative text-left whitespace-nowrap z-[4] -ml-10 ">
              Never stop learning
            </span>
          </div>
          <div className="w-[601px] h-[322px] bg-cover bg-no-repeat rounded-[20px] absolute top-[100px] left-[761px] z-[111]" style={{backgroundImage: `url(${course?.bannerImageUrl || 'https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/340c6403-8e85-427a-8900-2882848472b1.png'})`}}>
            <div className="w-[580px] h-[322px] bg-[rgba(0,0,0,0)] rounded-[20px] relative shadow-[0_1px_8px_0_rgba(0,0,0,0.08)] z-[110] mt-0 mr-0 mb-0 ml-[21px]" />
          </div>
          <span className="flex w-[681px] h-[144px] justify-start items-start font-['Plus_Jakarta_Sans'] text-[64px] font-bold leading-[75px] text-[#3d3d3d] absolute top-[150px] left-[6.94%] text-left z-[5]">
            {course?.title || 'Full Stack development with Ai'}
          </span>
          <span className="flex w-[645px] h-[48px] justify-start items-start font-['Manrope'] text-[16px] font-normal leading-[24px] text-[rgba(0,0,0,0.7)] absolute top-[301px] left-[102px] text-left z-[84]">
            Become a certified Full Stack Engineer with our Offline Full Stack
            Web Development Program. Available in Lucknow, Noida, Indore, Patna,
            Pune and Bangalore
          </span>
          
          {/*ShareButton*/}
          <div className="w-[40px] h-[40px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/40fvE1vJdu.png)] bg-cover bg-no-repeat absolute top-[380px] left-[102px] z-[9999] -mt-5">
          <Share/>
          </div>

          <div className="w-[628px] h-[48px] bg-[rgba(0,0,0,0)] absolute top-[450px] left-[103px] z-[85]">

            <div className="w-[200px] h-[48px] bg-[rgba(0,0,0,0)] absolute top-0 left-0 z-[86]">
              <button 
                onClick={() => console.log('View Training option')}
                className="w-[200px] h-[48px] bg-[#fd661f] rounded-[8px] absolute top-0 left-0 z-[87] hover:bg-[#FF9500] hover:scale-105 hover:shadow-lg transition-all duration-300 transform flex items-center justify-center"
              >
                <span className="flex w-[153px] h-[22px] justify-center items-start font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#fff] text-center whitespace-nowrap z-[88]">
                  View Training option
                </span>
              </button>
            </div>
            <div className="w-[100px] h-[48px] bg-[rgba(0,0,0,0)] absolute top-0 left-[225px] z-[89]">
              <button 
                onClick={() => console.log('Book demo')}
                className="w-[100px] h-[48px] bg-[#fd661f] rounded-[8px] absolute top-0 left-0 z-[90] hover:bg-[#FF9500] hover:scale-105 hover:shadow-lg transition-all duration-300 transform flex items-center justify-center"
              >
                <span className="flex w-[92px] h-[22px] justify-center items-start font-['Nunito_Sans'] text-[16px] font-normal leading-[21.824px] text-[#fff] text-center whitespace-nowrap z-[91]">
                  Book demo
                </span>
              </button>
            </div>
            <div className="w-[50px] h-[48px] bg-[rgba(0,0,0,0)] rounded-[8px] border-solid border border-[#fd661f] absolute top-0 left-[350px] z-[92]">
              <div className="flex w-[24px] h-[24px] justify-center items-center flex-nowrap absolute top-[11px] left-[12px] z-[93]">
                <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/uypS0gD0T8.png)] bg-cover bg-no-repeat rounded-[20px] relative overflow-hidden z-[94]" />
              </div>
              <button 
                onClick={() => console.log('Download Curriculum')}
                className="w-auto h-[24px] bg-[rgba(0,0,0,0)] absolute top-[11px] left-[44px] overflow-hidden z-[95] hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              >
                <span className="flex h-[22px] justify-start items-start font-['Nunito_Sans'] text-[16px] font-normal leading-[16px] text-[#e97862] absolute top-px left-0 text-left whitespace-nowrap z-[96] hover:text-[#FD661F] transition-colors duration-300">
                  Download Curriculum
                </span>
              </button>
            </div>
          </div>
          <div className="w-[300px] h-[100px] bg-[rgba(255,255,255,0.8)] rounded-[40px] absolute top-[500px] left-[866px] z-[48] ">
            <div className="w-[162px] h-[70px] text-[0px] absolute top-[15px] left-[110px] z-50 ">
              <span className="block h-[43px] font-['Nunito_Sans'] text-[24px] font-bold leading-[43px] text-[#595959] tracking-[0.48px] relative text-left whitespace-nowrap z-[49] mt-0 mr-0 mb-0 ml-0">
                250k
              </span>
              <span className="block h-[36px] font-['Nunito_Sans'] text-[20px] font-semibold leading-[36px] text-[#545567] tracking-[0.4px] relative text-left whitespace-nowrap z-50 mt-[-9px] mr-0 mb-0 ml-0">
                Assisted Student
              </span>
            </div>
            <div className="w-[50px] h-[50px] bg-[#23bdee] rounded-[40px] absolute top-[25px] left-[28px] z-[52]">
              <div className="w-[27.5px] h-[27.5px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/MrKe0CGb0c.png)] bg-cover bg-no-repeat rounded-[40px] relative overflow-hidden z-[53] mt-[11.25px] mr-0 mb-0 ml-[11.25px]" />
            </div>
          </div>
          <div className="w-[69px] h-[69px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/nzJJzEV2hR.png)] bg-cover bg-no-repeat absolute top-[500px] left-[1222px] z-[46] rounded-full mt-5" />
          <button 
            onClick={() => console.log('Explore Path')}
            className="flex w-[180px] h-[59px] pt-[20px] pr-[30px] pb-[20px] pl-[30px] gap-[10px] items-start flex-nowrap bg-[#fd661f] rounded-[40px] absolute top-[580px] left-[112px] z-[6] hover:bg-[#FF9500] hover:scale-105 hover:shadow-lg transition-all duration-300 transform"
          >
            <span className="h-[19px] shrink-0 basis-auto  text-[16px] font-medium leading-[18.784px] text-[#fff] tracking-[0.32px] relative text-left uppercase whitespace-nowrap z-[7]">
              explore path
            </span>
          </button>
          <div className="flex w-[233.183px] h-[52.205px] gap-[34.803px] items-center flex-nowrap rounded-[40px] absolute top-[580px] left-[304px] z-40">
            <div className="flex w-[233.183px] gap-[8.701px] items-center shrink-0 flex-nowrap relative z-[41]">
              <div className="w-[127.033px] h-[52.205px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/yy9U1mPVsj.png)] bg-cover bg-no-repeat relative z-[42]" />
              <div className="w-[97.45px] h-[45.233px] shrink-0 relative z-[43]">
                <div className="w-[97.45px] h-[20.882px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/a80e3119-ac07-4151-81c9-f642c64bdc19.png)] bg-cover bg-no-repeat relative z-[44] mt-0 mr-0 mb-5 ml-0" />
                <span className="block h-[20px] font-['Raleway'] text-[12.181194305419922px] font-semibold leading-[20px] text-[#230f0f] relative text-left whitespace-nowrap z-[45] mt-[4.35px] mr-0 mb-0 ml-0">
                  ( 10k+ Reviews)
                </span>
              </div>
            </div>
          </div>
          <span className="flex h-[27px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[692px] left-[50.04%] text-center whitespace-nowrap z-[25]">
            {" "}
          </span>
          <span className="flex w-[1.37%] h-[29.438px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[692.525px] left-[50.45%] text-center rotate-[12.86deg] whitespace-nowrap z-[26]">
            E
          </span>
          <span className="flex w-[1.09%] h-[28.548px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[692.931px] left-[48.41%] text-center rotate-[-12.86deg] whitespace-nowrap z-[24]">
            -
          </span>
          <span className="flex w-[1.69%] h-[30.401px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[697.311px] left-[51.35%] text-center rotate-[25.71deg] whitespace-nowrap z-[27]">
            x
          </span>
          <span className="flex w-[0.81%] h-[24.326px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[24.326px] text-[#fff] absolute top-[700.467px] left-[47.46%] text-center rotate-[-25.71deg] whitespace-nowrap z-[23]">
            {" "}
          </span>
          <span className="flex w-[1.93%] h-[29.838px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[705.894px] left-[45.99%] text-center rotate-[-38.57deg] whitespace-nowrap z-[22]">
            e
          </span>
          <span className="flex w-[1.98%] h-[30.462px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[706.117px] left-[52.18%] text-center rotate-[38.57deg] whitespace-nowrap z-[28]">
            p
          </span>
          <span className="flex w-[1.99%] h-[26.216px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.216px] text-[#fff] absolute top-[719.077px] left-[45.16%] text-center rotate-[-51.43deg] whitespace-nowrap z-[21]">
            r
          </span>
          <span className="flex w-[1.68%] h-[20.743px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[20.743px] text-[#fff] absolute top-[722.059px] left-[53.1%] text-center rotate-[51.43deg] whitespace-nowrap z-[29]">
            l
          </span>
          <span className="flex w-[2.11%] h-[24.328px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[24.328px] text-[#fff] absolute top-[733.525px] left-[44.5%] text-center rotate-[-64.29deg] whitespace-nowrap z-20">
            o
          </span>
          <span className="flex w-[2.11%] h-[24.328px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[24.328px] text-[#fff] absolute top-[734.666px] left-[53.51%] text-center rotate-[64.29deg] whitespace-nowrap z-30">
            o
          </span>
          <span className="flex w-[2.15%] h-[26.482px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.482px] text-[#fff] absolute top-[747.755px] left-[44.1%] text-center rotate-[-77.14deg] whitespace-nowrap z-[19]">
            M
          </span>
          <span className="flex w-[2.01%] h-[17.707px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[17.707px] text-[#fff] absolute top-[753.154px] left-[53.92%] text-center rotate-[77.14deg] whitespace-nowrap z-[31]">
            r
          </span>
        </div>
        <div className="w-[309px] h-[47px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/default/image/2025-11-19/6b0aece8-28ec-41c7-9aff-cdd356aaf2ca.png)] bg-cover bg-no-repeat absolute top-[5px] left-0 z-[74]" />
        <div className="w-[273px] h-[274px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/w6dhzQb9ck.png)] bg-cover bg-no-repeat absolute top-[640px] left-[617px] z-[2]" />
        <div className="w-[13.65%] h-[201px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/1Bo0VW7YLV.png)] bg-cover bg-no-repeat rounded-[50%] absolute top-[676px] left-[44.33%] z-[9]" />
        <div className="w-[4.41%] h-[65px] bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-19/q1rH9zPk2t.png)] bg-cover bg-no-repeat rounded-[5.652px] absolute top-[745px] left-[49.08%] z-[39]" />
        <div className="absolute top-[676px] left-[44.33%] z-[40] pointer-events-none"
                  style={{ width: "13.65%", height: "201px" }}>
                
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  <defs>
                    <path
                      id="circleTextPath"
                      d="
                        M 150,150
                        m -120,0
                        a 120,120 0 1,1 240,0
                        a 120,120 0 1,1 -240,0
                      "
                    />
                  </defs>

                  <text
                    fill="#ffffff"
                    fontSize="22"
                    fontFamily="Clash Display"
                    fontWeight="600"
                  >
                    <textPath href="#circleTextPath" startOffset="0">
                      Explore More • Explore More • Explore More • Explore More • Explore More •  
                    </textPath>
                  </text>
                </svg>
              </div>
        <span className="flex w-[1.79%] h-[6.008px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[6.008px] text-[#fff] absolute top-[790.517px] left-[55.03%] text-center rotate-[102.86deg] whitespace-nowrap z-[33]">
          {" "}
        </span>
        <div className="w-[322.25px] h-[60px] text-[0px] bg-[rgba(0,0,0,0)] absolute top-[802px] left-[29px] z-[107]">
          <span className="flex w-[122px] h-[24px] justify-center items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#1b2124] relative text-center whitespace-nowrap z-[108] mt-px mr-0 mb-0 ml-[91.672px]">
            {course?.programName || 'Job Assistance'}
          </span>
          <span className="flex w-[55px] h-[19px] justify-center items-start font-['Nunito_Sans'] text-[14px] font-normal leading-[14px] text-[#3d3d3d] relative text-center whitespace-nowrap z-[109] mt-[12px] mr-0 mb-0 ml-[125.625px]">
            Program
          </span>
        </div>
      </div>
      <div className="w-[1440px] h-[84px] bg-[rgba(0,0,0,0)] absolute top-[816px] left-[160px] z-[97]">
        <span className="flex w-[2.32%] h-[30.635px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[26.851px] text-[#fff] absolute top-[0.87px] left-[44.55%] text-center rotate-[115.71deg] whitespace-nowrap z-[34]">
          M
        </span>
        <span className="flex w-[2.05%] h-[22.526px] justify-center items-end font-['Clash_Display'] text-[21.82978630065918px] font-semibold leading-[22.526px] text-[#fff] absolute top-[3.987px] left-[35.67%] text-center rotate-[-115.71deg] whitespace-nowrap z-[16]">
          r
        </span>
        <div className="w-[283px] h-[60px] text-[0px] bg-[rgba(0,0,0,0)] absolute top-[9px] left-[137px] z-[104]">
          <span className="flex w-[79px] h-[24px] justify-center items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#1b2124] relative text-center whitespace-nowrap z-[105] mt-px mr-0 mb-0 ml-[113.406px]">
            {course?.durationMonths ? `${course.durationMonths} Months` : '8 Months'}
          </span>
          <span className="flex w-[55px] h-[19px] justify-center items-start font-['Nunito_Sans'] text-[14px] font-normal leading-[14px] text-[#3d3d3d] relative text-center whitespace-nowrap z-[106] mt-[12px] mr-0 mb-0 ml-[125.375px]">
            Duration
          </span>
        </div>
        <div className="w-[322.25px] h-[60px] text-[0px] bg-[rgba(0,0,0,0)] absolute top-[12px] left-[728.5px] z-[98]">
          <span className="flex w-[97px] h-[24px] justify-center items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#1b2124] relative text-center whitespace-nowrap z-[99] mt-px mr-0 mb-0 ml-[104.344px]">
            {course?.deliveryModes && course.deliveryModes.length > 0 ? course.deliveryModes[0] : 'Virtual Live'}
          </span>
          <span className="flex w-[92px] h-[19px] justify-center items-start font-['Nunito_Sans'] text-[14px] font-normal leading-[14px] text-[#3d3d3d] relative text-center whitespace-nowrap z-[100] mt-[12px] mr-0 mb-0 ml-[106.938px]">
            Delivery Mode
          </span>
        </div>
        <div className="w-[321.25px] h-[60px] text-[0px] bg-[rgba(0,0,0,0)] absolute top-[12px] left-[1066.75px] z-[101]">
          <span className="flex w-[62px] h-[24px] justify-center items-start font-['Nunito_Sans'] text-[18px] font-normal leading-[18px] text-[#1b2124] relative text-center whitespace-nowrap z-[102] mt-px mr-0 mb-0 ml-[121.719px]">
            {course?.language || 'English'}
          </span>
          <span className="flex w-[63px] h-[19px] justify-center items-start font-['Nunito_Sans'] text-[14px] font-normal leading-[14px] text-[#3d3d3d] relative text-center whitespace-nowrap z-[103] mt-[12px] mr-0 mb-0 ml-[121.563px]">
            Language
          </span>
        </div>
      </div>

      {/* Consultation Modal - High z-index to appear above all content */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto" style={{ zIndex: 100000 }}>
            {/* Close Button */}
            <button
              onClick={() => setIsConsultationModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Modal Content - Form and Image Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Form */}
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
                  Get In Touch
                </h2>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Form submitted:', consultationForm);
                    // Handle form submission here
                    alert('Thank you! We will get in touch with you soon.');
                    setIsConsultationModalOpen(false);
                    setConsultationForm({ name: '', phone: '', email: '' });
                  }}
                  className="space-y-6"
                >
                  {/* Name Input */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter your name
                    </label>
                    <input
                      type="text"
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                      placeholder="hello"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter your mobile number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="+91"
                        disabled
                        className="w-16 px-3 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <input
                        type="tel"
                        value={consultationForm.phone}
                        onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                        placeholder="9413477263"
                        required
                        pattern="[0-9]{10}"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter your email
                    </label>
                    <input
                      type="email"
                      value={consultationForm.email}
                      onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Connected
                  </button>
                </form>
              </div>

              {/* Right Side - Illustration */}
              <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-8 rounded-r-2xl">
                <img
                  src={popUp}
                  alt="Get In Touch Illustration"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Enrollment Modal */}
  {isEnrollModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
    <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" style={{ zIndex: 100000 }}>
      {/* Close Button */}
      <button
        onClick={() => {
          setIsEnrollModalOpen(false);
          setEnrollStep(1);
          setEnrollForm({ name: '', email: '', phone: '', background: '', courseType: '', domain: '' });
        }}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      {/* Modal Content */}
      <div className="p-8 lg:p-12">
        {/* Step Indicator - Horizontal Circles */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    enrollStep >= step
                      ? 'bg-gradient-to-r from-[#ffa800] to-[#ffb84d] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 transition-all ${
                      enrollStep > step ? 'bg-[#ffa800]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Name, Phone, OTP */}
        {enrollStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Get Started
            </h2>

            {/* Name Input - Underlined Style */}
            <div>
              <input
                type="text"
                value={enrollForm.name}
                onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                placeholder="Name *"
                required
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#ffa800] text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Phone Input with Country Code */}
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-[#ffa800] transition-colors">
              <div className="flex items-center space-x-2 pr-4 border-r border-gray-300">
                <span className="font-bold text-gray-700">IN</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">+91</span>
              </div>
              <input
                type="tel"
                value={enrollForm.phone}
                onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                placeholder="Enter your mobile number"
                required
                pattern="[0-9]{10}"
                className="flex-1 px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                className="text-[#ffa800] font-medium text-sm hover:text-[#ff9500] transition-colors"
              >
                GET OTP
              </button>
            </div>

            {/* OTP Input */}
            <div>
              <input
                type="text"
                placeholder="OTP"
                maxLength="6"
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-[#ffa800] text-gray-700 placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => {
                if (enrollForm.name && enrollForm.phone) {
                  setEnrollStep(2);
                } else {
                  alert('Please fill in all required fields');
                }
              }}
              className="w-full bg-[#ffa800] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg hover:shadow-xl mt-8"
            >
              Submit
            </button>
          </div>
        )}

        {/* Step 2: Domain Selection */}
        {enrollStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
              Which domain interests you the most?
            </h2>

            {/* Domain Dropdown */}
            <div className="w-full">
              <select
                value={enrollForm.domain}
                onChange={(e) => setEnrollForm({ ...enrollForm, domain: e.target.value })}
                required
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa800] focus:border-[#ffa800] bg-white text-gray-900 text-base font-medium transition-all"
              >
                <option value="">Select Domain</option>
                <option value="web-development">Web Development</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="devops">DevOps</option>
                <option value="blockchain">Blockchain</option>
                <option value="digital-marketing">Digital Marketing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setEnrollStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (enrollForm.domain) {
                    setEnrollStep(3);
                  } else {
                    alert('Please select a domain');
                  }
                }}
                className="flex-1 bg-[#ffa800] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Background and Course Type */}
        {enrollStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
              Tell us about your background?
            </h2>

            {/* Background Dropdown */}
            <div className="w-full">
              <select
                value={enrollForm.background}
                onChange={(e) => setEnrollForm({ ...enrollForm, background: e.target.value })}
                required
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa800] focus:border-[#ffa800] bg-white text-gray-900 text-base font-medium transition-all"
              >
                <option value="">Select Background</option>
                <option value="school-student">School Student</option>
                <option value="college-student">College Student</option>
                <option value="graduate-not-working">Graduate (Not Working)</option>
                <option value="working-professional">Working Professional</option>
              </select>
            </div>

            {/* Course Type Question */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                What type of course are you interested in?
              </h3>
              <div className="w-full">
                <select
                  value={enrollForm.courseType}
                  onChange={(e) => setEnrollForm({ ...enrollForm, courseType: e.target.value })}
                  required
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa800] focus:border-[#ffa800] bg-white text-gray-900 text-base font-medium transition-all"
                >
                  <option value="">Select Course</option>
                  <option value="upskillway-course">Upskillway Course</option>
                  <option value="online-degree">Online Degree</option>
                </select>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setEnrollStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (enrollForm.background && enrollForm.courseType) {
                    console.log('Form submitted:', enrollForm);
                    alert('Thank you for your interest! We will contact you soon.');
                    setIsEnrollModalOpen(false);
                    setEnrollStep(1);
                    setEnrollForm({ name: '', email: '', phone: '', background: '', courseType: '', domain: '' });
                  } else {
                    alert('Please fill in all fields');
                  }
                }}
                className="flex-1 bg-[#ffa800] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Need Help Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsEnrollModalOpen(false);
              setIsConsultationModalOpen(true);
            }}
            className="text-[#ffa800] hover:text-[#ff9500] font-medium text-sm flex items-center justify-center mx-auto space-x-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Need help? Talk to our counsellor</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Multi-Step Enrollment Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto" style={{ zIndex: 100000 }}>
            {/* Close Button */}
            <button
              onClick={() => {
                setIsEnrollModalOpen(false);
                setEnrollStep(1);
                setEnrollForm({ name: '', email: '', phone: '', background: '', courseType: '', domain: '' });
              }}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            {/* Modal Content */}
            <div className="p-8 lg:p-12">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          enrollStep >= step
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-16 h-1 ${
                            enrollStep > step ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Name, Phone, OTP */}
              {enrollStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    Get Started
                  </h2>

                  {/* Name Input */}
                  <div>
                    <input
                      type="text"
                      value={enrollForm.name}
                      onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                      placeholder="Name *"
                      required
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Phone Input with Country Code */}
                  <div className="flex items-center border-b-2 border-gray-300 focus-within:border-purple-500">
                    <div className="flex items-center space-x-2 pr-4 border-r border-gray-300">
                      <span className="font-bold text-gray-700">IN</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      placeholder="Enter your mobile number"
                      required
                      pattern="[0-9]{10}"
                      className="flex-1 px-4 py-3 border-0 focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="text-pink-300 font-medium text-sm hover:text-pink-400 transition-colors"
                    >
                      GET OTP
                    </button>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <input
                      type="text"
                      placeholder="OTP"
                      maxLength="6"
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={() => {
                      if (enrollForm.name && enrollForm.phone) {
                        setEnrollStep(2);
                      } else {
                        alert('Please fill in all required fields');
                      }
                    }}
                    className="w-full bg-pink-300 text-white py-4 rounded-lg font-semibold text-lg hover:bg-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl mt-8"
                  >
                    Submit
                  </button>
                </div>
              )}

              {/* Step 2: Domain Selection */}
              {enrollStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
                    Which domain interests you the most?
                  </h2>

                  {/* Domain Dropdown */}
                  <div className="w-full">
                    <select
                      value={enrollForm.domain}
                      onChange={(e) => {
                        console.log('Domain selected:', e.target.value);
                        setEnrollForm({ ...enrollForm, domain: e.target.value });
                      }}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-base font-medium"
                    >
                      <option value="">Select Domain</option>
                      <option value="web-development">Web Development</option>
                      <option value="data-science">Data Science</option>
                      <option value="ai-ml">AI & Machine Learning</option>
                      <option value="cloud-computing">Cloud Computing</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="mobile-development">Mobile Development</option>
                      <option value="devops">DevOps</option>
                      <option value="blockchain">Blockchain</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setEnrollStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (enrollForm.domain) {
                          setEnrollStep(3);
                        } else {
                          alert('Please select a domain');
                        }
                      }}
                      className="flex-1 bg-pink-300 text-white py-4 rounded-lg font-semibold text-lg hover:bg-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Background and Course Type */}
              {enrollStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-6">
                    Tell us about your background?
                  </h2>

                  {/* Background Dropdown */}
                  <div className="w-full">
                    <select
                      value={enrollForm.background}
                      onChange={(e) => {
                        console.log('Background selected:', e.target.value);
                        setEnrollForm({ ...enrollForm, background: e.target.value });
                      }}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-base font-medium"
                    >
                      <option value="">Select Background</option>
                      <option value="school-student">School Student</option>
                      <option value="college-student">College Student</option>
                      <option value="graduate-not-working">Graduate (Not Working)</option>
                      <option value="working-professional">Working Professional</option>
                    </select>
                  </div>

                  {/* Course Type Question */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-4">
                      What type of course are you interested in?
                    </h3>
                    <div className="w-full">
                      <select
                        value={enrollForm.courseType}
                        onChange={(e) => {
                          console.log('Course type selected:', e.target.value);
                          setEnrollForm({ ...enrollForm, courseType: e.target.value });
                        }}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-base font-medium"
                      >
                        <option value="">Select Course</option>
                        <option value="upskillway-course">Upskillway Course</option>
                        <option value="online-degree">Online Degree</option>
                      </select>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setEnrollStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (enrollForm.background && enrollForm.courseType) {
                          console.log('Form submitted:', enrollForm);
                          alert('Thank you for your interest! We will contact you soon.');
                          setIsEnrollModalOpen(false);
                          setEnrollStep(1);
                          setEnrollForm({ name: '', email: '', phone: '', background: '', courseType: '', domain: '' });
                        } else {
                          alert('Please fill in all fields');
                        }
                      }}
                      className="flex-1 bg-pink-300 text-white py-4 rounded-lg font-semibold text-lg hover:bg-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Need Help Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center justify-center mx-auto space-x-2"
                >
                  <span>Need help?</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;