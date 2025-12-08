import React, { useState } from 'react';
import Blog from "../components/Blog/Blog";
import config from '../config/env';


const MainContent = () => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
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
        alert('Thank you for subscribing to our newsletter!');
        setEmail('');
      } else {
        throw new Error(result.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-18 md:mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
                <div className='w-full sm:w-[400px] md:w-[500px] lg:w-[559px] h-auto sm:h-[140px] md:h-[160px] lg:h-[189px] top-[258px]'>
              <h1 className="font-[Plus_Jakarta_Sans] font-bold text-[32px] sm:text-[40px] md:text-[50px] lg:text-[64px] leading-[32px] sm:leading-[40px] md:leading-[50px] lg:leading-[63px] tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2px] text-[#FCB11F]">
                Unlock <br />
                <span className="text-gray-900">Knowledge,</span> <br />
                <span className="text-gray-900">Shape Your </span>
                <span className="text-[#FCB11F]">Future</span>
              </h1>
              </div>
              <p className="w-full sm:w-[500px] md:w-[600px] lg:w-[624px] h-auto sm:h-[60px] md:h-[70px] lg:h-[78px] font-[Plus_Jakarta_Sans] font-normal text-[14px] sm:text-[15px] md:text-[16px] leading-[20px] sm:leading-[22px] md:leading-[26px] tracking-[0px]">
              Learning is more than just education—it’s transformation. At Upskillway, our blog is your one-stop destination for expert insights, study hacks, and the latest updates in technology, analytics, and career development. Stay ahead, stay informed, and keep growing.
              </p>
            </div>
            <div className="relative">
               <div className="relative">
      <div className="w-full sm:w-[400px] md:w-[480px] lg:w-[540px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[320px] relative">
        {/* Gradient border container */}
        <div className="absolute inset-0 rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-[2px] sm:p-[3px]">
          <div className="w-full h-full rounded-[17px] overflow-hidden bg-white">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2Faf6f5d0c557b4ef08d1f65ca6234a3bb%2F8294813a0ef84ed49f98dd8f7e915a3a?format=webp&width=800"
              alt="The Knowledge Hub - Students collaborating" 
              className=""
            />
          </div>
        </div>
        
        {/* Label overlay */}
      
      </div>
    </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <Blog></Blog>

      {/* Newsletter Subscription Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FEF9F8]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            newsletter
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of learners and professionals. Get weekly updates on the latest courses, 
            insights, and opportunities delivered straight to your inbox.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleEmailSubmit();
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FCB11F] focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </section>
      
    </div>
  );
};

export default MainContent;
