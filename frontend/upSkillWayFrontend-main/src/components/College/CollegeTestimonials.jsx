import React, { useState, useEffect, useContext, useRef } from 'react';
import config from '../../config/env';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

// Utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
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
    const magnitude = Math.min(5, (Math.abs(v) / 800) * 5);
    return sign * magnitude;
  });

  return (
    <ScrollVelocityContext.Provider value={velocityFactor}>
      <div className={cn("overflow-hidden", className)} {...props}>
        {children}
      </div>
    </ScrollVelocityContext.Provider>
  );
}

// Scroll Velocity Row Implementation
function ScrollVelocityRowImpl({
  children,
  baseVelocity = 1,
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
      className={cn("relative w-full", className)}
      {...props}
    >
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? blockRef : null}
            className="flex flex-nowrap"
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

  return <ScrollVelocityRowImpl {...props} velocityFactor={velocityFactor} />;
}

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial, getPlaceholderImage }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="w-[350px] min-h-[420px] flex-shrink-0 mx-3">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col">
        {/* Student Image */}
        <div className="flex justify-center mb-4">
          {testimonial.studentImageUrl && !imageError ? (
            <img
              src={testimonial.studentImageUrl}
              alt="Student"
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl border-2 border-purple-200">
              ?
            </div>
          )}
        </div>

        {/* Testimonial Text - Flexible height */}
        <div className="flex-grow mb-4">
          <p className="text-gray-700 text-sm leading-relaxed italic text-center">
            "{testimonial.testimonialText}"
          </p>
        </div>

        {/* Rating Stars */}
        <div className="flex justify-center gap-1 mb-3">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialsDisplay = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/cms/training-programs?page=1&limit=10&trainingType=college`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract only the required fields from testimonials
        const allTestimonials = [];
        if (data.success && data.data) {
          data.data.forEach(program => {
            if (program.testimonials && Array.isArray(program.testimonials)) {
              program.testimonials.forEach(testimonial => {
                allTestimonials.push({
                  id: testimonial.id || Math.random(),
                  studentImageUrl: testimonial.studentImageUrl,
                  testimonialText: testimonial.testimonialText,
                  rating: testimonial.rating
                });
              });
            }
          });
        }
        
        setTestimonials(allTestimonials);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getPlaceholderImage = () => {
    return `https://placehold.co/64x64/e0e0e0/9e9e9e?text=?`;
  };

  // Ensure testimonials are duplicated if needed for smooth scrolling
  const displayTestimonials = testimonials.length < 3 
    ? [...testimonials, ...testimonials, ...testimonials].slice(0, 6)
    : testimonials;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Error Loading Testimonials</h3>
            <p className="text-gray-600 text-center mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                No testimonials available
              </p>
              <p className="text-gray-600">
                Check back later for student success stories!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-block p-[2px] rounded-[22px] bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">
            <span className="block bg-white rounded-[22px] px-4 py-2 text-amber-700 text-sm font-medium">
              Testimonial
            </span>
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Student <span className="text-[#FDB11F]">Success Stories</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Hear from our graduates who transformed their careers
          </p>
        </div>

        {/* Scrollable Testimonials */}
        <ScrollVelocityContainer className="space-y-8">
          {/* Single Row - Moving Right */}
          <ScrollVelocityRow baseVelocity={15} direction={1}>
            {displayTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial}
                getPlaceholderImage={getPlaceholderImage}
              />
            ))}
          </ScrollVelocityRow>

          {/* View More Button */}
          <div className="text-center p-8">
            <button
              className="text-white text-[20px] bg-[#FCB11F] w-[220px] h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px]"
              onClick={() => navigate("/contact")}
            >
              View More
              <svg
                className="w-[40px] h-[40px] -mt-10 ml-35 bg-[#FCB11F] text-white"
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
        </ScrollVelocityContainer>
      </div>
    </section>
  );
};

export default TestimonialsDisplay;