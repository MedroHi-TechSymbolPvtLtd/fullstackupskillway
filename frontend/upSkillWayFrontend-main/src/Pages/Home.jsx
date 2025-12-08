import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import Lottie from 'lottie-react';
import walk from '../assets/Images/animation (3).json';
import Cards from "../components/home/Cards";
import RedFluid from "../components/home/RedFluid";
import InfinityAnimation from "../components/Animation/Infinity";
import Course from "../components/home/Course";
import Refer from "../components/home/Refer";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import Hero from "../components/home/Hero";
import Schedule from "../components/home/Schedule";
import Credibility from "../components/home/Credibility";
import Enterprises from "../components/home/Enterprises";
import Certified from "../components/home/Certificate";
import Stats from "../components/home/Stats";
import Process from "../assets/Images/process.mp4";


export default function TrustSection() {
 

 

 


  // Add Google Font link dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Oregano:ital@0;1&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);






  return (
    <div
      className="min-h-screen relative overflow-hidden bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Navigation */}
      

      {/* Hero Section */}
      <Hero/>
  
      
      <Cards/>
      <Stats/>

     

  

     

      <Course/>


      <section className="py-8 sm:py-10 md:py-14 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      </section>

      {/* The Process We Follow Section */}
      <section className="-mt-20 sm:-mt-25 md:-mt-35 lg:-mt-45 py-8 sm:py-10 md:py-14 lg:py-20 bg-white">
        <div className="w-full">
          {/* Title container */}
          <div className="text-center max-w-5xl mx-auto px-4 sm:px-6">
            <h2
              className="text-gray-900 mb-3 sm:mb-4"
              style={{
                fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui",
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 3.875rem)",
                lineHeight: "clamp(2.5rem, 6vw, 4.625rem)",
                letterSpacing: "0%",
                textAlign: "center",
              }}
            >
              The <span className="text-[#FBB11F] font-['Oregano'] text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] text-center">Process</span> We Follow
            </h2>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <video 
            src={Process} alt="video" className="w-full h-auto" style={{objectFit: 'cover'}}
            autoPlay
                    loop
                    muted
                    playsInline
                  />
          </div>
        </div>
      </section>

 
      {/* The Process We Follow Section */}
      <Credibility/>

      {/* Testimonials Section */}

      {/* Certified Section - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block">
        <Certified />
      </div>

      {/* Vired For Business Enterprise Section */}
    

    

        {/* Discover Certification Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white text-black -mt-20 sm:-mt-30 md:-mt-40 lg:-mt-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-block bg-gray-100 text-gray-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                certifications
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight -mt-2 sm:-mt-3 md:-mt-4 lg:-mt-5">
                discover
                <br />
                <span className="text-amber-500">certification</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 -mt-3 sm:-mt-4 md:-mt-5 w-full max-w-full md:max-w-[761px]">
                Turn your interest into expertise with our industry-recognized certification courses. 
                Whether you're a beginner or a working professional, these programs are designed to help 
                you build job-ready skills and get certified by trusted institutions.
              </p>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">What you'll gain:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1.5 sm:mt-2">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">Globally recognized certificates from Upskillway & partners</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1.5 sm:mt-2">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">Hands-on training with real-world projects</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1.5 sm:mt-2">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">Expert mentorship to guide your learning</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1.5 sm:mt-2">
                      <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm sm:text-base">Career-focused skills that employers value</span>
                  </li>
                </ul>
              </div>

              <button className="border-1 p-1 rounded-3xl flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all group w-full sm:w-auto justify-between sm:justify-start">
                <span className="ml-3 sm:ml-4 text-sm sm:text-base">Explore certificate programs</span>
                <div className="ml-auto sm:ml-12 md:ml-16 lg:ml-20 w-7 h-7 sm:w-8 sm:h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </button> 
            </div>
            {/* Lottie Animation - Hidden on Mobile, Visible on Desktop */}
            <div className="hidden lg:block relative lg:ml-70">
              <Lottie 
        animationData={walk}
        loop={true}
        autoplay={true}
        className="w-[364px] h-[557px]"
      />
            </div>
          </div>
        </div>
      </section>
   
      <Testimonials className="-mt-100"/>

      {/* Certificate Programs Section */}
      

      {/* Enterprises Section - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block">
        <Enterprises/>
      </div>

      {/* FAQ Section */}
  
      <FAQ />

      {/* Why Learners Trust Upskillway Section */}
     

      {/* Refer & Earn Section - Hidden on Mobile, Visible on Desktop */}
      <div className="hidden lg:block">
        <Refer/>
      </div>

      {/* Schedule Demo Section */}
    
      <Schedule/>

      {/* Yellow Line Separator - Bottom */}
      <div className="w-full flex justify-center  ">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 bg-yellow-400 w-full -"></div>
        </div>
      </div>

      

      
    </div>
  );
}
