import React from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// TextAnimate component (simplified version based on your example)



 
const TextAnimate = ({ 
  children, 
  animation = "blurInUp", 
  by = "character", 
  once = true,
  className = "",
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Extract text content from children (whether string or JSX)
  const getTextContent = (element) => {
    if (typeof element === 'string') return element;
    if (React.isValidElement(element) && element.props.children) {
      return typeof element.props.children === 'string' ? element.props.children : '';
    }
    return '';
  };

  const textContent = getTextContent(children);
  const isJSXElement = React.isValidElement(children);

  if (by === "character" && textContent) {
    return (
      <span className={className}>
        {textContent.split('').map((char, index) => (
          <span
            key={index}
            className={`inline-block ${isVisible ? 'animate-blur-in-up' : 'opacity-0'} ${isJSXElement ? children.props.className || '' : ''}`}
            style={{
              animationDelay: isVisible ? `${(delay + index * 50)}ms` : '0ms',
              animationFillMode: 'both'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={`${isVisible ? 'animate-blur-in-up' : 'opacity-0'} ${className}`}
          style={{
            animationDelay: `${delay}ms`,
            animationFillMode: 'both'
          }}>
      {children}
    </span>
  );
};
 
const HeroSection = ({
  
 


 
  mainTitle = "Transform Your Career with",
  subTitle = "Industry-Ready Skills",
  description = "professionals who've accelerated their careers through our hands-on programs and industry connections.",
  statsNumber = "15,000+",
  primaryButtonText = "Explore Our Programs",
  
  onPrimaryClick = () => console.log('Primary button clicked'),
  onSecondaryClick = () => console.log('Secondary button clicked'),
  gradientColor = "255, 168, 0", // RGB values for orange
  className = ""
}) => {
  const navigate = useNavigate();
  return (
    <>
      <style jsx>{`
        @keyframes blur-in-up {
          0% {
            opacity: 0;
            filter: blur(4px);
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }
        
        .animate-blur-in-up {
          animation: blur-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <section className={`relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-16 md:pb-20 overflow-hidden ${className}`}>
        {/* Left gradient blob */}
        <div
          className="absolute opacity-100"
          style={{
            width: "800px",
            height: "800px",
            top: "-400px",
            left: "-400px",
            background: `radial-gradient(circle, rgba(${gradientColor}, 0.8) 0%, rgba(255, 255, 255, 0.2) 70%)`,
            filter: "blur(40px)",
            transform: "rotate(45deg)",
          }}
        />
        
        {/* Right gradient blob */}
        <div
          className="absolute opacity-100"
          style={{
            width: "800px",
            height: "800px",
            top: "-400px",
            right: "-400px",
            background: `radial-gradient(circle, rgba(${gradientColor}, 0.8) 0%, rgba(255, 255, 255, 0.2) 70%)`,
            filter: "blur(40px)",
            transform: "rotate(-45deg)",
          }}
        />

        {/* Middle gradient blob 1 */}
        <div
          className="absolute opacity-100"
          style={{
            width: "1500px",
            height: "600px",
            top: "0%",
            left: "20%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${gradientColor}, 0.6) 0%, rgba(255, 255, 255, 0.1) 60%)`,
            filter: "blur(60px)",
          }}
        />
        
        {/* Middle gradient blob 2*/}
        <div
          className="absolute opacity-100"
          style={{
            width: "1500px",
            height: "600px",
            top: "0%",
            left: "80%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${gradientColor}, 0.6) 0%, rgba(255, 255, 255, 0.1) 60%)`,
            filter: "blur(60px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <div></div>
          </div>
         

          {/* Main heading with background and animation */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute inset-0 rounded-lg transform translate-x-1 translate-y-1 opacity-60"></div>
            <div>
              <span className='inline-block p-[1px] w-full max-w-[280px] sm:max-w-[350px] md:max-w-[405px] rounded-[22px] bg-gradient-to-r from-[#FCB11F] via-black to-[#FCB11F]'>
                  
            <div className="w-full h-auto min-h-[30px] opacity-100 rounded-[24px] py-1 sm:py-0.5 px-2 bg-white border border-transparent [border-image:linear-gradient(180deg,#FDB11F_0%,#000000_100%)] [border-image-slice:1]">
              
  <span className='block opacity-100 font-[Plus_Jakarta_Sans] font-medium text-xs sm:text-sm md:text-[16px] leading-tight sm:leading-[20px] tracking-[0px] text-center px-2'>India's #1 Project-Based Learning Platform</span>
          
</div>
</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-1 sm:mb-2 mt-4">
                <TextAnimate animation="blurInUp" by="character" once delay={10}>
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[72px] bg-[linear-gradient(to_bottom,#FFA800_60%,#000000_100%)] bg-clip-text text-transparent font-normal">
                    {mainTitle}
                  </span>
                </TextAnimate>
              </h1>
              <h2 className="bg-[linear-gradient(to_bottom,#000000_60%,#FFA800_100%)] bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-[72px] font-normal -mt-4 sm:-mt-6 md:-mt-8 lg:mt-1">
                <TextAnimate animation="blurInUp" by="character" once delay={1200}>
                  {subTitle}
                </TextAnimate>
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10 md:mb-12 -mt-3 sm:-mt-4 md:-mt-5">
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed px-4">
              Join{" "}
              <span className="text-gray-600 px-1 sm:px-2 py-0.5 sm:py-1 rounded font-semibold">
                {statsNumber}
              </span>{" "}
              {description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 md:mb-20 px-4">
            <button 
                onClick={() => navigate("/courses")}
              className="bg-amber-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 -mt-3 sm:-mt-4 md:-mt-5 rounded-full text-sm sm:text-base font-medium hover:bg-amber-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              {primaryButtonText}
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/20 rounded-full flex items-center justify-center">
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
            
     
          </div>
        </div>

        {/* Yellow Line Separator - Under Hero Content */}
        <div className="w-full flex justify-center pt-4 pb-4">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;