import React, { useState, useEffect, useContext, useRef } from 'react';
import config from '../../config/env';
import { Play } from 'lucide-react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// Utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Wrap utility function
export const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Context for scroll velocity
const ScrollVelocityContext = React.createContext(null);

// Scroll Velocity Container
function ScrollVelocityContainer({ children, className, ...props }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("relative w-full", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

// Scroll Velocity Row Implementation
function ScrollVelocityRowImpl({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
  velocityFactor,
  ...props
}) {
  const containerRef = useRef(null);
  const blockRef = useRef(null);
  const [numCopies, setNumCopies] = useState(1);

  const baseX = useMotionValue(0);
  const baseDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const currentDirectionRef = useRef(direction >= 0 ? 1 : -1);
  const unitWidth = useMotionValue(0);

  const isInViewRef = useRef(true);
  const isPageVisibleRef = useRef(true);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const block = blockRef.current;
    if (!container || !block) return;

    const updateSizes = () => {
      const cw = container.offsetWidth || 0;
      const bw = block.scrollWidth || 0;
      unitWidth.set(bw);
      const nextCopies = bw > 0 ? Math.max(3, Math.ceil(cw / bw) + 2) : 1;
      setNumCopies((prev) => (prev === nextCopies ? prev : nextCopies));
    };

    updateSizes();

    const ro = new ResizeObserver(updateSizes);
    ro.observe(container);
    ro.observe(block);

    const io = new IntersectionObserver(([entry]) => {
      isInViewRef.current = entry.isIntersecting;
    });
    io.observe(container);

    const handleVisibility = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility, {
      passive: true,
    });
    handleVisibility();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePRM = () => {
      prefersReducedMotionRef.current = mq.matches;
    };
    mq.addEventListener("change", handlePRM);
    handlePRM();

    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      mq.removeEventListener("change", handlePRM);
    };
  }, [children, unitWidth]);

  const x = useTransform([baseX, unitWidth], ([v, bw]) => {
    const width = Number(bw) || 1;
    const offset = Number(v) || 0;
    return `${-wrap(0, width, offset)}px`;
  });

  useAnimationFrame((_, delta) => {
    if (!isInViewRef.current || !isPageVisibleRef.current) return;
    const dt = delta / 1000;
    const vf = velocityFactor.get();
    const absVf = Math.min(5, Math.abs(vf));
    const speedMultiplier = prefersReducedMotionRef.current ? 1 : 1 + absVf;

    if (absVf > 0.1) {
      const scrollDirection = vf >= 0 ? 1 : -1;
      currentDirectionRef.current = baseDirectionRef.current * scrollDirection;
    }

    const bw = unitWidth.get() || 0;
    if (bw <= 0) return;
    const pixelsPerSecond = (bw * baseVelocity) / 500;
    const moveBy =
      currentDirectionRef.current * pixelsPerSecond * speedMultiplier * dt;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      ref={containerRef}
      className={cn("w-full overflow-hidden whitespace-nowrap", className)}
      {...props}
    >
      <motion.div
        className="inline-flex items-center will-change-transform transform-gpu select-none"
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            aria-hidden={i !== 0}
            className="inline-flex shrink-0 items-center"
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Scroll Velocity Row with context
function ScrollVelocityRow(props) {
  const sharedVelocityFactor = useContext(ScrollVelocityContext);
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmoothVelocity = useSpring(localVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const localVelocityFactor = useTransform(localSmoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  const velocityFactor = sharedVelocityFactor || localVelocityFactor;
  
  return (
    <ScrollVelocityRowImpl {...props} velocityFactor={velocityFactor} />
  );
}

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial, getPlaceholderImage }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 mx-4 min-w-[300px] border border-gray-100">
    <div className="w-16 h-16 mx-auto mb-4 overflow-hidden rounded-full">
      <img
        src={testimonial.avatarUrl || getPlaceholderImage(testimonial.authorName)}
        alt={testimonial.authorName}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = getPlaceholderImage(testimonial.authorName);
        }}
      />
    </div>
    <h3 className="text-center font-semibold mb-1 text-gray-900">
      {testimonial.authorName}
    </h3>
    <p className="text-center text-sm text-gray-500 mb-4">
      {testimonial.role}
    </p>
    <p className="text-gray-600 text-sm italic text-center leading-relaxed">
      "{testimonial.text}"
    </p>
    {testimonial.videoUrl && (
      <div className="mt-4 text-center">
        <button
          onClick={() => window.open(testimonial.videoUrl, "_blank")}
          className="text-amber-500 hover:text-amber-700 text-sm font-medium flex items-center justify-center mx-auto transition-colors"
        >
          <Play className="w-4 h-4 mr-1" />
          Watch Video
        </button>
      </div>
    )}
    {testimonial.status && (
      <div className="mt-3 text-center">
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full ${
            testimonial.status === "approved"
              ? "bg-green-100 text-green-800"
              : testimonial.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {testimonial.status}
        </span>
      </div>
    )}
  </div>
);

// Main Animated Testimonials Component
const AnimatedTestimonials = ({ 
  apiUrl = `${config.apiBaseUrl}/cms/testimonials`,
  maxTestimonials = 12,
  title = "Hear What Our Users Are Saying",
  subtitle = "Discover the varied perspectives and experiences as users share their stories, highlighting the versatility of our app.",
  baseVelocity = 15
}) => {
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(null);

  // Mock testimonials data for demonstration
  const mockTestimonials = [
    {
      id: 1,
      authorName: "Sarah Johnson",
      role: "Marketing Director",
      text: "This platform has completely transformed how we approach our marketing campaigns. The results speak for themselves!",
      avatarUrl: null,
      status: "approved"
    },
    {
      id: 2,
      authorName: "Michael Chen",
      role: "Software Engineer",
      text: "As a developer, I appreciate the clean architecture and intuitive design. It's exactly what our team needed.",
      avatarUrl: null,
      status: "approved"
    },
    {
      id: 3,
      authorName: "Emma Williams",
      role: "Product Manager",
      text: "The user experience is outstanding. Our productivity has increased significantly since we started using this tool.",
      avatarUrl: null,
      status: "approved"
    },
    {
      id: 4,
      authorName: "David Rodriguez",
      role: "Creative Director",
      text: "Beautiful design meets powerful functionality. This is the perfect solution for creative professionals.",
      avatarUrl: null,
      status: "approved"
    },
    {
      id: 5,
      authorName: "Lisa Thompson",
      role: "Business Analyst",
      text: "The analytics features are incredible. We can now make data-driven decisions with confidence.",
      avatarUrl: null,
      status: "approved"
    },
    {
      id: 6,
      authorName: "James Wilson",
      role: "Startup Founder",
      text: "This platform helped us scale our business from startup to success. Couldn't recommend it more!",
      avatarUrl: null,
      status: "approved"
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError(null);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
          setTestimonials(data.data || []);
        } else {
          // If API call fails, fall back to mock data for demo
          console.warn("API returned success: false, falling back to mock data");
          setTestimonials(mockTestimonials);
        }
      } catch (err) {
        console.warn("API fetch failed, falling back to mock data:", err.message);
        // Fall back to mock data if API fails
        setTestimonials(mockTestimonials);
        setTestimonialsError(null); // Don't show error, just use mock data
      } finally {
        setTestimonialsLoading(false);
      }
    };

    fetchTestimonials();
  }, [apiUrl]);

  const handleRetry = () => {
    setTestimonialsError(null);
    setTestimonialsLoading(true);
    
    // Retry the API call
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
          setTestimonials(data.data || []);
          setTestimonialsError(null);
        } else {
          setTestimonialsError("API returned unsuccessful response");
        }
      } catch (err) {
        setTestimonialsError("Error fetching testimonials: " + err.message);
        console.error("Error fetching testimonials:", err);
      } finally {
        setTestimonialsLoading(false);
      }
    };
    
    fetchTestimonials();
  };

  const getInitialFromName = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getPlaceholderImage = (name) => {
    const initial = getInitialFromName(name);
    return `https://placehold.co/64x64/e0e0e0/9e9e9e?text=${initial}`;
  };

  // Split testimonials into two rows for different scroll directions
  const firstRowTestimonials = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRowTestimonials = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="py-20  mt-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {/* Badge */}
        <div className="flex justify-center mb-12 rounded-xs">
          <span
            className="inline-flex items-center justify-center px-6 py-2 text-gray-600 font-semibold text-base leading-none text-center"
            style={{
              background:
                "linear-gradient(80.07deg, #FCB11F 9.8%, #000000 39.62%, #000000 81.26%, #FCB11F 87.42%, #FCB11F 99.61%)",
              borderRadius: "22px",
              padding: "1px",
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center bg-white px-6 py-3"
              style={{ borderRadius: "21px" }}
            >
              Testimonials
            </div>
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2
            className="text-gray-900 mb-6"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 500,
              fontSize: "54px",
              lineHeight: "100%",
              letterSpacing: "-4%",
              marginLeft: "-400px",
            }}
          >
            {title.split(' ').map((word, index) => 
              word === 'Users' ? (
                <span key={index} className="text-amber-500">{word} </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>

          <p
            className="text-gray-600"
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "-1%",
              textAlign: "center",
              marginLeft: "-400px"
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {testimonialsLoading ? (
        // Loading skeleton
        <div className="space-y-8">
          {[1, 2].map((row) => (
            <div key={row} className="flex space-x-4 px-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${row}-${index}`}
                  className="bg-white rounded-xl p-6 shadow-md animate-pulse min-w-[300px]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 mx-auto w-24"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4 mx-auto w-32"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : testimonialsError ? (
        // Error state
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
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
            <p className="text-lg font-semibold">
              Failed to load testimonials
            </p>
            <p className="text-sm text-gray-600">{testimonialsError}</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        // No testimonials state
        <div className="text-center py-8">
          <div className="text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <p className="text-lg font-semibold">
              No testimonials available
            </p>
            <p className="text-sm">
              Check back later for user testimonials!
            </p>
          </div>
        </div>
      ) : (
        // Animated testimonial rows
        <ScrollVelocityContainer className="space-y-8">
          {/* First Row - Moving Right */}
          <ScrollVelocityRow baseVelocity={baseVelocity} direction={1}>
            {firstRowTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                getPlaceholderImage={getPlaceholderImage}
              />
            ))}
          </ScrollVelocityRow>

          {/* Second Row - Moving Left */}
          <ScrollVelocityRow baseVelocity={baseVelocity} direction={-1}>
            {secondRowTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                getPlaceholderImage={getPlaceholderImage}
              />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      )}

      
    </section>
  );
};

export default AnimatedTestimonials;