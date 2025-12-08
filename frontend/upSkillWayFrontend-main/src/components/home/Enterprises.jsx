import React from 'react';
import { Check } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Business from '../../assets/Images/Bank.png';

const EnterpriseSection = () => {
  const navigate = useNavigate();

  return (
    

    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-2 p-8 rounded-[20px] text-[#FDB11F]">
        {/* Header */}
        <div className="mb-8">
          <div className="text-red-500 font-medium mb-4 uppercase text-2xl sm:text-3xl" style={{ color: '#FF302F' }}>
            ENTERPRISES
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Upskillway For
            </h2>
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg text-3xl sm:text-4xl md:text-5xl font-bold">
              Business
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            {/* Feature List */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Check className="w-6 h-6  text-green-500" />
                </div>
                <p className="text-gray-900 text-base sm:text-lg font-medium">
                  Customized Learning Solutions
                </p>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-900 text-base sm:text-lg font-medium">
                  Learn from Subject Matter Experts
                </p>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-900 text-base sm:text-lg font-medium">
                  Enterprise Reporting
                </p>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-gray-900 text-base sm:text-lg font-medium">
                  Job-Ready employees post-training
                </p>
              </li>
            </ul>
            
            {/* Statistics Cards */}
            <div className="flex flex-nowrap gap-2 mt-8">
              <div 
                className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  width: '203px',
                  height: '80px',
                  paddingTop: '16px',
                  paddingRight: '24px',
                  paddingBottom: '16px',
                  paddingLeft: '24px'
                }}
              >
                <div className="font-bold text-[18px] text-gray-900 mb-1 leading-tight">100+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Enterprise Partners
                </div>
              </div>

              <div 
                className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  width: '203px',
                  height: '80px',
                  paddingTop: '16px',
                  paddingRight: '24px',
                  paddingBottom: '16px',
                  paddingLeft: '24px'
                }}
              >
                <div className="font-bold text-[18px] text-gray-900 mb-1 leading-tight">25,000+ hrs</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Live Hours Delivered
                </div>
              </div>

              <div 
                className="bg-white rounded-[20px] shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  width: '203px',
                  height: '80px',
                  paddingTop: '16px',
                  paddingRight: '24px',
                  paddingBottom: '16px',
                  paddingLeft: '24px'
                }}
              >
                <div className="font-bold text-[18px] text-gray-900 mb-1 leading-tight">10,000+</div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Employees Upskilled
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative mt-8 md:mt-0">
            <div className="relative z-10 -mt-38">
              <img src={Business} alt="Enterprise Solutions" className="w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="text-center mt-10 " >
        <button className=" text-white text-[28px] bg-[#FCB11F] w-[355px] h-[53px] text-bold rounded-3xl"  onClick={() => navigate("/corporate")}>Explore Our Solution
           <svg className="w-[40px] h-[40px] -mt-10 ml-77  bg-[#FCB11F] text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg> 
        </button>
       
      </div>
      </div>
    </section>
  );
};

export default EnterpriseSection;
