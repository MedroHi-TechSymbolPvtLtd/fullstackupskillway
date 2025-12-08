import React, { useContext, useRef, useState, useEffect } from "react";
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

    const pixelsPerSecond = (bw * baseVelocity) / 100;
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
          src={testimonial.imageUrl || getPlaceholderImage(testimonial.name)}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = getPlaceholderImage(testimonial.name);
          }}
        />
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">
        {testimonial.name}
      </h3>

      {/* Role */}
      <p className="text-sm text-gray-600 text-center mb-4">
        {testimonial.role}
        {testimonial.company ? ` at ${testimonial.company}` : ""}
      </p>

      {/* Testimonial Text - Flexible height */}
      <div className="flex-grow mb-4">
        <p className="text-gray-700 text-sm leading-relaxed italic">
          "{testimonial.feedback}"
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

// Main Corporate Testimonials Component
const CorporateTestimonials = ({
  testimonials = [],
  subtitle = "See how enterprises are improving productivity, accelerating digital adoption, and closing capability gaps with Upskillway.",
  baseVelocity = 15,
}) => {
  const navigate = useNavigate();

  const getInitialFromName = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  const getPlaceholderImage = (name) => {
    const initial = getInitialFromName(name);
    return `https://placehold.co/64x64/e0e0e0/9e9e9e?text=${initial}`;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}

        {/* Header */}
        <div className="text-center mb-12 -mt-20">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[48px] leading-[46px] font-bold text-black capitalize mb-4">
            <span className="text-[#FDB11F]">Success Stories</span> Powered by
            Strong Partnerships
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] leading-[32px] text-[#38393E] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <p className="text-xl font-semibold text-gray-900 mb-2">
                No testimonials available
              </p>
              <p className="text-gray-600">
                Check back later for success stories!
              </p>
            </div>
          </div>
        ) : (
          <ScrollVelocityContainer className="space-y-8">
            {/* Single Row - Moving Right */}
            <ScrollVelocityRow baseVelocity={baseVelocity} direction={1}>
              {testimonials.map((testimonial, index) => (
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
        )}
      </div>
    </section>
  );
};

export default CorporateTestimonials;
