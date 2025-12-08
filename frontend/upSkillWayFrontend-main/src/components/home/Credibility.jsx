import React from "react";
import {
  GraduationCap,
  MessageCircle,
  Briefcase,
  Globe,
  Monitor,
  Users,
  Headphones,
  Clock,
  BookOpen,
  Settings,
  ArrowRight,
} from "lucide-react";
import Logo from "../../assets/Images/upskillway.png";


const UpskillwayFeatures = () => {
  return (

       <div className="text-center mb-12">
          <h2 className="w- text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Why Learners Trust <br></br> Upskill<span className="text-[#FFB84D]">w</span>ay
          </h2>
          <p className="text-gray-600 text-lg font-medium max-w-3xl mx-auto">
            Unlock your true potential with Upskillway and explore <br></br> opportunities that fit your skills, passions, and career goals.
          </p>
      
  
<div className="text-center">
                      <img
                        src={Logo}
                        alt="Upskillway"
                        className="w-[1000px] lg:h-[775px] mx-auto center sm:h-[350px]"
                      />
                    </div>
                    </div>
  );
};

export default UpskillwayFeatures;


