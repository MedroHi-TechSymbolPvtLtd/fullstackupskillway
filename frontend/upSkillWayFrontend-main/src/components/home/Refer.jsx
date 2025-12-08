import React from 'react';
import { useNavigate } from 'react-router-dom';

import Laptop from "../../assets/Images/Laptop (2).png";
import Watch from "../../assets/Images/Watch.png";
import Strong from "../../assets/Images/Strong.png";
import refer from "../../assets/Images/Content.png";

const Refer = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden -mt-25 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="h-px bg-black 800 flex-1 max-w-[443px]"></div>
            <div className="w-2 h-2 bg-[#FF9500] rounded-full mx-3 sm:mx-4"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mx-4 sm:mx-8">
              Refer <span className="text-[#FF9500]">&</span> Earn
            </h2>
            <div className="w-2 h-2 bg-[#FF9500] rounded-full mx-3 sm:mx-4"></div>
            <div className="h-px bg-black 800 flex-1 max-w-[443px]"></div>
          </div>
        </div>

        {/* Product Display Section - Top Half */}
       
        </div>

        <div className='-mt-20'>
          <img src={Laptop} alt="" />
        </div>

              <div className="text-center p-2 -mt-20 " >
        <button className=" text-white text-[20px] bg-[#FCB11F] w-[220px] h-[56px] p-4 rounded-tl-[40px] rounded-tr-[5px] rounded-br-[40px] rounded-bl-[5px] " >Refer Now 
           <svg className="w-[40px] h-[40px] -mt-10 ml-35  bg-[#FCB11F] text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg> 
        </button>
       
      </div>

        
   
    </section>
  );
};


export default Refer;