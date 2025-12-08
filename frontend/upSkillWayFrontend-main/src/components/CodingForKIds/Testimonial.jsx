import React, { useState, useEffect, useContext, useRef } from "react";
import { Play } from "lucide-react";
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
const TestimonialCard = ({ testimonial, getPlaceholderImage }) => (
  <div className="w-[350px] min-h-[420px] flex-shrink-0 mx-3">
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col">
      {/* Profile Picture */}
      <div className="flex justify-center mb-4">
        <img
          src={
            testimonial.avatarUrl || getPlaceholderImage(testimonial.authorName)
          }
          alt={testimonial.authorName}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = getPlaceholderImage(testimonial.authorName);
          }}
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
        {testimonial.authorName}
      </h3>

      {/* Role */}
      <p className="text-sm text-gray-600 text-center mb-4">
        {testimonial.role}
      </p>

      {/* Testimonial Text - Flexible height */}
      <div className="flex-grow mb-4">
        <p className="text-gray-700 text-sm leading-relaxed italic">
          "{testimonial.text}"
        </p>
      </div>

      {/* Watch Video Button */}
      {testimonial.videoUrl && (
        <div className="mb-3">
          <button
            onClick={() => window.open(testimonial.videoUrl, "_blank")}
            className="text-amber-500 hover:text-amber-600 text-sm font-medium flex items-center justify-center mx-auto transition-all gap-1.5 hover:gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Video
          </button>
        </div>
      )}

      {/* Status Badge */}
      {testimonial.status && (
        <div className="flex justify-center">
          <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-medium">
            {testimonial.status}
          </span>
        </div>
      )}
    </div>
  </div>
);

// Main Animated Testimonials Component
const AnimatedTestimonials = ({
  testimonials: propTestimonials = [],
  title = "Hear What Our Users Are Saying",
  subtitle = "Discover the varied perspectives and experiences as users share their stories, highlighting the versatility of our platform.",
  baseVelocity = 15,
}) => {
  const testimonialsLoading = false;
  

  // Use testimonials from props, or fallback to mock data
  const mockTestimonials = [
    {
      id: 1,
      authorName: "Riya Sharma",
      role: "Frontend Developer Intern",
      text: "My internship at TheMedro gave me hands-on experience with cutting-edge technologies. The mentorship was invaluable!",
      avatarUrl: null,
      videoUrl: "https://example.com/video1",
      status: "approved",
    },
    {
      id: 2,
      authorName: "Sneha Patel",
      role: "AI/ML Intern",
      text: "My time as an AI/ML intern helped me gain practical knowledge in machine learning algorithms and real-world case studies. The team was incredibly supportive and I learned so much!",
      avatarUrl: null,
      videoUrl: "https://example.com/video2",
      status: "approved",
    },
    {
      id: 3,
      authorName: "Aditya Verma",
      role: "Junior Backend Engineer",
      text: "Working at TheMedro has been a fantastic experience. The projects are challenging and rewarding, pushing me to grow as a developer every single day.",
      avatarUrl: null,
      videoUrl: "https://example.com/video3",
      status: "approved",
    },
    {
      id: 4,
      authorName: "Michael Chen",
      role: "Software Engineer",
      text: "As a developer, I appreciate the clean architecture and intuitive design. It's exactly what our team needed.",
      avatarUrl: null,
      status: "approved",
    },
    {
      id: 5,
      authorName: "Emma Williams",
      role: "Product Manager",
      text: "The user experience is outstanding. Our productivity has increased significantly since we started using this tool.",
      avatarUrl: null,
      status: "approved",
    },
    {
      id: 6,
      authorName: "David Rodriguez",
      role: "Creative Director",
      text: "Beautiful design meets powerful functionality. This is the perfect solution for creative professionals looking to elevate their work.",
      avatarUrl: null,
      status: "approved",
    },
  ];

  const testimonials = propTestimonials.length > 0 ? propTestimonials : mockTestimonials;

  const getInitialFromName = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getPlaceholderImage = (name) => {
    const initial = getInitialFromName(name);
    return `https://placehold.co/64x64/e0e0e0/9e9e9e?text=${initial}`;
  };

  const firstRowTestimonials = testimonials.slice(
    0,
    Math.ceil(testimonials.length / 2)
  );

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white to-white py-16 px-4 -mt-25">
      {/* Badge */}
      <div className="flex justify-center mb-4">
      <span className="inline-block p-[2px] rounded-[22px] bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]">
  <span className="block bg-white rounded-[22px] px-4 py-2 text-amber-700 text-sm font-medium">
    Testimonial
  </span>
</span>
      </div>

      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {title.split(" ").map((word, index) =>
            word === "Users" ? (
              <span key={index} className="text-amber-500">
                {word}{" "}
              </span>
            ) : (
              <span key={index}>{word} </span>
            )
          )}
        </h1>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      {testimonialsLoading ? (
        <div className="space-y-8">
          {[1, 2].map((row) => (
            <div key={row} className="flex gap-6 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[350px] h-[420px] flex-shrink-0 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 ">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <p className="text-xl font-semibold text-gray-900 mb-2">
              No testimonials available
            </p>
            <p className="text-gray-600">
              Check back later for user testimonials!
            </p>
          </div>
        </div>
      ) : (
        <ScrollVelocityContainer className="space-y-8 ">
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

  <div className="text-center p-8" >
        <button className=" text-white text-[20px] bg-[#FCB11F] w-[220px] h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px]  " onClick={() => navigate("/contact")} >View More
           <svg className="w-[40px] h-[40px] -mt-10 ml-35  bg-[#FCB11F] text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg> 
        </button>
       
      </div>
          {/* Second Row - Moving Left */}
        </ScrollVelocityContainer>
      )}
    
    </div>
  );
};

export default AnimatedTestimonials;
