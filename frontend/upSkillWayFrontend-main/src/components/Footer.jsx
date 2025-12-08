import React, { useState } from "react";
import config from '../config/env';
import footerbabe from "../assets/Images/footerbabe.png";
import footerlogo from "../assets/Images/footerlogo.png";

export default function Index() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    try {
  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`Thank you! We'll contact you at ${email}`);
        setEmail("");
      } else {
        throw new Error(result.message || 'Failed to submit email');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 lg:p-8">
      {/* Main container matching Figma proportions */}
      <section className="relative w-full max-w-[1280px] h-auto min-h-[800px] sm:min-h-[900px] md:min-h-[1000px] lg:min-h-0 lg:h-[690px] bg-[#131313] text-white overflow-hidden rounded-3xl shadow-2xl">

        {/* Decorative white cutouts - matching Figma exact positions */}
        <div className="absolute left-0 bottom-0 w-[200px] sm:w-[250px] md:w-[300px] lg:w-[319px] h-[40px] sm:h-[50px] md:h-[55px] lg:h-[57px] bg-white rounded-tr-[20px] sm:rounded-tr-[30px] md:rounded-tr-[35px] lg:rounded-tr-[40px]"></div>
        <div className="absolute right-0 top-0 w-[180px] sm:w-[220px] md:w-[260px] lg:w-[294px] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[88px] bg-white rounded-bl-[20px] sm:rounded-bl-[30px] md:rounded-bl-[35px] lg:rounded-bl-[40px]"></div>

        {/* Logo - positioned exactly as in Figma */}
        <img
          src={footerlogo}
          alt="logo"
          className="absolute left-[4px] sm:left-[6px] md:left-[7px] top-[4px] sm:top-[6px] md:top-[8px] w-[80px] sm:w-[100px] md:w-[110px] lg:w-[122px] h-[80px] sm:h-[100px] md:h-[110px] lg:h-[122px] object-cover"
        />

        {/* Social icons - positioned exactly as in Figma top-right */}
        <div className="absolute right-[8px] sm:right-[10px] md:right-[12px] top-[8px] sm:top-[10px] md:top-[12px] flex items-center gap-2 sm:gap-3 md:gap-4">
          <button aria-label="twitter" className="p-2 sm:p-3 md:p-4 rounded-full border border-[#DCDCDC] hover:bg-white/10 transition-colors">
            <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M22.5 4.5C22.5 2.8425 21.1575 1.5 19.5 1.5H4.5C2.8425 1.5 1.5 2.8425 1.5 4.5V19.5C1.5 21.1575 2.8425 22.5 4.5 22.5H19.5C21.1575 22.5 22.5 21.1575 22.5 19.5V4.5Z" fill="#050505" />
              <path d="M5.65168 18.1045H7.15168L11.1567 13.552L14.6404 18.097H18.7129L13.3692 11.032L17.8917 5.89453H16.3917L12.6754 10.117L9.48793 5.89828H5.28418L10.4554 12.6445L5.64793 18.1083L5.65168 18.1045ZM7.56793 7.01953H8.93293L16.4554 16.972H15.1992L7.57168 7.01953H7.56793Z" fill="white" />
            </svg>
          </button>

          <button aria-label="facebook" className="p-2 sm:p-3 md:p-4 rounded-full border border-[#DCDCDC] hover:bg-white/10 transition-colors">
            <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.4282 1.71387C19.4907 1.71387 20.3991 2.0911 21.1536 2.84556C21.9081 3.60003 22.2853 4.50851 22.2853 5.57101V18.4282C22.2853 19.4907 21.9081 20.3991 21.1536 21.1536C20.3991 21.9081 19.4907 22.2853 18.4282 22.2853H15.9103V14.3165H18.5755L18.9773 11.2094H15.9103V9.22726C15.9103 8.72726 16.0152 8.35226 16.225 8.10226C16.4348 7.85226 16.8433 7.72726 17.4505 7.72726L19.0844 7.71387V4.94155C18.5219 4.86119 17.7273 4.82101 16.7005 4.82101C15.4862 4.82101 14.5152 5.17815 13.7875 5.89244C13.0598 6.60672 12.696 7.61565 12.696 8.91922V11.2094H10.0174V14.3165H12.696V22.2853H5.57101C4.50851 22.2853 3.60003 21.9081 2.84556 21.1536C2.0911 20.3991 1.71387 19.4907 1.71387 18.4282V5.57101C1.71387 4.50851 2.0911 3.60003 2.84556 2.84556C3.60003 2.0911 4.50851 1.71387 5.57101 1.71387H18.4282Z" fill="black" />
            </svg>
          </button>

          <button aria-label="instagram" className="p-2 sm:p-3 md:p-4 rounded-full border border-[#DCDCDC] hover:bg-white/10 transition-colors">
            <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="black" />
            </svg>
          </button>

          <button aria-label="linkedin" className="p-2 sm:p-3 md:p-4 rounded-full border border-[#DCDCDC] hover:bg-white/10 transition-colors">
            <svg width="16" height="16" className="sm:w-5 sm:h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-0.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h0.046c0.477-0.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-0.926-2.063-2.065 0-1.138 0.92-2.063 2.063-2.063 1.14 0 2.064 0.925 2.064 2.063 0 1.139-0.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.225 0z" fill="black" />
            </svg>
          </button>
        </div>

        {/* Content wrapper - flex layout for mobile/tablet, absolute for desktop */}
        <div className="relative lg:absolute lg:inset-0 flex flex-col lg:block px-5 pt-24 pb-16 sm:px-8 sm:pt-28 md:px-10 md:pt-32 lg:p-0">

          {/* Request a Demo section - responsive positioning */}
          <div className="relative lg:absolute lg:left-[720px] lg:top-[110px] w-full lg:w-[373px] mb-8 lg:mb-0">
            {/* Demo badge */}
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full border border-[rgba(255,255,255,0.3)] text-xs sm:text-sm text-[#FFE6A1] bg-white/5 shadow-sm">Demo</span>
            </div>

            {/* Main heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-jakarta font-bold leading-tight mb-3 sm:mb-4 text-white">Request a Demo</h1>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full border border-[rgba(255,255,255,0.1)] bg-transparent py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 pr-24 sm:pr-32 md:pr-40 lg:pr-44 text-white placeholder:text-[rgba(255,255,255,0.6)] font-general text-sm sm:text-base focus:outline-none focus:border-[rgba(255,255,255,0.3)]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#FCB11F] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-medium hover:bg-[#E5A21C] transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  Get Started
                </button>
              </div>
            </form>
          </div>

          {/* Navigation columns - responsive layout */}
          <div className="relative lg:absolute lg:left-[40px] lg:top-[180px] flex flex-row flex-wrap gap-8 sm:gap-12 md:gap-16 lg:gap-[120px] mb-8 lg:mb-0">
            {/* Explore column */}
            <div className="w-auto lg:w-[107px]">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold font-jakarta mb-2 sm:mb-3 md:mb-4 text-white">Explore</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-[rgba(255,255,255,0.6)] font-general">
                <li className="hover:text-white cursor-pointer transition-colors">What We Offer</li>
                <li className="hover:text-white cursor-pointer transition-colors">Case Studies</li>
                <li className="hover:text-white cursor-pointer transition-colors">Blog & Insights</li>
                <li className="hover:text-white cursor-pointer transition-colors">Resources</li>
                <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>

            {/* Company column */}
            <div className="w-auto lg:w-[107px]">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold font-jakarta mb-2 sm:mb-3 md:mb-4 text-white">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-[rgba(255,255,255,0.6)] font-general">
                <li className="hover:text-white cursor-pointer transition-colors">Home</li>
                <li className="hover:text-white cursor-pointer transition-colors">About</li>
                <li className="hover:text-white cursor-pointer transition-colors">Service</li>
                <li className="hover:text-white cursor-pointer transition-colors">Testimonials</li>
                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-white cursor-pointer transition-colors">Career</li>
              </ul>
            </div>

            {/* Legal Links column */}
            <div className="w-auto lg:w-[107px]">
              <h4 className="text-sm sm:text-base md:text-lg font-semibold font-jakarta mb-2 sm:mb-3 md:mb-4 text-white">Legal Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-[rgba(255,255,255,0.6)] font-general">
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Disclaimer</li>
                <li className="hover:text-white cursor-pointer transition-colors">Copyright</li>
              </ul>
            </div>
          </div>

          {/* Person image - responsive positioning */}
          <div className="relative lg:absolute lg:left-[534px] lg:top-[287px] w-full lg:w-[746px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[403px] mb-6 lg:mb-0">
            <img
              src={footerbabe}
              alt="person pointing"
              className="w-full h-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-none"
            />
          </div>

          {/* Back to top button - responsive positioning */}
          <div className="relative lg:absolute lg:left-[40px] lg:top-[472px] flex items-center gap-2 sm:gap-3 md:gap-4 text-white hover:text-[#FFE6A1] transition-colors cursor-pointer">
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm sm:text-base md:text-lg font-general">Back to top</span>
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 border border-[rgba(255,255,255,0.4)] rounded-md hover:border-[rgba(255,255,255,0.6)] transition-colors">
              <svg width="12" height="12" className="sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.81803 2.83301L7.81803 12.833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.80132 6.86621L7.81732 2.83288L11.834 6.86621" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Design by Medro badge - positioned exactly as in Figma bottom-left */}
        <div className="absolute left-0 bottom-0 mb-[5px] sm:mb-[8px] md:mb-[10px] ml-[5px] sm:ml-[8px] md:ml-[10px]">
          <span className="inline-flex items-center px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-white text-[#141219] text-xs sm:text-sm md:text-base lg:text-lg font-jakarta">
            Design by Medro ❤️
          </span>
        </div>

      </section>
    </main>
  );
}