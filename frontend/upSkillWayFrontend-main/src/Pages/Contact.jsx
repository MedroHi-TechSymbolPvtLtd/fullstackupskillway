import { useState } from "react";
import Contact from "../assets/Images/contact (2).json";
import Lottie from "lottie-react";
import Form from "../components/Contact/Form";

const ContactPageMain = () => {
  const [activeTab, setActiveTab] = useState("course");

  return (
    <div className="w-full min-h-screen bg-white mt-16 md:mt-20 lg:mt-[100px] px-4 md:px-8 lg:px-[146px]">
      {/* Hero Section */}
      <div className="container mx-auto py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1">
            <div>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
                Join the journey
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Got a <span className="text-yellow-400">Course</span> in
                <br className="hidden sm:block" />
                Mind? Enroll Today<span className="text-yellow-400">!</span>
              </h1>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Illustration */}
            <div className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[532px] h-40 sm:h-48 md:h-64 lg:h-[296px] opacity-100 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] border-[2px] [border-image:linear-gradient(180deg,#FBB11F_0%,#FFFFFF_100%)_1] mx-auto lg:mx-0">
              <div className="flex justify-center h-full">
                <div className="relative w-full">
                  {/* Desk */}
                  <div className="w-full h-full bg-gray-800 rounded-t-sm relative overflow-hidden">
                    <Lottie
                      animationData={Contact}
                      loop={true}
                      autoplay={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Contact Form */}
          <div className="w-full max-w-[420px] bg-white rounded-2xl p-6 md:p-8 shadow-lg mx-auto lg:mx-0 lg:ml-[40px] order-1 lg:order-2">
            {/* Navigation Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("course")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "course"
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Course Enquiry
              </button>
              <button
                onClick={() => setActiveTab("corporate")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === "corporate"
                    ? "bg-orange-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Corporate Enquiry
              </button>
            </div>

            {/* Form */}
            <Form formType={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPageMain;
